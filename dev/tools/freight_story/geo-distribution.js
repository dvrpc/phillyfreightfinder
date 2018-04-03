var freightMap = {
    activeMode : 'none',

	colorStops : [
		[1, '#EDF1F7'],
		[2, '#4790FF'],
		[3, '#2375EF'],
	    [4, '#2A4EAB'],
	    [5, '#312867']
    ],

	fqStops : [
		[0.8, '#EDF1F7'],
		[1.7, '#4790FF'],
		[2.85, '#2375EF'],
	    [4.4, '#2A4EAB'],
        [7.45, '#312867']
    ],

	stylesheet : {
	   "version": 8,
	   "sources": {
	       "counties": {
	           "type": "vector",
	           "url": "https://a.michaelruane.com/data/dvrpc-municipal.json"
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
        $('#distribution-map').css('height', BUBBLE_PARAMETERS.height);
			// lets build the map
		var map = new mapboxgl.Map({
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
		for (i = 0; i < this.overlays.length; i++) {
		    if(this.overlays[i] == mode){
		      	map.setPaintProperty(mode +'-fill', 'fill-opacity', 0.65);
		      	map.setPaintProperty(mode +'-half-fill', 'fill-opacity', 0.45);
		      	
		    }else{ 
		    	map.setPaintProperty(this.overlays[i] +'-fill', 'fill-opacity', 0);
		      	map.setPaintProperty(this.overlays[i] +'-half-fill', 'fill-opacity', 0);
		    }
		}
	}
}

mapboxgl.accessToken = 'pk.eyJ1IjoibXJ1YW5lIiwiYSI6ImNpZ3dnaGF1bjBzNGZ3N201bTQwN3h6YngifQ.pw1khldm3UDHd56okxc5bQ';

var map = freightMap.makeIt();

map.on('load', function(){
    // Add a new source from our GeoJSON data 
    map.addSource("hex", {
        type: "geojson",
        data: 'data/d3/dvrpc_fq_hex_score.geojson'
    });

    map.addLayer({
        "id": "employment-half-fill",
        "type": "fill",
        "source": "hex",
        'paint': {
            "fill-opacity": 0,
            'fill-color': {
                property: 'score_emp',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            "<",
            "score_emp",
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
                property: 'score_emp',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            ">",
            "score_emp",
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
                property: 'score_est',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            "<",
            "score_est",
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
                property: 'score_est',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            ">",
            "score_est",
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
                property: 'score_lu',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            "<",
            "score_lu",
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
                property: 'score_lu',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            ">",
            "score_lu",
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
                property: 'score_ind',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            "<",
            "score_ind",
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
                property: 'score_ind',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            ">",
            "score_ind",
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
                property: 'score_fac',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            "<",
            "score_fac",
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
                property: 'score_fac',
                stops: freightMap.colorStops
            },
        },
        'filter': 
                    [
            ">",
            "score_fac",
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
                property: 'fq',
                stops: freightMap.fqStops
            },
        },
        'filter': 
                    [
            "<=",
            "fq",
            2.85
        ],
    });

    map.addLayer({
        "id": "fq-fill",
        "type": "fill",
        "source": "hex",
        'paint': {
            "fill-opacity": 0,
            'fill-color': {
                property: 'fq',
                stops: freightMap.fqStops
            },
        },
        'filter': 
                    [
            ">",
            "fq",
            2.85
        ],
    });

    (map_mode !== 'none') ?  freightMap.repaint(map_mode) : '';
    map_exists = true;

});