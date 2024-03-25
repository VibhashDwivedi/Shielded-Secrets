from flask import Blueprint, request
from werkzeug.utils import secure_filename

import base64
import os
import wave


audio_stegano = Blueprint('audio_stegano', __name__)

def encode_aud_data(data, audio_file):
    

    nameoffile=audio_file
    song = wave.open(nameoffile, mode='rb')

    nframes=song.getnframes()
    frames=song.readframes(nframes)
    frame_list=list(frames)
    frame_bytes=bytearray(frame_list)

    

    res = ''.join(format(i, '08b') for i in bytearray(data, encoding ='utf-8'))     
    print("\nThe string after binary conversion :- " + (res))   
    length = len(res)
    print("\nLength of binary after conversion :- ",length)

    data = data + '*^*^*'

    result = []
    for c in data:
        bits = bin(ord(c))[2:].zfill(8)
        result.extend([int(b) for b in bits])

    j = 0
    for i in range(0,len(result),1): 
        res = bin(frame_bytes[j])[2:].zfill(8)
        if res[len(res)-4]== result[i]:
            frame_bytes[j] = (frame_bytes[j] & 253)      #253: 11111101
        else:
            frame_bytes[j] = (frame_bytes[j] & 253) | 2
            frame_bytes[j] = (frame_bytes[j] & 254) | result[i]
        j = j + 1
    
    frame_modified = bytes(frame_bytes)

    stegofile='stego_audio.wav'
    with wave.open(stegofile, 'wb') as fd:
        fd.setparams(song.getparams())
        fd.writeframes(frame_modified)
    print("\nEncoded the data successfully in the audio file.")    
    song.close()

def decode_aud_data(song):
    

    

    nframes=song.getnframes()
    frames=song.readframes(nframes)
    frame_list=list(frames)
    frame_bytes=bytearray(frame_list)

    extracted = ""
    p=0
    for i in range(len(frame_bytes)):
        if(p==1):
            break
        res = bin(frame_bytes[i])[2:].zfill(8)
        if res[len(res)-2]==0:
            extracted+=res[len(res)-4]
        else:
            extracted+=res[len(res)-1]
    
        all_bytes = [ extracted[i: i+8] for i in range(0, len(extracted), 8) ]
        decoded_data = ""
        for byte in all_bytes:
            decoded_data += chr(int(byte, 2))
            if decoded_data[-5:] == "*^*^*":
                #print("The Encoded data was :--",decoded_data[:-5])
                return decoded_data[:-5]
                p=1
                break  



@audio_stegano.route('/encode_audio', methods=['POST'])
def encode_audio():
    audio_file = request.files['audio']
    data = request.form['secret']
    filename = secure_filename(audio_file.filename)
    directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_cover_files')
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    audio_file.save(save_path)
    # song = wave.open(save_path, mode='rb')
    encode_aud_data(data, save_path)
    with open('stego_audio.wav', "rb") as audio_file:  # Open the encoded audio file
      audio_string = base64.b64encode(audio_file.read()).decode('utf-8')
    return {'audio': 'data:audio/wav;base64,' + audio_string}  # Return the encoded audio as a base64 string


#receive image from user

#decode router receives image from user and returns the decoded message


@audio_stegano.route('/decode_audio', methods=['POST'])
def decode_audio():
    audio_file = request.files['audio']
    filename = secure_filename(audio_file.filename)
    directory = 'Sample_cover_files'
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    audio_file.save(save_path)
    song = wave.open(save_path, mode='rb')
    data = decode_aud_data(song)
    
    return data



