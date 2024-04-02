# Description: This is the main file of the backend. It is responsible for running the Flask server and registering the blueprints of the different modules.

# Importing the required libraries
from flask import Flask
from flask_cors import CORS

# Importing the blueprints of the different modules
from image_stegano import image_stegano
from audio_stegano import audio_stegano
from text_stegano import text_stegano
from video_stegano import video_stegano
from lps import lps

# Creating the Flask app
app = Flask(__name__)

# Registering the blueprints of the different modules
app.register_blueprint(image_stegano)
app.register_blueprint(audio_stegano)
app.register_blueprint(text_stegano)
app.register_blueprint(video_stegano)
app.register_blueprint(lps)

# Enabling CORS
CORS(app, resources={r"/*": {"origins": "*", "methods":  ["GET", "POST", "OPTIONS", "DELETE", "PUT"],"allow_headers": ["append", "delete", "entries", "foreach", "get", "has", "keys", "set", "values", "Authorization", "content-type"] }} , supports_credentials=True)

# Route to check if the server is running
@app.route('/')
def hello_world():
    return 'Hello, Flask!!!!'

# Running the Flask app
if __name__ == '__main__':
    app.run()
