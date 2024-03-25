import React from 'react'
import poster from '../../../assets/images/Steganography-encoder.jpg'
import './encoder.css'
import { Link, NavLink } from 'react-router-dom'

const Encoder = () => {
  return (
    <div className='container mt-5 pb-5' >
      <div className="card shadow-lg border-0" style={{backgroundColor: '#99FFFF'}}>
        <div className="card-body rounded-5 px-5 py-4">
          <div className="row">
            <div className="col-md-6">
             <img src={poster} alt="" className='rounded-circle m-2 p-3' height={400} width={400}  />
            </div>
            <div className="col-md-6">
            <h1 className='text-center head'>Choose an option!!</h1>
            <p className='text-center head'>Choose the type of steganography you want to use!</p>
           <div className="card mt-5 border-0" style={{backgroundColor:'#D0F0C0'}}>
            <div className="card-body p-3 m-3">
            <div className="">
              <div className="row">
                <div className="col-md-6 ">
                  <Link className='btn btn-dark fs-4 p-3 py-4' to='/text-encoder'>  Text Encoder</Link>
                </div>
                <div className="col-md-6 ">
                  <Link className='btn btn-dark fs-4 p-3 py-2' to='/image-encoder' >Image Encoder</Link>
                </div>
                
              </div>
              <div className="row mt-4">
                <div className="col-md-6 ">
                  <Link className='btn btn-dark fs-4 p-3 py-2' to='/audio-encoder'>Audio Encoder</Link>
                </div>
                <div className="col-md-6 ">
                  <Link className='btn btn-dark fs-4 p-3 py-2' to='#'>Video Encoder</Link>
                </div>
                
              </div>
            </div>
            </div>
           </div>
            
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Encoder