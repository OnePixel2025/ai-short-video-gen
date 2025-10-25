import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const generationConfig = {
    temperature: 1,
    max_tokens: 8192,
};

export const generateScript = async (prompt) => {
    try {
        console.log("Generating script with prompt:", prompt);
        console.log("OpenAI API Key exists:", !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a video script generator. Always respond in English language only, regardless of the user's interface language or any other context. Never generate content in Arabic, Spanish, French, or any other language - only English.\n\nWrite scripts for maximum 20 Seconds video.\n- Write ONLY in English language\n- Do not add Scene description\n- Do not Add Anything in Braces, Just return the plain story in text\n- CRITICAL: Return ONLY valid JSON, no explanatory text, no markdown formatting, no code blocks\n- Follow this exact schema:\n{\n scripts:[\n {\n content:''\n },\n ],\n}"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            ...generationConfig
        });
        
        console.log("OpenAI response received:", completion.choices[0].message.content);
        
        return {
            response: {
                text: () => completion.choices[0].message.content
            }
        };
    } catch (error) {
        console.error("Error generating script:", error);
        throw error;
    }
};

export const GenerateImageScript = async (prompt) => {
    try {
        console.log("Generating image script with prompt:", prompt);
        console.log("OpenAI API Key exists:", !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an image prompt generator. Always respond in English language only, regardless of the user's interface language or any other context. Never generate content in Arabic, Spanish, French, or any other language - only English.\n\nGenerate detailed image prompts for video scenes.\nIMPORTANT: Write image prompts ONLY in English language.\nJust Give specific image prompt depends on the story line\nDo not give camera angle image prompt\nCRITICAL: Return ONLY valid JSON, no explanatory text, no markdown formatting, no code blocks\nFollow this exact schema (Max 4-5 Images):\n[\n{\nimagePrompt:'',\nsceneContent: ' <Script Content>'\n}\n]"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            ...generationConfig
        });
        
        console.log("OpenAI image script response received:", completion.choices[0].message.content);
        
        return {
            response: {
                text: () => completion.choices[0].message.content
            }
        };
    } catch (error) {
        console.error("Error generating image script:", error);
        throw error;
    }
};
