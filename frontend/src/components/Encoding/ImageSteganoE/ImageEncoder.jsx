import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const ImageEncoder = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [encodedImage, setEncodedImage] = useState(null);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    encoding.setFieldValue('image', event.currentTarget.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  const postSchema = Yup.object().shape({
    secret: Yup.string().required('Required'),
    image: Yup.mixed().required('Required')
  });

  const encoding = useFormik({
    initialValues: {
      secret: '',
      image: ''
    },
    onSubmit: async values => {
      let formData = new FormData();
      formData.append('image', imageFile);
      formData.append('secret', values.secret);

      const res = await fetch('http://localhost:5000/encode_img', {
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
        setEncodedImage(data.image);
        console.log(data);
        if(data.status === 200){
          alert('Encoded')
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    validationSchema: postSchema
  });

  return (
    <div>
      <h1>Encoder</h1>
      <form onSubmit={encoding.handleSubmit}>
        <input 
          type="file"
          name="image"
          onChange={handleImageChange}
          
        />
         {encoding.touched.image && encoding.errors.image ? (
    <p className='error-label'>{encoding.errors.image}</p>
  ) : null}
  {imageUrl && <img src={imageUrl} alt="Uploaded" height='200' width='200' />}
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

      {encodedImage && <img src={encodedImage} alt="Encoded" height='200' width='200' />}
    </div>
  )
}

export default ImageEncoder;