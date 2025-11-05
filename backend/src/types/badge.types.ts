import { ObjectId } from 'mongodb';
import { BadgeType } from './enum';

export interface IBadge {
  _id: ObjectId;
  name: string;
  description: string;
  type: BadgeType;
  iconUrl: string;
  condition: {
    type: 'lesson_count' | 'quiz_score' | 'streak_days' | 'xp_total' | 'vocabulary_mastered';
    threshold: number; // e.g., complete 10 lessons
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  createdAt: Date;
}

export interface IUserBadge {
  _id: ObjectId;
  userId: ObjectId;
  badgeId: ObjectId;
  earnedAt: Date;
}