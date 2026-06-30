export interface Draft {
  _id: string;
  user_id: string | null;
  title: string;
  content: string;
  plain_text: string;
  topic: string;
  key_points: string[];
  tone: string;
  length: string;
  image_urls: string[];
  selected_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostHistory {
  _id: string;
  user_id: string;
  content: string;
  plain_text: string;
  image_url: string | null;
  linkedin_post_id: string | null;
  topic: string;
  tone: string;
  length: string;
  posted_at: string;
  platform: string;
  engagement: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

export interface GeneratePostRequest {
  topic: string;
  key_points: string[];
  tone: string;
  length: string;
}

export interface GenerateImageRequest {
  topic: string;
  style: string;
  post_summary: string;
}

export interface GeneratedImage {
  url: string;
  thumbnail_url: string;
}

export interface UserSettings {
  default_tone: string;
  default_length: string;
  default_image_style: string;
  auto_hashtags: boolean;
  hashtag_count: number;
}

export interface User {
  name: string;
  avatar_url: string;
  token: string;
  user_id: string;
}

export type Tone = 'Professional' | 'Casual' | 'Inspirational' | 'Educational' | 'Storytelling';
export type Length = 'Short' | 'Medium' | 'Long';
export const IMAGE_STYLES = [
  { id: 'Modern 3D', label: 'Modern 3D' },
  { id: 'Minimal', label: 'Minimal' },
  { id: 'Photographic', label: 'Photo' },
] as const;

export type ImageStyle = (typeof IMAGE_STYLES)[number]['id'];
