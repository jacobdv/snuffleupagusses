// Pulls in state data from our created API.
d3.json('http://127.0.0.1:5000/api/states/').then((stateData) => {
    // Initializes geoJSON object to append state data to.
    const geoJSON = {
        'type': 'FeatureCollection',
        'features': []
    }; 
    // Iterates through each state.
    stateData.forEach(state => {
        // Accesses MapQuest API data to include state lat/lng in the geoJSON object.
        // THIS REQUIRES A MAPQUEST API KEY CALLED 'mapQuestKey' IN YOUR CONFIG FILE. <<<<<<<<<<<<<< (https://developer.mapquest.com/)
        d3.json(`https://www.mapquestapi.com/geocoding/v1/address?key=${mapQuestKey}&inFormat=kvp&outFormat=json&location=${state.state}%2C+US&thumbMaps=false`).then(mapQuestData => {
            // Sets coords to a state's lat/lng.
            let coords = [];
            // Somehow this query was returning 3 values from France.
            // The if statement checks country before pulling lat/lng.
            if (mapQuestData.results[0].locations[0].adminArea1 === 'US') {
                coords = [mapQuestData.results[0].locations[0].latLng.lat,mapQuestData.results[0].locations[0].latLng.lng]
            } else if (mapQuestData.results[0].locations[1].adminArea1 === 'US') {
                coords = [mapQuestData.results[0].locations[1].latLng.lat,mapQuestData.results[0].locations[1].latLng.lng]
            };
            // Creates an geoJSON object for the iterated state.
            let stateObject = {
                'type':'Feature',
                'properties': {
                    'name': state.state,
                    'highSpeed': state.PopulationWithHighSpeedInternet
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': coords
                }
            }
            // Appends the features key of the geoJSON object with each state as a feature.
            geoJSON.features.push(stateObject)
        })
    });
        
    // ALL BELOW HERE IS HIGHCHARTS EXPERIMENTING. <<<<<<<<<<<<<< (https://www.highcharts.com/docs/getting-started/installation)
    // NOTHING WORKING YET.
    
    const data = [], mapData = Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small']);
    Highcharts.data(geoJSON);

    Highcharts.mapChart('container', {
        title: {
            text:'High Speed Internet Access (%)'
        },
        mapNavigation: {
            enabled: true,
            enableButtons: true
        },
        xAxis: {
            labels: {
                enabled: false
            }
        },
        colorAxis: {
            labels: {
                format: '{value}%'
            }
        },
        series: [{
            mapData: mapData,
            data: data, 
            joinBy: 'ucName',
            name: 'Population with Access to Internet Download Speed 25 Mb/s',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.point.properties['hc-a2'];
                },
                style: {
                    fontSize: '10px'
                }
            },
            tooltip: {
                valueSuffix: '%'
            }
        }, {
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small'], 'mapline'),
            color: 'silver'
        }]
    })

});

// Addding in Highcart stacked bar chart
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Education Levels vs. Access to Highspeed Internet'
    },
    // Import in States Data
    xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Total fruit consumption'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            }
        }
    },
    legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2]
    }, {
        name: 'Jane',
        data: [2, 2, 3, 2, 1]
    }, {
        name: 'Joe',
        data: [3, 4, 4, 2, 5]
    }]
});