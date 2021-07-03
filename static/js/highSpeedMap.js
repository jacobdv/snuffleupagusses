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
  MedianIncome: new L.LayerGroup(),
  AccessRate: new L.LayerGroup()
};
// Map
const myMap = L.map('map', {
  center: mapCenter,
  zoom: 4,
  layers: [
    layers.HighSpeedAccess,
    layers.MedianIncome,
    layers.AccessRate
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
  'High Speed Access': layers.HighSpeedAccess,
  'Median Income': layers.MedianIncome,
  'High Speed Internet Access Rate': layers.AccessRate
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
function hsiMarkerRadius(population) {
  return (Math.sqrt(population) * 100)
};

function hsiMarkerRadiusOneState(population) {
  return (Math.sqrt(population) * 50)
};

function hsiMarkerColor(population) {
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
      default : return ('#ffffff');
    }
};

// Function for MedianIncome marker radius.
function miMarkerRadius(medianIncome) {
  return (Math.sqrt(medianIncome) * 150)
};

function miMarkerRadiusOneState(medianIncome) {
  return (Math.sqrt(medianIncome) * 75)
};

function miMarkerColor(medianIncome) {
    switch (true) {
      case medianIncome > 100000 : return ('#7f0000');
      case medianIncome > 90000 : return ('#b30000');
      case medianIncome > 80000 : return ('#d7301f');
      case medianIncome > 70000 : return ('#ef6548');
      case medianIncome > 60000 : return ('#fc8d59');
      case medianIncome > 50000 : return ('#fdbb84');
      case medianIncome > 40000 : return ('#fdd49e');
      case medianIncome > 30000 : return ('#fee8c8');
      case medianIncome > 20000 : return ('#fff7ec');
      default : return ('#ffffff');
    }
};

// Function for AccessRate marker radius.
function arMarkerRadius(accessRate) {
  return (accessRate * 45000)
};

function arMarkerRadiusOneState(accessRate) {
  return (accessRate * 22500)
};

function arMarkerColor(accessRate) {
    switch (true) {
      case accessRate > 100000 : return ('#3f007d');
      case accessRate > 90000 : return ('#54278f');
      case accessRate > 80000 : return ('#6a51a3');
      case accessRate > 70000 : return ('#807dba');
      case accessRate > 60000 : return ('#9e9ac8');
      case accessRate > 50000 : return ('#bcbddc');
      case accessRate > 40000 : return ('#dadaeb');
      case accessRate > 30000 : return ('#efedf5');
      case accessRate > 20000 : return ('#fcfbfd');
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
    myMap.setView(new L.LatLng(coords[0],coords[1]), 6, {
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


    //////////////////////////


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
                      'medianIncome': c.MedianIncome,
                      'population': c.Population,
                      'accessRate': (c.PopulationWithHighSpeedInternet / c.Population)
                  },
                  'geometry': {
                      'type': 'Point',
                      'coordinates': [c.Latitude, c.Longitude]
                  }
                }; // usCityObject end bracket.

                const hsiNewCity = L.circle(usCityObject.geometry.coordinates, {
                  fillOpacity: 0.75,
                  color: 'black',
                  weight: 0.5,
                  fillColor: hsiMarkerColor(usCityObject.properties.highSpeed),
                  radius: hsiMarkerRadius(usCityObject.properties.highSpeed)
                });
                hsiNewCity.addTo(layers.HighSpeedAccess);
                hsiNewCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: ${usCityObject.properties.highSpeed}`);

                const miNewCity = L.circle(usCityObject.geometry.coordinates, {
                  fillOpacity: 0.75,
                  color: 'black',
                  weight: 0.5,
                  fillColor: miMarkerColor(usCityObject.properties.medianIncome),
                  radius: miMarkerRadius(usCityObject.properties.population)
                });
                miNewCity.addTo(layers.MedianIncome);
                miNewCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: $${(usCityObject.properties.medianIncome).toFixed(2)}`);

                if (usCityObject.properties.accessRate < 1) {
                  const arNewCity = L.circle(usCityObject.geometry.coordinates, {
                  fillOpacity: 0.75,
                  color: 'black',
                  weight: 0.5,
                  fillColor: arMarkerColor(usCityObject.properties.medianIncome),
                  radius: arMarkerRadius(usCityObject.properties.accessRate)
                });
                arNewCity.addTo(layers.AccessRate);
                arNewCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: ${((usCityObject.properties.accessRate).toFixed(2)) * 100}%`);
              }
              }
            })
          });
        });
      myMap.addLayer(layers.AccessRate);
      myMap.removeLayer(layers.HighSpeedAccess);
      myMap.removeLayer(layers.MedianIncome);

      //////////////////////


    d3.select('#mapDataset').on('change', function() {
      let selection = mapDropdown.property('value');
      clearMap(layers.HighSpeedAccess);
      clearMap(layers.MedianIncome);
      clearMap(layers.AccessRate);

      if (selection !== 'all-states') {
        d3.json(`http://127.0.0.1:5000/api/cities/${selection}/`).then(data => {
          citiesData = data;
          citiesData.forEach(c => {
            let cityObject = {
                'type':'Feature',
                'properties': {
                    'name': c.City,
                    'highSpeed': c.PopulationWithHighSpeedInternet,
                    'medianIncome': c.MedianIncome,
                    'population': c.Population,
                    'accessRate': (c.PopulationWithHighSpeedInternet / c.Population)
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [c.Latitude, c.Longitude]
                }
            }; // usCityObject end bracket.

            const hsiNewCity = L.circle(cityObject.geometry.coordinates, {
              fillOpacity: 0.75,
              color: 'black',
              weight: 0.5,
              fillColor: hsiMarkerColor(cityObject.properties.highSpeed),
              radius: hsiMarkerRadiusOneState(cityObject.properties.highSpeed)
            });
            hsiNewCity.addTo(layers.HighSpeedAccess);
            hsiNewCity.bindPopup(`<strong>${cityObject.properties.name}</strong>: ${cityObject.properties.highSpeed}`);

            const miNewCity = L.circle(cityObject.geometry.coordinates, {
              fillOpacity: 0.75,
              color: 'black',
              weight: 0.5,
              fillColor: miMarkerColor(cityObject.properties.medianIncome),
              radius: miMarkerRadiusOneState(cityObject.properties.population)
            });
            miNewCity.addTo(layers.MedianIncome);
            miNewCity.bindPopup(`<strong>${cityObject.properties.name}</strong>: $${(cityObject.properties.medianIncome).toFixed(2)}`);

            if (cityObject.properties.accessRate < 1) {
              const arNewCity = L.circle(cityObject.geometry.coordinates, {
              fillOpacity: 0.75,
              color: 'black',
              weight: 0.5,
              fillColor: arMarkerColor(cityObject.properties.medianIncome),
              radius: arMarkerRadiusOneState(cityObject.properties.accessRate)
            });
            arNewCity.addTo(layers.AccessRate);
            arNewCity.bindPopup(`<strong>${cityObject.properties.name}</strong>: ${((cityObject.properties.accessRate).toFixed(2)) * 100}%`);
          }
        })
      });
      getCoords(selection, myMap);
      myMap.addLayer(layers.AccessRate);
      myMap.removeLayer(layers.HighSpeedAccess);
      myMap.removeLayer(layers.MedianIncome);
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
                      'medianIncome': c.MedianIncome,
                      'population': c.Population,
                      'accessRate': (c.PopulationWithHighSpeedInternet / c.Population)
                  },
                  'geometry': {
                      'type': 'Point',
                      'coordinates': [c.Latitude, c.Longitude]
                  }
                }; // usCityObject end bracket.
                const hsiNewBigCity = L.circle(usCityObject.geometry.coordinates, {
                  fillOpacity: 0.75,
                  color: 'black',
                  weight: 0.5,
                  fillColor: hsiMarkerColor(usCityObject.properties.highSpeed),
                  radius: hsiMarkerRadius(usCityObject.properties.highSpeed)
                });
                hsiNewBigCity.addTo(layers.HighSpeedAccess);
                hsiNewBigCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: ${usCityObject.properties.highSpeed}`);

                const miNewBigCity = L.circle(usCityObject.geometry.coordinates, {
                  fillOpacity: 0.75,
                  color: 'black',
                  weight: 0.5,
                  fillColor: miMarkerColor(usCityObject.properties.medianIncome),
                  radius: miMarkerRadius(usCityObject.properties.population)
                });
                miNewBigCity.addTo(layers.MedianIncome);
                miNewBigCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: $${(usCityObject.properties.medianIncome.toFixed(2))}`);

                if (usCityObject.properties.accessRate < 1) {
                  const arNewBigCity = L.circle(usCityObject.geometry.coordinates, {
                  fillOpacity: 0.75,
                  color: 'black',
                  weight: 0.5,
                  fillColor: arMarkerColor(usCityObject.properties.medianIncome),
                  radius: arMarkerRadius(usCityObject.properties.accessRate)
                });
                arNewBigCity.addTo(layers.AccessRate);
                arNewBigCity.bindPopup(`<strong>${usCityObject.properties.name}</strong>: ${((usCityObject.properties.accessRate).toFixed(2)) * 100}%`);
              }
              }
            })
          });
        });
        myMap.setView(new L.LatLng(39.8283, -98.5795), 4);
        myMap.addLayer(layers.AccessRate);
        myMap.removeLayer(layers.HighSpeedAccess);
        myMap.removeLayer(layers.MedianIncome);
      }
    });
  });