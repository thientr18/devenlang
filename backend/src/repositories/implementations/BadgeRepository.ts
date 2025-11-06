import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import {
  IBadgeRepository,
  IUserBadgeRepository,
  IBadgeDocument,
  IUserBadgeDocument
} from '../interfaces/IBadgeRepository';
import { Badge, UserBadge } from '../../models/Badge';

export class BadgeRepository
  extends BaseRepository<IBadgeDocument>
  implements IBadgeRepository
{
  constructor() {
    super(Badge as unknown as Model<IBadgeDocument>);
  }

  async findByType(type: string): Promise<IBadgeDocument[]> {
    try {
      return await this.model.find({ type }).sort({ 'condition.threshold': 1 });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByRarity(rarity: string): Promise<IBadgeDocument[]> {
    try {
      return await this.model.find({ rarity }).sort({ createdAt: -1 });
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkCondition(
    conditionType: string,
    userValue: number
  ): Promise<IBadgeDocument[]> {
    try {
      return await this.model.find({
        'condition.type': conditionType,
        'condition.threshold': { $lte: userValue }
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}

export class UserBadgeRepository
  extends BaseRepository<IUserBadgeDocument>
  implements IUserBadgeRepository
{
  constructor() {
    super(UserBadge as unknown as Model<IUserBadgeDocument>);
  }

  async getUserBadges(userId: string): Promise<IUserBadgeDocument[]> {
    try {
      return await this.model
        .find({ userId })
        .populate('badgeId')
        .sort({ earnedAt: -1 })
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async awardBadge(
    userId: string,
    badgeId: string
  ): Promise<IUserBadgeDocument | null> {
    try {
      const existing = await this.model.findOne({ userId, badgeId });
      if (existing) {
        return existing;
      }

      return await this.create({
        userId,
        badgeId,
        earnedAt: new Date()
      } as any);
    } catch (error) {
      this.handleError(error);
    }
  }

  async hasBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      return await this.exists({ userId, badgeId } as any);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserBadgeCount(userId: string): Promise<number> {
    try {
      return await this.count({ userId } as any);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRecentBadges(
    userId: string,
    limit: number = 5
  ): Promise<IUserBadgeDocument[]> {
    try {
      return await this.model
        .find({ userId })
        .populate('badgeId', 'name description iconUrl rarity')
        .sort({ earnedAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }
}