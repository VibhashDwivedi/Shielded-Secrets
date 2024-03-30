from flask import Flask
from flask_cors import CORS
from image_stegano import image_stegano
from audio_stegano import audio_stegano
from text_stegano import text_stegano
from video_stegano import video_stegano

app = Flask(__name__)
app.register_blueprint(image_stegano)
app.register_blueprint(audio_stegano)
app.register_blueprint(text_stegano)
app.register_blueprint(video_stegano)

CORS(app, resources={r"/*": {"origins": "*", "methods":  ["GET", "POST", "OPTIONS", "DELETE", "PUT"],"allow_headers": ["append", "delete", "entries", "foreach", "get", "has", "keys", "set", "values", "Authorization", "content-type"] }} , supports_credentials=True)

@app.route('/')
def hello_world():
    return 'Hello, Flask!!!!'

if __name__ == '__main__':
    app.run()
