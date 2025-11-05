import { ObjectId } from 'mongodb';

export interface ITopic {
  _id: ObjectId;
  name: string;
  slug: string; // URL-friendly: "web-development", "databases"
  description: string;
  icon?: string; // icon URL or name
  color?: string; // hex color for UI
  order: number; // display order
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}