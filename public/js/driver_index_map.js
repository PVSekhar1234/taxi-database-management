

var map = L.map('map');
// var curr_lat,curr_long;
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const successCallback = (position) => {
	// curr_lat=position.coords.latitude;
	// curr_long=position.coords.longitude;
	console.log(position.coords.latitude);
	console.log(position.coords.longitude);
	// console.log("queue",curr_long,curr_lat);
	
};

const errorCallback = (error) => {
	console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

// console.log("hey")
// console.log("yoyo",curr_lat,curr_long);
// const assign_curr= ()=>{
// 	console.log("asd",curr_lat,curr_long)
// 	return L.latLng(curr_lat, curr_long)
// }

// var control = L.Routing.control(L.extend(window.lrmConfig, {
var control = L.Routing.control(L.extend({}, {
	waypoints: [
		// assign_curr(),
		L.latLng(22.74, 75.94),
		L.latLng(22.74, 75.94)  // for driver with current location
	],
	geocoder: L.Control.Geocoder.nominatim(),
	routeWhileDragging: true,
	reverseWaypoints: true,
	showAlternatives: true,
	altLineOptions: {
		styles: [
		{color: 'black', opacity: 0.15, weight: 9},
		{color: 'white', opacity: 0.8, weight: 6},
		{color: 'blue', opacity: 0.5, weight: 2}
	]
	}
}))

setTimeout(function() { 
	control.addTo(map)
	L.Routing.errorControl(control).addTo(map);
	// console.log("queue",curr_long,curr_lat);
}, 3000);

setTimeout(function() { 
	map.removeControl(control);
	// console.log("queue2",curr_long,curr_lat);
}, 5000);

setTimeout(function() { 
	control.addTo(map)
	// console.log("queue3",curr_long,curr_lat);
}, 6000);
