import { ObjectId } from 'mongodb';
import { UserRole, LanguageLevel } from './enum';

export interface IUser {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  languageLevel?: LanguageLevel;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  avatar?: string;
  preferences: {
    dailyGoal?: number; // minutes per day
    emailNotifications: boolean;
    soundEffects: boolean;
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
