/* 
        To do List (31/8/2025):
        1. Try deployment on ithub actions or docke.
        2. change the region in AWS Lambda from us-eas1 to another and try do deploy. 
*/

import axios from "axios";
import { inngest } from "./client";
import { createClient } from "@deepgram/sdk";
import { GenerateImageScript } from "@/configs/AiModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getServices, renderMediaOnCloudrun } from '@remotion/cloudrun/client';
import { getFunctions, renderMediaOnLambda, getRenderProgress } from '@remotion/lambda-client';


const ImagePromptScript = `Generate detailed image prompts in {style} style for 
all images based on the provided script: {script}. 
IMPORTANT: Write image prompts ONLY in English language.
Ensure each image prompt aligns with the storyline
 and visually represents the key moments.
Do not include camera angles in the image prompts.
Return a maximum of 4-5 images.
Follow this JSON schema strictly:
- [
    {
        imagePrompt:'',
        sceneContent: ' <Script Content>'
    }
]`

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

const BASE_URL = 'https://aigurulab.tech';
export const GenerateVideoData = inngest.createFunction(
    { 
        id: 'generate-video-data',
        timeout: '30m' // 30 minutes timeout for video generation
    },
    { event: 'generate-video-data' },
    async ({ event, step }) => {

        const { script, topic, title, caption, videoStyle, voice, recordId } = event?.data;
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
        // Generate Audio File MP3
        const GenerateAudioFile = await step.run(
            "GenerateAudioFile",
            async () => {
                const result = await axios.post(BASE_URL + '/api/text-to-speech',
                    {
                        input: script,
                        voice: voice
                    },
                    {
                        headers: {
                            'x-api-key': process.env.NEXT_PUBLIC_AIGURULAB_API_KEY, // Your API Key
                            'Content-Type': 'application/json', // Content Type
                        },
                    })
                return result.data.audio;
            }
        )

        //Generate Captions
        const GenerateCaptions = await step.run(
            "generateCaptions",
            async () => {
                const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
                // STEP 2: Call the transcribeUrl method with the audio payload and options
                const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
                    {
                        url: GenerateAudioFile,
                    },
                    // STEP 3: Configure Deepgram options for audio analysis
                    {
                        model: "nova-3",
                    }
                );
                return result.results?.channels[0]?.alternatives[0]?.words;
            }
        )
        //Generate Image Prompt from Scrip
        const GenerateImagePrompts = await step.run(
            "generateImagePrompt",
            async () => {
                const FINAL_PROMPT = ImagePromptScript
                    .replace('{style}', videoStyle).replace('{script}', script);
                const result = await GenerateImageScript(FINAL_PROMPT);
                const resp = result.response.text();

                // Try to extract JSON from the response if it contains extra text
                let jsonResponse;
                try {
                    jsonResponse = JSON.parse(resp);
                } catch (parseError) {
                    console.log("Direct JSON parsing failed, trying extraction methods...");
                    console.log("Response:", resp);
                    
                    // If direct parsing fails, try to extract JSON from markdown code blocks
                    const jsonMatch = resp.match(/```json\s*([\s\S]*?)\s*```/) || resp.match(/```\s*([\s\S]*?)\s*```/);
                    if (jsonMatch) {
                        console.log("Found JSON in code block:", jsonMatch[1]);
                        jsonResponse = JSON.parse(jsonMatch[1]);
                    } else {
                        // Try to find JSON array in the response - use a more precise regex
                        const jsonArrayMatch = resp.match(/\[[\s\S]*?\]/);
                        if (jsonArrayMatch) {
                            console.log("Found JSON array:", jsonArrayMatch[0]);
                            jsonResponse = JSON.parse(jsonArrayMatch[0]);
                        } else {
                            // Try to find the first complete JSON object/array
                            const lines = resp.split('\n');
                            let jsonStart = -1;
                            let jsonEnd = -1;
                            let braceCount = 0;
                            let bracketCount = 0;
                            
                            for (let i = 0; i < lines.length; i++) {
                                const line = lines[i];
                                if (line.includes('{') || line.includes('[')) {
                                    if (jsonStart === -1) jsonStart = i;
                                }
                                
                                for (let char of line) {
                                    if (char === '{') braceCount++;
                                    if (char === '}') braceCount--;
                                    if (char === '[') bracketCount++;
                                    if (char === ']') bracketCount--;
                                }
                                
                                if (jsonStart !== -1 && braceCount === 0 && bracketCount === 0) {
                                    jsonEnd = i;
                                    break;
                                }
                            }
                            
                            if (jsonStart !== -1 && jsonEnd !== -1) {
                                const jsonText = lines.slice(jsonStart, jsonEnd + 1).join('\n');
                                console.log("Extracted JSON:", jsonText);
                                jsonResponse = JSON.parse(jsonText);
                            } else {
                                throw new Error("No valid JSON found in response");
                            }
                        }
                    }
                }

                return jsonResponse;
            }
        )
        //Generate Images using AI

        const GenerateImages = await step.run(
            "generateImages",
            async () => {
                let images = [];
                images = await Promise.all(
                    GenerateImagePrompts.map(async (element) => {
                        const result = await axios.post(BASE_URL + '/api/generate-image',
                            {
                                width: 720,
                                height: 1280,
                                input: element?.imagePrompt,
                                model: 'sdxl',//'flux'
                                aspectRatio: "1:1"//Applicable to Flux model only
                            },
                            {
                                headers: {
                                    'x-api-key': process.env.NEXT_PUBLIC_AIGURULAB_API_KEY, // Your API Key
                                    'Content-Type': 'application/json', // Content Type
                                },
                            })
                        console.log(result.data.image) //Output Result: Base 64 Image
                        return result.data.image;
                    })
                )
                return images;
            }
        )

        //Save All Data to DB
        const UpdateDB = await step.run(
            'UpdateDB',
            async () => {
                const result = await convex.mutation(api.videoData.UpdateVideoRecord, {
                    recordId: recordId,
                    audioUrl: GenerateAudioFile,
                    captionJson: GenerateCaptions,
                    images: GenerateImages
                });
                return result;
            }
        )

        /**
         * using Google Cloud (SLOW RENDERING)
         
         const RenderVideo = await step.run(
             "renderVideo",
             async () => {
                 // Calculate video duration from captions
                 const videoDuration = GenerateCaptions && GenerateCaptions.length > 0 
                     ? Math.ceil(GenerateCaptions[GenerateCaptions.length - 1].end * 30) 
                     : 450; // fallback to 15 seconds
                 
                 console.log('Video duration in frames:', videoDuration);
                 console.log('Last caption end time:', GenerateCaptions[GenerateCaptions.length - 1]?.end);
                 console.log('Starting video rendering...');
                 
                 //Redner Video
                 const services = await getServices({
                     region: 'us-east1',
                     compatibleOnly: true,
                 });

                 const serviceName = services[0].serviceName;
                 const result = await renderMediaOnCloudrun({
                    serviceName,
                    region: 'us-east1',
                    serveUrl: process.env.GCP_SERVE_URL,
                    composition: 'youtubeShort',
                    inputProps: {
                         videoData: {
                             audioUrl: GenerateAudioFile,
                             captionJson: GenerateCaptions,
                             images: GenerateImages,
                             caption: caption,  // Include the caption styling object
                             duration: videoDuration  // Explicitly pass duration
                         }
                     },
                    codec: 'h264',
                    timeoutInMilliseconds: 1500000, // 25 minutes timeout (25 * 60 * 1000)

                 });

                 if (result.type === 'success') {
                     console.log('Video rendering completed successfully!');
                     console.log('Bucket:', result.bucketName);
                     console.log('Render ID:', result.renderId);
                     console.log('Public URL:', result.publicUrl);
                 } else {
                     console.log('Video rendering failed:', result);
                 }
                 return result?.publicUrl;
             }
         )*/

        /**
         * Using AWS Lamda (FAST RENDERING)
         */
        const RenderVideoUsingAWSLamda = await step.run(
            "RenderVideoUsingAWSLamda",
            async () => {
                //Redner Video
                const functions = await getFunctions({
                    region: 'us-east-1',
                    compatibleOnly: false,
                });

                const functionName = functions[0].functionName;

                const { renderId, bucketName } = await renderMediaOnLambda({
                    region: 'us-east-1',
                    functionName: process.env.REMOTION_AWS_FUNCTION_NAME,// Or use above function Name
                    serveUrl: process.env?.REMOTION_AWS_SERVE_URL,
                    composition: 'youtubeShort',
                    inputProps: {
                        videoData: {
                            audioUrl: GenerateAudioFile,
                            captionJson: GenerateCaptions,
                            images: GenerateImages,
                            caption: caption  // Include the caption styling object
                        }
                    },
                    codec: 'h264',
                    imageFormat: 'jpeg',
                    maxRetries: 1,
                    framesPerLambda: 100, // Increased to work within concurrency limit of 10
                    privacy: 'public',
                });
                const url = process.env.REMOTION_AWS_SITE_URL + '/renders/' + renderId + '/out.mp4'

                return url

                // return functions

            }
        )

        // Error: this code isn't working properly, need to check and fic the code to upload the video URL to DB
        const UpdateDownloadUrl = await step.run(
            'UpdateDownloadUrl',
            async () => {
                const result = await convex.mutation(api.videoData.UpdateVideoDownloadUrl, {
                    recordId: recordId,
                    downloadUrl: RenderVideoUsingAWSLamda ?? 'NoURL'

                });
                return result;
            }
        )

        return RenderVideoUsingAWSLamda;
    }
)

