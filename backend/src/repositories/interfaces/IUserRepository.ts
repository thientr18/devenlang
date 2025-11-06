import { IUser } from '../../types';
import { IBaseRepository } from '../base/IBaseRepository';
import { Document } from 'mongoose';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

// Minimal Auth0 profile info we need to create/sync a user
export interface IAuth0ProfileMinimal {
  sub: string;              // Auth0 "sub" (auth0Id)
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export interface IUserRepository extends IBaseRepository<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByAuth0Id(auth0Id: string): Promise<IUserDocument | null>;
  findOrCreateByAuth0(profile: IAuth0ProfileMinimal): Promise<IUserDocument>;
  getLeaderboard(limit: number): Promise<IUserDocument[]>;
  updateXP(userId: string, xpToAdd: number): Promise<IUserDocument | null>;
  updateStreak(userId: string, currentStreak: number): Promise<IUserDocument | null>;
  updateLastLogin(userId: string, date?: Date): Promise<IUserDocument | null>;
  getActiveUsers(startDate: Date): Promise<IUserDocument[]>;
}