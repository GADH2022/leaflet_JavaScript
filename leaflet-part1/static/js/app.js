var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/

    // Once we get a response, send the data.features object to the createFeatures function.
    
d3.json(queryUrl).then(function(data){
    createFeatures(data.features);

});
function createFeatures(earthquakeData){
    function onEachFeature(feature,layer){
        layer.bindPopup(`<h3>${ feature.properties.place}
                        </h3><hr><p>${new Date(feature.properties.time)}
                        </p><p>Magnitude:${feature.properties.mag}</p>
                        <p>Number of felt Reports:${feature.properties.felt}</p>`);
    }
    function getColor(magnitude){
        if(magnitude > 5){
            return '#FF4500';   
        }
        else if(magnitude > 4){
            return '#FF7F50';
        }
        else if(magnitude > 3){
            return '#FFD700';
        }
        else if (magnitude > 2){
            return '#FFE4B5';
        
        }
        else if (magnitude >1){
            return '#ADFF2F';

        }
        else {
            return '#32CD32';
        }
    }
// Creating a GeoJson layer containing features array on 
// earthquake object
var earthquakes=L.geoJson(earthquakeData,{
    pointToLayer:function(feature,latlng){
        return L.circleMarker(latlng,{
            radius:feature.properties.mag*4,
            fillOpacity:1,
            weight:1,
            color:"black",
            fillColor:getColor(feature.properties.mag)
        }) 
    },
    onEachFeature:onEachFeature
});
createMap(earthquakes);
}
function createMap(earthquakes){
    var streetmap= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

  //  var lightmap=L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  //      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  //    });
// create basemaps object
var baseMaps={
    "street Map":streetmap,
 //   "Topographic Map":lightmap

};    

// hold our overlay layer
var overlayMaps={
    Earthquakes: earthquakes
};
//creating our map
var myMap=L.map("map-id",{
    center:[37.09,-95.71],
    zoom:5,
    layers:[streetmap,earthquakes]

});
// create a layer control and add it to the map
L.control.layers(baseMaps, overlayMaps,{
   collapsed:false
}).addTo(myMap);

// an object legend
    var legend = L.control({
      position: "bottomright"
    });
  
    // details for the legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [                    
                      '#32CD32',
                      '#ADFF2F', 
                      '#FFE4B5',
                      '#FFD700',
                      '#FF7F50',
                      '#FF4500',
                       
      ];
      // Looping through
      for (var i = 0; i < grades.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
          "<i style='background: " + colors[i] + "; float: left; width: 18px; height: 18px;'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Finally, we add our legend to the map.
    legend.addTo(myMap);

};



