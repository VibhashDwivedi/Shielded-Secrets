from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import base64
import os

text_stegano = Blueprint('text_stegano', __name__)

def BinaryToDecimal(binary):
    string = int(binary, 2)
    return string

def txt_encode(text, text_file):
    l=len(text)
    i=0
    add=''
    while i<l:
        t=ord(text[i])
        if(t>=32 and t<=64):
            t1=t+48
            t2=t1^170       #170: 10101010
            res = bin(t2)[2:].zfill(8)
            add+="0011"+res
        
        else:
            t1=t-48
            t2=t1^170
            res = bin(t2)[2:].zfill(8)
            add+="0110"+res
        i+=1
    res1=add+"111111111111"
    print("The string after binary conversion appyling all the transformation :- " + (res1))   
    length = len(res1)
    print("Length of binary after conversion:- ",length)
    HM_SK=""
    ZWC={"00":u'\u200C',"01":u'\u202C',"11":u'\u202D',"10":u'\u200E'}      
    file1 = open(text_file,"r", encoding="utf-8")
    nameoffile = 'stego_text.txt'
    file3= open(nameoffile,"w+", encoding="utf-8")
    word=[]
    for line in file1: 
        word+=line.split()
    i=0
    while(i<len(res1)):  
        s=word[int(i/12)]
        j=0
        x=""
        HM_SK=""
        while(j<12):
            x=res1[j+i]+res1[i+j+1]
            HM_SK+=ZWC[x]
            j+=2
        s1=s+HM_SK
        file3.write(s1)
        file3.write(" ")
        i+=12
    t=int(len(res1)/12)     
    while t<len(word): 
        file3.write(word[t])
        file3.write(" ")
        t+=1
    file3.close()  
    file1.close()
    print("\nStego file has successfully generated")

def txt_decode(text_file):
    ZWC_reverse={u'\u200C':"00",u'\u202C':"01",u'\u202D':"11",u'\u200E':"10"}
    
    stego=text_file
    file4= open(stego,"r", encoding="utf-8")
    temp=''
    for line in file4: 
        for words in line.split():
            T1=words
            binary_extract=""
            for letter in T1:
                if(letter in ZWC_reverse):
                     binary_extract+=ZWC_reverse[letter]
            if binary_extract=="111111111111":
                break
            else:
                temp+=binary_extract
    print("\nEncrypted message presented in code bits:",temp) 
    lengthd = len(temp)
    print("\nLength of encoded bits:- ",lengthd)
    i=0
    a=0
    b=4
    c=4
    d=12
    final=''
    while i<len(temp):
        t3=temp[a:b]
        a+=12
        b+=12
        i+=12
        t4=temp[c:d]
        c+=12
        d+=12
        if(t3=='0110'):
            decimal_data = BinaryToDecimal(t4)
            final+=chr((decimal_data ^ 170) + 48)
        elif(t3=='0011'):
            decimal_data = BinaryToDecimal(t4)
            final+=chr((decimal_data ^ 170) - 48)
    
    return final




@text_stegano.route('/encode_text', methods=['POST'])
def encode_txt_data():
    txt_file = request.files['file']
    filename = secure_filename(txt_file.filename)
    directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_cover_files')
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    txt_file.save(save_path)
    text1 = request.form['secretMessage']
    txt_encode(text1, save_path)
    with open('stego_text.txt', "rb") as text_file:  # Open the encoded text file
        text_string = base64.b64encode(text_file.read()).decode('utf-8')
    return {'text': 'data:text/plain;base64,' + text_string, 'filename': 'stego_text.txt'}  # Return the encoded text as a base64 string

@text_stegano.route('/decode_text', methods=['POST'])
def decode_txt_data():
    stego_text = request.files['file']
    filename = secure_filename(stego_text.filename)
    directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_stego_files')
    if not os.path.exists(directory):
        os.makedirs(directory)
    save_path = os.path.join(directory, filename)
    stego_text.save(save_path)
    text = txt_decode(save_path)
    return text