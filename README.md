# Snuffleupagusses

## Instructions to Run Snuffleupagusses API Flask App
- Clone repo to local computer
- Create a config.js file in static/js
- Get a MapBox Token and save in config.js as API_KEY :https://account.mapbox.com/
- Get a MapQuest api key and save in config.js as mapQuestKey: https://developer.mapquest.com/
- Create a conda environment using the requirements.txt file provided in the repo.
- Open jupyter notebook and run the CSV_to_MongoDB.ipynb file to load Mongo database on local computer
- Run app.py file in terminal

## Project Summary

### Snuffleupagusses Team Members
- Elizabeth Sanchez
- Jacob de Vries
- Pete Johnson
- Mathew Miller

### Project Summary
Our goal was to use FCC data on internet speed to explore the relationship between high-speed internet access and community measures such as median income, population, average age, education level, etc.
We planned multiple interactive visualizations to explore the relationship between high-speed internet access and these community measures.
We decided to use the Census API to pull in data on median income, population and education level.

### Data Sources
We used FCC data to get information on high speed internet access and geographical information(city, lat, lon).
We pulled in our demographic information from the Census API.
Originally we planned on pulling Census data by city name and state but ran into some difficulties and had to use zipcode. So we pulled in zipcode data from simplemaps.com to match up our demographic data with our internet and geographical data.

- Latitude / Longitude Data (https://opendata.fcc.gov/Wireline/Geography-Lookup-Table/v5vt-e7vw)
- Internet Speed Data (https://opendata.fcc.gov/Wireline/Area-Table-June-2020-V1/ktav-pdj7)
- Community Measures  (Census API)
- Zipcode Data (https://simplemaps.com/data/us-zips)

### Visualizations
Initially we planned on creating a heatmap, an interactive map with layers and an interactive scatter plot. After working with data and experimenting with different visualizations we ended up with the three listed below.

- Interactive Bubble Map of the US showing access to high speed internet and median income by state.
- Interactive Scatter Plot showing high speed internet access vs income and education level by state.
- Interactive Stacked Column Chart displaying different education levels by state.  (Internet Speed on y, other variables on x) (Dropdown for state)
