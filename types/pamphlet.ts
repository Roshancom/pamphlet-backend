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
export interface Pamphlet extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  location: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Pamphlet with author information (from JOIN query)
 */
export interface PamphletWithAuthor extends Pamphlet {
  author_name: string;
}

/**
 * Pamphlet payload for create and update requests
 */
export interface PamphletPayload {
  title?: string;
  description?: string;
  image_url?: string;
  category?: string;
  location?: string;
  url_key: string;
}

/**
 * Pamphlet response (formatted for API)
 */
export interface PamphletResponse {
  id: number;
  title: string;
  description: string;
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
