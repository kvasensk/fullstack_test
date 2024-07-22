import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor/nohighlight';
import DownloadFile from '../DownloadFile/DownloadFile';
import Logo from '../Logo/Logo';
import { useNavigate } from 'react-router-dom';
import styles from './card.module.scss';
import { INews } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchDeleteNews } from '../../../redux/thunkActions';
import { formatDate } from '../DatePicker/DatePicker';

export default function NewsCard({
  news,
  url,
}: {
  news: INews;
  url?: string | null;
}) {
  const dispatch = useAppDispatch();
  const { username } = useAppSelector(store => store.userSlice);
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:3001';

  const currentDate = new Date();
  const newsDate = new Date(news.publicDate);
  const isFuturePublication = newsDate > currentDate;
  const isUserOwnPost = news.username === username;

  const shouldShowCard =
    !isFuturePublication || (isFuturePublication && isUserOwnPost);

  const deleteHandler = () => {
    dispatch(fetchDeleteNews(news._id));
  };

  const editButtonHandler = () => {
    navigate(`/edit/${news._id}`);
  };

  const [quotes, setQuotes] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(news.quotes)) {
      setQuotes(news.quotes);
    } else {
      setQuotes(JSON.parse(news.quotes || '[]'));
    }
  }, [news.quotes]);

  return (
    <>
      {shouldShowCard ? (
        <>
          {isFuturePublication && isUserOwnPost && (
            <div className={styles.publicationMessage}>
              <p>
                Запись будет опубликована в {formatDate(news.publicDate)}, этот
                текст видите только вы.
              </p>
              <button onClick={deleteHandler}>удалить</button>
            </div>
          )}
          {!isFuturePublication && (
            <div className={styles.card}>
              <div className={styles.cardHeaderBox}>
                <h3>
                  Upload date: {formatDate(news.publicDate)} / Author:{' '}
                  {news.username}
                </h3>
                <div>
                  {news.username === username && (
                    <>
                      <button onClick={editButtonHandler}>Edit</button>
                      <button onClick={deleteHandler}>Delete</button>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.logoBox}>
                {news.logo && (
                  <Logo
                    url={url || `${baseUrl}${news.logo}`}
                    name={url || `${baseUrl}${news.logo}`}
                    key={url || `${baseUrl}${news.logo}`}
                  />
                )}
              </div>
              <div>
                <MDEditor.Markdown
                  source={news.text}
                  className={styles.editor}
                />
              </div>
              <div className={styles.cardFooter}>
                {news.files?.length ? (
                  <div
                    className={
                      news.files?.length && quotes.length
                        ? styles.newsFooter + ' ' + styles.downloader
                        : styles.downloadBox
                    }
                  >
                    <DownloadFile files={news.files} key={news.author} />
                  </div>
                ) : null}
                {quotes.length > 0 && (
                  <div
                    className={
                      news.files?.length && quotes.length
                        ? styles.newsFooter + ' ' + styles.quoter
                        : styles.downloadBox
                    }
                  >
                    <ul>
                      <label>Цитаты</label>
                      {quotes.map((quote, index) => (
                        <li key={index}>{quote}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
}
