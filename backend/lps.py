# Importing required libraries
from flask import Blueprint, request
from werkzeug.utils import secure_filename
from PIL import Image
from random import choice
import binascii
import base64
import os
import cv2

# Blueprint for lps
lps = Blueprint('lps', __name__)

# Function to convert pixel number to coordinates.
def pixelNumberToCoordinate(n, img):
    return (n%img.size[0], n//img.size[0])

# Function to convert coordinates to pixel number.
def coordinateToPixelNumber(x, y, img):
    return int(y*img.size[0]+x)

# Function to set the least significant bit.
def setLSB(v, state):
    if state == "0":
        return v & 0b11111110
    elif state == "1":
        return v | 0b00000001
    else:
        print(f"invalide state: {state}")
        return v

# Function to write a block of data and pointer to the next pixel in binary format at a given pixel
def write(data, pixel, nextP, img):
    pix = img.load()
    x, y = pixelNumberToCoordinate(nextP, img)
    l = len(data)
    # binary representation of next pixel x
    col = bin(x)[2:].zfill(l)
    # binary representation of next pixel y
    lin = bin(y)[2:].zfill(l)
    for i in range(pixel, pixel+l):
        p = pix[pixelNumberToCoordinate(i, img)]
        if len(p) == 4:
            # With alpha channel
            pix[pixelNumberToCoordinate(i, img)] = (
            setLSB(p[0], data[i-pixel]),
            setLSB(p[1], col[i-pixel]),
            setLSB(p[2], lin[i-pixel]),
            p[3])
        else:
            # no alpha channel
            pix[pixelNumberToCoordinate(i, img)] = (
            setLSB(p[0], data[i-pixel]),
            setLSB(p[1], col[i-pixel]),
            setLSB(p[2], lin[i-pixel]))

# Function to convert a string to binary
def toBin(string):
    print(string)
    x = ''.join(format(ord(i), '08b') for i in string)
    print(x)
    return x

# Function to convert binary to string
def binToString(i):
    if len(i) % 8 != 0:
        r = 8-(len(i)%8)
        i = i + "0"*r
    h = hex(int(i, 2))[2:]
    if len(h) % 2 != 0:
        h = "0"+h
    return binascii.unhexlify(h)[:-1]

# Function to chunk a string into blocks of a given length
def chunkstring(string, length):
    return [string[0+i:length+i].ljust(length, "0") for i in range(0, len(string), length)]

# Function to get the data from a given pixel
def getData(img, startX, startY):
    startX = int(startX)
    startY = int(startY)
    if startX < 0 or startX >= img.width or startY < 0 or startY >= img.height:
        raise ValueError("Starting coordinates are out of bounds")
    n = coordinateToPixelNumber(startX, startY, img)
    print(startX)
    print
    pix = img.load()
    BLOCKLEN = len(bin(max(img.size))[2:])
    nx = ""
    ny = ""
    s = ""
    total_pixels = img.width * img.height
    print(total_pixels)
    for i in range(BLOCKLEN):
        if n+i >= total_pixels:
            raise ValueError("Pixel number is out of bounds")
        c = pixelNumberToCoordinate(n+i, img)
        if c[0] < 0 or c[0] >= img.width or c[1] < 0 or c[1] >= img.height:
          raise ValueError("Pixel coordinates are out of bounds")
        if not isinstance(pix[c][0], int):
          raise TypeError("Pixel value is not an integer")
        s += str(pix[c][0] & 1)
        nx += str(pix[c][1] & 1)
        ny += str(pix[c][2] & 1)
    nx = int(nx, 2)
    ny = int(ny, 2)
    return (s,(nx, ny))

# Function to encode the data in the image
def encode_img_data(data, imgName, startingPixel=(0,0)):
    outName = 'stego_image.png'
    img = Image.open(imgName)
    BLOCKLEN = len(bin(max(img.size))[2:])
    # The number of pixels in the image
    total = img.size[0] * img.size[1]
    # list of available block positions
    AVAILABLE = [x for x in range(1, total-1, BLOCKLEN)]
    # Check if the last position is big enough
    if AVAILABLE[-1] + BLOCKLEN >= total:
        AVAILABLE.pop()
    d = chunkstring(toBin(data),BLOCKLEN)
    n = len(d)
    # choose the first pixel
    pixel = coordinateToPixelNumber(startingPixel[0], startingPixel[1], img)
    if pixel == 0:
        # Choose a random location because (0, 0) is not authorized
        pixel = choice(AVAILABLE)
        AVAILABLE.remove(pixel)
        startingPixel = pixelNumberToCoordinate(pixel, img)
    for i in range(n-1):
        # pointer to the next pixel
        nextP = choice(AVAILABLE)
        AVAILABLE.remove(nextP)
        write(d[i], pixel, nextP, img)
        # switch to next pixel
        pixel = nextP
    # last pointer towards NULL (0, 0)
    write(d[-1], pixel, 0, img)
    img.save(outName)
    img.close()
    print(startingPixel)
    return startingPixel

# Function to decode the data from the image
def decode_img_data(imgName, startX, startY):
    print(imgName, startX, startY)
    img = Image.open(imgName)
    data, p = getData(img, startX, startY)
    while p != (0, 0):
        d, p = getData(img, p[0], p[1])
        data += d
    print(data)      
    return binToString(data)

# Route to encode the data in the image
@lps.route('/encode-lps', methods=['POST'])
def encode():
    stego_image = request.files['image']
    data = request.form['secret']
    filename = secure_filename(stego_image.filename)
    directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_cover_files')
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    stego_image.save(save_path)
    startingPixel = encode_img_data(data, save_path)
    with open('stego_image.png', "rb") as img_file:  # Open the encoded image file
        img_string = base64.b64encode(img_file.read()).decode('utf-8')
    return {'image': 'data:image/png;base64,' + img_string, 'startingPixel': startingPixel} # Return the encoded image as a base64 string

# Route to decode the data from the image
@lps.route('/decode-lps',  methods=['POST']  )
def decode():
    stego_image = request.files['image']
    startX = request.form['startX']
    startY = request.form['startY']
    print(startX, startY)
    filename = secure_filename(stego_image.filename)
    directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_stego_files')
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    stego_image.save(save_path)
    img = cv2.imread(save_path)
    data = decode_img_data(save_path, startX, startY)
    print(data)
    return data