import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = JSON.parse(searchParams.get('state') || '{}');
    const { videoUrl, title } = state;

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.INSTAGRAM_APP_ID,
                client_secret: process.env.INSTAGRAM_APP_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
                code
            })
        });

        const { access_token, user_id } = await tokenResponse.json();

        // Upload video to Instagram
        const videoResponse = await fetch(decodeURIComponent(videoUrl));
        const videoBuffer = await videoResponse.arrayBuffer();

        // Create container
        const containerResponse = await fetch(`https://graph.instagram.com/${user_id}/media`, {
            method: 'POST',
            body: new URLSearchParams({
                access_token,
                media_type: 'REELS',
                video: Buffer.from(videoBuffer),
                caption: decodeURIComponent(title)
            })
        });

        const { id: container_id } = await containerResponse.json();

        // Publish the container
        const publishResponse = await fetch(`https://graph.instagram.com/${user_id}/media_publish`, {
            method: 'POST',
            body: new URLSearchParams({
                access_token,
                creation_id: container_id
            })
        });

        const { id: post_id } = await publishResponse.json();

        return NextResponse.redirect(`https://instagram.com/p/${post_id}`);
    } catch (error) {
        console.error('Instagram callback error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}