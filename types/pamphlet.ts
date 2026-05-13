import { RowDataPacket } from 'mysql2/promise';

/**
 * Pamphlet category enum
 */
export enum PamphletCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}

/**
 * Pamphlet interface representing a pamphlet in the database
 */
export interface Pamphlet {
  id: number;
  title: string | null;
  short_description: string | null;
  thumbnail_image: string | null;
  category: string | null;
  location_id: number | null;
  location: { city: string; latitude: number; longitude: number };
  user_id: number | null;
  created_at: Date | null;
  url_key: string | null;
  author_name: string | null;
}

/**
 * Pamphlet response (formatted for API)
 */
export interface PamphletResponse {
  id: number;
  title: string;
  short_description: string;
  image_url: string | null;
  category: string;
  location: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  author_name?: string;
}

/**
 * Paginated pamphlets response
 */
export interface PaginatedPamphlets {
  data: PamphletResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  additionalData?: string; // Example of additional data field
}

/**
 * Database count result
 */
export interface CountResult extends RowDataPacket {
  total: number;
}
