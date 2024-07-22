import React from 'react';
import styles from './DatePicker.module.scss';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setDateValue } from '../../../redux/redactorSlice';

export const formatDate = date => {
  const newDate = new Date(date);
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  const year = newDate.getFullYear();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();

  const formattedDate = `${day < 10 ? '0' + day : day}/${
    month < 10 ? '0' + month : month
  }/${year} ${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }`;
  return formattedDate;
};

export default function DatePicker() {
  const { pubDate } = useAppSelector(store => store.redactorSlice);
  const dispatch = useAppDispatch();
  const dateObject = new Date(pubDate);

  const handleAddHours = hours => {
    const newDate = new Date(pubDate);
    newDate.setHours(newDate.getHours() + hours);
    dispatch(setDateValue(newDate));
  };

  const handleAddDays = days => {
    const newDate = new Date(pubDate);
    newDate.setDate(newDate.getDate() + days);
    dispatch(setDateValue(newDate));
  };

  const handleAddMinutes = minutes => {
    const newDate = new Date(pubDate);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    dispatch(setDateValue(newDate));
  };

  return (
    <div className={styles.pickerBox}>
      <div>
        <h4>Можно изменить дату публикации на более позднюю: </h4>
        <h3>{formatDate(pubDate)}</h3>
      </div>
      <div>
        <button
          onClick={() => handleAddDays(-1)}
          disabled={dateObject <= new Date()}
        >
          -1 день
        </button>
        <button
          onClick={() => handleAddHours(-1)}
          disabled={dateObject <= new Date()}
        >
          -1 час
        </button>
        <button
          onClick={() => handleAddMinutes(-1)}
          disabled={dateObject <= new Date()}
        >
          -1 минута
        </button>
      </div>
      <div>
        <button onClick={() => handleAddMinutes(1)}>+1 минута</button>
        <button onClick={() => handleAddHours(1)}>+1 час</button>
        <button onClick={() => handleAddDays(1)}>+1 день</button>
      </div>
    </div>
  );
}
