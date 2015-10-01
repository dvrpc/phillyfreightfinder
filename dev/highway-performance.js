//$('head').append('<link rel="stylesheet" href="lib/assets/nouislider.min.css" type="text/css" />');
$.getScript('lib/assets/nouislider.min.js', buildSlider);

var hp_map, hp_metric = 'TTI', hp_time = '0', tg = 0, tileGroups=[]; 
//timing lookup to convert inputs
var hp_timing = {'0': '_0_5', '5': '_5_7','7': '_7_9','9': '_9_11','11': '_11_13', '13': '_13_15','15': '_15_17','17': '_17_19','19': '_19_24',};

var time_slider; 


function buildSlider(){
	//build the timing slider
	
	
	time_slider = document.getElementById('hp_timing_slider');

	noUiSlider.create(time_slider, {
		start: [0, 5],
		//step:2,
		connect: true,
		snap: true,
		behaviour: "tap",
		/*range: {
			'min': [0],
			'max': [24]
		}*/
		range: {
			'min': 0,
			'20%': 5,
			'28%': 7,
			'36%': 9,
			'44%': 11,
			'52%': 13,
			'60%': 15,
			'68%': 17,
			'76%': 19,
			'max': 24
		},
		pips: {
			mode: 'range',
			density: 4
		}
	});

	$('.noUi-value.noUi-value-horizontal.noUi-value-large').each(function(){
        var val = $(this).html();
        val = recountVal(parseInt(val));
        $(this).html(val);
    });

    function recountVal(val){
        switch(val){
            case 5:return '5 <span class="hp_tod">AM</span>';break;
            case 7:return '7 <span class="hp_tod">AM</span>';break;
            case 9:return '9 <span class="hp_tod">AM</span>';break;
            case 11:return '11 <span class="hp_tod">AM</span>';break;
            case 13:return '1 <span class="hp_tod">PM</span>';break;
            case 15:return '3 <span class="hp_tod">PM</span>';break;
            case 17:return '5 <span class="hp_tod">PM</span>';break;
            case 19:return '7 <span class="hp_tod">PM</span>';break;
            default :return '12 <span class="hp_tod">AM</span>';break;
        }
    }
	var prev_Low = 0, prev_High = 5;
	
	//custom slide events to handle time bin periods
	time_slider.noUiSlider.on('slide', function( values, handle ){
		var upper = parseInt(values[1]),
			lower = parseInt(values[0]);
		if(upper > prev_High || upper < prev_High){
			if(upper <= 5){
				time_slider.noUiSlider.set([0,5]);
				prev_High = 5;
				prev_Low = 0;
			}else if(upper > 5 && upper <= 19){
				var newValue = upper - 2;
				time_slider.noUiSlider.set([newValue,upper]);
				prev_High = upper;
				prev_Low = newValue;
			}else{
				time_slider.noUiSlider.set([19,24]);
				prev_High = 24;
				prev_Low = 19;
			}	
		}else if(lower < prev_Low || lower > prev_Low){
			if(lower < 5){
				time_slider.noUiSlider.set([0,5]);
				prev_High = 5;
				prev_Low = 0;
			}else if(lower >= 5 && lower < 19){
				var newValue = lower + 2;
				time_slider.noUiSlider.set([lower, newValue]);
				prev_High = newValue;
				prev_Low = lower;
			}else{
				time_slider.noUiSlider.set([19,24]);
				prev_High = 24;
				prev_Low = 19;
			}	
		}

	});

	time_slider.noUiSlider.on('change', function( values, handle ){
		rebuild_hp_layers();
		 //clearInterval(foo);
	});

}


// add event listener for timing change
		$(document.body).on('change', '#hp_timing_select input', rebuild_hp_layers);
		$(document.body).on('change', '#hp_select input', rebuild_hp_layers);

		 function rebuild_hp_layers(){
			var elem = $(this).attr('name');
			if(elem === 'hp_measure'){
				hp_metric = $(this).val();
				var elem_text = $(this).parent().text();
				$('#hp_metric').html(elem_text);
				$('.hp_legend_wrapper').toggleClass('hidden');
			}else{
				var time_vals = time_slider.noUiSlider.get();
				hp_time = parseInt(time_vals[0]).toFixed(0);
			}	
			var newTile = hp_metric + hp_timing[hp_time];

			tg = ((tg === 2) ? 0 : tg + 1);

			var newLayer = L.esri.tiledMapLayer({
			  url: 'http://arcgis.dvrpc.org/arcgis/rest/services/Freight/'+ newTile +'/MapServer',
			  maxZoom: 14
			});
			
			//add new tiles to current overlay group
			tileGroups[tg].clearLayers().addLayer(newLayer);

			//once tiles have loaded clear existing layer groups
			newLayer.on('load', function(){
				setTimeout(clearOldLayers, 500);
			});

			// loop through unqiue layer groups and clear layers
			function clearOldLayers(){
				for (i = 0; i < tileGroups.length; i++) { 
					if(i != tg){
						tileGroups[i].clearLayers();
					}
				}
			}

		}
		
		var foo;
		playing = function() {
		    foo = window.setInterval(function() {
		    	var currValues = time_slider.noUiSlider.get(),
		    		nextItem = parseInt(currValues[1]) + 2;
		    	if(nextItem <= 19){
		    	 	time_slider.noUiSlider.set([currValues[1], nextItem]);
		    	 	rebuild_hp_layers();
		    	}else if(nextItem > 19 && nextItem < 24){
		    		time_slider.noUiSlider.set([19, 24]);
		    		rebuild_hp_layers();
		    	}else{time_slider.noUiSlider.set([0, 5]);
		    		rebuild_hp_layers();}
		    }, 2000);
		}

		$(document.body).on('click', '.hp_play', function() {
			$(this).toggleClass('hp_play hp_pause').html('<i class="glyphicon glyphicon-pause"></i>&nbsp;&nbsp;Pause');
		    playing();
		});
		$(document.body).on('click', '.hp_pause', function() {
			$(this).toggleClass('hp_pause hp_play').html('<i class="glyphicon glyphicon-play"></i>&nbsp;&nbsp;Play');
		    clearInterval(foo);
		});
		$(document.body).on('mouseup', '.hp_filter .btn', function(){
            $(this).blur();
        });
        $(document.body).on('click', '#hp_prev', function(){
            var currValues = time_slider.noUiSlider.get(),
	    		nextItem = parseInt(currValues[0]) - 2;
	    	if(nextItem <= 19 && parseInt(currValues[0]) > 5){
	    	 	time_slider.noUiSlider.set([nextItem, currValues[0] ]);
	    	 	rebuild_hp_layers();
	    	}else if(parseInt(currValues[0]) === 0){
	    		time_slider.noUiSlider.set([19, 24]);
	    		rebuild_hp_layers();
	    	}else{time_slider.noUiSlider.set([0, 5]);
	    		rebuild_hp_layers();}

        });
        $(document.body).on('click', '#hp_next', function(){
            clearInterval(foo);
            var currValues = time_slider.noUiSlider.get(),
	    		nextItem = parseInt(currValues[1]) + 2;
	    	if(nextItem <= 19){
	    	 	time_slider.noUiSlider.set([currValues[1], nextItem]);
	    	 	rebuild_hp_layers();
	    	}else if(nextItem > 19 && nextItem < 24){
	    		time_slider.noUiSlider.set([19, 24]);
	    		rebuild_hp_layers();
	    	}else{time_slider.noUiSlider.set([0, 5]);
	    		rebuild_hp_layers();}

        });



$(function() {
	
	
	// load esri leaflet source and build map
	$.getScript('//cdn.jsdelivr.net/leaflet.esri/1.0.0/esri-leaflet.js', build_hp_map);
	


	function build_hp_map (){
		hp_map = L.map("hp-map-wrapper", {
		    minZoom: 9,
		    maxZoom: 14,
		   	zoomControl: false
		   
		}).setView([oLat, oLng], 10);
		// add esri gray basemap
		L.esri.basemapLayer('Gray').addTo(hp_map);
		// add DVRPC center region control
		hp_map.addControl(new L.Control.mapCenter());

		hp_map.attributionControl.addAttribution('<b>Performance Measures:</b> DVRPC analysis of NPMRDS truck prode data.');
		// define starting layer based on hash location
		var startLayer = L.esri.tiledMapLayer({
		  url: 'http://arcgis.dvrpc.org/arcgis/rest/services/Freight/'+ hp_metric + hp_timing[hp_time] +'/MapServer',
		  maxZoom: 14
		});
		
		// create three unique instances for layer loading (fix to layer clear delay)
		tileGroups = [L.layerGroup().addTo(hp_map), L.layerGroup().addTo(hp_map), L.layerGroup().addTo(hp_map)];
		tileGroups[tg].clearLayers().addLayer(startLayer);


		

	}

});
	
