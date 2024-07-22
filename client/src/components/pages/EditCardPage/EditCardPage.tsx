import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Navbar from '../../navbar/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  fetchAllNews,
  fetchOneNews,
  fetchUpdateNews,
} from '../../../redux/thunkActions';
import {
  setDateValueDefault,
  setRedactorValueDefault,
} from '../../../redux/redactorSlice';
import DatePicker from '../../ui/DatePicker/DatePicker';
import Redactor from '../../ui/Redactor/Redactor';
import styles from '../../form/NewsForm/NewNews.module.scss';
import NewsCard from '../../ui/NewsCard/NewsCard';

export default function EditCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { editing_news } = useAppSelector(store => store.newsSlice);
  const { code, pubDate } = useAppSelector(store => store.redactorSlice);

  const [quotes, setQuotes] = useState<string[]>([]);
  const [quote, setQuote] = useState<string>('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [preview, setPreview] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);

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

  const changeArrayHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuote(e.target.value);
  };

  const acceptQuotesArrayHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotes.includes(quote)) {
      setQuotes(pre => [...pre, quote]);
      setQuote('');
    }
  };

  const submitHandler = (e: React.FormEvent) => {
    if (!code.length) return setErr(true);
    e.preventDefault();
    const formData = new FormData();

    uploadFiles.forEach(file => {
      formData.append('files', file, file.name);
    });
    if (logo) {
      formData.append('logo', logo, logo.name);
    }

    formData.append('text', code);
    formData.append('quotes', JSON.stringify(quotes));
    if (editing_news) {
      dispatch(fetchUpdateNews({ id: editing_news._id, formData }));
      dispatch(setDateValueDefault());
      dispatch(setRedactorValueDefault());
      navigate('/');
      fetchAllNews();
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchOneNews(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (err) setTimeout(() => setErr(false), 4000);
  }, [err]);

  return (
    <div>
      <div>
        <Navbar />
        <div className={styles.oldOne}>
          <h2>
            Старая версия, пролистайте вниз до формы, которая отредактирует вашу
            новость
          </h2>
          {editing_news && (
            <NewsCard
              news={{
                author: editing_news.author,
                _id: editing_news._id,
                username: editing_news.username,
                text: editing_news.text,
                files: editing_news.files,
                logo: editing_news.logo,
                publicDate: editing_news.publicDate,
                quotes: editing_news.quotes,
              }}
            />
          )}
          <h2>Введите данные ниже, чтобы изменить новость</h2>
        </div>
        <div
          className={
            preview
              ? `${styles.newsFormBox} ${styles.previewNoForm}`
              : `${styles.newsFormBox} ${styles.previewWithForm}`
          }
        >
          <div className={styles.quotesBox}>
            <Redactor />
            <div className={styles.quotesAdd}>
              <input
                type='text'
                value={quote}
                onChange={changeArrayHandler}
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
                <div key={el}>
                  <h4>{el}</h4>
                  <button
                    className={styles.redactorQuotesButton}
                    onClick={() =>
                      setQuotes(quotes.filter(item => item !== el))
                    }
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
              {err && <p className={styles.err}>Введите текст</p>}
            </div>
          </div>
        </div>
        <div
          className={`${styles.previewContainer} ${styles.editPreview}`}
          onClick={() => setPreview(!preview)}
        >
          {preview && (
            <div className={styles.editPre}>
              <h2>Кликните на окно, чтобы закрыть</h2>
              <NewsCard
                news={{
                  _id: 'blanc',
                  author: 'blanc',
                  username: '@Ваш логин',
                  text: code,
                  files: filenames,
                  logo: previewUrl || null,
                  publicDate: pubDate,
                  quotes: JSON.stringify(quotes),
                }}
                url={previewUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
