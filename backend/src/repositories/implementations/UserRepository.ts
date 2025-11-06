import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { IUserRepository, IUserDocument, IAuth0ProfileMinimal } from '../interfaces/IUserRepository';
import { User } from '../../models/User';

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor() {
    super(User as unknown as Model<IUserDocument>);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    try {
      return await this.model.findOne({ email: email.toLowerCase() });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByAuth0Id(auth0Id: string): Promise<IUserDocument | null> {
    try {
      return await this.model.findOne({ auth0Id });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOrCreateByAuth0(profile: IAuth0ProfileMinimal): Promise<IUserDocument> {
    try {
      const now = new Date();
      const fullName =
        profile.name ??
        (profile.email ? profile.email.split('@')[0] : 'User');

      const updated = await this.model.findOneAndUpdate(
        { auth0Id: profile.sub },
        {
          $set: {
            authProvider: 'auth0',
            auth0Id: profile.sub,
            email: profile.email.toLowerCase(),
            emailVerified: !!profile.email_verified,
            fullName,
            picture: profile.picture,
            lastAuthSyncAt: now
          },
          $setOnInsert: {
            // app defaults handled by schema, but explicit is fine too
            totalXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            isActive: true
          }
        },
        { upsert: true, new: true }
      );

      // findOneAndUpdate with upsert + new:true always returns a doc
      // but add a fallback type guard
      if (!updated) throw new Error('Failed to upsert user');

      return updated;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getLeaderboard(limit: number = 10): Promise<IUserDocument[]> {
    try {
      return await this.model
        .find({ isActive: true })
        .sort({ totalXP: -1 })
        .limit(limit)
        .select('fullName email avatar picture totalXP currentStreak');
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateXP(
    userId: string,
    xpToAdd: number
  ): Promise<IUserDocument | null> {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        { $inc: { totalXP: xpToAdd } },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateStreak(
    userId: string,
    currentStreak: number
  ): Promise<IUserDocument | null> {
    try {
      const user = await this.model.findById(userId);
      if (!user) return null;

      const updateData: any = { currentStreak };
      if (currentStreak > user.longestStreak) {
        updateData.longestStreak = currentStreak;
      }

      return await this.model.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateLastLogin(userId: string, date?: Date): Promise<IUserDocument | null> {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        { $set: { lastLoginAt: date ?? new Date() } },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getActiveUsers(startDate: Date): Promise<IUserDocument[]> {
    try {
      return await this.model.find({
        isActive: true,
        lastLoginAt: { $gte: startDate }
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}