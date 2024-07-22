import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import * as bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import tokenService from './tokenController';

class authController {
  /**
   * Регистрация нового пользователя.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   * @param {NextFunction} next - Функция для передачи управления следующему middleware.
   * @returns {Promise<Response>} JSON с данными пользователя и токенами.
   */

  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username }, { _id: 1 });
      if (candidate) {
        return res.status(400).json({ message: 'this login is busy' });
      }
      const hash = bcrypt.hashSync(password, 7);
      const user = new User({
        username,
        password: hash,
      });
      await user.save();
      const _id = user._id;
      const tokens = tokenService.generateTokens({ username, _id });
      await tokenService.saveToken(_id, tokens.refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ user: { username, _id }, tokens });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Авторизация пользователя.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   * @param {NextFunction} next - Функция для передачи управления следующему middleware.
   * @returns {Promise<Response>} JSON с данными пользователя и токенами.
   */

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `User ${username} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Password is not valid' });
      }

      const _id = user._id;
      const tokens = tokenService.generateTokens({ username, _id });
      await tokenService.saveToken(_id, tokens.refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ user: { username, _id }, tokens });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Выход пользователя из системы.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   * @param {NextFunction} next - Функция для передачи управления следующему middleware.
   * @returns {Promise<Response>} JSON с данными удаленного токена.
   */

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await tokenService.removeToken(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({ message: 'User not auth' });
      }

      const userData = await tokenService.validateRefreshToken(refreshToken);

      if (!userData) {
        return res.status(401).json({ message: 'User not auth' });
      }

      const tokenFromDB = await tokenService.findToken(refreshToken);
      if (!tokenFromDB) {
        return res.status(401).json({ message: 'User not auth' });
      }

      const user = await User.findOne({ _id: userData._id });
      if (!user) {
        return res.status(401).json({ message: 'User not auth' });
      }

      const _id = user._id;
      const username = user.username;
      const tokens = tokenService.generateTokens({ username, _id });
      await tokenService.saveToken(_id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({ user: { _id, username }, tokens });
    } catch (error) {
      next(error);
    }
  }
}

export default new authController();
