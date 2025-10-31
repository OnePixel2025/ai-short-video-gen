import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { voice } = await req.json();
        
        if (!voice) {
            return NextResponse.json(
                { error: 'Voice parameter is required' },
                { status: 400 }
            );
        }

        // Sample text for preview
        const previewText = "Welcome to our AI video generator. This is a preview of how this voice sounds.";

        // Generate audio preview using AI Guru Lab API
        const BASE_URL = 'https://aigurulab.tech';
        const response = await fetch(BASE_URL + '/api/text-to-speech', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.NEXT_PUBLIC_AIGURULAB_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: previewText,
                voice: voice
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate voice preview');
        }

        const data = await response.json();
        
        return NextResponse.json({ audioUrl: data.audio });
    } catch (error) {
        console.error('Error generating voice preview:', error);
        return NextResponse.json(
            { error: 'Failed to generate voice preview' },
            { status: 500 }
        );
    }
}

