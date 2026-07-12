import type { Theme } from './types';
import { classicThemes } from './classic';
import { modernThemes } from './modern';

export type { Theme };
export const THEMES: Theme[] = [...classicThemes, ...modernThemes];

export interface ThemeGroup {
  label: string;
  themes: Theme[];
}

export const THEME_GROUPS: ThemeGroup[] = [
  { label: '经典', themes: classicThemes },
  { label: '潮流', themes: modernThemes },
];
