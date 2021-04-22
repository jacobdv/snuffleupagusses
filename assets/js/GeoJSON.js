// Creating GeoJSON data.
let citiesGeoJSON = [];
d3.csv('data/placeholder.csv').then(city => {
    city.forEach(c => {
        let cityObject = {
            'type':'Feature',
            'properties': {
                'name': c.name,
                'highSpeed': c.highSpeed
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [c.lat, c.lng]
            }
        };
        citiesGeoJSON.push(cityObject);
    })
    const outputGeoJSON = JSON.stringify(citiesGeoJSON);
});

