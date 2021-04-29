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
  // HighSpeedAccess: new L.LayerGroup(),
  MedianIncome: new L.LayerGroup()
};
// Map
const myMap = L.map('map', {
  center: mapCenter,
  zoom: 4,
  layers: [
    // layers.HighSpeedAccess,
    layers.MedianIncome
  ],
  scrollWheelZoom: false
});

// Adding dark map and creating maps and overlays labels for control panel.
darkmap.addTo(myMap);
const maps = {
  'Light': lightmap,
  'Dark': darkmap
};
let overlays = {
  // 'High Speed Access': layers.HighSpeedAccess,
  'Median Income': layers.MedianIncome
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
const usCitiesGeoJSON = {
  'type': 'FeatureCollection',
  'features': []
};

// Function for HighSpeedInternet marker radius.
// function hsiMarkerRadius(population) {
//   return (Math.sqrt(population) * 100)
// };

// function hsiMarkerColor(population) {
//     switch (true) {
//       case population > 1000000 : return ('#084081');
//       case population > 750000 : return ('#0868ac');
//       case population > 500000 : return ('#2b8cbe');
//       case population > 250000 : return ('#4eb3d3');
//       case population > 100000 : return ('#7bccc4');
//       case population > 75000 : return ('#a8ddb5');
//       case population > 50000 : return ('#ccebc5');
//       case population > 25000 : return ('#e0f3db');
//       case population > 10000 : return ('#f7fcf0');
//       default : return ('#ffffff');
//     }
// };

// Function for MedianIncome marker radius.
function miMarkerRadius(medianIncome) {
  return (Math.sqrt(medianIncome) * 100)
};

function miMarkerColor(medianIncome) {
    switch (true) {
      case medianIncome > 1000000 : return ('#00441b');
      case medianIncome > 750000 : return ('#006d2c');
      case medianIncome > 500000 : return ('#238b45');
      case medianIncome > 250000 : return ('#41ae76');
      case medianIncome > 100000 : return ('#66c2a4');
      case medianIncome > 75000 : return ('#99d8c9');
      case medianIncome > 50000 : return ('#ccece6');
      case medianIncome > 25000 : return ('#e5f5f9');
      case medianIncome > 10000 : return ('#f7fcfd');
      default : return ('#ffffff');
    }
};

function clearMap(layer) {
  layer.clearLayers();
};

function getCoords(state) {
  d3.json(`https://www.mapquestapi.com/geocoding/v1/address?key=${mapQuestKey}&inFormat=kvp&outFormat=json&location=${state}%2C+US&thumbMaps=false`).then(mapQuestData => {
    let coords = [];
    if (mapQuestData.results[0].locations[0].adminArea1 === 'US') {
      coords = [mapQuestData.results[0].locations[0].latLng.lat,mapQuestData.results[0].locations[0].latLng.lng]
    } else if (mapQuestData.results[0].locations[1].adminArea1 === 'US') {
      coords = [mapQuestData.results[0].locations[1].latLng.lat,mapQuestData.results[0].locations[1].latLng.lng]
    };
    myMap.setView(new L.LatLng(coords[0],coords[1]), 5, {
      animate: true, duration: 1.5
    })
  });
}


Promise.all([d3.json(cityLink), d3.json(stateLink)]).then(([citiesData, statesData]) => {
    // Adding dropdown content.
    let mapDropdown = d3.select('#mapDataset');
    statesData.forEach(state => {
      mapDropdown.append('option').text(state.state).attr('value',state.state);
    });



    d3.select('#mapDataset').on('change', function() {
      let selection = mapDropdown.property('value');
      // clearMap(layers.HighSpeedAccess);
      clearMap(layers.MedianIncome);

      if (selection !== 'all-states') {
        d3.json(`http://127.0.0.1:5000/api/cities/${selection}/`).then(data => {
          citiesData = data;
          citiesData.forEach(c => {
            let cityObject = {
                'type':'Feature',
                'properties': {
                    'name': c.City,
                    'highSpeed': c.PopulationWithHighSpeedInternet,
                    'medianIncome': c.MedianIncome
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [c.Latitude, c.Longitude]
                }
            }; // usCityObject end bracket.

            // const hsiNewCity = L.circle(cityObject.geometry.coordinates, {
            //   fillOpacity: 0.75,
            //   color: 'black',
            //   weight: 0.5,
            //   fillColor: hsiMarkerColor(cityObject.properties.highSpeed),
            //   radius: hsiMarkerRadius(cityObject.properties.highSpeed)
            // });
            // hsiNewCity.addTo(layers.HighSpeedAccess);
            // hsiNewCity.bindPopup(`<strong>${cityObject.properties.name}</strong>: ${cityObject.properties.highSpeed}`);

            const miNewCity = L.circle(cityObject.geometry.coordinates, {
              fillOpacity: 0.75,
              color: 'black',
              weight: 0.5,
              fillColor: miMarkerColor(cityObject.properties.medianIncome),
              radius: miMarkerRadius(cityObject.properties.medianIncome)
            });
            miNewCity.addTo(layers.MedianIncome);
            miNewCity.bindPopup(`<strong>${cityObject.properties.name}</strong>: ${cityObject.properties.medianIncome}`);
        })
      });
      getCoords(selection, myMap);
      } else {
        const filteredUSCities = [];
        // Filtering state data.
        statesData.forEach(state => {
          d3.json(`http://127.0.0.1:5000/api/cities/${state.state}/`).then(state => {
            state.forEach(c => {
              if (c.Population > 5000) {
                let usCityObject = {
                  'type':'Feature',
                  'properties': {
                      'name': c.City,
                      'highSpeed': c.PopulationWithHighSpeedInternet,
                      'medianIncome': c.MedianIncome
                  },
                  'geometry': {
                      'type': 'Point',
                      'coordinates': [c.Latitude, c.Longitude]
                  }
                }; // usCityObject end bracket.
                // const hsiNewBigCity = L.circle(usCityObject.geometry.coordinates, {
                //   fillOpacity: 0.75,
                //   color: 'black',
                //   weight: 0.5,
                //   fillColor: hsiMarkerColor(usCityObject.properties.highSpeed),
                //   radius: hsiMarkerRadius(usCityObject.properties.highSpeed)
                // });
                // hsiNewBigCity.addTo(layers.HighSpeedAccess);
                // hsiNewBigCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: ${usCityObject.properties.highSpeed}`);

                const miNewBigCity = L.circle(usCityObject.geometry.coordinates, {
                  fillOpacity: 0.75,
                  color: 'black',
                  weight: 0.5,
                  fillColor: miMarkerColor(usCityObject.properties.medianIncome),
                  radius: miMarkerRadius(usCityObject.properties.medianIncome)
                });
                miNewBigCity.addTo(layers.MedianIncome);
                miNewBigCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: ${usCityObject.properties.medianIncome}`);
              }
            })
          });
        });
        myMap.setView(new L.LatLng(39.8283, -98.5795), 4);
      }
    });
  });