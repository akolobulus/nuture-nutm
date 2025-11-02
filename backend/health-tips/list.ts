import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: Date;
}

interface ListHealthTipsRequest {
  category?: Query<string>;
  limit?: Query<number>;
}

interface ListHealthTipsResponse {
  tips: HealthTip[];
}

// Retrieves published health tips
export const list = api<ListHealthTipsRequest, ListHealthTipsResponse>(
  { method: "GET", path: "/health-tips", expose: true },
  async ({ category, limit }) => {
    let query = `
      SELECT id, title, content, category, image_url, created_at
      FROM health_tips
      WHERE published = true
    `;
    
    const params: string[] = [];
    let paramIndex = 1;
    
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    query += ` ORDER BY created_at DESC`;
    
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(limit.toString());
    }
    
    const rows = await db.rawQueryAll<{
      id: string;
      title: string;
      content: string;
      category: string;
      image_url: string | null;
      created_at: Date;
    }>(query, ...params);
    
    const tips = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      imageUrl: row.image_url || undefined,
      createdAt: row.created_at,
    }));
    
    return { tips };
  }
);
