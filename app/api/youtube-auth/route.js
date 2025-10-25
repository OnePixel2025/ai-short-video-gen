import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('videoUrl');
    const title = searchParams.get('title');

    try {
        // Validate video URL
        if (!videoUrl) {
            throw new Error('Video URL is required');
        }

        // Check if it's a valid URL
        let decodedUrl;
        try {
            decodedUrl = decodeURIComponent(videoUrl);
            new URL(decodedUrl);
        } catch (urlError) {
            throw new Error('Invalid video URL format');
        }

        // Pre-check if the video URL is accessible (especially important for AWS S3)
        try {
            console.log('Pre-checking video accessibility...');
            const headResponse = await fetch(decodedUrl, { 
                method: 'HEAD',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!headResponse.ok) {
                console.warn('Video URL pre-check failed:', headResponse.status, headResponse.statusText);
                // Don't throw error here, just log warning - the actual fetch in callback will handle it
            } else {
                console.log('Video URL is accessible, content-type:', headResponse.headers.get('content-type'));
            }
        } catch (preCheckError) {
            console.warn('Video URL pre-check error:', preCheckError.message);
            // Don't throw error here, just log warning
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );

        const scopes = [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube'
        ];

        // Create a more compact state object to avoid URL length issues
        const stateData = {
            v: videoUrl, // Shortened key
            t: title || 'My AI Generated Video' // Shortened key with fallback
        };

        console.log('Starting YouTube OAuth with video URL:', decodeURIComponent(videoUrl));
        console.log('OAuth configuration:', {
            clientId: process.env.YOUTUBE_CLIENT_ID ? 'Set' : 'Missing',
            clientSecret: process.env.YOUTUBE_CLIENT_SECRET ? 'Set' : 'Missing',
            redirectUri: process.env.YOUTUBE_REDIRECT_URI
        });

        // Try to avoid OAuth delegation issues by using specific parameters
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: JSON.stringify(stateData),
            prompt: 'select_account', // Use select_account instead of consent to avoid delegation issues
            response_type: 'code',
            redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
            // Add additional parameters to prevent delegation issues
            hd: undefined, // Don't specify hosted domain
            login_hint: undefined // Don't specify login hint
        });

        console.log('Generated auth URL length:', authUrl.length);
        console.log('Auth URL preview:', authUrl.substring(0, 200) + '...');

        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('YouTube auth error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}