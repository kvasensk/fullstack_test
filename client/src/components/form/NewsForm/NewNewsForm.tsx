import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchAddNews } from '../../../redux/thunkActions';
import {
  setDateValueDefault,
  setRedactorValueDefault,
} from '../../../redux/redactorSlice';
import { dropError } from '../../../redux/newsSlice';
import styles from './NewNews.module.scss';
import Redactor from '../../ui/Redactor/Redactor';
import DatePicker from '../../ui/DatePicker/DatePicker';
import NewsCard from '../../ui/NewsCard/NewsCard';

export default function NewNewsForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { code, pubDate } = useAppSelector(store => store.redactorSlice);
  const { _id } = useAppSelector(store => store.userSlice);
  const { add_error } = useAppSelector(store => store.newsSlice);

  const [quotes, setQuotes] = useState<string[]>([]);
  const [quote, setQuote] = useState<string>('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [preview, setPreview] = useState<boolean>(false);
  const [err_msg, setErr_msg] = useState<boolean>(false);

  const uploadFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const filenames = useMemo(() => {
    return uploadFiles.map(file => file.name);
  }, [uploadFiles]);

  const uploadLogoHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const logoFile = e.target.files[0];
      setLogo(logoFile);
      const url = URL.createObjectURL(logoFile);
      setPreviewUrl(url);
    }
  };

  const changeArrayHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuote(e.target.value);
  };

  const acceptQuotesArrayHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotes.includes(quote)) {
      setQuotes(pre => [...pre, quote]);
    }
    setQuote('');
  };

  const submitHandler = (e: React.FormEvent) => {
    if (code.length) {
      e.preventDefault();
      const formData = new FormData();

      uploadFiles.forEach(file => {
        formData.append('files', file, file.name);
      });
      if (logo) {
        formData.append('logo', logo, logo.name);
      }

      formData.append('author', _id);
      formData.append('text', code);
      formData.append('quotes', JSON.stringify(quotes));
      const formattedDate = new Date(pubDate).toISOString();
      formData.append('publicDate', formattedDate);

      dispatch(fetchAddNews(formData));
      dispatch(setDateValueDefault());
      dispatch(setRedactorValueDefault());
      navigate('/');
    }
  };

  useEffect(() => {
    setErr_msg(true);
    setTimeout(() => {
      setErr_msg(false);
      dispatch(dropError());
    }, 4000);
  }, [add_error]);

  return (
    <>
      <div
        className={
          preview
            ? styles.newsFormBox + ' ' + styles.previewNoForm
            : styles.newsFormBox + ' ' + styles.previewWithFormNew
        }
      >
        <div className={styles.quotesBox}>
          <Redactor />
          <div className={styles.quotesAdd}>
            <input
              type='text'
              value={quote}
              onChange={changeArrayHandler}
              multiple
              name='quotes'
              placeholder='введите цитату'
            />
            <button
              className={styles.redactorQuotesButton}
              onClick={acceptQuotesArrayHandler}
            >
              добавить
            </button>
          </div>
          <div className={styles.quotesShow}>
            {quotes?.map(el => (
              <div>
                <h4>{el}</h4>
                <button
                  className={styles.redactorQuotesButton}
                  onClick={() => setQuotes(quotes.filter(item => item !== el))}
                >
                  удалить
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.uploadBox}>
            <label className={styles.FormText} htmlFor='uploadLogo'>
              <input
                id='uploadLogo'
                name='logo'
                type='file'
                multiple
                onChange={uploadLogoHandler}
                accept='image/*'
                hidden
              />
              <span>Нажмите сюда, чтобы загрузить логотип</span>
            </label>
            <label className={styles.FormText} htmlFor='upload'>
              <input
                id='upload'
                name='files'
                type='file'
                multiple
                onChange={uploadFileHandler}
                hidden
              />
              <span>Нажмите сюда, чтобы загрузить файлы</span>
            </label>
          </div>
          <div className={styles.pubBox}>
            <DatePicker />
            <button
              className={styles.newsFormButton}
              onClick={() => setPreview(!preview)}
            >
              предпросмотр
            </button>
            <button className={styles.newsFormButton} onClick={submitHandler}>
              опубликовать
            </button>
            {err_msg && <p className={styles.err}>{add_error}</p>}
          </div>
        </div>
      </div>
      <div
        className={styles.previewContainer}
        onClick={() => setPreview(!preview)}
      >
        {preview ? (
          <>
            <h2>Кликните на окно, чтобы закрыть</h2>
            <NewsCard
              news={{
                author: 'blanc',
                _id: 'blanc',
                username: '@Ваш логин',
                text: code,
                files: filenames,
                logo: previewUrl ? previewUrl : null,
                publicDate: '',
                quotes: JSON.stringify(quotes),
              }}
              url={previewUrl}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
