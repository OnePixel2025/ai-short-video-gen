import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const videoUrl = formData.get('videoUrl');
        const title = formData.get('title');
        const description = formData.get('description');

        // Get the token from cookies
        const token = request.cookies.get('youtube_token');
        
        if (!token) {
            return NextResponse.json({ 
                error: 'Not authenticated. Please login to YouTube first.' 
            }, { status: 401 });
        }

        // Initialize YouTube client
        const oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );
        oauth2Client.setCredentials({ access_token: token.value });
        const youtube = google.youtube('v3');

        try {
            // Fetch video and convert to buffer
            console.log('Fetching video from:', videoUrl);
            const videoResponse = await fetch(videoUrl);
            
            if (!videoResponse.ok) {
                throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
            }

            const videoBuffer = await videoResponse.arrayBuffer();

            // Upload to YouTube
            console.log('Starting YouTube upload...');
            const response = await youtube.videos.insert({
                auth: oauth2Client,
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title,
                        description,
                        categoryId: '22',
                    },
                    status: {
                        privacyStatus: 'private',
                        selfDeclaredMadeForKids: false,
                        shortForm: true
                    },
                },
                media: {
                    body: Buffer.from(videoBuffer),
                    mimeType: 'video/mp4',
                },
            });

            console.log('Upload successful, video ID:', response.data.id);
            return NextResponse.json({ 
                videoId: response.data.id,
                status: 'success' 
            });

        } catch (uploadError) {
            console.error('Video processing error:', uploadError);
            throw new Error(`Video upload failed: ${uploadError.message}`);
        }

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message }, 
            { status: 500 }
        );
    }
}

// Increase payload size limit for video uploads
export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },
};