from flask import Blueprint, request, send_from_directory
from werkzeug.utils import secure_filename

import os
import cv2
import numpy as np

from crypto import encryption, decryption

video_stegano = Blueprint('video_stegano', __name__)

UPLOAD_FOLDER = 'Sample_cover_files'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def msgtobinary(msg):
    if type(msg) == str:
        result= ''.join([ format(ord(i), "08b") for i in msg ])
    
    elif type(msg) == bytes or type(msg) == np.ndarray:
        result= [ format(i, "08b") for i in msg ]
    
    elif type(msg) == int or type(msg) == np.uint8:
        result=format(msg, "08b")

    else:
        raise TypeError("Input type is not supported in this function")
    
    return result




def embed(frame, key, data):
    data=data
    data=encryption(data, key)
    print("The encrypted data is : ",data)
    if (len(data) == 0): 
        raise ValueError('Data entered to be encoded is empty')

    data +='*^*^*'
    
    binary_data=msgtobinary(data)
    length_data = len(binary_data)
    
    index_data = 0
    
    for i in frame:
        for pixel in i:
            r, g, b = msgtobinary(pixel)
            if index_data < length_data:
                pixel[0] = int(r[:-1] + binary_data[index_data], 2) 
                index_data += 1
            if index_data < length_data:
                pixel[1] = int(g[:-1] + binary_data[index_data], 2) 
                index_data += 1
            if index_data < length_data:
                pixel[2] = int(b[:-1] + binary_data[index_data], 2) 
                index_data += 1
            if index_data >= length_data:
                break
        return frame



def extract(frame, key):
    data_binary = ""
    final_decoded_msg = ""
    for i in frame:
        for pixel in i:
            r, g, b = msgtobinary(pixel) 
            data_binary += r[-1]  
            data_binary += g[-1]  
            data_binary += b[-1]  
            total_bytes = [ data_binary[i: i+8] for i in range(0, len(data_binary), 8) ]
            decoded_data = ""
            for byte in total_bytes:
                decoded_data += chr(int(byte, 2))
                if decoded_data[-5:] == "*^*^*": 
                    for i in range(0,len(decoded_data)-5):
                        final_decoded_msg += decoded_data[i]
                    final_decoded_msg = decryption(final_decoded_msg, key)
                    print("\n\nThe Encoded data which was hidden in the Video was :--\n",final_decoded_msg)
                    return final_decoded_msg

def encode_vid_data(video_path, frame_num, key, msg):
    cap=cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise IOError("Unable to open video file")
    vidcap = cv2.VideoCapture(video_path)    
    fourcc = int(vidcap.get(cv2.CAP_PROP_FOURCC))
    frame_width = int(vidcap.get(3))
    frame_height = int(vidcap.get(4))

    size = (frame_width, frame_height)
    out = cv2.VideoWriter('stego_video.mp4',fourcc, 25.0, size)
    max_frame=0;
    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret == False:
            break
        max_frame+=1
    cap.release()
    print("Total number of Frame in selected Video :",max_frame)
    n=frame_num
    frame_number = 0
    while(vidcap.isOpened()):
        frame_number += 1
        ret, frame = vidcap.read()
        if ret == False:
            break
        if frame_number == n:    
            change_frame_with = embed(frame, key, msg)
            frame_ = change_frame_with
            frame = change_frame_with
        out.write(frame)
    
    print("\nEncoded the data successfully in the video file.")
    return frame_

def decode_vid_data(stego_video_path, frame_num, key, frame_):
    cap = cv2.VideoCapture(stego_video_path)
    max_frame=0;
    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret == False:
            break
        max_frame+=1
    print("Total number of Frame in selected Video :",max_frame)
    n=frame_num
    vidcap = cv2.VideoCapture(stego_video_path)
    frame_number = 0
    while(vidcap.isOpened()):
        frame_number += 1
        ret, frame = vidcap.read()
        if ret == False:
            break
        if frame_number == n:
            print("Extracting the data from the video file.")
            return extract(frame_, key)
        


@video_stegano.route('/upload_vid', methods=['POST'])
def upload_vid():
    if 'video' not in request.files:
        return {"error": "No video file in request"}, 400

    video = request.files['video']
    filename = secure_filename(video.filename)
    video_path = os.path.join(UPLOAD_FOLDER, filename)
    video.save(video_path)
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    return {'total_frames': total_frames}





@video_stegano.route('/encode_vid', methods=['POST'])
def encode_vid():
    try:
        video = request.files['video']
        frame_num = int(request.form['frame_num'])
        key = request.form['key']
        msg = request.form['msg']

        video_path = os.path.join('Sample_cover_files', video.filename)
        video.save(video_path)

        # Call your existing functions to encode the video
        frame_ = encode_vid_data(video_path, frame_num, key, msg)

        # Save frame_ for future decoding
        np.save('frame_.npy', frame_)

        encoded_video_url = request.url_root + 'stego_video.mp4'  # Assuming the server serves static files

        return {"message": "Video encoded successfully", "video": encoded_video_url}, 200
    except Exception as e:
        print(e)
        return {"error": str(e)}, 400



@video_stegano.route('/stego_video.mp4')
def serve_stego_video():
    return send_from_directory('.', 'stego_video.mp4')


@video_stegano.route('/decode_vid', methods=['POST'])
def decode_vid():
    stego_video = request.files['stego_video']
    frame_num = int(request.form['frame_num'])
    key = request.form['key']

    stego_video_path = os.path.join('Sample_cover_files', stego_video.filename)
    stego_video.save(stego_video_path)

    # Load frame_ from file
    frame_ = np.load('frame_.npy')

    # Call your existing functions to decode the video
    decoded_msg = decode_vid_data(stego_video_path, frame_num, key, frame_)

    return {"message": "Video decoded successfully", "decoded_msg": decoded_msg}

