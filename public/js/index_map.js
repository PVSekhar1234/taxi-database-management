var curr_lat,curr_long;

const successCallback = (position) => {
	curr_lat=position.coords.latitude;
	curr_long=position.coords.longitude;
	console.log(position.coords.latitude);
	console.log(position.coords.longitude);
	// console.log("queue",curr_long,curr_lat);
	
};

const errorCallback = (error) => {
	console.log(error);
};
var map;
var latlng;
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
function create_map(){
	// latlng = L.latLng(curr_lat, curr_long);
	map = L.map('map', {
		center: [curr_lat, curr_long],
		// center: [51.505, -0.09],
		zoom: 13,
		maxZoom: 15
		// minZoom: 3
	});
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	return map;
}
// console.log("hey")
// console.log("yoyo",curr_lat,curr_long);
var control;
function create_control(lo,la){
	control = L.Routing.control(L.extend({}, {
	waypoints: [
		L.latLng(la,lo),
		L.latLng(la,lo)
		// L.latLng(22.6792, 7 5.749)
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
	return control;

}
// var control = L.Routing.control(L.extend({}, {
// 	waypoints: [
// 		L.latLng(curr_lat,curr_long),
// 		L.latLng(22.6792, 75.749)
// 	],
// 	geocoder: L.Control.Geocoder.nominatim(),
// 	routeWhileDragging: true,
// 	reverseWaypoints: true,
// 	showAlternatives: true,
// 	altLineOptions: {
// 		styles: [
// 			{color: 'black', opacity: 0.15, weight: 9},
// 			{color: 'white', opacity: 0.8, weight: 6},
// 			{color: 'blue', opacity: 0.5, weight: 2}
// 		]
// 	}
// }))

setTimeout(function() { 
	navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
	map=create_map();
}, 3000);
setTimeout(function() { 
	console.log("queue",curr_long,curr_lat);
	control=create_control(curr_long,curr_lat);

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
