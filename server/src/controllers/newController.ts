import { Request, Response } from 'express';
import News from '../models/News';
import mongoose from 'mongoose';
import * as path from 'path';
import { UploadedFile } from 'express-fileupload';
import * as fs from 'fs';
import * as uuid  from 'uuid'

class NewsController {

   /**
   * Получить все новости.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   */

  async getNews(req: Request, res: Response) {
    try {
      const news = await News.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            text: 1,
            quotes: 1,
            logo: 1,
            files: 1,
            publicDate: 1,
            username: '$user.username',
          },
        },
      ]);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

    /**
   * Получить новость по ID.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   */

  async getNewsById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const news = await News.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            text: 1,
            quotes: 1,
            logo: 1,
            files: 1,
            publicDate: 1,
            username: '$user.username',
          },
        },
      ]);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

   /**
   * Создать новость.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   */

  async createNews(req: Request, res: Response) {
    const { author, text, quotes, publicDate } = req.body;

    const uploadPath = path.join(__dirname, '../../uploads');
    const uploadedFiles = req.files?.files;
    const uploadedLogoFile = req.files?.logo as UploadedFile | undefined;

    try {
      if (!author || author === 'undefined') {
        return res
          .status(400)
          .send({ message: 'Author is required and cannot be undefined.' });
      }

      if (!text) {
        return res.status(400).send({ message: 'Text is required.' });
      }

      let parsedQuotes: string[] = [];
      try {
        parsedQuotes = JSON.parse(quotes) || [];
      } catch (error) {
        return res
          .status(400)
          .send({ message: 'Quotes must be a valid JSON array.' });
      }

      const filesPaths: string[] = [];
      let logoPath: string | undefined;

      const moveFile = (
        file: UploadedFile,
        destination: string
      ): Promise<void> => {
        return new Promise((resolve, reject) => {
          file.mv(destination, (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      };

      if (uploadedFiles) {
        const filesArray = Array.isArray(uploadedFiles)
          ? uploadedFiles
          : [uploadedFiles];
        await Promise.all(
          filesArray.map(file => {
            const customPath = `${uuid.v4()}-${file.name}`
            const filePath = path.join(uploadPath, customPath);
            filesPaths.push(`/uploads/${customPath}`);
            return moveFile(file, filePath);
          })
        );
      }
      
      if (uploadedLogoFile) {
        const customPath = `${uuid.v4()}-${uploadedLogoFile.name}`
        const logoFilePath = path.join(uploadPath,customPath);
        logoPath = `/uploads/${customPath}`;
        await moveFile(uploadedLogoFile, logoFilePath);
      }

      const news = await News.create({
        author,
        text,
        quotes: parsedQuotes,
        publicDate: publicDate ? new Date(publicDate) : undefined,
        files: filesPaths,
        logo: logoPath,
      });

      res.json(news);
    } catch (error) {
      res.status(500).send({ message: `Server Error: ${error}` });
    }
  }

   /**
   * Редактировать новость.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   */

  async editNews(req: Request, res: Response) {
    const { id } = req.params;
    const { text, quotes } = req.body;
    const uploadPath = path.join(__dirname, '../../uploads');
    const uploadedFiles = req.files?.files;
    const uploadedLogoFile = req.files?.logo as UploadedFile | undefined;

    try {
      if (text) {
        const filesPaths: string[] = [];
        let logoPath: string | undefined;

        const moveFile = (
          file: UploadedFile,
          destination: string
        ): Promise<void> => {
          return new Promise((resolve, reject) => {
            file.mv(destination, (err: any) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        };

        if (uploadedFiles) {
          const filesArray = Array.isArray(uploadedFiles)
            ? uploadedFiles
            : [uploadedFiles];
          await Promise.all(
            filesArray.map(file => {
              const customPath = `${uuid.v4()}-${file.name}`
              const filePath = path.join(uploadPath, customPath);
              filesPaths.push(`/uploads/${customPath}`);
              return moveFile(file, filePath);
            })
          );
        }
        
        if (uploadedLogoFile) {
          const customPath = `${uuid.v4()}-${uploadedLogoFile.name}`
          const logoFilePath = path.join(uploadPath,customPath);
          logoPath = `/uploads/${customPath}`;
          await moveFile(uploadedLogoFile, logoFilePath);
        }

        let parsedQuotes: string[] = [];
        try {
          parsedQuotes = JSON.parse(quotes) || [];
        } catch (error) {
          return res
            .status(400)
            .send({ message: 'Quotes must be a valid JSON array.' });
        }

        const news = await News.findById({ _id: id });
        if (news) {
          const edited = await news.updateOne({
            text,
            quotes: parsedQuotes,
            files: filesPaths,
            logo: logoPath,
          });
          res.json(edited);
        }
      } else {
        return res.status(400).send({ message: 'Text is required.' });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

   /**
   * Удалить новость.
   * @param {Request} req - Объект запроса Express.
   * @param {Response} res - Объект ответа Express.
   */

  async deleteNews(req: Request, res: Response) {
    const { id } = req.params;
  
    try {
      const news = await News.findById(id);
      if (!news) {
        return res.status(404).json({ message: 'News not found' });
      }
  
      if (news.files && news.files.length > 0) {
        for (const file of news.files) {
          const filePath = path.join(
            __dirname,
            '../../uploads',
            file.replace('/uploads/', '')
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            console.log(`File not found: ${filePath}`);
          }
        }
      }
  
      if (news.logo) {
        const logoPath = path.join(
          __dirname,
          '../../uploads',
          news.logo.replace('/uploads/', '')
        );
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        } else {
          console.log(`Logo not found: ${logoPath}`);
        }
      }
  
      await News.findByIdAndDelete(id);
      res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }

}
export default new NewsController();
