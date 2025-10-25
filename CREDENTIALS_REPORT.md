# AI Short Video Generator - Credentials Report

dev email : snapshort.dev@gmail.com
email acc pass = nArHweeUk1BWIEoU
github repo link : https://github.com/OnePixel2025/ai-short-video-gen

## Overview
This document provides a comprehensive list of all credentials and API keys required for the AI Short Video Generator application. The application integrates multiple services for authentication, video processing, AI generation, and deployment.

## 🔐 Required Environment Variables

### 1. Firebase Authentication
**Purpose**: User authentication and user management
**Configuration File**: `configs/firebaseConfig.jsx`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCrLIyw4YmLu40mkOg1SHAOOP_V7A4cyX4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=snapshort-saas.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=snapshort-saas
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=snapshort-saas.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=145049913807
NEXT_PUBLIC_FIREBASE_APP_ID=1:145049913807:web:7a2a11e54829116e706aba
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-L2GHPXHR86
```

**Firebase Project Details**:
- Project ID: `snapshort-saas`
- Auth Domain: `snapshort-saas.firebaseapp.com`
- Storage Bucket: `snapshort-saas.firebasestorage.app`
- Messaging Sender ID: `145049913807`
- App ID: `1:145049913807:web:7a2a11e54829116e706aba`
- Measurement ID: `G-L2GHPXHR86`

**Setup Instructions**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `snapshort-saas`
3. Go to Project Settings > General
4. Copy the API key from the Web app configuration
5. Enable Authentication with Google provider
6. Enable Firestore Database
7. Enable Firebase Storage

---

### 2. AWS Services
**Purpose**: Video rendering and storage (Remotion Lambda)
**Configuration Files**: `inngest/functions.js`, `docker-compose.yml`

```env
# AWS Credentials for Remotion Lambda
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1

# Remotion AWS Configuration
REMOTION_AWS_FUNCTION_NAME=your_remotion_lambda_function_name
REMOTION_AWS_SERVE_URL=your_remotion_serve_url
REMOTION_AWS_SITE_URL=your_remotion_site_url

# S3 Storage (for Convex)
S3_STORAGE_EXPORTS_BUCKET=your_s3_bucket_name
S3_STORAGE_SNAPSHOT_IMPORTS_BUCKET=your_s3_bucket_name
S3_STORAGE_MODULES_BUCKET=your_s3_bucket_name
S3_STORAGE_FILES_BUCKET=your_s3_bucket_name
S3_STORAGE_SEARCH_BUCKET=your_s3_bucket_name
```

**Setup Instructions**:
1. Create AWS account and configure IAM user with Lambda, S3, and CloudFormation permissions
2. Deploy Remotion Lambda function using Remotion CLI
3. Create S3 buckets for video storage
4. Configure proper CORS settings for S3 buckets

---

### 3. Google Cloud Platform
**Purpose**: YouTube API integration and video rendering
**Configuration Files**: `utils/youtubeApi.js`, `app/api/youtube-*/route.js`

```env
# YouTube API Credentials
YOUTUBE_CLIENT_ID=your_google_oauth_client_id
YOUTUBE_CLIENT_SECRET=your_google_oauth_client_secret
YOUTUBE_REDIRECT_URI=your_redirect_uri

# Google Cloud for Remotion (Alternative rendering)
GCP_SERVE_URL=your_gcp_serve_url
```

**Setup Instructions**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs
5. Set up Google Cloud Run for video rendering (optional)

---

### 4. Deepgram
**Purpose**: Voice-to-text transcription for captions
**Configuration File**: `inngest/functions.js`

```env
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

