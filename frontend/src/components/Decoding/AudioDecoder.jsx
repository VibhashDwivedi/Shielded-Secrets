import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import './decoding.css';
import { Spinner } from 'react-bootstrap';

const AudioDecoder = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [decodin, setDecodin] = useState(false);

  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
    decoding.setFieldValue('audio', event.currentTarget.files[0]);
  };

  const audioSchema = Yup.object().shape({
    key: Yup.string().required('Required'),
    audio: Yup.mixed()
    .required('Required')
    .test('fileFormat', 'Unsupported format. Please select an WAV audio file.', value => {
      if (value) {
        const supportedFormats = ['audio/wav'];
        return supportedFormats.includes(value.type);
      }
      return true;
    }),
  });

  const decoding = useFormik({
    initialValues: {
      audio: '',
      key: ''
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('key', values.key);
      setDecodin(true);
      const res = await fetch('http://localhost:5000/decode_audio', {
        method: 'POST',
        body: formData
      })
      .then(response =>{ 
        if(response.status === 200){
          toast.success('Decoded Successfully😊')
         setAudioFile(null) 
        }
        else
          toast.error('Error Encountered😔')
        return response.text()})
      .then(data => {
        setDecodedMessage(data);
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('Error Encountered😔')
      });
      setDecodin(false);
    },
    validationSchema: audioSchema
  });

  return (
    <div className='container mt-5 pb-4'>
  <div className="card shadow-lg border-0 ">
    <div className="card-body">
      <h1 className=" decoder-head">Audio Decoder</h1>
      <p className='mb-4 para'>Decode Message hidden in an Audio file!!</p>
      <div className="row">
        <div className="col-md-7 ">
          <div className="container">
            <div className="card border-0">
              <div className="card-body form-card p-5">
                <form className='form-group' onSubmit={decoding.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label title">Audio File:</label>
                    {decoding.touched.audio && decoding.errors.audio && (
                      <div className="alert alert-danger fw-bold text-danger p-2 rounded-0 mt-2">{decoding.errors.audio}</div>
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
                      <button className="btn btn-light rounded-0 ml-2" type="button" onClick={() => document.getElementById('customFileInput').click()} style={{ marginLeft: '20px' }}>
                        <div className="d-flex">
                          <i className="fa-solid fa-folder-open  mt-1 px-1 "></i>  Browse
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                      <label className="form-label title">Key:</label>
                      {decoding.touched.key && decoding.errors.key ? (
                        <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">{decoding.errors.key}</div>
                      ) : null}
                      <input autoComplete='off' type='password' className="form-control rounded-0" name="key" onChange={decoding.handleChange} value={decoding.values.key} placeholder="Key" />
                    </div>
                  {decodin ? (
                    <Spinner animation="border" role="status" style={{ color: 'blue', height: '40px', width: '40px' }}>
                      <span className="visually-hidden">Decoding...</span>
                    </Spinner>
                  ) : (
                    <button type="submit" className="btn btn-primary rounded-0">Decode</button>
                  )}
                </form>
                {decodedMessage && (
                  <div className='mt-3'>
                    <p className='title'>Decoded Message: </p>
                    <div className="msg  p-2 border-black">
                      {decodedMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="container">
            <div className="card border-0">
              <div className="card-body bg-info-subtle">
                <h1 className="decoder-head">Instructions</h1>
                <p className='mb-4 para'>Follow these steps to decode your message from an audio file:</p>
                <ul>
                  <li className='para text-start'>Select an audio file from which you wish to extract the secret message.</li>
                  <li className='para text-start'>Click on the 'Decode' button.</li>
                  <li className='para text-start'>The decoded message will be displayed below.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default AudioDecoder;