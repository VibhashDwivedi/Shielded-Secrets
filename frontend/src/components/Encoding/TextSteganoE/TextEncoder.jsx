import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './textEncoder.css';
import toast from 'react-hot-toast';

const TextEncoder = () => {
  const [textFile, setTextFile] = useState(null);
  const [stegoFile, setStegoFile] = useState(null);
  const [stegoFileName, setStegoFileName] = useState('');

  const handleFileChange = (event) => {
    setTextFile(event.target.files[0]);
    encoding.setFieldValue('file', event.currentTarget.files[0]);
  };

  const textSchema = Yup.object().shape({
    file: Yup.mixed().required('Required')
    .test('fileFormat', 'Unsupported Format, only .txt files are supported', value => {
      if (value) {
        const supportedFormats = ['.txt'];
        const currentFormat = '.' + value.name.split('.').pop();
        return supportedFormats.includes(currentFormat);
      }
      return true;
    }),
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
      .then(response => {
        if(response.status === 200){
          toast.success('Encoded Successfully😊')
        }
        else
          toast.error('Error Encountered😔')
        return response.json();
      })
      .then(data => {
        setStegoFile(data.text);
        setStegoFileName(data.filename);
        encoding.resetForm(); 
        console.log(data);
        
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('Error Encountered😔')
      });
    },
    validationSchema: textSchema
  });

  return (
    <div className='container mt-5 pb-4'>
      <div className="card shadow-lg border-0 ">
        <div className="card-body">
        <h1 className=" encoder-head">Text Encoder</h1>
                <p className='mb-4 para'>Encode Your Message in a text file!!</p>
          <div className="row">
            <div className="col-md-7 ">
              <div className="container">
             
                <div className="card border-0">
                  <div className="card-body p-5 form-card">
                  <form className='form-group' onSubmit={encoding.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label title">Text File:</label>
                    {encoding.touched.file && encoding.errors.file && (
                      <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">{encoding.errors.file}</div>
                    )}
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
                      <button className="btn btn-light ml-2 rounded-0" type="button" onClick={() => document.getElementById('customFileInput').click()} style={{marginLeft:'20px'}}>
                      <div className="d-flex">
                      <i className="fa-solid fa-folder-open  mt-1 px-1"></i>  Browse
                      </div>
                      </button>
                    </div>
                   
                  </div>
                  <div className="mb-3">
                    <label className="form-label title">Secret Message:</label>
                    {encoding.touched.secretMessage && encoding.errors.secretMessage && (
                      <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">{encoding.errors.secretMessage}</div>
                    )}
                    <input 
                      type="text"
                      name="secretMessage"
                      onChange={encoding.handleChange}
                      value={encoding.values.secretMessage}
                      className="form-control rounded-0"
                      placeholder='Secret Message Here...'
                      autoComplete='off'
                    />
                    
                  </div>
                  <button type="submit" className="btn btn-primary rounded-0">Encode</button>
                </form>
              
              {stegoFile && (
        <div className='mt-3'>
           <label className="form-label title mt-3">Encoded File:</label>
          <a href={stegoFile} download={stegoFileName} className="btn btn-primary rounded-0 mx-3">{stegoFileName}</a>
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
        <h1 className="encoder-head">Instructions</h1>
        <p className='mb-4 para'>Follow these steps to encode your message in a text file:</p>
        <ul>
          <li className='para text-start'>Select a text file into which you wish to embed your secret message.</li>
          <li className='para text-start'>Input the confidential message that you wish to embed within the text file.</li>
          <li className='para text-start'>Click on the 'Encode' button.</li>
          <li className='para text-start'>The encoded text will be displayed below.</li>
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

export default TextEncoder;