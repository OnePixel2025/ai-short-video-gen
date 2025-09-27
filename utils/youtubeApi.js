import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
);

export const getAuthUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    });
};

export const uploadVideo = async (accessToken, videoFile, title, description) => {
    oauth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube('v3');

    try {
        const response = await youtube.videos.insert({
            auth: oauth2Client,
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title,
                    description,
                    categoryId: '22'
                },
                status: {
                    privacyStatus: 'public',
                    selfDeclaredMadeForKids: false,
                    shortForm: true
                }
            },
            media: {
                body: videoFile
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};