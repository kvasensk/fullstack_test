import React from 'react';
import Navbar from '../../navbar/Navbar';
import styles from './NewNewsPage.module.scss';
import NewNewsForm from '../../form/NewsForm/NewNewsForm';

export default function NewNewsPage() {
  return (
    <div>
      <Navbar />
      <div className={styles.PageFormBox}>
        <NewNewsForm />
      </div>
    </div>
  );
}
