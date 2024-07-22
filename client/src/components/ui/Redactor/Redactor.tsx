import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor/nohighlight';
import { useAppDispatch } from '../../../redux/hooks';
import { setRedactorValue } from '../../../redux/redactorSlice';

export default function Redactor() {
  const dispatch = useAppDispatch();

  const [code, setCode] = useState<string>(``);

  const setHandler = value => {
    setCode(value);
    dispatch(setRedactorValue(value));
  };
  return (
    <div>
      <MDEditor value={code} onChange={setHandler} />
    </div>
  );
}
