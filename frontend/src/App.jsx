import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import AudioDecoder from './components/Decoding/audioSteganoD/AudioDecoder';
import ImageDecoder from './components/Decoding/imageSteganoD/ImageDecoder';
import TextDecoder from './components/Decoding/textSteganoD/TextDecoder';
import AudioEncoder from './components/Encoding/AudioSteganoE/AudioEncoder';
import ImageEncoder from './components/Encoding/ImageSteganoE/ImageEncoder';
import TextEncoder from './components/Encoding/TextSteganoE/TextEncoder';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import Home from './components/pages/Home/Home';
import Encoder from './components/pages/Encoder/Encoder';
import Decoder from './components/pages/Decoder/Decoder';
import About from './components/pages/About/About';



function App() {
  return (
   <div className='body-color'>
 <Toaster position='top-center'/>
<BrowserRouter>
<Navbar/>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path ='/encoder' element={<Encoder/>}/>
  <Route path ='/decoder' element={<Decoder/>}/>
  <Route path ='/about' element={<About/>}/>
<Route path="/audio-encoder" element={<AudioEncoder />} />
<Route path="/audio-decoder" element={<AudioDecoder />} />
<Route path="/image-encoder" element={<ImageEncoder />} />
<Route path="/image-decoder" element={<ImageDecoder />} />
<Route path="/text-encoder" element={<TextEncoder />} />
<Route path="/text-decoder" element={<TextDecoder />} />
</Routes>

</BrowserRouter>
</div>
  );
}

export default App;
