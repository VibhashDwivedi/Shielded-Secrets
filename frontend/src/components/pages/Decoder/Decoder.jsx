import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, EffectFade} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Tilt from 'vanilla-tilt';
import './decoder.css';

const slides = [
  { key: 'vackD', backgroundColor: '#D0F0C0' },
  { key: 'vackD2', backgroundColor: '#D0F0C0' },
  { key: 'vackD3', backgroundColor: '#D0F0C0' },
];

const Encoder = () => {
  const tiltRefs = useRef([]);
  
 
  useEffect(() => {
    tiltRefs.current.forEach((tiltRef) => {
      Tilt.init(tiltRef, {
        max: 10,
        speed: 500,
        glare: true,
        'max-glare': 0.5,
        scale: 1.1,
        perspective: 1000,
      });
    });
  }, []);

  return (
    <Swiper
      className='mt-3 mx-5 px-2 p-lg-0'
      modules={[Autoplay, EffectFade, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      effect= {'fade'}
      autoplay={{ delay: 2000, disableOnInteraction: true, pauseOnMouseEnter: true }}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={slide.key}>
          <div className='container mt-5 pb-5'>
            <div className={`card shadow-lg border-0 ${slide.key}`}>
              <div className="card-body rounded-5 px-5 py-4">
                <div className="row">
                
                  <div className="col-md-6">
                    <h2 className='text-center head'>Decoding Choices!!</h2>
                    <h4 className='text-center mt-2'>Choose the type of steganography you want to use!</h4>
                    <div ref={ref => tiltRefs.current[i] = ref} className="inner-card">
                      <div className="card mt-4 border-0 inner-card" style={{ backgroundColor: slide.backgroundColor }}>
                        <div className="card-body p-3 m-3">
                          <div className="">
                            <div className="row">
                              <div className="col-md-6 ">
                                <Link className='btn btn-dark fs-4 p-3 py-4' to='/text-decoder'>Text Decoder</Link>
                              </div>
                              <div className="col-md-6 ">
                                <Link className='btn btn-dark fs-4 p-3 py-2' to='/image-decoder'>Image Decoder</Link>
                              </div>
                            </div>
                            <div className="row mt-4">
                              <div className="col-md-6 ">
                                <Link className='btn btn-dark fs-4 p-3 py-2' to='/audio-decoder'>Audio Decoder</Link>
                              </div>
                              <div className="col-md-6 ">
                                <Link className='btn btn-dark fs-4 p-3 py-2' to='#'>Video Decoder</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* <img src={poster} alt="" className='rounded-circle m-2 p-3' height={400} width={400}  /> */}
                  </div>
                
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Encoder;