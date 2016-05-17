<!DOCTYPE html>
<html lang="fr">
	<head>
		<title>Autonomous Car</title>
		<!-- Leaflet -->
		<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
		<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

		<!-- Scripts -->
		<script src="scripts.js"></script>

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
	//===> Global variables
	var map;
	var startPoint = {lat : 39.47796855, lon : -0.334134979212601};
	var endPoint = {lat : 39.48283465, lon : -0.343878495106637};
	var routeControl;

	//===> Program start (refer to scripts.js)
	mapInit();
	startRoad(startPoint,endPoint);

	</script>

</html>

