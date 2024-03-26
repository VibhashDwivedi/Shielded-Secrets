import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const TextEncoder = () => {
  const [textFile, setTextFile] = useState(null);
  const [stegoFile, setStegoFile] = useState(null);
  const [stegoFileName, setStegoFileName] = useState('');

  const handleFileChange = (event) => {
    setTextFile(event.target.files[0]);
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
      formData.append('file', textFile);
      formData.append('secretMessage', values.secretMessage);

      const res = await fetch('http://localhost:5000/encode_text', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        setStegoFile(data.text);
        setStegoFileName(data.filename);
        encoding.resetForm(); 
        console.log(data);
        if(data.status === 200){
          alert('Encoded')
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    validationSchema: textSchema
  });

  return (
    <div className='container mt-5 pb-4'>
      <div className="card shadow-lg border-0 ">
        <div className="card-body">
          <div className="row">
            <div className="col-md-7 ">
              <div className="container">
                <h1 className="mb-4">Text Encoder</h1>
                <form className='form-group' onSubmit={encoding.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Text File:</label>
                    <div className="d-flex align-items-center">
                      <input 
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        className="form-control d-none"
                        id="customFileInput"
                      />
                      <label className="form-control rounded-0" htmlFor="customFileInput">
                        {textFile ? textFile.name : 'Choose file'}
                      </label>
                      <button className="btn btn-outline-secondary ml-2" type="button" onClick={() => document.getElementById('customFileInput').click()}>
                        Browse
                      </button>
                    </div>
                    {encoding.touched.file && encoding.errors.file && (
                      <div className="alert alert-danger mt-2">{encoding.errors.file}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Secret Message:</label>
                    <input 
                      type="text"
                      name="secretMessage"
                      onChange={encoding.handleChange}
                      value={encoding.values.secretMessage}
                      className="form-control rounded-0"
                    />
                    {encoding.touched.secretMessage && encoding.errors.secretMessage && (
                      <div className="alert alert-danger mt-2">{encoding.errors.secretMessage}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary">Encode</button>
                </form>
              </div>
            </div>
          </div>
          {stegoFile && (
        <div className='mt-3 mx-3'>
          <a href={stegoFile} download={stegoFileName} className="btn btn-primary rounded-0 mt-2">{stegoFileName}</a>
        </div>
      )}
        </div>
      </div>
     
    </div>
  );
};

export default TextEncoder;