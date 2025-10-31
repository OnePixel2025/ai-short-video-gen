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

        // Helper function to convert single quotes to double quotes (JSON-compliant)
        const normalizeJsonQuotes = (text) => {
            let result = '';
            let i = 0;
            
            while (i < text.length) {
                const char = text[i];
                
                // Check for escaped single quotes (like \')
                if (char === '\\' && i + 1 < text.length && text[i + 1] === "'") {
                    // Keep escaped single quotes as is, but we'll handle them differently
                    result += '\\"';
                    i += 2;
                }
                // Check for escaped backslashes before quotes
                else if (char === '\\' && i + 1 < text.length) {
                    result += char + text[i + 1];
                    i += 2;
                }
                // Replace single quotes with double quotes
                else if (char === "'") {
                    result += '"';
                    i++;
                }
                else {
                    result += char;
                    i++;
                }
            }
            
            // Also normalize unquoted property names
            result = result.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
            
            return result;
        };

        // Try to extract JSON from the response if it contains extra text
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(resp);
        } catch (parseError) {
            console.log("Direct JSON parsing failed, trying extraction methods...");
            console.log("Response:", resp);
            
            // If direct parsing fails, try to extract JSON from markdown code blocks
            const jsonMatch = resp.match(/```json\s*([\s\S]*?)\s*```/) || resp.match(/```\s*([\s\S]*?)\s*```/);
            let jsonText = jsonMatch ? jsonMatch[1] : null;
            
            if (!jsonText) {
                // Try to find the first complete JSON object/array using brace/bracket counting
                const lines = resp.split('\n');
                let jsonStart = -1;
                let jsonEnd = -1;
                let braceCount = 0;
                let bracketCount = 0;
                let inString = false;
                let stringChar = null;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    // Find the start of JSON
                    if (jsonStart === -1 && (line.trim().startsWith('{') || line.trim().startsWith('['))) {
                        jsonStart = i;
                    }
                    
                    if (jsonStart !== -1) {
                        // Count braces and brackets, but ignore inside strings
                        for (let j = 0; j < line.length; j++) {
                            const char = line[j];
                            const prevChar = j > 0 ? line[j - 1] : null;
                            
                            if ((char === '"' || char === "'") && (j === 0 || prevChar !== '\\')) {
                                if (!inString) {
                                    inString = true;
                                    stringChar = char;
                                } else if (char === stringChar) {
                                    inString = false;
                                    stringChar = null;
                                }
                            }
                            
                            if (!inString) {
                                if (char === '{') braceCount++;
                                if (char === '}') braceCount--;
                                if (char === '[') bracketCount++;
                                if (char === ']') bracketCount--;
                            }
                        }
                        
                        // When all braces and brackets are closed, we found the end
                        if (braceCount === 0 && bracketCount === 0 && jsonStart !== -1) {
                            jsonEnd = i;
                            break;
                        }
                    }
                }
                
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    jsonText = lines.slice(jsonStart, jsonEnd + 1).join('\n');
                    console.log("Extracted JSON:", jsonText);
                }
            }
            
            if (jsonText) {
                // First, try parsing directly after trimming (it might already be valid JSON)
                const trimmedJson = jsonText.trim();
                try {
                    jsonResponse = JSON.parse(trimmedJson);
                    console.log("Successfully parsed JSON directly");
                } catch (directParseError) {
                    console.log("Direct parse failed, checking if normalization is needed...");
                    console.log("Parse error:", directParseError.message);
                    
                    // Check if the JSON uses single quotes for structure (not content)
                    // We detect this by looking for patterns like: key: 'value' or { 'key': 'value' }
                    const hasSingleQuoteStructure = /:\s*'[^']*'|{\s*'|'\s*:/.test(trimmedJson);
                    
                    if (hasSingleQuoteStructure) {
                        console.log("Detected single quote structure, normalizing...");
                        
                        // Only normalize structural quotes, not apostrophes inside strings
                        // Strategy: use a state machine to only replace quotes that are structural
                        let normalized = '';
                        let inString = false;
                        let stringChar = null;
                        let i = 0;
                        
                        while (i < trimmedJson.length) {
                            const char = trimmedJson[i];
                            const prevChar = i > 0 ? trimmedJson[i - 1] : null;
                            const isEscaped = prevChar === '\\';
                            
                            // If this character is escaped, just add it as-is
                            if (isEscaped) {
                                normalized += char;
                                i++;
                                continue;
                            }
                            
                            // Handle backslash (it escapes the next character)
                            if (char === '\\') {
                                normalized += char;
                                i++;
                                continue;
                            }
                            
                            // Track when we enter/exit strings
                            if (char === '"' || char === "'") {
                                if (!inString) {
                                    // Starting a string - convert single quote to double if it's structural
                                    inString = true;
                                    stringChar = char;
                                    normalized += char === "'" ? '"' : char;
                                } else if (char === stringChar) {
                                    // Ending a string
                                    inString = false;
                                    stringChar = null;
                                    normalized += char === "'" ? '"' : char;
                                } else {
                                    // Different quote type inside string - keep as is (apostrophe in double-quoted string)
                                    normalized += char;
                                }
                            } else {
                                normalized += char;
                            }
                            i++;
                        }
                        
                        // Also normalize unquoted property names
                        normalized = normalized.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
                        
                        console.log("Normalized JSON:", normalized.substring(0, 200) + "...");
                        
                        try {
                            jsonResponse = JSON.parse(normalized);
                        } catch (normalizedError) {
                            console.error("Normalization failed:", normalizedError.message);
                            throw new Error(`Failed to parse JSON: ${normalizedError.message}`);
                        }
                    } else {
                        // JSON structure looks valid but parsing failed - might be a different issue
                        console.error("JSON appears valid but parsing failed");
                        throw directParseError;
                    }
                }
            } else {
                throw new Error("No valid JSON found in response");
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
