import { QuizRepository } from '../../repositories/implementations/QuizRepository';
import { ProgressRepository } from '../../repositories/implementations/ProgressRepository';
import { UserRepository } from '../../repositories/implementations/UserRepository';
import { BadgeRepository, UserBadgeRepository } from '../../repositories/implementations/BadgeRepository';
import { IQuizService } from '../interfaces/IQuizService';
import { QuizNotFoundError } from '../errors';

export class QuizService implements IQuizService {
  constructor(
    private readonly quizRepo: QuizRepository,
    private readonly progressRepo: ProgressRepository,
    private readonly userRepo: UserRepository,
    private readonly badgeRepo: BadgeRepository,
    private readonly userBadgeRepo: UserBadgeRepository
  ) {}

  async getQuizPlayable(quizId: string) {
    const quiz = await this.quizRepo.getQuizWithQuestions(quizId);
    if (!quiz || !quiz.isPublished) throw new QuizNotFoundError(quizId);
    // Remove correct answers from payload (defense-in-depth)
    quiz.questions.forEach((q: any) => delete q.correctAnswer);
    return quiz;
  }

  async listByLesson(lessonId: string) {
    return this.quizRepo.findByLesson(lessonId);
  }

  async submitQuizAttempt(params: {
    userId: string;
    quizId: string;
    answers: { questionId: string; selected: string }[];
    durationSeconds: number;
  }) {
    const quiz = await this.quizRepo.getQuizWithQuestions(params.quizId);
    if (!quiz) throw new QuizNotFoundError(params.quizId);

    const total = quiz.questions.length;
    let correct = 0;
    const answerMap = new Map(params.answers.map(a => [a.questionId, a.selected]));
    quiz.questions.forEach((q: any) => {
      if (answerMap.get(q._id.toString()) === q.correctAnswer) correct++;
    });

    const scorePercent = Math.round((correct / total) * 100);
    const passed = scorePercent >= quiz.passingScore;
    const xpAwarded = passed ? quiz.xpReward : Math.round(quiz.xpReward * 0.25);

    // Persist attempt
    await this.progressRepo.addQuizAttempt(params.userId, {
      quizId: quiz._id,
      score: scorePercent,
      correctCount: correct,
      totalQuestions: total,
      durationSeconds: params.durationSeconds,
      passed,
      attemptedAt: new Date()
    });

    // Update aggregate stats
    await this.quizRepo.updateAttemptStats(quiz.id, scorePercent);
    
    // Award XP
    await this.userRepo.updateXP(params.userId, xpAwarded);

    // Badge evaluation example (XP badges)
    const user = await this.userRepo.findById(params.userId);
    if (user) {
      const badgeCandidates = await this.badgeRepo.checkCondition('totalXP', user.totalXP);
      for (const b of badgeCandidates) {
        await this.userBadgeRepo.awardBadge(params.userId, b.id.toString());
      }
    }

    return { score: scorePercent, passed, xpAwarded };
  }
}