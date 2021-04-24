// Setting up light and dark map layers.
// Light
const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});
// Dark
const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});
// Layers
const layers = {
  HighSpeedAccess: new L.LayerGroup(),
  MedianIncome: new L.LayerGroup()
};
// Map
const myMap = L.map('map', {
  center: [39.8283, -98.5795],
  zoom: 4,
  layers: [
    layers.HighSpeedAccess
    // layers.MedianIncome
  ]
});

// Adding dark map and creating maps and overlays labels for control panel.
darkmap.addTo(myMap);
const maps = {
  'Light': lightmap,
  'Dark': darkmap
};
const overlays = {
  'High Speed Access': layers.HighSpeedAccess
  // 'Median Income': layers.MedianIncome
};

L.control.layers(maps, overlays).addTo(myMap);
const info = L.control({
  position: 'topright'
});
info.onAdd = function() {
  const div = L.DomUtil.create('div','legend');
  return div;
};
info.addTo(myMap);

// Creating GeoJSON data.
const citiesGeoJSON = {
  'type': 'FeatureCollection',
  'features': []
};

// Function for marker radius.
function markerRadius(population) {
  return (Math.sqrt(population) * 100)
};

function markerColor(population) {
  console.log(population)
  switch (true) {
    case population > 1000000 : return ('#084081');
    case population > 750000 : return ('#0868ac');
    case population > 500000 : return ('#2b8cbe');
    case population > 250000 : return ('#4eb3d3');
    case population > 100000 : return ('#7bccc4');
    case population > 75000 : return ('#a8ddb5');
    case population > 50000 : return ('#ccebc5');
    case population > 25000 : return ('#e0f3db');
    case population > 10000 : return ('#f7fcf0');
    // Default would indicate an above ground earthquake.
    default : return ('#000000');
}
};

d3.csv('data/internet_census_combined.csv').then(city => {
    city.forEach(c => {
        let cityObject = {
            'type':'Feature',
            'properties': {
                'name': c.City,
                'highSpeed': c.Latitude
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [c.Latitude, c.Longitude]
            }
        };
        citiesGeoJSON.features.push(cityObject);
    })
    console.log(citiesGeoJSON.features)
    for (let i = 0; i < citiesGeoJSON.features.length; i++) {
      // City information.
      let city = citiesGeoJSON.features[i];
      let coords = city.geometry.coordinates;
      let popWithAccess = city.properties.highSpeed;
      // New city marker.
      const newCity = L.circle(coords, {
        fillOpacity: 0.75,
        color: 'black',
        weight: 0.5,
        fillColor: markerColor(popWithAccess),
        radius: markerRadius(popWithAccess)
      });
      // City addition to map and binding popup with name and population.
      newCity.addTo(layers.HighSpeedAccess);
      newCity.bindPopup(`<strong>${city.properties.name}</strong>: ${popWithAccess}`);
    };
});

// // MongoDB Part
// const link = 'f'; // MongoDB route name for endpoint.

// d3.json(link).then(data => {
//   city.forEach(c => {
//     let cityObject = {
//         'type':'Feature',
//         'properties': {
//             'name': c.name,
//             'highSpeed': c.highSpeed
//         },
//         'geometry': {
//             'type': 'Point',
//             'coordinates': [c.lat, c.lng]
//         }
//     };
//   });
// });