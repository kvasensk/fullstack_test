import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import tokenService from '../controllers/tokenController';

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

/**
 * Middleware для проверки авторизации пользователя по JWT токену.
 * @param {CustomRequest} req - Объект запроса.
 * @param {Response} res - Объект ответа.
 * @param {NextFunction} next - Функция передачи управления следующему middleware.
 * @returns {void}
 */

export default function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'User not auth' });
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ message: 'User not auth' });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(401).json({ message: 'User not auth' });
    }

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'User not auth' });
  }
}
