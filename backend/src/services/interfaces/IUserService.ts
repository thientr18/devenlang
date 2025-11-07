import { IUserDocument } from '../../repositories/interfaces/IUserRepository';

export interface IUserService {
  registerAuth0(profile: {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
  }): Promise<IUserDocument>;
  addXP(userId: string, xp: number): Promise<IUserDocument>;
  updateStreak(userId: string, lastLoginDate: Date): Promise<IUserDocument>;
  getLeaderboard(limit?: number): Promise<IUserDocument[]>;
}