import { BadgeRepository, UserBadgeRepository } from '../../repositories/implementations/BadgeRepository';
import { IBadgeService } from '../interfaces/IBadgeService';

export class BadgeService implements IBadgeService {
  constructor(
    private readonly badgeRepo: BadgeRepository,
    private readonly userBadgeRepo: UserBadgeRepository
  ) {}

  async evaluateAndAwardXPBadges(userId: string, totalXP: number) {
    const candidates = await this.badgeRepo.checkCondition('totalXP', totalXP);
    const awarded: any[] = [];
    for (const badge of candidates) {
      const badgeId = badge.id;
      const has = await this.userBadgeRepo.hasBadge(userId, badgeId);
      if (!has) {
        const ub = await this.userBadgeRepo.awardBadge(userId, badgeId);
        if (ub) awarded.push(ub);
      }
    }
    return awarded;
  }

  async getUserBadges(userId: string) {
    return this.userBadgeRepo.getUserBadges(userId);
  }

  async recent(userId: string, limit: number = 5) {
    return this.userBadgeRepo.getRecentBadges(userId, limit);
  }

  async checkAndAwardStreak(userId: string, streakValue: number) {
    const streakBadges = await this.badgeRepo.checkCondition('streak', streakValue);
    const newly: any[] = [];
    for (const b of streakBadges) {
      const badgeId = b.id;
      const has = await this.userBadgeRepo.hasBadge(userId, badgeId);
      if (!has) {
        const ub = await this.userBadgeRepo.awardBadge(userId, badgeId);
        if (ub) newly.push(ub);
      }
    }
    return newly;
  }
}