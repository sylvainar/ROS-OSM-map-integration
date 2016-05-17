function mapInit() {
	// mapInit()
	// Load the map using the tiles from OpenStreetMap

	//===> Var init
	var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'; //Tiles service
	var attrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'; 

	//===> Map loading
	map = L.map('map').setView([startPoint['lat'], startPoint['lon']], 12);
	var osm = L.tileLayer(tileUrl, {
		minZoom: 10, 
		maxZoom: 19,
		attribution: attrib
	}); 
	osm.addTo(map);

	//===> Put marker on start and on end
	markerStart = L.marker([startPoint['lat'],startPoint['lon']]).addTo(map);
	markerStart.bindPopup("Start");  

	markerEnd = L.marker([endPoint['lat'],endPoint['lon']]).addTo(map);
	markerEnd.bindPopup("End");  

	return map;
}

function trackMarker(shape){
	// trackMarker(shape)
	// Giving data from the routing API, this function places a marker on every point of the polygon.
	// Not useful for implementation, just for display
	var coords = polylineDecode(shape,6);
	var i;

	for(i = 0; i < coords.length; i++)
	{
		console.log(coords[i][0],coords[i][1]);
		L.marker([coords[i][0],coords[i][1]]).addTo(map);
	}

}


function polylineDecode(str, precision) {
	// polylineDecode(str, precision)
	// When data arrives from the routing API, the polyline is encoded so it reduces the size of the export. 
	// We have to decode it before using it.
	// More info : https://developers.google.com/maps/documentation/utilities/polylinealgorithm#example
	// Did not develop this function myself :
	// Credits : https://github.com/mapbox/polyline/blob/master/src/polyline.js

	var index = 0,
	lat = 0,
	lng = 0,
	coordinates = [],
	shift = 0,
	result = 0,
	byte = null,
	latitude_change,
	longitude_change,
	factor = Math.pow(10, precision || 5);

	// Coordinates have variable length when encoded, so just keep
	// track of whether we've hit the end of the string. In each
	// loop iteration, a single coordinate is decoded.
	while (index < str.length) {

		// Reset shift, result, and byte
		byte = null;
		shift = 0;
		result = 0;

		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);

		latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

		shift = result = 0;

		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);

		longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

		lat += latitude_change;
		lng += longitude_change;

		coordinates.push([lat / factor, lng / factor]);
	}

	return coordinates;
}

function startRoad(startPoint, endPoint) {
	// startRoad(startPoint, endPoint)
	// Give this function the coordinates, it will make the API calls to calculate the routing, then decode it.

	var xhttp = new XMLHttpRequest();

	var APIrequest = 'http://valhalla.mapzen.com/route?json={"locations":'
						+'[{"lat":'+startPoint['lat']+',"lon":'+startPoint['lon']+'},'
						+'{"lat":'+endPoint['lat']+',"lon":'+endPoint['lon']+'}],'
						+'"costing":"pedestrian",'
						+'"directions_options":{"units":"miles"}}'
						+'&api_key=valhalla-RsYgicy';

	// NOTE : see all the option here : https://mapzen.com/documentation/turn-by-turn/api-reference/
	// The heading information can be set when we will deploy on the car

	console.log(APIrequest);

	// AJAX call to the API
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var jsonResponse = JSON.parse(xhttp.responseText);
			
			trackMarker(jsonResponse.trip.legs[0].shape);
		}
	};
	xhttp.open("GET", APIrequest, true);
	xhttp.send();
}