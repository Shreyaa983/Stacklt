// src/App.jsx
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function App() {
  const [editorData, setEditorData] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-blue-300 text-xl mb-4">Rich Text Editor Demo</h1>

      <CKEditor
        editor={ClassicEditor}
        data="<p>Type your answer here...</p>"
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
          console.log('Editor Data:', data);
        }}
      />

      <h2 className="mt-6 font-bold">Live Preview:</h2>
      <div
        className="mt-2 border p-3"
        dangerouslySetInnerHTML={{ __html: editorData }}
      />
    </div>
  );
}

export default App;
