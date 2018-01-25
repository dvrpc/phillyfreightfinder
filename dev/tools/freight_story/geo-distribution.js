
var freightMap = {

	colorStops : [
		[1, '#eff3ff'],
		[2, '#bdd7e7'],
		[3, '#6baed6'],
	    [4, '#3182bd'],
	    [5, '#08519c']
	    ],

	stylesheet : {
	  "version": 8,
	  "sources": {
	    "counties": {
	      "type": "vector",
	      "url": "http://a.michaelruane.com/dvrpc_boundaries.json"
	    }
	  },
	  "layers": [
	    {"id": "county-fill",
	      "type": "fill",
	      "source": "counties",
	      "source-layer": "county",
	      "layout": {},
	      "paint": {
	          "fill-color": "#c9c9c9",
	          "fill-opacity": 1
	      },
	      "filter": [
	                "==",
	                "DVRPC_REG",
	                "Yes"
	            ],
	    },
	    {
	        "id": "municipality-outline",
	        "type": "line",
	        "source": "counties",
	        "source-layer": "municipalities",
	        "paint": {
	            'line-width': 0.5,
	            'line-color': '#fff'
	        }
	    },
	    {
	        "id": "county-outline",
	        "type": "line",
	        "source": "counties",
	        "source-layer": "county",
	        "paint": {
	            'line-width': 2.5,
	            'line-color': '#fff'
	        },
	        "filter": [
	                "==",
	                "DVRPC_REG",
	                "Yes"
	            ]
	    }
	  ]
	},

	makeIt: function(){
			// lets build the map
		var map= new mapboxgl.Map({
		    container: 'distribution-map', // container id
		    style: this.stylesheet,
		    center: [-75.2273, 40.071],
		    zoom: 8.82, // starting zoom
		    hash: false,
		    scrollZoom: false,
		    boxZoom: false,
		    dragRotate: false,
		    dragPan: false,
		    keyboard: false,
		    doubleClickZoom: false,
		    touchZoomRotate: false

		});

		//make sure it all fits
		map.fitBounds([
			[-76.09405517578125, 39.49211914385648], [-74.32525634765625,40.614734298694216]
		]);
		return map;
	}
	
}

mapboxgl.accessToken = 'pk.eyJ1IjoibXJ1YW5lIiwiYSI6ImNpZ3dnaGF1bjBzNGZ3N201bTQwN3h6YngifQ.pw1khldm3UDHd56okxc5bQ';

var map = freightMap.makeIt();


	//request to award data for 2017
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'data/dvrpc_hex_score.geojson', true);
// // xhr.responseType = 'arraybuffer';
// xhr.onload = function() {
//     if (xhr.status === 200) {
//         // var data = geobuf.decode(new Pbf(xhr.response));
//         var data = xhr.responseText;

//         map.on('load', function(){
//             // Add a new source from our GeoJSON data 
//             map.addSource("hex", {
//                 type: "geojson",
//                 data: JSON.parse(data)
//             });

//             // Create layer from source
//             map.addLayer({
//                 "id": "employment-fill",
//                 "type": "fill",
//                 "source": "hex",
//                 'paint': {
//                     // "fill-color": "#fff",
//                     "fill-opacity": 0.7,
//                     'fill-color': {
//                       property: 'fq_results_score_emp',
//                       stops: colorStops
//                     },
//                 },
//                 'filter': 
//                           [
//                     ">",
//                     "fq_results_score_emp",
//                     0
//                 ],
//             });

//             // Create layer from source
//             map.addLayer({
//                 "id": "establishment-fill",
//                 "type": "fill",
//                 "source": "hex",
//                 'paint': {
//                     // "fill-color": "#fff",
//                     "fill-opacity": 0,
//                     'fill-color': {
//                       property: 'fq_results_score_est',
//                       stops: colorStops
//                     },
//                 },
//                 'filter': 
//                           [
//                     ">",
//                     "fq_results_score_est",
//                     0
//                 ],
//             });

//             // Create layer from source
//             map.addLayer({
//                 "id": "facility-fill",
//                 "type": "fill",
//                 "source": "hex",
//                 'paint': {
//                     // "fill-color": "#fff",
//                     "fill-opacity": 0,
//                     'fill-color': {
//                       property: 'fq_results_score_fac',
//                       stops: colorStops
//                     },
//                 },
//                 'filter': 
//                           [
//                     ">",
//                     "fq_results_score_fac",
//                     0
//                 ],
//             });

//             // Create layer from source
//             map.addLayer({
//                 "id": "landuse-fill",
//                 "type": "fill",
//                 "source": "hex",
//                 'paint': {
//                     // "fill-color": "#fff",
//                     "fill-opacity": 0,
//                     'fill-color': {
//                       property: 'fq_results_score_lu',
//                       stops: colorStops
//                     },
//                 },
//                 'filter': 
//                           [
//                     ">",
//                     "fq_results_score_lu",
//                     0
//                 ],
//             });

//             // Create layer from source
//             map.addLayer({
//                 "id": "industrial-fill",
//                 "type": "fill",
//                 "source": "hex",
//                 'paint': {
//                     // "fill-color": "#fff",
//                     "fill-opacity": 0,
//                     'fill-color': {
//                       property: 'fq_results_score_ind',
//                       stops: colorStops
//                     },
//                 },
//                 'filter': 
//                           [
//                     ">",
//                     "fq_results_score_ind",
//                     0
//                 ],
//             });

//         });
//     }
//     else {
//         alert('Request failed.  Returned status of ' + xhr.status);
//     }
// };
// xhr.send();
