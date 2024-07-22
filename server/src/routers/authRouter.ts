import { Router } from 'express';
import controller from '../controllers/authController';
import { check } from 'express-validator';
const router = Router();

router.post(
  '/registration',
  [
    check('username', 'not empty').notEmpty(),
    check(
      'password',
      'too short/long password, need more symbols (4-20)'
    ).isLength({ min: 4, max: 20 }),
  ],
  controller.registration
);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/refresh', controller.refresh);

export default router;
