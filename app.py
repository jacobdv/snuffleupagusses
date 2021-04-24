from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_pymongo import PyMongo
#from flask_cors import CORS
# import database.py
from census import Census
import pprint

# Create an instance of Flask
app = Flask(__name__)


# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/census_data")


# Route to render index.html template using data from Mongo
@app.route("/")
def index():

    # make the census api call
    # format/grab the pieces of data needed from API call
    # insert_one/insert_many  function to save into the the database
    api_key='b4a5423a01bb0dc199f64d970316aed06f81fae2'
    c = Census(api_key, year=2019)
    # variables = ("NAME", "B19013_001E", "B01003_001E", "B15003_017E", "B15003_021E","B15003_022E")
    # Run Census Search to retrieve data on all zip codes (2013 ACS5 Census)
    # See: https://github.com/datamade/census for library documentation
    # See: https://gist.github.com/afhaque/60558290d6efd892351c4b64e5c01e9b for labels
    census_data = c.acs5.get(("B19013_001E", "B01003_001E", "B15003_017E", "B15003_021E","B15003_022E"), {'for': 'zip code tabulation area:*'})

    pprint.PrettyPrinter(width=41, compact=True).pprint(census_data)

    for i in range(len(census_data)):
        income = {
            'value': census_data[i]['B19013_001E']
        }

        mongo.db.heatmap.insert_one(income)


    return



@app.route('/test')
def test():
    pass





@app.route('/heatmap')
def heatmap():
# Retrieve collection (SQL equivelant of a table) - find function

    data = mongo.db.census_data.find()
    print(data)

    return



if __name__ == "__main__":
        app.run(debug=True)