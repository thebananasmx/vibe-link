import type { UserProfile, BentoItemData } from '../types';
import { Twitter, Github, Linkedin, Dribbble, Twitch, Youtube, Rss, Mail, Music, MessageCircle, Sticker } from 'lucide-react';

const colorPalettes = [
  ["#8ECAE6", "#219EBC", "#023047", "#FFB703", "#FB8500"],
  ["#D9ED92", "#B5E48C", "#99D98C", "#76C893", "#52B69A"],
  ["#F72585", "#B5179E", "#7209B7", "#560BAD", "#480CA8", "#3A0CA3", "#3F37C9", "#4895EF"],
  ["#2D00F7", "#6A00F4", "#8900F2", "#A100F2", "#B100E8", "#BC00DD", "#D100D1", "#DB00B6"],
];

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

const allItemsBank = [
    { title: 'Spotify Playlist', key: 'spotify', href: '#' },
    { title: 'WhatsApp', key: 'whatsapp', href: '#' },
    { title: 'Twitter / X', key: 'twitter', href: '#' },
    { title: 'GitHub', key: 'github', href: '#' },
    { title: 'LinkedIn', key: 'linkedin', href: '#' },
    { title: 'Mi Sticker Pack', key: 'sticker', href: '#', type: 'sticker' },
    { title: 'Contact Me', key: 'mail', href: '#' },
    { title: 'YouTube', key: 'youtube', href: '#' },
] as const;

const sarcasticSubtitles = {
    spotify: [
      "What I listen to so I don't cry", 
      "Songs for my existential crisis", 
      "My shrink recommended this playlist"
    ],
    whatsapp: [
      "Let's talk (if it's urgent)", 
      "For meme emergencies only", 
      "Send me a sticker, not a 'hi'"
    ],
    twitter: [
      "My worst takes, 280 characters at a time", 
      "Unsolicited opinions on everything", 
      "The reason I don't get hired"
    ],
    github: [
      "Where my code goes to die", 
      "Projects I'll start... tomorrow", 
      "Cemetery of half-baked ideas"
    ],
    linkedin: [
      "My boring corporate self", 
      "Faking professionalism since 2018", 
      "Let's connect and never talk"
    ]
};

const getRandomItem = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffleArray = <T>(arr: T[]): T[] => arr.sort(() => 0.5 - Math.random());

export const generateNewVibe = (userInput: string) => {
  const profile: UserProfile = {
    name: userInput.startsWith('@') ? userInput : `@${userInput.split(' ')[0]}`,
    avatarUrl: `https://picsum.photos/seed/${userInput}/200`,
    bio: "AI-generated description based on your vibe. Or something like that. I'm really just placeholder text.",
  };

  const selectedPalette = getRandomItem(colorPalettes);
  const selectedLayout = getRandomItem(layouts);
  const shuffledItemsBank = shuffleArray([...allItemsBank]);

  const bentoItems: BentoItemData[] = selectedLayout.map((layoutConfig, index) => {
    const itemTemplate = shuffledItemsBank[index % shuffledItemsBank.length];
    
    // @ts-ignore
    const subtitles = sarcasticSubtitles[itemTemplate.key] || [];
    
    return {
      ...layoutConfig,
      iconKey: itemTemplate.key, // Save the key, not the component
      type: layoutConfig.type || ('type' in itemTemplate && itemTemplate.type) || 'default',
      title: layoutConfig.type === 'profile' ? profile.name : itemTemplate.title,
      subtitle: layoutConfig.type === 'profile' ? "Your profile, with a cool CSS filter." : (subtitles.length > 0 ? getRandomItem(subtitles) : `Link to my ${itemTemplate.title}`),
      href: itemTemplate.href,
      bgColor: `bg-[${getRandomItem(selectedPalette)}]`,
      ...(layoutConfig.type === 'profile' && { img: profile.avatarUrl }),
    };
  });

  return { userProfile: profile, items: bentoItems };
};
