// Addding in Highcart stacked bar chart
d3.json('http://127.0.0.1:5000/api/states/').then((stateData) => {
    
    // Pull the data we need from out endpoint
    let states = stateData.map(d => d.state)
    let hsDiploma = stateData.map(d => d.PopulationWithHighSchoolDiploma)
    let associatesDegree = stateData.map(d => d.PopulationWithAssociatesDegree)
    let bachelorsDegree = stateData.map(d => d.PopulationWithBachelorsDegree)
    let hsInternet = stateData.map(d => d.PopulationWithHighSpeedInternet)
    let population = stateData.map(d => d.Population)
    
    
    Highcharts.chart('container2', {
        chart: {
            type: 'column'
        },

        title: {
            text: 'State Education Levels'
        },
        
        // Create x-Axis & y-Axis Labels
        xAxis: {
            categories: states
        },

        yAxis: {
            min: 0,
            max: 12000000,
            title: {
                text: 'Population'
            },
        },
        // Create the legend
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
            pointFormat: '{series.name}: {point.y}<br/>Total Educated: {point.stackTotal}<br/> {added.population}'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        
        // Add data to stacked columns
        series: [{
            name: "Bachelor's Degree",
            data: bachelorsDegree
        }, {
            name: "Associate's Degree",
            data: associatesDegree
        }, {
            name: "HS Diploma",
            data: hsDiploma
        }]
    });

});