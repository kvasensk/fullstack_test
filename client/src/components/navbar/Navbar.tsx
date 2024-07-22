import React from 'react';
import styles from './nav.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchUserLogout } from '../../redux/thunkActions';
import { openModalLogin } from '../../redux/modalSlice';
import LoginForm from '../form/LoginForm/LoginForm';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector(store => store.userSlice);
  const { openModal } = useAppSelector(store => store.modalSlice);
  const navigate = useNavigate();
  const mainPageUrl = 'http://localhost:5173/';

  const logoutHandler = () => {
    dispatch(fetchUserLogout());
  };

  const navigateHandler = (url: string) => {
    navigate(url);
  };

  return (
    <div className={styles.navbar}>
      <h2>news p֍rtal</h2>
      {isAuth ? (
        <div className={styles.buttonNavContainer}>
          {window.location.href === mainPageUrl ? (
            <>
              <button
                className={styles.NavButtons}
                onClick={() => navigateHandler('/new')}
              >
                Опубликовать новость
              </button>
              <button className={styles.NavButtons} onClick={logoutHandler}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.NavButtons}
                onClick={() => navigateHandler('/')}
              >
                Вернуться на главную
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <button
            className={styles.NavButtons}
            onClick={() => dispatch(openModalLogin())}
          >
            Регистрация/ Логин
          </button>
        </>
      )}
      {openModal ? <LoginForm /> : <></>}
    </div>
  );
}
