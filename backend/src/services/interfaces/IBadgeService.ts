import { IBadgeDocument, IUserBadgeDocument } from '../../repositories/interfaces/IBadgeRepository';

export interface IBadgeService {
  evaluateAndAwardXPBadges(userId: string, totalXP: number): Promise<IUserBadgeDocument[]>;
  getUserBadges(userId: string): Promise<IUserBadgeDocument[]>;
  recent(userId: string, limit?: number): Promise<IUserBadgeDocument[]>;
  checkAndAwardStreak(userId: string, streakValue: number): Promise<IUserBadgeDocument[]>;
}