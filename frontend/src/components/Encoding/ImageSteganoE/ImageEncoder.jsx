import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import './imageEncoder.css'

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
    <div className='container mt-5 pb-4'>
      <div className="card shadow-lg border-0 ">
        <div className="card-body">
          <div className="row">
            <div className="col-md-7 ">
              <div className="container">
                <h1 className="mb-4">Image Encoder</h1>
                <form className='form-group' onSubmit={encoding.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label title">Select an Image:</label>
                    {encoding.touched.image && encoding.errors.image && (
                      <div className="alert alert-danger mt-2">{encoding.errors.image}</div>
                    )}
                    <div className="d-flex align-items-center">
                      <input 
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="form-control d-none w-25 "
                        id="customFileInput"

                      />
                      <label className="form-control rounded-0" htmlFor="customFileInput">
                        {imageFile ? imageFile.name : 'Choose file'}
                      </label>
                      <button className="btn btn-outline-secondary ml-3 rounded-0" type="button" onClick={() => document.getElementById('customFileInput').click()} style={{ marginLeft: '20px' }}>
                        Browse
                      </button>
                    </div>
                    
                  </div>
                  {imageUrl && <img src={imageUrl} alt="Uploaded" height='270' width='350' className="img-thumbnail mb-3 rounded-0 border-0" />}
                  <div className="mb-3">
                    <label className="form-label title">Secret Message:</label>
                    {encoding.touched.secret && encoding.errors.secret && (
                      <div className="alert alert-danger mt-2">{encoding.errors.secret}</div>
                    )}
                    <input 
                      type="text"
                      name="secret"
                      onChange={encoding.handleChange}
                      value={encoding.values.secret}
                      className="form-control rounded-0"
                      placeholder='Secret Message here...'
                    />
                    
                  </div>
                  <button type="submit" className="btn btn-primary rounded-0">Encode</button>
                </form>

                {encodedImage && (
  <div className='d-block'>
    <div>
      <img src={encodedImage} alt="Encoded" height='270' width='350' className="img-thumbnail mt-3 rounded-0 border-0" />
    </div>
    <div>
      <a href={encodedImage} download="encoded_image.png" className="btn btn-primary rounded-0 mt-2">Download</a>
    </div>
  </div>
)}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageEncoder;