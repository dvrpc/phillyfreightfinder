
var freightMap = {

	colorStops : [
		[1, '#EDF1F7'],
		[2, '#4790FF'],
		[3, '#2375EF'],
	    [4, '#2A4EAB'],
	    [5, '#312867']
    ],

  //   fqStops : [
		// [0.7, '#EDF1F7'],
		// [1.7, '#75A6EF'],
		// [2.95, '#4790FF'],
	 //    [4.5, '#2375EF'],
	 //    [7.55, '#396AB2']
  //   ],

	fqStops : [
		[0.7, '#EDF1F7'],
		[1.7, '#4790FF'],
		[2.95, '#2375EF'],
	    [4.5, '#2A4EAB'],
	    [7.55, '#312867']
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

	overlays: ['employment','establishment','industrial', 'landuse', 'facilities', 'fq'],

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
	},
	
	repaint: function(mode){
		// console.log(mode);
		
			for (i = 0; i < this.overlays.length; i++) {
			    if(this.overlays[i] == mode){
			    	console.log(mode)
			      	map.setPaintProperty(mode +'-fill', 'fill-opacity', 0.65);
			      	map.setPaintProperty(mode +'-half-fill', 'fill-opacity', 0.45);
			      	
			    }else{ 
			    	map.setPaintProperty(this.overlays[i] +'-fill', 'fill-opacity', 0);
			      	map.setPaintProperty(this.overlays[i] +'-half-fill', 'fill-opacity', 0);
			    }
			    // if(mode == 'fq'){
			    // 	map.setPaintProperty(this.overlays[i] +'-fill', 'fill-opacity', 0.65);
			    //   	map.setPaintProperty(this.overlays[i] +'-half-fill', 'fill-opacity', 0.45);
			    // }else{
			    // 	map.setPaintProperty('fq-fill', 'fill-opacity', 0);
			    //   	map.setPaintProperty('fq-half-fill', 'fill-opacity', 0);
			    // }
			}
		
		
	}
}

mapboxgl.accessToken = 'pk.eyJ1IjoibXJ1YW5lIiwiYSI6ImNpZ3dnaGF1bjBzNGZ3N201bTQwN3h6YngifQ.pw1khldm3UDHd56okxc5bQ';

var map = freightMap.makeIt();

map_exists = true;

	//request to award data for 2017
var xhr = new XMLHttpRequest();
xhr.open('GET', 'data/d3/dvrpc_fq_hex_score.geojson', true);
xhr.onload = function() {
    if (xhr.status === 200) {
        // var data = geobuf.decode(new Pbf(xhr.response));
        var data = xhr.responseText;

        map.on('load', function(){
            // Add a new source from our GeoJSON data 
            map.addSource("hex", {
                type: "geojson",
                data: JSON.parse(data)
            });

            map.addLayer({
                "id": "employment-half-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_emp',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    "<",
                    "fq_results_score_emp",
                    3
                ],
            });

            map.addLayer({
                "id": "employment-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_emp',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    ">",
                    "fq_results_score_emp",
                    2
                ],
            });

            map.addLayer({
                "id": "establishment-half-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_est',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    "<",
                    "fq_results_score_est",
                    3
                ],
            });

            map.addLayer({
                "id": "establishment-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_est',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    ">",
                    "fq_results_score_est",
                    2
                ],
            });

            map.addLayer({
                "id": "facility-half-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_fac',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    "<",
                    "fq_results_score_fac",
                    3
                ],
            });

            map.addLayer({
                "id": "facility-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_fac',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    ">",
                    "fq_results_score_fac",
                    2
                ],
            });

            map.addLayer({
                "id": "landuse-half-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_lu',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    "<",
                    "fq_results_score_lu",
                    3
                ],
            });

            map.addLayer({
                "id": "landuse-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_lu',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    ">",
                    "fq_results_score_lu",
                    2
                ],
            });

            map.addLayer({
                "id": "industrial-half-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_ind',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    "<",
                    "fq_results_score_ind",
                    3
                ],
            });

            map.addLayer({
                "id": "industrial-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_ind',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    ">",
                    "fq_results_score_ind",
                    2
                ],
            });

            // Create layer from source
            map.addLayer({
                "id": "facilities-half-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_fac',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    "<",
                    "fq_results_score_fac",
                    3
                ],
            });

			map.addLayer({
                "id": "facilities-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_score_fac',
                      stops: freightMap.colorStops
                    },
                },
                'filter': 
                          [
                    ">",
                    "fq_results_score_fac",
                    2
                ],
            });
            // Create layer from source
            map.addLayer({
                "id": "fq-half-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_fq',
                      stops: freightMap.fqStops
                    },
                },
                'filter': 
                          [
                    "<=",
                    "fq_results_fq",
                    1.7
                ],
            });

            map.addLayer({
                "id": "fq-fill",
                "type": "fill",
                "source": "hex",
                'paint': {
                    "fill-opacity": 0,
                    'fill-color': {
                      property: 'fq_results_fq',
                      stops: freightMap.fqStops
                    },
                },
                'filter': 
                          [
                    ">=",
                    "fq_results_fq",
                    2.95
                ],
            });

        });
    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();