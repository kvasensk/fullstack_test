import React from 'react';
import styles from './DownloadFile.module.scss';

export default function DownloadFile({ files }) {
  const downloadFile = async file => {
    try {
      const url = 'http://localhost:3001';
      const response = await fetch(`${url}${file}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = decodeURIComponent(file.split('/').pop());
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      return error.response;
    }
  };

  return (
    <div className={styles.downloadContainer}>
      <h2>Файлы для скачивания:</h2>
      <ul>
        {files?.map(file => (
          <li key={file}>
            {file}
            <button onClick={() => downloadFile(file)}>download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
