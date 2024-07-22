import React, { useEffect, useState } from 'react';
import { ILoginInputs } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { closeModalLogin } from '../../../redux/modalSlice';
import { fetchUserLogin, fetchUserRegister } from '../../../redux/thunkActions';
import styles from './loginForm.module.scss';

export default function LoginForm() {
  const [inputs, setInputs] = useState<ILoginInputs>({
    password: '',
    username: '',
  });
  const [isRegistration, setIsRegistration] = useState<boolean>(true);
  const [passwordOpen, setPasswordOpen] = useState<boolean>(true);
  const { error, isAuth } = useAppSelector(store => store.userSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth) {
      if (error === null) {
        dispatch(closeModalLogin());
      }
    }
  }, [error, dispatch, isAuth]);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(pre => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (inputs) {
      if (!isRegistration) {
        void dispatch(fetchUserLogin(inputs));
      } else {
        void dispatch(fetchUserRegister(inputs));
      }
      setInputs({ password: '', username: '' });
    }
  };

  return (
    <div className={styles.loginRegContainer}>
      {error !== null && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.loginRegBox}>
        <div className={styles.loginResFrom}>
          <button
            className={styles.closeRegButton}
            onClick={() => dispatch(closeModalLogin())}
          >
            close
          </button>
          <h2 className={styles.logRegH2}>
            {isRegistration ? 'Registration' : 'Login'}
          </h2>
          <div className={styles.formLogResBox}>
            <input
              className={styles.logRegInput}
              onChange={inputHandler}
              value={inputs.username}
              name='username'
              type='text'
              placeholder='username'
              required
            />
            <div className={styles.passwordBox}>
              <input
                className={styles.logRegInput}
                onChange={inputHandler}
                name='password'
                value={inputs.password}
                type={passwordOpen ? 'password' : 'text'}
                placeholder='password'
                required
              />
              <button
                className={styles.passwordCheckButton}
                onClick={() => setPasswordOpen(!passwordOpen)}
              >
                {passwordOpen ? '🙈' : '🐵'}
              </button>
            </div>
          </div>
          <button className={styles.logResAcceptButton} onClick={submitHandler}>
            accept
          </button>
          <button
            className={styles.logResChangeButton}
            onClick={() => setIsRegistration(!isRegistration)}
          >
            {isRegistration
              ? 'Have an account? go to login'
              : "Don't have an account? go to registration"}
          </button>
        </div>
      </div>
    </div>
  );
}
