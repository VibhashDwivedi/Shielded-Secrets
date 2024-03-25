import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const TextDecoder = () => {
  const [file, setFile] = useState(null);
  const [decodedText, setDecodedText] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    decoding.setFieldValue('file', event.currentTarget.files[0]);
  };

  const textSchema = Yup.object().shape({
    file: Yup.mixed().required('Required')
  });

  const decoding = useFormik({
    initialValues: {
      file: ''
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:5000/decode_text', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        setDecodedText(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    validationSchema: textSchema
  });

  return (
    <div>
      <h1>Text Decoder</h1>
      <form onSubmit={decoding.handleSubmit}>
        <input 
          type="file"
          name="file"
          onChange={handleFileChange}
        />
        <button type="submit">Decode</button>
      </form>

      {decodedText && <p>Decoded Text: {decodedText}</p>}
    </div>
  )
}

export default TextDecoder;