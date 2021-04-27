function stateLatLong(stateAbbr) {
    switch(stateAbbr) {
        case stateAbbr = 'AL': return [0,1];
        default : return [10,10];
    };
        
}

d3.json('http://127.0.0.1:5000/api/states/').then(stateData => {
    console.log(stateData)
    const geoJSON = {
        'type': 'FeatureCollection',
        'features': []
      };;
    stateData.forEach(s => {
        let stateGeoJson = {
            'type':'Feature',
            'properties': {
                'name': s.state,
                'highSpeed': s.PopulationWithHighSpeedInternet
            },
            'geometry': {
                'type': 'Point',
                'coordinates': stateLatLong(s.state)
            }
        };
        geoJSON.features.push(stateGeoJson);
        console.log(stateGeoJson.geometry.coordinates)
    });
    console.log(geoJSON)
    // const dataAsGeoJSON;
    // const data = [], mapData = Highcharts.geojson(dataAsGeoJSON);
})