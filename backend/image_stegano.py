from flask import Blueprint, request
from werkzeug.utils import secure_filename

import base64
import numpy as np
import os
import cv2

from crypto import encryption, decryption

image_stegano = Blueprint('image_stegano', __name__)


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


def encode_img_data( data, stego_image, key='123'):
    data = encryption(data, key)
    img=cv2.imread(stego_image)
    #data=input("\nEnter the data to be Encoded in Image :")    
    if (len(data) == 0): 
        raise ValueError('Data entered to be encoded is empty')
  
    nameoffile = stego_image
    
    
    no_of_bytes=(img.shape[0] * img.shape[1] * 3) // 8
    
    print("\t\nMaximum bytes to encode in Image :", no_of_bytes)
    
    if(len(data)>no_of_bytes):
        raise ValueError("Insufficient bytes Error, Need Bigger Image or give Less Data !!")
    
    data = str(data) + '*^*^*'    
    
    binary_data=msgtobinary(data)
    print("\n")
    print(binary_data)
    length_data=len(binary_data)
    
    print("\nThe Length of Binary data",length_data)
    
    index_data = 0
    
    for i in img:
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
    nameoffile = 'stego_image.png'        
    cv2.imwrite( nameoffile, img)
    print("\nEncoded the data successfully in the Image and the image is successfully saved with name ",nameoffile)

def decode_img_data(img, key):
    print("key" + key)
    data_binary = ""
    for i in img:
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
                    #print("\n\nThe Encoded data which was hidden in the Image was :--  ",decoded_data[:-5])
                    ciphertext =  decoded_data[:-5]
                    print(ciphertext)
                    print(key)
                    decoded_data = decryption(ciphertext, key)
                    return decoded_data
                


@image_stegano.route('/encode_img', methods=['POST'])
def encode():
    stego_image = request.files['image']
    data = request.form['secret']
    key = request.form['key']
    filename = secure_filename(stego_image.filename)
    directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_cover_files')
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    stego_image.save(save_path)
    encode_img_data(data, save_path, key)
    with open('stego_image.png', "rb") as img_file:  # Open the encoded image file
        img_string = base64.b64encode(img_file.read()).decode('utf-8')
    return {'image': 'data:image/png;base64,' + img_string} # Return the encoded image as a base64 string




@image_stegano.route('/decode_img',  methods=['POST']  )
def decode():
    stego_image = request.files['image']
    key = request.form['key']
    filename = secure_filename(stego_image.filename)
    directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_stego_files')
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    stego_image.save(save_path)
    img = cv2.imread(save_path)
    print(key)
    data = decode_img_data(img, key)
    return data




