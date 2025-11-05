import { ObjectId } from 'mongodb';
import { DifficultyLevel, PartOfSpeech } from './enum';

export interface IVocabulary {
  _id: ObjectId;
  word: string;
  partOfSpeech: PartOfSpeech;
  
  // Multilingual support (future scalability)
  meaning: string;
  meaningVi?: string; // Vietnamese translation (optional)
  
  example: string;
  exampleVi?: string;
  
  itContext: string; // "Used in REST APIs to retrieve data"
  
  pronunciation?: string; // IPA or audio URL
  audioUrl?: string;
  imageUrl?: string;
  
  // Categorization
  topicId: ObjectId;
  difficulty: DifficultyLevel;
  tags?: string[]; // ["backend", "API", "HTTP"]
  
  // Gamification
  timesReviewed: number; // how many times users reviewed this
  averageScore: number; // avg score in quizzes
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
}