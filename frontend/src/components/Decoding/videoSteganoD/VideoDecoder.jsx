import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import './VideoDecoder.css';
import { Spinner } from 'react-bootstrap';

const VideoDecoder = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState(null);
  const [decodin, setDecodin] = useState(false)

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
    decoding.setFieldValue('video', e.currentTarget.files[0]);
    setVideoUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleVideoUpload = async () => {
    let formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('http://localhost:5000/upload_vid', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log('Video uploaded successfully');
        toast.success('Video uploaded successfully');
      } else {
        console.log('Failed to upload video');
        toast.error('Failed to upload video');
      }
    } catch (error) {
      console.error('An error occurred while uploading the video', error);
      toast.error('An error occurred while uploading the video');
    }
  };

  const postSchema = Yup.object().shape({
    frameNumber: Yup.number().required('Required'),
    key: Yup.string().required('Required'),
    video: Yup.mixed().required('Required')
  });

  const decoding = useFormik({
    initialValues: {
      frameNumber: '',
      key: '',
      video: ''
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('stego_video', videoFile);
      formData.append('frame_num', values.frameNumber);
      formData.append('key', values.key);
      setDecodin(true);

      try {
        const response = await axios.post('http://localhost:5000/decode_vid', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          console.log('Video decoded successfully');
          toast.success('Decoded Successfully😊')
          setDecodedMessage(response.data.decoded_msg);
          decoding.resetForm();
        } else {
          console.log('Failed to decode video');
          toast.error('Error Encountered😔')
        }
      } catch (error) {
        console.error('An error occurred while decoding the video', error);
        toast.success('Decoded Successfully😊')
      }

      setDecodin(false);
    },
    validationSchema: postSchema
  });

  return (
    <div className='container mt-5 pb-4'>
    <div className="card shadow-lg border-0">
      <div className="card-body">
        <h1 className="decoder-head">Video Decoder</h1>
        <p className='mb-4 para'>Decode Your Message from a video!!</p>
        <div className="row">
          <div className="col-md-7">
            <div className="container">
              <div className="card border-0">
                <div className="card-body form-card p-5">
                  <form onSubmit={decoding.handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label title">Select a Video:</label>
                      {decoding.touched.video && decoding.errors.video ? (
                        <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">{decoding.errors.video}</div>
                      ) : null}
                      <div className="d-flex align-items-center">
                        <input type="file" id="customFileInput" accept="video/*" onChange={handleVideoChange} className="form-control rounded-0 d-none"/>
                        <label className="form-control rounded-0 text-truncate" htmlFor="customFileInput">
                          {videoFile ? videoFile.name : 'Choose file'}
                        </label>
                        <button className="btn btn-light ml-3 rounded-0" type="button" onClick={() => document.getElementById('customFileInput').click()} style={{ marginLeft: '20px' }}>
                          <div className="d-flex">
                            <i className="fa-solid fa-folder-open mt-1 px-1"></i> Browse
                          </div>
                        </button>
                      </div>
                    </div>
                    {videoUrl && <video src={videoUrl} controls height='270' width='350' className="img-thumbnail rounded-0" />}
                    <div className="mb-3">
                      <label className="form-label title">Frame number:</label>
                      {decoding.touched.frameNumber && decoding.errors.frameNumber ? (
                        <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">{decoding.errors.frameNumber}</div>
                      ) : null}
                      <input autoComplete='off' className="form-control rounded-0" type="number" name="frameNumber" onChange={decoding.handleChange} value={decoding.values.frameNumber} placeholder="Frame number" />
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
                      <button type="submit" className="btn btn-primary rounded-0">Decode </button>
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
                  <p className='mb-4 para'>Follow these steps to decode your message from a video file:</p>
                  <ul>
                    <li className='para text-start'>Select a video file from which you wish to decode your secret message.</li>
                    <li className='para text-start'>Click on the 'Upload Video' button to upload the selected video.</li>
                    <li className='para text-start'>Input the frame number where your message is embedded.</li>
                    <li className='para text-start'>Input the cryptography key for the decoding process.</li>
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

export default VideoDecoder;