import type { UserProfile, BentoItemData } from '../types';
import { TFunction } from 'i18next';
import { Twitter, Github, Linkedin, Dribbble, Twitch, Youtube, Rss, Mail, Music, MessageCircle, Sticker } from 'lucide-react';

const colorPalettes = [
  ["#8ECAE6", "#219EBC", "#023047", "#FFB703", "#FB8500"],
  ["#D9ED92", "#B5E48C", "#99D98C", "#76C893", "#52B69A"],
  ["#F72585", "#B5179E", "#7209B7", "#560BAD", "#480CA8", "#3A0CA3", "#3F37C9", "#4895EF"],
  ["#2D00F7", "#6A00F4", "#8900F2", "#A100F2", "#B100E8", "#BC00DD", "#D100D1", "#DB00B6"],
];

const layouts = [
  // Layout 1: Perfil grande
  [
    { id: 1, type: 'profile', colSpan: 'md:col-span-2', rowSpan: 'md:row-span-2' },
    { id: 2, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 3, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 4, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 5, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
  ],
  // Layout 2: Columna central dominante
  [
    { id: 1, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 2, type: 'profile', colSpan: 'md:col-span-1', rowSpan: 'md:row-span-2' },
    { id: 3, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 4, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 5, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
  ],
    // Layout 3: Foco en la primera fila
  [
    { id: 1, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
    { id: 2, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
    { id: 3, type: 'profile', colSpan: 'md:col-span-1', rowSpan: 'md:row-span-2' },
    { id: 4, colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' },
    { id: 5, colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' },
  ],
] as const;

const allItemsBank = [
    { Icon: Music, title: 'Spotify Playlist', key: 'spotify', href: '#' },
    { Icon: MessageCircle, title: 'WhatsApp', key: 'whatsapp', href: '#' },
    { Icon: Twitter, title: 'Twitter / X', key: 'twitter', href: '#' },
    { Icon: Github, title: 'GitHub', key: 'github', href: '#' },
    { Icon: Linkedin, title: 'LinkedIn', key: 'linkedin', href: '#' },
    { Icon: Sticker, title: 'Mi Sticker Pack', key: 'sticker', href: '#', type: 'sticker' },
    { Icon: Mail, title: 'Contáctame', key: 'mail', href: '#' },
    { Icon: Youtube, title: 'YouTube', key: 'youtube', href: '#' },
] as const;

// FIX: Update function to accept readonly arrays to handle 'as const' types. This resolves the error on line 61.
const getRandomItem = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffleArray = <T>(arr: T[]): T[] => arr.sort(() => 0.5 - Math.random());

export const generateNewVibe = (userInput: string, t: TFunction) => {
  const profile: UserProfile = {
    name: userInput.startsWith('@') ? userInput : `@${userInput.split(' ')[0]}`,
    avatarUrl: `https://picsum.photos/seed/${userInput}/200`,
    bio: t('profile.bio'),
  };

  const selectedPalette = getRandomItem(colorPalettes);
  const selectedLayout = getRandomItem(layouts);
  const shuffledItemsBank = shuffleArray([...allItemsBank]);

  const bentoItems: BentoItemData[] = selectedLayout.map((layoutConfig, index) => {
    const itemTemplate = shuffledItemsBank[index % shuffledItemsBank.length];
    const subtitleKey = `sarcasticSubtitles.${itemTemplate.key}`;
    const subtitles = t(subtitleKey, { returnObjects: true }) as string[] || [];
    
    return {
      ...layoutConfig,
      Icon: itemTemplate.Icon,
      // FIX: Safely access the optional 'type' property on itemTemplate using a type guard. This resolves the error on line 72.
      type: layoutConfig.type || ('type' in itemTemplate && itemTemplate.type) || 'default',
      title: layoutConfig.type === 'profile' ? profile.name : t(`itemTitles.${itemTemplate.key}`),
      subtitle: layoutConfig.type === 'profile' ? t('profile.subtitle') : (subtitles.length > 0 ? getRandomItem(subtitles) : t('itemTitles.default', { title: itemTemplate.title })),
      href: itemTemplate.href,
      bgColor: `bg-[${getRandomItem(selectedPalette)}]`,
      img: layoutConfig.type === 'profile' ? profile.avatarUrl : undefined,
    };
  });

  return { userProfile: profile, items: bentoItems };
};
