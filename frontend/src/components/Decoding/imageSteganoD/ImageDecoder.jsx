import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react';

const ImageDecoder = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState(null);

  

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    decoding.setFieldValue('image', event.currentTarget.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  const postSchema = Yup.object().shape({
    image: Yup.mixed().required('Required')
  });

  const decoding = useFormik({
    initialValues: {
      image: ''
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('image', imageFile);

      const res = await fetch('http://localhost:5000/decode_img', {
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
    validationSchema: postSchema
  });

  useEffect(() => {
    if (decodedMessage) {
      setTimeout(() => {
        alert('Decoded');
      }, 0);
    }
  }, [decodedMessage]);

  return (
    <div>
      <h1>Decoder</h1>
      <form onSubmit={decoding.handleSubmit}>
        <input 
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        {decoding.touched.image && decoding.errors.image ? (
          <p className='error-label'>{decoding.errors.image}</p>
        ) : null}
        {imageUrl && <img src={imageUrl} alt="Uploaded" height='200' width='200' />}
        <button type="submit">Decode</button>
      </form>

      {decodedMessage && <p>Decoded message: {decodedMessage}</p>}
    </div>
  )
}

export default ImageDecoder;