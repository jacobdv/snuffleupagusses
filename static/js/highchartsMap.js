// Addding in Highcart stacked bar chart
<<<<<<< HEAD
d3.json('http://127.0.0.1:5000/api/states/').then((stateData) => {
    
    // Wrap the highcharts code in a then function after using d3.json to call in the data from your endpoint
    // Use map functions to pull out states for the x axis, and pull the three variables out into the series for the stacked bars themselves.
    
    // Pull the list of states out of the data
    let states = stateData.map(d => d.state)
    let hsDiploma = stateData.map(d => d.PopulationWithHighSchoolDiploma)
    let associatesDegree = stateData.map(d => d.PopulationWithAssociatesDegree)
    let bachelorsDegree = stateData.map(d => d.PopulationWithBachelorsDegree)
    let hsInternet = stateData.map(d => d.PopulationWithHighSpeedInternet)
    
        console.log(stateData)
        console.log(states)
        console.log(hsDiploma)
        console.log(associatesDegree)
        console.log(bachelorsDegree)
        console.log(hsInternet)
    

   
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },

=======
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
>>>>>>> faf3e0c33136cb299a4d3a3f8b5e29997c5bbe0d
        title: {
            text: 'Education Levels vs. Access to Highspeed Internet'
        },
        
        // Create x-Axis Labels
        // replace the array in the xAxis object for categories with the states from our data
        xAxis: {
            labels: [states]
        },

        yAxis: {
            min: 0,
            title: {
                text: 'Population'
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
<<<<<<< HEAD
        },
        // Pull out an array of values for each of the three datapoints.
        // Name key will hold the degree level, and the data will hold the array of values for each of the three.

        series: [{
            name: "Bachelor's Degree",
            data: [bachelorsDegree]
        }, {
            name: "Associate's Degree",
            data: [associatesDegree]
        }, {
            name: "HS Diploma",
            data: [hsDiploma]
        }]
    });

});
=======
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
>>>>>>> faf3e0c33136cb299a4d3a3f8b5e29997c5bbe0d
