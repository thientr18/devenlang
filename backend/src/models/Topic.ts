import mongoose, { Schema, Model } from 'mongoose';
import { ITopic } from '../types/model.types';

const topicSchema = new Schema<ITopic>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    icon: String,
    color: {
      type: String,
      match: /^#([A-Fa-f0-9]{6})$/
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'topics'
  }
);

topicSchema.index({ slug: 1 });
topicSchema.index({ order: 1, isPublished: 1 });

export const Topic: Model<ITopic> = mongoose.model<ITopic>('Topic', topicSchema);