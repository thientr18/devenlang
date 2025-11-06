import { IBadge, IUserBadge } from '../../types';
import { IBaseRepository } from '../base/IBaseRepository';
import { Document } from 'mongoose';

export interface IBadgeDocument extends Omit<IBadge, '_id'>, Document {}
export interface IUserBadgeDocument extends Omit<IUserBadge, '_id'>, Document {}

export interface IBadgeRepository extends IBaseRepository<IBadgeDocument> {
  findByType(type: string): Promise<IBadgeDocument[]>;
  findByRarity(rarity: string): Promise<IBadgeDocument[]>;
  checkCondition(
    conditionType: string,
    userValue: number
  ): Promise<IBadgeDocument[]>;
}

export interface IUserBadgeRepository extends IBaseRepository<IUserBadgeDocument> {
  getUserBadges(userId: string): Promise<IUserBadgeDocument[]>;
  awardBadge(userId: string, badgeId: string): Promise<IUserBadgeDocument | null>;
  hasBadge(userId: string, badgeId: string): Promise<boolean>;
  getUserBadgeCount(userId: string): Promise<number>;
  getRecentBadges(userId: string, limit?: number): Promise<IUserBadgeDocument[]>;
}