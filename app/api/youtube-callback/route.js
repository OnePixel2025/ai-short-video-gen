import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = JSON.parse(searchParams.get('state') || '{}');
    const { v: videoUrl, t: title } = state; // Use shortened keys

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const youtube = google.youtube('v3');

        // Fetch video
        console.log('Fetching video from:', decodeURIComponent(videoUrl));
        
        // Add headers for better compatibility with AWS S3
        const fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'video/mp4,video/*,*/*',
                'Accept-Encoding': 'identity', // Disable compression for video files
            },
            // Increase timeout for large video files
            signal: AbortSignal.timeout(300000) // 5 minutes timeout
        };
        
        const videoResponse = await fetch(decodeURIComponent(videoUrl), fetchOptions);
        
        if (!videoResponse.ok) {
            console.error('Video fetch failed:', {
                status: videoResponse.status,
                statusText: videoResponse.statusText,
                url: decodeURIComponent(videoUrl)
            });
            throw new Error(`Failed to fetch video: ${videoResponse.status} ${videoResponse.statusText}`);
        }

        // Convert ArrayBuffer to Buffer
        const arrayBuffer = await videoResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log('Video downloaded successfully, size:', buffer.length, 'bytes');

        // Create readable stream from buffer
        const readable = new Readable();
        readable._read = () => {}; // _read is required but you can noop it
        readable.push(buffer);
        readable.push(null);

        // Upload to YouTube
        console.log('Starting YouTube upload...');
        const response = await youtube.videos.insert({
            auth: oauth2Client,
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: decodeURIComponent(title),
                    description: 'Uploaded via AI Video Generator',
                    categoryId: '22',
                },
                status: {
                    privacyStatus: 'private',
                    selfDeclaredMadeForKids: false,
                    shortForm: true
                },
            },
            media: {
                body: readable,
                mimeType: 'video/mp4',
            },
        });

        // Redirect to YouTube Studio editor
        const studioUrl = `https://studio.youtube.com/video/${response.data.id}/edit`;
        return NextResponse.redirect(studioUrl);

    } catch (error) {
        console.error('YouTube callback error:', {
            message: error.message,
            stack: error.stack,
            videoUrl: videoUrl,
            title: title
        });
        
        // Handle specific error types
        let errorTitle = 'YouTube Upload Failed';
        let errorMessage = error.message;
        let errorDescription = 'This might be due to video access restrictions or network issues.';
        let showRetry = true;
        
        if (error.message.includes('exceeded the number of videos')) {
            errorTitle = 'YouTube Upload Quota Exceeded';
            errorDescription = 'You have reached your daily YouTube upload limit. Please try again tomorrow or request a quota increase from Google Cloud Console.';
            showRetry = false;
        } else if (error.message.includes('quota')) {
            errorTitle = 'YouTube API Quota Exceeded';
            errorDescription = 'YouTube API quota limit reached. Please wait 24 hours or request a quota increase.';
            showRetry = false;
        } else if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
            errorTitle = 'Authentication Error';
            errorDescription = 'There was an issue with YouTube authentication. Please try again.';
        } else if (error.message.includes('Failed to fetch video')) {
            errorTitle = 'Video Access Error';
            errorDescription = 'Could not access the video file. This might be due to AWS S3 access restrictions.';
        }
        
        // Return a more user-friendly error page instead of JSON
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${errorTitle}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; max-width: 600px; margin: 0 auto; }
                    .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .success { color: #2e7d32; background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .retry { margin-top: 20px; }
                    button { background: #1976d2; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
                    .close-btn { background: #757575; }
                    .info { background: #e3f2fd; color: #1565c0; padding: 15px; border-radius: 8px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1>${errorTitle}</h1>
                <div class="error">
                    <h3>Error: ${errorMessage}</h3>
                    <p>${errorDescription}</p>
                </div>
                
                ${error.message.includes('exceeded') ? `
                <div class="info">
                    <h4>What you can do:</h4>
                    <ul style="text-align: left;">
                        <li>Wait 24 hours for quota reset</li>
                        <li>Request quota increase in Google Cloud Console</li>
                        <li>Use a different YouTube account</li>
                    </ul>
                </div>
                ` : ''}
                
                <div class="retry">
                    <button class="close-btn" onclick="window.close()">Close Window</button>
                    ${showRetry ? '<button onclick="window.location.reload()">Retry</button>' : ''}
                </div>
            </body>
            </html>
        `;
        
        return new NextResponse(errorHtml, {
            status: 500,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}