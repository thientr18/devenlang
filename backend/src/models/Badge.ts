import mongoose, { Schema, Model } from 'mongoose';
import { IBadge, IUserBadge, BadgeType } from '../types';

const badgeSchema = new Schema<IBadge>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(BadgeType),
      required: true
    },
    iconUrl: {
      type: String,
      required: true
    },
    condition: {
      type: {
        type: String,
        enum: ['lesson_count', 'quiz_score', 'streak_days', 'xp_total', 'vocabulary_mastered'],
        required: true
      },
      threshold: {
        type: Number,
        required: true,
        min: 1
      }
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    xpReward: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    collection: 'badges'
  }
);

const userBadgeSchema = new Schema<IUserBadge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    badgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Badge',
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'user_badges'
  }
);

// Prevent duplicate badges for same user
userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const Badge: Model<IBadge> = mongoose.model<IBadge>('Badge', badgeSchema);
export const UserBadge: Model<IUserBadge> = mongoose.model<IUserBadge>(
  'UserBadge',
  userBadgeSchema
);