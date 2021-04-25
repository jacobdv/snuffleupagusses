# Import dependencies
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_pymongo import PyMongo
from census import Census

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/Census_Data")

# Route to render index.html template using data from Mongo
@app.route("/")
def index():

    # Find one record of data from the mongo database
    Census_Data = mongo.db.collection.find_one()

    # Return template and data
    return render_template("index.html", data=Census_Data)

if __name__ == "__main__":
    app.run(debug=True)