# Import dependencies.
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from census import Census

# Additional tools for API routes.
import json
from bson import json_util
from bson.json_util import dumps

# Create an instance of Flask.
app = Flask(__name__)
CORS(app)

# Connections to both collections in MongoDB.
app.config["DEBUG"] = True
app.config["MONGO_URI"] = "mongodb://localhost:27017/Census_Data"
mongo = PyMongo(app)
citiesCollection = mongo.db.Cities
statesCollection = mongo.db.States

# Home route that displays index.html content.
@app.route("/")
def index():
    return render_template("index.html")

# API endpoint for api.html content.
@app.route("/api")
def apihome():
    return render_template("api.html")

# API endpoint for cities in an individual state, defaulting to Oregon.
@app.route("/api/cities/", defaults={'state': 'OR'})
@app.route("/api/cities/<state>/", methods=['GET', 'POST'])
def cityData(state):
    stateCitiesList = dumps(citiesCollection.find({'State': state}, {'_id': 0}))
    return stateCitiesList

# API endpoint for states' aggregated data.
@app.route("/api/states/", methods=['GET'])
def stateData():
    # Creates a list from the collection and uses json_util to return this result.
    statesList = list(statesCollection.find())
    return json.dumps(statesList, default = json_util.default)

# Do the thing. (:
if __name__ == "__main__":
    app.run(debug=True)
