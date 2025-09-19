import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('videoUrl');
    const title = searchParams.get('title');

    try {
        const appId = process.env.INSTAGRAM_APP_ID;
        const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_content_publish&response_type=code&state=${encodeURIComponent(JSON.stringify({ videoUrl, title }))}`;

        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Instagram auth error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}