import * as jwt from 'jsonwebtoken';
import tokenModel from '../models/Token';
import { Types } from 'mongoose';

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}

class TokenService {

   /**
   * Генерация токенов доступа и обновления.
   * @param {object} payload - Данные для создания токена.
   * @returns {{ accessToken: string, refreshToken: string }} - Возвращает сгенерированные токены.
   * @throws {Error} Если секретные ключи не заданы.
   */

  generateTokens(payload: object) {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT - секретные ключи не заданы');
    }

    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

   /**
   * Проверка и декодирование токена доступа.
   * @param {string} token - Токен доступа.
   * @returns {object | null} - Возвращает данные пользователя или null, если токен не валиден.
   * @throws {Error} Если секретный ключ не задан.
   */

  validateAccessToken(token: string) {
    try {
      const accessSecret = process.env.JWT_ACCESS_SECRET;
      if (!accessSecret) {
        throw new Error('JWT access секрет не задан');
      }
      const user = jwt.verify(token, accessSecret);
      return user;
    } catch (error) {
      return null;
    }
  }

 /**
   * Проверка и декодирование токена обновления.
   * @param {string} token - Токен обновления.
   * @returns {JwtPayloadWithId | null} - Возвращает данные пользователя или null, если токен не валиден.
   * @throws {Error} Если секретный ключ не задан.
   */

  validateRefreshToken(token: string): JwtPayloadWithId | null {
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) {
        throw new Error('JWT refresh secret is not defined');
      }
      const user = jwt.verify(token, refreshSecret);
      if (typeof user === 'string') {
        return null;
      }
      return user as JwtPayloadWithId;
    } catch (error) {
      return null;
    }
  }

   /**
   * Сохранение токена обновления в базе данных.
   * @param {string | Types.ObjectId | undefined} userId - ID пользователя.
   * @param {string} refreshToken - Токен обновления.
   * @returns {Promise<object>} - Возвращает сохранённый токен.
   */

  async saveToken(
    userId: string | Types.ObjectId | undefined,
    refreshToken: string
  ) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

   /**
   * Удаление токена обновления из базы данных.
   * @param {string} refreshToken - Токен обновления.
   * @returns {Promise<object>} - Возвращает результат удаления.
   */

  async removeToken(refreshToken: string) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

 /**
   * Поиск токена обновления в базе данных.
   * @param {string} refreshToken - Токен обновления.
   * @returns {Promise<object | null>} - Возвращает найденный токен или null, если токен не найден.
   */

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
