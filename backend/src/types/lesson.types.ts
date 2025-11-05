import { ObjectId } from 'mongodb';
import { DifficultyLevel } from './enum';

export interface ILesson {
  _id: ObjectId;
  topicId: ObjectId;
  title: string;
  slug: string;
  description: string;
  order: number; // order within topic
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  xpReward: number;
  thumbnailUrl?: string;
  
  // References - avoid embedding to prevent data duplication
  vocabularyIds: ObjectId[]; // references to Vocabulary
  quizIds: ObjectId[]; // references to Quiz
  
  prerequisites?: ObjectId[]; // lesson IDs that should be completed first
  
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId; // admin user
}