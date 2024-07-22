import React from 'react';
import { LogoProps } from '../../../types';
import styles from './Logo.module.scss';

export default function Logo({ url, name }: LogoProps) {
  return (
    <div className={styles.logoImg}>
      {url ? <img src={url} alt={name || 'Logo'} /> : <></>}
    </div>
  );
}
