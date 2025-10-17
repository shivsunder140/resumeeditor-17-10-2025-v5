import { Template } from '../types/resume';

export const TEMPLATES: Template[] = [
  {
    id: 'classic-1',
    name: 'Professional Classic',
    category: 'classic',
    preview: 'bg-white border-2 border-gray-300',
    description: 'Traditional professional layout'
  },
  {
    id: 'modern-1',
    name: 'Tech Modern',
    category: 'modern',
    preview: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    description: 'Technology industry modern'
  },
  {
    id: 'photo-1',
    name: 'Professional Photo',
    category: 'photo',
    preview: 'bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-300',
    description: 'Photo-centric professional'
  },
  {
    id: 'classic-2',
    name: 'Executive Classic',
    category: 'classic',
    preview: 'bg-gray-50 border-2 border-gray-400',
    description: 'Executive-level traditional'
  },
  {
    id: 'modern-2',
    name: 'Creative Modern',
    category: 'modern',
    preview: 'bg-gradient-to-br from-pink-500 to-rose-600',
    description: 'Creative and bold design'
  },
  {
    id: 'photo-2',
    name: 'Creative Photo',
    category: 'photo',
    preview: 'bg-gradient-to-r from-purple-100 to-pink-200 border-2 border-purple-300',
    description: 'Creative industries focused'
  },
];

export const COLOR_PALETTES = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#64748B', accent: '#8B5CF6' },
  { name: 'Green', primary: '#10B981', secondary: '#64748B', accent: '#F59E0B' },
  { name: 'Orange', primary: '#F97316', secondary: '#64748B', accent: '#06B6D4' },
  { name: 'Red', primary: '#EF4444', secondary: '#64748B', accent: '#10B981' },
  { name: 'Teal', primary: '#14B8A6', secondary: '#64748B', accent: '#F59E0B' },
  { name: 'Indigo', primary: '#6366F1', secondary: '#64748B', accent: '#EC4899' },
  { name: 'Gray', primary: '#6B7280', secondary: '#9CA3AF', accent: '#3B5CF6' },
  { name: 'Black', primary: '#000000', secondary: '#475569', accent: '#e2e8f0' },
  { name: 'White', primary: '#FFFFFF', secondary: '#f1f5f9', accent: '#64748b' },
];

export const FONT_STYLES = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Century Gothic'
];
