import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const AudioDecoder = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState(null);

  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
    decoding.setFieldValue('audio', event.currentTarget.files[0]);
  };

  const audioSchema = Yup.object().shape({
    audio: Yup.mixed().required('Required')
  });

  const decoding = useFormik({
    initialValues: {
      audio: ''
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('audio', audioFile);

      const res = await fetch('http://localhost:5000/decode_audio', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        setDecodedMessage(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    validationSchema: audioSchema
  });

  return (
    <div>
      <h1>Audio Decoder</h1>
      <form onSubmit={decoding.handleSubmit}>
        <input 
          type="file"
          name="audio"
          onChange={handleAudioChange}
        />
        {decoding.touched.audio && decoding.errors.audio ? (
          <p className='error-label'>{decoding.errors.audio}</p>
        ) : null}
        <button type="submit">Decode</button>
      </form>

      {decodedMessage && <p>Decoded Message: {decodedMessage}</p>}
    </div>
  )
}

export default AudioDecoder;