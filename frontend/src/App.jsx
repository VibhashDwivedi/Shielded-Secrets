import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import AudioDecoder from "./components/Decoding/AudioDecoder";
import ImageDecoder from "./components/Decoding/ImageDecoder";
import TextDecoder from "./components/Decoding/TextDecoder";
import AudioEncoder from "./components/Encoding/AudioEncoder";
import ImageEncoder from "./components/Encoding/ImageEncoder";
import TextEncoder from "./components/Encoding/TextEncoder";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/pages/Home/Home";
import Encoder from "./components/pages/Encoder/Encoder";
import Decoder from "./components/pages/Decoder/Decoder";
import VideoEncoder from "./components/Encoding/VideoEncoder";
import VideoDecoder from "./components/Decoding/VideoDecoder";
import ImageEncoder2 from "./components/Encoding/LPSencoder";
import ImageDecoder2 from "./components/Decoding/LPSdecoder";

function App() {
  return (
    <div className="body-color">
      <Toaster position="top-center" />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/encoder" element={<Encoder />} />
          <Route path="/decoder" element={<Decoder />} />
          <Route path="/audio-encoder" element={<AudioEncoder />} />
          <Route path="/audio-decoder" element={<AudioDecoder />} />
          <Route path="/image-encoder" element={<ImageEncoder />} />
          <Route path="/image-decoder" element={<ImageDecoder />} />
          <Route path="/text-encoder" element={<TextEncoder />} />
          <Route path="/text-decoder" element={<TextDecoder />} />
          <Route path="/video-encoder" element={<VideoEncoder />} />
          <Route path="/video-decoder" element={<VideoDecoder />} />
          <Route path='/lps-encode' element={<ImageEncoder2/>} />
          <Route path='/lps-decode' element={<ImageDecoder2/>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
