<!DOCTYPE html>
<html lang="fr">
	<head>
		<title>Autonomous Car</title>
		<!-- Leaflet -->
		<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
		<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>


		<!-- Leaflet Routing Machine -->
		<link rel="stylesheet" href="libs/LRM/leaflet-routing-machine.css" />
		<script src="libs/LRM/leaflet-routing-machine.js"></script>


	</head>

	<style>
        body {
            padding: 0;
            margin: 0;
        }
        html, body, #map {
            height: 100%;
            width: 100%;
        }
	</style>

	<body>
		<div id="map"></div>
	</body>

	<script>
	var map;
	var startPoint = {latitude : 39.47796855, longitude : -0.334134979212601};
	var endPoint = {latitude : 39.48283465, longitude : -0.343878495106637};
	var routeControl;

	function mapInit(user_location) {

		//===> Var init

		var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'; //Tiles service
		var attrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'; 


		//===> Map loading
		map = L.map('map').setView([startPoint['latitude'], startPoint['longitude']], 12);
		var osm = L.tileLayer(tileUrl, {
			minZoom: 10, 
			maxZoom: 19,
			attribution: attrib
		}); 
		osm.addTo(map);

		//===> Put marker on start and on end
		markerStart = L.marker([startPoint['latitude'],startPoint['longitude']]).addTo(map);
		markerStart.bindPopup("Start");  

		markerEnd = L.marker([endPoint['latitude'],endPoint['longitude']]).addTo(map);
		markerEnd.bindPopup("End");  

		return map;
	}



	mapInit();

	</script>

</html>