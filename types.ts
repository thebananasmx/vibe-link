import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface UserProfile {
  name: string;
  avatarUrl: string;
  bio: string;
}

export interface BentoItemData {
  id: number;
  iconKey: string; // Storing a string key instead of the component
  title: string;
  subtitle: string;
  href: string;
  bgColor: string;
  colSpan: string;
  rowSpan: string;
  type?: 'default' | 'profile' | 'sticker';
  img?: string;
}

export interface VibeConfig {
  slug: string;
  userProfile: UserProfile;
  items: BentoItemData[];
}