let myMap = L.map('map-div', {
    center: [0,0],
    zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


const link = 'data/internet2020.geojson';

d3.json(link).then(data => {
  const quakes = data.features;
  const markers = L.markerClusterGroup();

  quakes.forEach(eq => {
    if (eq.geometry.coordinates) {
      markers.addLayer(L.marker([eq.geometry.coordinates[1], eq.geometry.coordinates[0]]))
        .bindPopup('Text');
    }
    myMap.addLayer(markers);
  });

});