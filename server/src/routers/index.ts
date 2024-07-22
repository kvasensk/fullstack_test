import {Router} from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import newsRouter from './newsRouter'
import authRouter from './authRouter'

const router = Router();

router.use('/auth', authRouter)
router.use('/news', authMiddleware, newsRouter)


export default router