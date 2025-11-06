import mongoose, { Schema, Model } from 'mongoose';
import { LanguageLevel } from '../types/enums';
import { IUser } from '../types/model.types';

const userSchema = new Schema<IUser>(
  {
    // Auth identity (Auth0)
    authProvider: {
      type: String,
      enum: ['auth0'],
      default: 'auth0',
      required: true,
      index: true
    },
    auth0Id: {
      type: String, // Auth0 "sub"
      required: true,
      unique: true,
      index: true
    },

    // Profile
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    picture: String,

    // App fields
    languageLevel: {
      type: String,
      enum: Object.values(LanguageLevel)
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
      index: true // Leaderboards
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

    // Status / timestamps
    lastLoginAt: Date,
    lastAuthSyncAt: Date,
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

// Indexes
userSchema.index({ auth0Id: 1 }, { unique: true });
userSchema.index({ email: 1 });
userSchema.index({ totalXP: -1 });
userSchema.index({ createdAt: -1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);