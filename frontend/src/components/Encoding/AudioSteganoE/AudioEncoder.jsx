import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './audioEncoder.css';

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
      secret: ''
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
        encoding.resetForm();
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
    <div className='container mt-5 pb-4'>
      <div className="card shadow-lg border-0 ">
        <div className="card-body">
          <div className="row">
            <div className="col-md-7 ">
              <div className="container">
                <h1 className="mb-4">Audio Encoder</h1>
                <div className="card border-0">
                  <div className="card-body p-5 form-card">
                <form className='form-group' onSubmit={encoding.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label title">Select Audio File:</label>
                    {encoding.touched.audio && encoding.errors.audio && (
                      <div className="alert alert-danger mt-2  p-2 rounded-0">{encoding.errors.audio}</div>
                    )}
                    <div className="d-flex align-items-center">
                      <input 
                        type="file"
                        name="audio"
                        onChange={handleAudioChange}
                        className="form-control d-none"
                        id="customFileInput"
                      />
                       
                      <label className="form-control rounded-0" htmlFor="customFileInput">
                        {audioFile ? audioFile.name : 'Choose file'}
                      </label>
                      <button className="btn btn-light rounded-0" type="button" onClick={() => document.getElementById('customFileInput').click()} style={{marginLeft:'20px'}}>
                     
                     <div className="d-flex"> <i className="fa-solid fa-folder-open  mt-1 px-1"></i> Browse
                     </div> </button>
                    </div>
                    {audioFile && (
  <div className='rounded-0 mt-3'>
   
    <audio controls>
      <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
      Your browser does not support the audio element.
    </audio>
  </div>
)}
                  
                  </div>
                  <div className="mb-3">
                    <label className="form-label title">Secret Message:</label>
                    {encoding.touched.secret && encoding.errors.secret && (
                      <div className="alert alert-danger mt-2  p-2 rounded-0">{encoding.errors.secret}</div>
                    )}
                    <input 
                      type="text"
                      name="secret"
                      onChange={encoding.handleChange}
                      value={encoding.values.secret}
                      className="form-control rounded-0"
                      placeholder='Secret message here...'
                    />
                   
                  </div>
                  <button type="submit" className="btn btn-primary rounded-0">Encode</button>
                </form>
              </div>
            </div>
          </div>
          {encodedAudio && (
  <div className='mt-3 mx-3'>
    <div>
      <audio controls src={encodedAudio} className='rounded-0' style={{ backgroundColor: 'transparent', border: 'none' }}  />
    </div>
    <div>
      <a href={encodedAudio} download="encoded_audio.mp3" className="btn btn-primary rounded-0 mt-2">Download</a>
    </div>
  </div>
)}
</div>
</div>
         
        </div>
      </div>
     
    </div>
  );
};

export default AudioEncoder;