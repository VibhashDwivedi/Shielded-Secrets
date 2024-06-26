# Importing the required libraries
import numpy as np

# Function to perform the Key Scheduling Algorithm (KSA)
def KSA(key):
    key_length = len(key)
    S=list(range(256)) 
    j=0
    for i in range(256):
        j=(j+S[i]+key[i % key_length]) % 256
        S[i],S[j]=S[j],S[i]
    return S

# Function to perform the Pseudo-Random Generation Algorithm (PRGA)
def PRGA(S,n):
    i=0
    j=0
    key=[]
    while n>0:
        n=n-1
        i=(i+1)%256
        j=(j+S[i])%256
        S[i],S[j]=S[j],S[i]
        K=S[(S[i]+S[j])%256]
        key.append(K)
    return key

# Function to prepare the key array
def preparing_key_array(s):
    return [ord(c) for c in s]

# Function to encrypt the plaintext
def encryption(plaintext, key):
    key=key
    key=preparing_key_array(key)
    S=KSA(key)
    keystream=np.array(PRGA(S,len(plaintext)))
    plaintext=np.array([ord(i) for i in plaintext])
    cipher=keystream^plaintext
    ctext=''
    for c in cipher:
        ctext=ctext+chr(c)
    print(ctext)
    return ctext

# Function to decrypt the ciphertext
def decryption(ciphertext, key):
    key=key
    key=preparing_key_array(key)
    S=KSA(key)
    keystream=np.array(PRGA(S,len(ciphertext)))
    ciphertext=np.array([ord(i) for i in ciphertext])
    decoded=keystream^ciphertext
    dtext=''
    for c in decoded:
        dtext=dtext+chr(c)
    print(dtext)
    return dtext
