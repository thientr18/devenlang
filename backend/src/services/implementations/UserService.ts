import { UserRepository } from '../../repositories/implementations/UserRepository';
import { IUserService } from '../interfaces/IUserService';
import { UserAlreadyExistsError, UserNotFoundError } from '../errors';
import { IUserDocument } from '../../repositories/interfaces';

export class UserService implements IUserService {
  constructor(private readonly userRepo: UserRepository) {}

  async registerAuth0(profile: {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
  }) {
    const existing = await this.userRepo.findByEmail(profile.email);
    if (existing && existing.auth0Id && existing.auth0Id !== profile.sub) {
      throw new UserAlreadyExistsError(profile.email);
    }
    return this.userRepo.findOrCreateByAuth0(profile as any);
  }

  async addXP(userId: string, xp: number) {
    const updated = await this.userRepo.updateXP(userId, xp);
    if (!updated) throw new UserNotFoundError(userId);
    return updated;
  }

  async updateStreak(userId: string, lastLoginDate: Date): Promise<IUserDocument> { // annotated
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UserNotFoundError(userId);

    const lastLogin = user.lastLoginAt;
    let newStreak = user.currentStreak || 0;

    if (lastLogin) {
      const diffDays = Math.floor((lastLoginDate.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    await this.userRepo.updateLastLogin(userId, lastLoginDate);
    const updated = await this.userRepo.updateStreak(userId, newStreak);
    if (!updated) throw new UserNotFoundError(userId); // defensive
    return updated;
  }

  async getLeaderboard(limit: number = 10) {
    return this.userRepo.getLeaderboard(limit);
  }
}