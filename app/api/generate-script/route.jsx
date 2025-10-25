import { generateScript } from "@/configs/AiModel";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = `Write two unique scripts for a 30 to 60 second 
video on the topic: {topic}. Each script should be engaging, 
concise, and impactful. 
IMPORTANT: Write ONLY in English language, regardless of the user's interface language.
Do not include scene descriptions, formatting, or anything in braces—just return the plain text story.
Respond strictly in JSON format using the following schema:
-{
scripts:[
{
content:''
},
],
}`
export async function POST(req) {
    try {
        const { topic } = await req.json();

        const PROMPT = SCRIPT_PROMPT.replace('{topic}', topic);
        const result = await generateScript(PROMPT);
        const resp = result?.response?.text();

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
                // Try to find JSON object in the response - use a more precise regex
                const jsonObjectMatch = resp.match(/\{[\s\S]*?\}/);
                if (jsonObjectMatch) {
                    console.log("Found JSON object:", jsonObjectMatch[0]);
                    jsonResponse = JSON.parse(jsonObjectMatch[0]);
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

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error("Error in generate-script API:", error);
        return NextResponse.json(
            { error: "Failed to generate script" },
            { status: 500 }
        );
    }
}