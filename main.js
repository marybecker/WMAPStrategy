// initialize the map
var lat= 41.55;
var lng= -72.65;
var zoom= 9;

//Load a tile layer base map from USGS ESRI tile server https://viewer.nationalmap.gov/help/HowTo.htm
var hydro = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}',{
    attribution: 'USGS The National Map: National Hydrography Dataset. Data refreshed March, 2020.',
    maxZoom:16}),
    topo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',{
        attribution: 'USGS The National Map: National Boundaries Dataset, 3DEP Elevation Program, Geographic Names Information System, National Hydrography Dataset, National Land Cover Database, National Structures Dataset, and National Transportation Dataset; USGS Global Ecosystems; U.S. Census Bureau TIGER/Line data; USFS Road Data; Natural Earth Data; U.S. Department of State Humanitarian Information Unit; and NOAA National Centers for Environmental Information, U.S. Coastal Relief Model. Data refreshed May, 2020.USGS The National Map: National Topography Dataset. Data refreshed March, 2020.',
        maxZoom:16
    });
    Thunderforest_Landscape = L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e4e0f2bcb8a749f4a9b355b5fca1d913', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
});

var baseMaps = {
    "Hydro": hydro,
    "Topo": topo,
    "Landscape": Thunderforest_Landscape
  };

var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    layers:[hydro]
});

map.setView([lat, lng], zoom);
map.createPane('top');
map.getPane('top').style.zIndex=650;
map.createPane('middle');
map.getPane('middle').style.zIndex=600;

L.control.attribution({position: 'bottomleft'}).addTo(map);

L.control.zoom({
     position:'topright'
}).addTo(map);


var customOptions =
    {
        'maxWidth': '500',
        'className' : 'custom'
    };

var ctsites = "bio_sites_1987_2020.geojson"

// load GeoJSON from an external file and display circle markers
$.getJSON(ctsites,function(data){
    console.log(data);
  var marker = L.geoJson(data, {
    pointToLayer: function(feature,latlng){
      var markerStyle = getStyle(feature.properties.trendS)
      return L.circleMarker(latlng, markerStyle);
    },
    onEachFeature: function (feature,marker) {
      marker.bindPopup(
        '<b>Station: </b>' + feature.properties.locationNa+'</br>' +
          "<b>SID: </b>" + feature.properties.staSeq+'</br>' +
          "<b>Bug Cnt: </b>" + feature.properties.bugs+'</br>' +
          "<b>Fish Cnt: </b>" + feature.properties.fish+'</br>' +
          "<b>Diatom Cnt: </b>" + feature.properties.diatom+'</br>' +
          "<b>POR: </b>" + feature.properties.minYr+ "-" + feature.properties.maxYr + '</br>' +
          "<b>RMN: </b>" + feature.properties.rmn+'</br>' +
          "<b>EJ: </b>" + feature.properties.ej+'</br>' +
          "<b>Temperature: </b>" + feature.properties.temperatur+'</br>' +
          "<b>USGS WQ: </b>" + feature.properties.wqusgs+'</br>' +
          "<b>USGS SF: </b>" + feature.properties.sfusgs+'</br>',
          customOptions);
    }
    }).addTo(map);
  });

// load GeoJSON of CT Boundary
var linestyle = {
    "color": "black",
    "weight": 2,
};

  $.getJSON("CT_state_boundary.geojson",function(linedata){
      console.log(linedata);
      L.geoJson(linedata,{
          style:linestyle
      }).addTo(map);
  });

  $.getJSON("https://services1.arcgis.com/FjPcSmEFuDYlIdKC/arcgis/rest/services/Environmental_Justice_Set_2023/FeatureServer/1/query?outFields=*&where=1%3D1&f=geojson", function(ejmuni){
    console.log(ejmuni);
    var ejm = L.geoJson(ejmuni,{
        style:{
        fillColor: '#800026',
        weight: 2,
        opacity: 0.8,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
        }
    }).addTo(map)
  })

  $.getJSON("https://services1.arcgis.com/FjPcSmEFuDYlIdKC/arcgis/rest/services/Environmental_Justice_Set_2023/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson", function(ejblocks){
    console.log(ejblocks);
    var ejb = L.geoJson(ejblocks,{
        style:{
        fillColor: '#800026',
        weight: 2,
        opacity: 0.8,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
        }
    }).addTo(map)
  })


//add legend
var legend = L.control({position: 'topleft'});

    // Function that runs when legend is added to map
    legend.onAdd = function (map) {
      
      // Create Div Element and Populate it with HTML
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<i class="circle" style="background: #FDB515"></i><p> Proposed Bio Trend Site </p><br>';
      div.innerHTML += '<i class="circle" style="background: #2ea1cb"></i><p> Bio Monitoring Site </p><br>';
      div.innerHTML += '<i class="square" style="background: #800026"></i><p> Environmental Justice Area </p><br>';

      // Return the Legend div containing the HTML content
      return div;
    };

    // Add Legend to Map
    legend.addTo(map);

    L.control.layers(baseMaps).addTo(map);

    function getStyle (trend){
        if (trend == "Y"){
            return {fillColor:'#FDB515',
                radius: 7,
                color: "#0D2D6C",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
                pane: 'top'
            };
        } else {
            return {fillColor:'#2ea1cb',
                radius: 5,
                color: "#0D2D6C",
                weight: 2,
                opacity: 0.2,
                fillOpacity: 0.2,
                pane: 'middle'
            };
        }
    }
    