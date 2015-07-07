(function() {

	'use strict';

	// load data
	d3.csv('data/d3/commRegions_v2.csv', function(regionLookup) {
		d3.csv('data/d3/totalFlowsBEA.csv', function(regionData) {
			d3.csv('data/d3/commodities.csv', function(CoData) {
				var packer = sm.packer();
	
				var currDir = 'in',
					measure = 'ton',
					mode = 'all',
					currMetro = 42017,
					county = 'bucks';
				
				// put circles on map (standard radius)
				var svg = d3.select('#content').append('svg')
						.attr('width', 960)
						.attr('height', 500);
				
				var states = svg.append('g')
						.attr('width', 960)
						.attr('height', 500)
						.attr('id', 'states');
							
				svg.append('g')
					.attr('width', 960)
					.attr('height', 500)
					.attr('id', 'metros');
				
				svg.append('g')
					.attr('width', 960)
					.attr('height', 500)
					.attr('id', 'temp');
				
				// draw state outlines
				var path = d3.geo.path();
				d3.json("data/d3/us_states_shapes.json", function(json) {
					states.selectAll("path")
						.data(json.features)
						.enter().append("path")
						.attr("d", path);
				});
							
				// generate list of all metros (both primary and related)	
				var metrosPrimary = [],
					metrosRelated = [];
					
				for (var i = 0; i < regionData.length; i++) {
					metrosPrimary.push(parseInt(regionData[i].region_id));
					metrosRelated.push(parseInt(regionData[i].rel_region_id));
				}

				// remove duplicates
				metrosPrimary = sortedAndDeDuped(metrosPrimary);
				metrosRelated = sortedAndDeDuped(metrosRelated);
				
				var metrosCombined = sortedAndDeDuped(metrosPrimary.concat(metrosRelated));
				
				// add metro circles to the map
				addCirclesToMap(metrosCombined, 3);
				
				// mark primary metros and make them bigger
				/*for (var i = 0; i < metrosPrimary.length; i++) {
					d3.select('#metro_' + metrosPrimary[i])
						.classed('related', false)
						.classed('primary', true)
						.on('click', function(e) {
							d3.selectAll('#temp text').remove();
							currMetro = parseInt(d3.select(this).attr('id').split('metro_').join(''));
							sizeMetros(currMetro, currDir);
						})
						.select('circle').attr('r', 5);
				}*/
				
				d3.selectAll('#metros .metro')
					.on('mouseover', function(e) {
						if (!packer.animating) {
							d3.select(this).style("stroke", "#E57B32").style("stroke-width", 3);
						}
					})
					.on('mouseout', function(e) {
						d3.select(this).style("stroke", "none").style("stroke-width", 0);
					
					
					});
				
				
				sizeMetros(currMetro, currDir);

				

				//***********************************************
				// commodity data prep
				loadCommodities(county, measure, currDir, mode);

				//***********************************************
				function loadCommodities(c, m, d, mo){
					var cty = c, meas = m, cdir = d, cmode = mo, matchComm = [], sortFunction;
					for(var i = 0; i < CoData.length; i++){
						var comm = CoData[i];

						if(comm.dir === cdir && comm.region === cty && comm.typ === meas){
							matchComm.push(comm);
						}
					}
					var sortedComms = sortCommodities(matchComm, meas);
					console.log(sortedComms);
						
				}

				function sortCommodities(c, meas){
					if(meas === 'ton'){c.sort(function(a,b){return b.ton - a.ton});
						}else{c.sort(function(a,b){return b.value - a.value});}
					return c
				}

		
				// **********************************************

				$('input[name="dir"]').change(function() {
					currDir = $(this).val();
					sizeMetros(currMetro, currDir);
				});


				$('input[name="county"]').change(function() {
					d3.selectAll('#temp text').remove();
					currMetro = parseInt($(this).val());
					sizeMetros(currMetro, currDir);
				});

				$('input[name="measure"]').change(function() {
					measure = $(this).val();
					sizeMetros(currMetro, currDir, 'measure');
				});
				$('input[name="mode"]').change(function() {
					mode = $(this).val();
					sizeMetros(currMetro, currDir, 'mode');
				});

				$("#controls .radio label").click(function() {
					$("#controls .radio label").removeClass("sel");
					$(this).addClass("sel");
				});
				
				var dirDescriptions = {
					in: 'Based on the number of inbound home searches <br/>to a metro area by out-of-towners',
					out: 'Based on the number of outbound home <br/>searches from a metro by locals'
				}
				
				$('#controls .radio label').hover(function() {
					var dir = $(this).attr('for').split('dir_').join(''),
						msg = dirDescriptions[dir],
						pos = $(this).position();
					
					pos.top += 32;
					
					//updateToolTip(msg, pos);
				}, function() {
					$('#dir_tooltip').hide();
				});
				
				function updateToolTip(msg, pos) {
					$('#dir_tooltip .text').html(msg);
					$('#dir_tooltip').css('left', pos.left).css('top', pos.top);
					$('#dir_tooltip').show();
					
				}
				
				
		
				// **********************************************
				
				function sortNumber(a, b) {
					return a - b;
				}
				
				// **********************************************
				
				function sortedAndDeDuped(a) {
				
					a = a.sort(sortNumber);
				
					var trimmed = [];
					for (var i = 0; i < a.length; i++) {
						if (a[i] !== a[i - 1]) {
							trimmed.push(a[i]);
						}
					}
					return trimmed;
				}
			
				// **********************************************
				
				function getMetro(id) {
								
					var result = null;
					
					for (var i = 0; i < regionLookup.length; i++) {
						var metro = regionLookup[i];
						if (parseInt(metro.id) === parseInt(id)) {
							result = metro;
						}
					}
					return result;
				}
			
				
				// **********************************************
				
				function addCirclesToMap(a, r) {
				
					var pixelLoc = d3.geo.albersUsa();
			
					for (var i = 0; i < a.length; i++) {
						var metro = getMetro(a[i]);
						
						if (metro) {
							var xy = pixelLoc([metro.lon, metro.lat]);
							
							var element = d3.select('#metros').append('g')
								.attr('transform', 'translate(' + Math.round(xy[0]) + ',' + Math.round(xy[1]) + ')')
								.attr('r', r)
								.attr('id', 'metro_' + metro.id)
								.attr('class', 'metro related');
							
							element.append('circle')
								.attr('r', r);
							
							var useName = metro.id;
							
							if (metro.state === 'DC') {
								useName = metro.familiar_name + ', ' + metro.state;	
							}
							
							/*var t = element.append('text')
								.attr('y', 3)
								.text(useName);
								//.text(metro.familiar_name); // + ', ' + metro.state);
								*/
							//element.attr('r', t.node().getBBox().width);

						}
					}
					
				}
				//**********************************************
				 function buttonsActive(){
					$('.flowBtn').attr('disabled', false);
				}
				
				// **********************************************
				
				function sizeMetros(metroId, dir, source) {
					$('.flowBtn').attr('disabled', true);
					setTimeout(buttonsActive, 520)
					//identify range based on data
					var scaleRange = [], minSize = [], maxSize = [];
					for (var i = 0; i < regionData.length; i++) {
						var d = regionData[i];
						if(parseInt(d.region_id) === metroId && d.rel_region_id != d.region_id && d.dir === dir && d.mode === mode){
							if(measure === 'ton'){
								scaleRange.push(parseInt(d.ton));
							}else{scaleRange.push(parseInt(d.val));}
						}
					}
					
					var minSize = d3.min(scaleRange),
						maxSize = d3.max(scaleRange),
						scale = d3.scale.pow()
							.exponent(.6)
							.domain([minSize, maxSize])
							.range([2, 35]);
					d3.select('#metros .sel_primary')
						.classed('prevSelection', true);
					d3.selectAll('#metros .sel_related')
						.classed('prevSelection', true);
					// return circles to starting size
					d3.selectAll('#metros .metro')
						.classed('sel_primary', false)
						.classed('sel_related', false)
						.classed('in', false)
						.classed('out', false);
					

					
					$("svg circle").unbind('mouseenter mouseleave');
					
					// size primary metro
					d3.select('#metro_' + metroId)
						.attr('r', 15)
						.classed('sel_primary', true)
						.classed('prevSelection', false)
						.select('circle')
							.attr('r', 15);
					
					// loop through data and size metros related to primary
					for (var i = 0; i < regionData.length; i++) {
						var d = regionData[i], r, ttLabel;
							//r = scale(Math.sqrt(d.val / Math.PI));
						//identify measurement of moves	
						if(measure === 'ton'){
							r = scale(d.ton),
							ttLabel = numeral(d.ton).format('0,0') +' tons';
						}else{r = scale(d.val),
							ttLabel = numeral(d.ton).format('$0,0');}

						if (parseInt(d.region_id) === metroId && d.dir === dir && d.rel_region_id != d.region_id && d.mode === mode) {						
							var elem = d3.select('#metro_' + d.rel_region_id),
								a = getMetro(d.rel_region_id),
								tooltipContent = '<b>'+ a.familiar_name + '</b><br/>'+ ttLabel;
								elem.classed('prevSelection', false);
								elem.classed('sel_related', true)

									//.classed('prevValue', true)
									.attr('r', r)
									.classed(dir, true)
									.select('circle')
										.transition()
	    								.duration(500)
											.attr('r', r)
											.attr('title', tooltipContent);
								
							
							/*var textWidth =  elem.select('text').node().getBBox().width;
							
							if (r < textWidth / 2) {
								elem.attr('r', textWidth / 2);
							}
	*/											
						}
					}
					d3.selectAll('#metros .prevSelection')
						.classed('prevSelection', false)
						.attr('r', 3)
						.select('circle')
							.transition()
	    					.duration(500)
								.attr('r', 3);

					packMetros();
					//d3.selectAll('svg circle').attr('title','This is my tooltip title');
					$('svg .sel_related circle').tipsy({
					   gravity: 'n', 
				        html: true
				        
				      });
					
				
				}
				
				// **********************************************
				
				function packMetros() {
				
					var elements = d3.selectAll('#metros .metro')[0];
					
					packer.elements(elements).start();
				
				}
							
				
				// **********************************************
			});
		});
	});
	
	// **********************************************
	/*var commData;	
	d3.csv('../lib/data/commodities.csv', function(CoData) {
		for (var i = 0; i < CoData.length; i++) {
			console.log(CoData[i]);
		}



	});*/

	
/*	}*/
	
})();