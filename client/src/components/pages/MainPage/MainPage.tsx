import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchAllNews } from '../../../redux/thunkActions';
import Navbar from '../../navbar/Navbar';
import styles from './MainPage.module.scss';
import NewsCard from '../../ui/NewsCard/NewsCard';

export default function MainPage() {
  const { isAuth } = useAppSelector(store => store.userSlice);
  const { news } = useAppSelector(store => store.newsSlice);

  const newsRedux = useAppSelector(store => store.newsSlice.news);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllNews());
  }, [news]);

  return (
    <>
      <Navbar />
      {!isAuth ? (
        <>
          <div className={styles.auth}>
            Авторизуйтесь, чтобы увидеть новости
          </div>
        </>
      ) : (
        <>
          <div className={styles.cardBox}>
            {newsRedux?.map(news => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
