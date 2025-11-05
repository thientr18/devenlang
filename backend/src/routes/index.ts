import { Router } from 'express';
import useRouter from './user.routes';

const router = Router();

router.get('/user', useRouter);

export default router;