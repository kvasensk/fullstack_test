import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './redux/hooks';
import { fetchCheckAuth } from './redux/thunkActions';
import MainPage from './components/pages/MainPage/MainPage';
import NewNewsPage from './components/pages/CreateNewsPage/NewNewsPage';
import EditCard from './components/pages/EditCardPage/EditCardPage';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      void dispatch(fetchCheckAuth());
    }
  }, []);
  return (
    <div>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/new' element={<NewNewsPage />} />
        <Route path='/edit/:id' element={<EditCard />} />
      </Routes>
    </div>
  );
}

export default App;
