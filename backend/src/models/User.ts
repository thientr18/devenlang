import mongoose, { Schema, Model } from 'mongoose';
import { IUser, UserRole, LanguageLevel } from '../types';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false // Don't return password by default
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.LEARNER,
      index: true
    },
    languageLevel: {
      type: String,
      enum: Object.values(LanguageLevel)
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
      index: true // For leaderboards
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    avatar: String,
    preferences: {
      dailyGoal: {
        type: Number,
        min: 5,
        max: 240
      },
      emailNotifications: {
        type: Boolean,
        default: true
      },
      soundEffects: {
        type: Boolean,
        default: true
      }
    },
    lastLoginAt: Date,
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ totalXP: -1 }); // Leaderboard queries
userSchema.index({ createdAt: -1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);