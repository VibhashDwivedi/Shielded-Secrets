from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import base64
import os

video_stegano = Blueprint('video_stegano', __name__)

hrkr;r