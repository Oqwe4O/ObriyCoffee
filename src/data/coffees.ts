import type { ImageMetadata } from 'astro';
import ethiopiaImage from '../assets/ethiopia.png';
import colombiaImage from '../assets/colombia.png';
import brazilImage from '../assets/brazil.png';

export const weights = [
  { id: '250', label: '250 г' },
  { id: '1000', label: '1 кг' },
] as const;

export const grinds = ['Зерно', 'Під фільтр', 'Під еспресо', 'Під турку'] as const;

export type WeightId = (typeof weights)[number]['id'];

export interface Coffee {
  slug: string;
  name: string;
  region: string;
  roast: 1 | 2 | 3;
  roastLabel: string;
  notes: string[];
  brew: string;
  image: ImageMetadata;
  prices: Record<WeightId, number>;
}

export const coffees: Coffee[] = [
  {
    slug: 'ethiopia',
    name: 'Ефіопія',
    region: 'Ґуджі',
    roast: 1,
    roastLabel: 'Світле обсмаження',
    notes: ['бергамот', 'персик', 'чорний чай'],
    brew: 'Найкраще у фільтрі та V60',
    image: ethiopiaImage,
    prices: { '250': 420, '1000': 1450 },
  },
  {
    slug: 'colombia',
    name: 'Колумбія',
    region: 'Уїла',
    roast: 2,
    roastLabel: 'Середнє обсмаження',
    notes: ['карамель', 'червоне яблуко', 'какао'],
    brew: 'Універсальна: фільтр, еспресо, турка',
    image: colombiaImage,
    prices: { '250': 380, '1000': 1290 },
  },
  {
    slug: 'brazil',
    name: 'Бразилія',
    region: 'Серрадо',
    roast: 3,
    roastLabel: 'Темне обсмаження',
    notes: ['темний шоколад', 'фундук', 'патока'],
    brew: 'Для еспресо та кави з молоком',
    image: brazilImage,
    prices: { '250': 340, '1000': 1150 },
  },
];
