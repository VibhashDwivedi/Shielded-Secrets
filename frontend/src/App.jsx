
import './App.css';
import AudioDecoder from './components/Decoding/audioSteganoD/AudioDecoder';
import ImageDecoder from './components/Decoding/imageSteganoD/ImageDecoder';
import TextDecoder from './components/Decoding/textSteganoD/TextDecoder';
import AudioEncoder from './components/Encoding/AudioSteganoE/AudioEncoder';
import ImageEncoder from './components/Encoding/ImageSteganoE/ImageEncoder';
import TextEncoder from './components/Encoding/TextSteganoE/TextEncoder';


function App() {
  return (
   <div>
   <ImageEncoder  />
   <ImageDecoder/>
   <AudioEncoder/>
   <AudioDecoder/>
   <TextEncoder/>
   <TextDecoder/>
   </div>
  );
}

export default App;
