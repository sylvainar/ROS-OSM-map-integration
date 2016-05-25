
// ============================= FUNCTIONS

// ===> mapInit() : init the map
function mapInit() {
	// mapInit()
	// Load the map using the tiles from OpenStreetMap

	//===> Var init
	var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'; //Tiles service
	var attrib = 'Map data © OpenStreetMap contributors'; 

	//===> Map loading
	map = L.map('map');
	var osm = L.tileLayer(tileUrl, {
		minZoom: 10, 
		maxZoom: 19,
		attribution: attrib
	}); 
	osm.addTo(map);

	L.easyButton('glyphicon-road', function(btn, map){
		swal({
			title: "Where do you want to go ?",
			text: "After closing this popup, click on the place you want to go.",
			type: "info",
			confirmButtonText: "Got it!",
			showCancelButton: true,
			closeOnConfirm: true,
			showLoaderOnConfirm: true,
			allowOutsideClick: false,
			},
			function(isConfirm){
				if (isConfirm) selectionMode = true;
				else selectionMode = false;
			});
	}).addTo(map);

	markerFinish.addTo(map).setOpacity(0)

	return map;
}

// ============================= SCRIPT

//===> Global variables
var map;
var selectionMode;
var bounds;
var currentPosition = {latitude : 0, longitude : 0};
var startPoint;
var endPoint;
var markerPosition = L.marker([39,0]);
var markerFinish = L.marker([0,0]);
var zoomLevel = 16;
var routeControl;
var loadedMap = false;
var i = 0;

//===> ROS connexion
var ros = new ROSLIB.Ros({
	url : 'ws://localhost:9090'
});

swal({
	title: "Connecting to ROS...",
	showConfirmButton: false,
	closeOnConfirm: false,
	showLoaderOnConfirm: true,
	allowOutsideClick: false,
	allowEscapeKey: false
});

ros.on('connection', function() {
	console.log('Connected to websocket server.');
	swal({
		title: "Waiting...",
		text: "The navigation module can't work without the GPS. Launch the GPS and the module will start automatically.",
		type: "info",
		confirmButtonText: "Ok",
		closeOnConfirm: false,
		showLoaderOnConfirm: true,
		allowOutsideClick: false,
		allowEscapeKey: false
		},
		function(){
			setTimeout(function(){}, 2000);
	});
});

ros.on('error', function(error) {
	console.log('Error connecting to websocket server: ', error);
	swal({
		title: "Error connecting the ROS server",
		text: "Unable to reach ROS server. Is rosbridge launched ?",
		type: "error",
		confirmButtonText: "Retry",
		closeOnConfirm: false,
		allowOutsideClick: false,
		allowEscapeKey: false
		},
		function(){
			window.location.reload();
	});
});

ros.on('close', function() {
	console.log("Connexion closed.");
	swal({
		title: "Error connecting the ROS server",
		text: "Unable to reach ROS server. Is rosbridge launched ?",
		type: "error",
		confirmButtonText: "Retry",
		closeOnConfirm: false,
		allowOutsideClick: false,
		allowEscapeKey: false
		},
		function(){
			window.location.reload();
	});
});


//===> Init the parameters from ROS Params
var paramStartLat = new ROSLIB.Param({
	ros : ros,
	name : '/routing_machine/start/latitude'
});
var paramStartLon = new ROSLIB.Param({
	ros : ros,
	name : '/routing_machine/start/longitude'
});
var paramEndLat = new ROSLIB.Param({
	ros : ros,
	name : '/routing_machine/destination/latitude'
});
var paramEndLon = new ROSLIB.Param({
	ros : ros,
	name : '/routing_machine/destination/longitude'
});
var paramEndGoTo = new ROSLIB.Param({
	ros : ros,
	name : '/routing_machine/destination/goTo'
});

paramStartLat.set(0);
paramStartLon.set(0);	
paramEndLat.set(0);
paramEndLon.set(0);
paramEndGoTo.set(false);

//===> Set the GPS listener, that will move the marker while the car is moving
var listenerGPS = new ROSLIB.Topic({
	ros : ros,
	name : '/gps',
	messageType : 'sensor_msgs/NavSatFix'
});


//===> Init the map and the click listener

mapInit();

map.on('click', function(e) {
	//When a click on the map is detected
	if(selectionMode == true)
	{
		selectionMode = false;
		//First, get the coordinates of the point clicked
		var lat = e.latlng.lat;
		var lon = e.latlng.lng;
		//Place a marker
		markerFinish.setLatLng([lat,lon]);
		markerFinish.setOpacity(1);
		setTimeout(function() {
			swal({
				title: "Is this correct ?",
				text: "Confirm the position to start the navigation.",
				type: "info",
				confirmButtonText: "Yes, let's go !",
				showCancelButton: true,
				closeOnConfirm: true,
				allowOutsideClick: false,
				},
				function(isConfirm){
					if (isConfirm)
					{
						//Logging stuff in the console
						console.log('Routing Start !');
						console.log('Start set to : '+ currentPosition.latitude + ' ' + currentPosition.longitude);
						console.log('Destination set to : '+lat + ' ' + lon);
						//Set all the parameters to the destination
						paramStartLat.set(currentPosition.latitude);
						paramStartLon.set(currentPosition.longitude);
						paramEndLat.set(lat);
						paramEndLon.set(lon);
						paramEndGoTo.set(true);// goTo is set to true, that means that their is a new destination to consider.
					}
					else
					{
						markerFinish.setOpacity(0);
					}
			})}, 1000);
	}
});


//===> Set the callback function when a message from /gps is received

listenerGPS.subscribe(function(message) {
	// We have to wait for the GPS before showing the map, because we don't know where we are
	if(loadedMap == false) 
	{
		swal.close();
		// Center the map on the car's position
		map.setView([message.latitude, message.longitude], zoomLevel);
		// Add the marker on the map
		markerPosition.addTo(map);
		// Set the flag to true, so we don't have to load the map again
		loadedMap = true;
	}

	// Refresh the global variable with the position
	currentPosition.latitude = message.latitude;
	currentPosition.longitude = message.longitude;

	if(i%20 == 0) // No need to move the marker everytime
	{
		// Refresh the position of the marker on the map
		markerPosition.setLatLng([message.latitude, message.longitude]);
		// If the marker has went out of the map, we move the map
		bounds = map.getBounds();
		if(!bounds.contains([message.latitude, message.longitude]))
			map.setView([message.latitude, message.longitude], zoomLevel);
	}
	
	i++;
});