**Setup Instructions**:
1. Sign up at [Deepgram](https://deepgram.com/)
2. Create a new project
3. Generate API key from the dashboard
4. Enable Nova-3 model access

---

### 5. Convex Database
**Purpose**: Real-time database for user data and video records
**Configuration Files**: `app/ConvexClientProvider.js`, `inngest/functions.js`

```env
CONVEX_DEPLOYMENT=dev:calm-avocet-962 # team: snapshort-dev, project: snapshort-saas-database
NEXT_PUBLIC_CONVEX_URL=https://calm-avocet-962.convex.cloud
CONVEX_DEPLOY_KEY=prod:avid-wildcat-903|eyJ2MiI6Ijg1ZTFlODc4NTljNDQ4ZWViNGU5ODFmOTBiNDJlZGNmIn0=
```

**Convex Project Details**:
- Schema: Defined in `convex/schema.js`
- Tables: `users`, `videoData`
- Functions: User management, video data CRUD operations

**Setup Instructions**:
1. Sign up at [Convex](https://convex.dev/)
2. Create a new project
3. Run `npx convex dev` to deploy schema
4. Copy the deployment URL from the dashboard

---

### 6. Inngest
**Purpose**: Background job processing for video generation
**Configuration Files**: `inngest/client.js`, `inngest/functions.js`

```env
# Inngest configuration (if using cloud service)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

**Setup Instructions**:
1. Sign up at [Inngest](https://inngest.com/)
2. Create a new app
3. Configure event keys for production
4. Set up webhook endpoints

---

### 7. AI Guru Lab
**Purpose**: Voice generation and image generation
**Configuration File**: `inngest/functions.js`

```env
NEXT_PUBLIC_AIGURULAB_API_KEY=your_aigurulab_api_key_here
```

**API Endpoints Used**:
- `https://aigurulab.tech/api/text-to-speech` (Voice generation)
- `https://aigurulab.tech/api/generate-image` (Image generation)

**Setup Instructions**:
1. Sign up at [AI Guru Lab](https://aigurulab.tech/)
2. Generate API key from dashboard
3. Configure billing and usage limits

---

### 8. Gemini AI (Google)
**Purpose**: Script generation and image prompt creation
**Configuration File**: `configs/AiModel.jsx`

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Model Used**: `gemini-2.0-flash`

**Setup Instructions**:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Generate API key
3. Enable Gemini API access

---

### 9. Vercel Deployment
**Purpose**: Application hosting and deployment
**Configuration**: Automatic through Vercel integration

```env
# Vercel automatically handles these
NEXT_PUBLIC_DEPLOYMENT_URL=your_vercel_app_url
```

**Setup Instructions**:
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up automatic deployments

---

### 10. Remotion
**Purpose**: Video rendering and composition
**Configuration Files**: `remotion.config.ts`, video compositions in `remotion/`

**Setup Instructions**:
1. Deploy Remotion Lambda function to AWS
2. Configure Remotion Cloud Run (optional)
3. Set up serve URL for video rendering

---

### 11. Additional Services

#### PayPal Integration
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### Instagram API (Optional)
```env
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=your_instagram_redirect_uri
```

---

## 🔧 Environment Setup Checklist

### Development Environment
1. ✅ Create `.env.local` file in project root
2. ✅ Add all required environment variables
3. ✅ Run `npm install` to install dependencies
4. ✅ Run `npx convex dev` to start Convex
5. ✅ Run `npm run dev` to start development server

### Production Environment
1. ✅ Configure all services in production
2. ✅ Set up Vercel environment variables
3. ✅ Deploy Convex to production
4. ✅ Configure AWS Lambda functions
5. ✅ Set up monitoring and logging

---

## 📋 Service Dependencies

```
Firebase Auth → User Management → Convex DB
Gemini AI → Script Generation → AI Guru Lab → Voice/Images
Deepgram → Transcription → Remotion → Video Rendering
YouTube API → Video Upload → AWS S3 → Storage
Inngest → Background Jobs → All Services
```

---

## 🚨 Security Notes

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate API keys regularly**
4. **Monitor API usage and set up billing alerts**
5. **Use least privilege principle for IAM roles**
6. **Enable CORS properly for all services**
7. **Set up monitoring for failed API calls**

---

## 📞 Support Contacts

- **Firebase**: [Firebase Support](https://firebase.google.com/support)
- **AWS**: [AWS Support](https://aws.amazon.com/support/)
- **Google Cloud**: [Google Cloud Support](https://cloud.google.com/support)
- **Deepgram**: [Deepgram Support](https://support.deepgram.com/)
- **Convex**: [Convex Discord](https://discord.gg/convex)
- **Inngest**: [Inngest Support](https://inngest.com/support)
- **AI Guru Lab**: Contact through their platform
- **Gemini AI**: [Google AI Support](https://ai.google.dev/support)
- **Vercel**: [Vercel Support](https://vercel.com/support)
- **Remotion**: [Remotion Discord](https://discord.gg/remotion)

---

## 📊 Cost Estimation

| Service | Estimated Monthly Cost | Billing Model |
|---------|----------------------|---------------|
| Firebase | $0-25 | Pay-as-you-go |
| AWS Lambda | $5-50 | Per execution |
| Google Cloud | $10-100 | API calls + storage |
| Deepgram | $5-25 | Per minute transcribed |
| Convex | $0-30 | Database operations |
| Inngest | $0-25 | Event processing |
| AI Guru Lab | $20-200 | Per generation |
| Gemini AI | $0-50 | Per token |
| Vercel | $0-20 | Bandwidth + functions |
| Remotion | $10-100 | Rendering minutes |

---

*This document should be kept secure and updated whenever credentials are changed or new services are added.*
