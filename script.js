// 1. Initialize the map
const map = L.map('map', {
  center: [20, 0],
  zoom: 2
});

// 2. Define base maps (like Google Maps styles)
const light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap + Carto'
});

const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenTopoMap contributors'
});

// 3. Country borders layer (GeoJSON)
const countryBorders = L.layerGroup();
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 1,
        fillColor: 'lightblue',
        fillOpacity: 0.4
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<b>${feature.properties.name}</b>`);
        layer.on('mouseover', () => layer.setStyle({ fillColor: 'orange' }));
        layer.on('mouseout', () => layer.setStyle({ fillColor: 'lightblue' }));
      }
    }).addTo(countryBorders);
  });

// 4. Metro overlays (Images)
const metroLayer = L.layerGroup();
const metros = [
  {
    name: 'Tokyo Metro',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Tokyo_Metro_Route_Map_en.png',
    bounds: [[35.6, 139.5], [35.8, 139.9]]
  },
  {
    name: 'London Underground',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/London_Underground_map_Hammond_2024.svg',
    bounds: [[51.28, -0.5], [51.7, 0.3]]
  },
  {
    name: 'Paris Metro',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Paris_Metro_map_2024.svg',
    bounds: [[48.8, 2.2], [48.9, 2.45]]
  },
  {
    name: 'New York Subway',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/NYC_Subway_Map_2023.svg',
    bounds: [[40.5, -74.3], [40.9, -73.7]]
  }
];

metros.forEach(m => {
  const overlay = L.imageOverlay(m.url, m.bounds, { opacity: 0.7 });
  overlay.addTo(metroLayer);
});

// 5. Layer Control
const baseMaps = {
  "Light": light,
  "Dark": dark,
  "Terrain": terrain
};

const overlayMaps = {
  "Country Borders": countryBorders,
  "Metro Maps": metroLayer
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
