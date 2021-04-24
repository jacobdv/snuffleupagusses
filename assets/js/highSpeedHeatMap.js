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
  HighSpeedAccess: new L.LayerGroup()
};
// Map
const myMap = L.map('map', {
  center: [39.8283, -98.5795],
  zoom: 4,
  layers: [
    layers.HighSpeedAccess
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
        citiesGeoJSON.features.push(cityObject);
    })
    console.log(citiesGeoJSON.features)
    for (let i = 0; i < citiesGeoJSON.features.length; i++) {
      let coords = citiesGeoJSON.features[i].geometry.coordinates;
      console.log(coords)
      const newCity = L.circle(coords, {
        fillOpacity: 0.75,
        color: 'black',
        weight: 0.5,
        fillColor: 'gold',
        radius: markerRadius(citiesGeoJSON.features[i].properties.highSpeed)
      });
      newCity.addTo(layers.HighSpeedAccess);
    };
});

// MongoDB Part
const link = 'f'; // MongoDB route name for endpoint.

d3.json(link).then(data => {
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
  });
});