# Import dependencies
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from census import Census

# Create an instance of Flask
app = Flask(__name__)
CORS(app)

# Use PyMongo to establish Mongo connection
app.config["DEBUG"] = True

app.config["MONGO_URI"] = "mongodb://localhost:27017/Census_Data"
mongo = PyMongo(app)
servicerequests = mongo.db.Data

# Route to render index.html template using data from Mongo
@app.route("/")
def index():

    # Return template and data
    return render_template("index.html")


@app.route("/api/v1/data", methods=['GET'])
def serveData():
    return jsonify(list(servicerequests.find({ },
   { '_id': 0})))

if __name__ == "__main__":
    app.run(debug=True)