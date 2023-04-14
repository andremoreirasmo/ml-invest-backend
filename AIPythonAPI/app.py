from flask import Flask
from .blueprints import api_ai

app = Flask(__name__)

api_ai.init_app(app)
