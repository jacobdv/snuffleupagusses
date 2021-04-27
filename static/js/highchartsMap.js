d3.json('http://127.0.0.1:5000/api/states/').then((stateData) => {
    const geoJSON = {
        'type': 'FeatureCollection',
        'features': []
    }; 
    stateData.forEach(state => {
        d3.json(`https://www.mapquestapi.com/geocoding/v1/address?key=${mapQuestKey}&inFormat=kvp&outFormat=json&location=${state.state}%2C+US&thumbMaps=false`).then(mapQuestData => {
            let coords = [];
            if (mapQuestData.results[0].locations[0].adminArea1 === 'US') {
                coords = [mapQuestData.results[0].locations[0].latLng.lat,mapQuestData.results[0].locations[0].latLng.lng]
            } else if (mapQuestData.results[0].locations[1].adminArea1 === 'US') {
                coords = [mapQuestData.results[0].locations[1].latLng.lat,mapQuestData.results[0].locations[1].latLng.lng]
            };
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
            geoJSON.features.push(stateObject)
        })
    });
    console.log(geoJSON)
});
