import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const AudioEncoder = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [encodedAudio, setEncodedAudio] = useState(null);

  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
    encoding.setFieldValue('audio', event.currentTarget.files[0]);
  };

  const audioSchema = Yup.object().shape({
    audio: Yup.mixed().required('Required'),
    secret: Yup.string().required('Required')
});

  const encoding = useFormik({
    initialValues: {
      audio: '',
      secret:''
      
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('secret', values.secret);

      const res = await fetch('http://localhost:5000/encode_audio', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if(response.status === 200){
          alert('Encoded');
        }
        return response.json();
    })
      .then(data => {
        setEncodedAudio(data.audio);
        if(data.status === 200){
            alert('Encoded')
          }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    validationSchema: audioSchema
  });

  return (
    <div>
      <h1>Audio Encoder</h1>
      <form onSubmit={encoding.handleSubmit}>
        <input 
          type="file"
          name="audio"
          onChange={handleAudioChange}
        />
        {encoding.touched.audio && encoding.errors.audio ? (
          <p className='error-label'>{encoding.errors.audio}</p>
        ) : null}
        <input 
  type="text"
  name="secret"
  onChange={encoding.handleChange}
  value={encoding.values.secret}
/>
{encoding.touched.secret && encoding.errors.secret ? (
          <p className='error-label'>{encoding.errors.secret}</p>
        ) : null}
        <button type="submit">Encode</button>
      </form>

      {encodedAudio && <audio controls src={encodedAudio} />}
    </div>
  )
}

export default AudioEncoder;