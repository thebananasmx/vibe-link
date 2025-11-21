import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface UserProfile {
  name: string;
  avatarUrl: string;
  bio: string;
}

export interface BentoItemData {
  id: number;
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  subtitle: string;
  href: string;
  bgColor: string;
  colSpan: string;
  rowSpan: string;
  type?: 'default' | 'profile' | 'sticker';
  img?: string;
}
