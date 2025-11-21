import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, BentoItemData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const availableIcons = ['twitter', 'github', 'linkedin', 'dribbble', 'twitch', 'youtube', 'rss', 'mail', 'spotify', 'whatsapp', 'sticker'];

const layouts = [
  [
    { id: 1, type: 'profile', colSpan: 'md:col-span-2', rowSpan: 'md:row-span-2' },
    { id: 2, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 3, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 4, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 5, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
  ],
  [
    { id: 1, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 2, type: 'profile', colSpan: 'md:col-span-1', rowSpan: 'md:row-span-2' },
    { id: 3, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 4, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 5, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
  ],
  [
    { id: 1, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
    { id: 2, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 3, type: 'profile', colSpan: 'md:col-span-1', rowSpan: 'md:row-span-2' },
    { id: 4, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
    { id: 5, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
  ],
] as const;


export const generateVibeWithGemini = async (userInput: string): Promise<{ userProfile: UserProfile; items: BentoItemData[] } | null> => {
    try {
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'A cool handle or name for the user based on the input. If the input looks like a handle, use it. Should start with @.' },
                bio: { type: Type.STRING, description: 'A short, witty, and creative bio (max 150 characters) that captures the user\'s vibe.' },
                avatarSeed: { type: Type.STRING, description: 'A single, descriptive word to be used as a seed for a random image generator (e.g., "neon", "galaxy", "forest").' },
                palette: { 
                    type: Type.ARRAY, 
                    description: 'An array of 5 vibrant and cohesive hex color codes (e.g., "#FFB703") that fit the neobrutalist theme.',
                    items: { type: Type.STRING }
                },
                links: {
                    type: Type.ARRAY,
                    description: 'An array of exactly 4 link objects relevant to the user\'s vibe.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            iconKey: { type: Type.STRING, description: `The icon key. Must be one of: ${availableIcons.join(', ')}` },
                            title: { type: Type.STRING, description: 'The title for the link (e.g., "My Music").' },
                            subtitle: { type: Type.STRING, description: 'A short, sarcastic, or fun subtitle for the link.' },
                        },
                        required: ['iconKey', 'title', 'subtitle']
                    }
                }
            },
            required: ['name', 'bio', 'avatarSeed', 'palette', 'links']
        };

        const prompt = `You are a creative assistant that designs personalized 'link-in-bio' pages called VibeLinks. Based on a user's description, you will generate a profile, a set of relevant links, and a color palette that matches their 'vibe'. The style must be neobrutalist: vibrant colors, fun, and slightly sarcastic. The user's description is: "${userInput}". Generate exactly 4 links.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });

        // FIX: Robustly parse JSON, handling potential markdown code fences.
        let jsonText = response.text.trim();
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = jsonText.match(jsonRegex);
        if (match) {
            jsonText = match[1];
        }

        const jsonResponse = JSON.parse(jsonText);
        
        const userProfile: UserProfile = {
            name: jsonResponse.name,
            bio: jsonResponse.bio,
            avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(jsonResponse.avatarSeed)}/200`,
        };

        const selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
        
        // FIX: Add a fallback palette to prevent errors if the API doesn't provide one.
        const defaultPalette = ['#FFB703', '#FB8500', '#8ECAE6', '#219EBC', '#023047'];
        const palette = (jsonResponse.palette && jsonResponse.palette.length > 0) 
            ? jsonResponse.palette 
            : defaultPalette;
        
        const finalItems: BentoItemData[] = [];
        let linkIndex = 0;
        for (const layoutConfig of selectedLayout) {
            let item: BentoItemData;
            if ('type' in layoutConfig && layoutConfig.type === 'profile') {
                item = {
                    ...layoutConfig,
                    iconKey: 'default',
                    type: 'profile',
                    title: userProfile.name,
                    subtitle: "A little bit about me.",
                    href: '#',
                    color: palette[Math.floor(Math.random() * palette.length)],
                    img: userProfile.avatarUrl,
                };
            } else {
                // FIX: Handle cases where the AI might not return links to prevent crashing.
                if (!jsonResponse.links || jsonResponse.links.length === 0) {
                    item = {
                        ...layoutConfig,
                        iconKey: 'default',
                        type: 'default',
                        title: 'AI Generated Link',
                        subtitle: 'You can edit this!',
                        href: '#',
                        color: palette[Math.floor(Math.random() * palette.length)],
                    };
                } else {
                    const linkData = jsonResponse.links[linkIndex % jsonResponse.links.length];
                    // Correctly assign 'sticker' type for sticker icons.
                    const itemType = linkData.iconKey === 'sticker' ? 'sticker' : 'default';
                    item = {
                        ...layoutConfig,
                        iconKey: linkData.iconKey,
                        type: itemType,
                        title: linkData.title,
                        subtitle: linkData.subtitle,
                        href: '#',
                        color: palette[Math.floor(Math.random() * palette.length)],
                    };
                }
                linkIndex++;
            }
            finalItems.push(item);
        }

        return { userProfile, items: finalItems };

    } catch (error) {
        console.error("Error generating vibe with Gemini:", error);
        return null;
    }
};
