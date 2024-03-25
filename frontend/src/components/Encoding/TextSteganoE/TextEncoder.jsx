import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const TextEncoder = () => {
  const [file, setFile] = useState(null);
  const [stegoFile, setStegoFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    encoding.setFieldValue('file', event.currentTarget.files[0]);
  };

  const textSchema = Yup.object().shape({
    file: Yup.mixed().required('Required'),
    secretMessage: Yup.string().required('Required')
  });

  const encoding = useFormik({
    initialValues: {
      file: '',
      secretMessage: ''
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('secretMessage', values.secretMessage);

      const res = await fetch('http://localhost:5000/encode_text', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        setStegoFile(data.text);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    validationSchema: textSchema
  });

  return (
    <div>
      <h1>Text Encoder</h1>
      <form onSubmit={encoding.handleSubmit}>
        <input 
          type="file"
          name="file"
          onChange={handleFileChange}
        />
        <input 
          type="text"
          name="secretMessage"
          onChange={encoding.handleChange}
          value={encoding.values.secretMessage}
        />
        {encoding.touched.secretMessage && encoding.errors.secretMessage ? (
          <p className='error-label'>{encoding.errors.secretMessage}</p>
        ) : null}
        <button type="submit">Encode</button>
      </form>

      {stegoFile && <a href={stegoFile} download="stego_text.txt"> stego_text.txt</a>}
    </div>
  )
}

export default TextEncoder;