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
						.attr('height', 500)
						.attr('id', 'tradeMap');
				
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
				console.log(regionData);
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

				
				sizeMetros(currMetro, currDir);



				//***********************************************
				
				// commodity data prep
				loadCommodities(county, measure, currDir, mode);

				
				function loadCommodities(c, m, d, mo){
					var cty = c, meas = m, cdir = d, cmode = mo, matchComm = [], sortFunction;
					for(var i = 0; i < CoData.length; i++){
						var comm = CoData[i];

						if(comm.dir === cdir && comm.region === cty && comm.typ === meas){
							matchComm.push(comm);
						}
					}
					var sortedComms = sortCommodities(matchComm, meas);
					//console.log(sortedComms);	
				}

				function sortCommodities(c, meas){
					if(meas === 'ton'){c.sort(function(a,b){return b.ton - a.ton});
						}else{c.sort(function(a,b){return b.value - a.value});}
					return c
				}

		
				// **********************************************
				// commodity flow button controls
				$('input[name="dir"]').change(function() {
					currDir = $(this).val();
					sizeMetros(currMetro, currDir);
				});


				$('input[name="county"]').change(function() {
					d3.selectAll('#temp text').remove();
					county = this.id;
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
				
				
				// key functions
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
						}
					}	
				}

				//**********************************************
				
				function buttonsActive(){
					$('.flowBtn').attr('disabled', false);
				}
				
				// **********************************************

				function sortRegions(regions, measure){
					if(measure === 'ton'){regions.sort(function(a,b){return b.ton - a.ton});
						}else{regions.sort(function(a,b){return b.val - a.val});}
					return regions;

				}

				function round(value, decimals) {
				    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
				}

				// **********************************************
				
				function sizeMetros(metroId, dir, source) {
					$('.flowBtn').attr('disabled', true);
					$('#comm1').html('');
					setTimeout(buttonsActive, 520)
					//identify range based on data
					var sortedRegions = sortRegions(regionData, measure);

					var scaleRange = [], minSize = [], maxSize = [], listItems = [], j=0;
					for (var i = 0; i < sortedRegions.length; i++) {
						var d = sortedRegions[i];
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

					//prep data for all
					if(mode === 'all'){
						for(var i = 0; i < regionData.length; i++){
							if (parseInt(d.region_id) === metroId && d.dir === dir && d.rel_region_id != d.region_id) {
								
							}
						}
					}

					// loop through data and size metros related to primary
					for (var i = 0; i < sortedRegions.length; i++) {
						var d = sortedRegions[i], r, ttLabel, num, formatNum;
							//r = scale(Math.sqrt(d.val / Math.PI));
						//identify measurement of moves	
						if(measure === 'ton'){
							r = scale(d.ton),
							num = d.ton,
							formatNum = numeral(num).format('0,0')+' tons';
						}else{r = scale(d.val),
							num = d.val,
							formatNum = '$ '+ numeral(num).format('0,0');
						}
												

						if (parseInt(d.region_id) === metroId && d.dir === dir && d.rel_region_id != d.region_id && d.mode === mode) {						
								var elem = d3.select('#metro_' + d.rel_region_id),
									a = getMetro(d.rel_region_id);
								var	name = a.familiar_name;
								if(num > 0){
									var listItem = '<li class="list-group-item"><span class="badge">'+ formatNum +'</span><b>'+name+'</b></li>'; 
									listItems.push(listItem);
								}
								
								elem.classed('prevSelection', false);
								elem.classed('sel_related', true)
									.attr('r', r)
									.classed(dir, true)
									.select('circle')
										.transition()
	    								.duration(500)
											.attr('r', r)
											.attr('i', j)
											.attr('val', num)
											.attr('name', name);
								j++												
						}
					}
					if(listItems.length>0){
						for (var i = 0; i < 10; i++) {
							var dl = listItems[i];
							$(dl).appendTo('#comm1');
						}
					}else{
						var capitalized = county.slice(0,1).toUpperCase() + county.slice(1, county.length);
						var dl = '<li class="list-group-item"><b>'+ capitalized +' County</b> has no domestic trade using <b>'+ mode +' transportation.</b></li>';
						if(mode === 'air' && metroId === 42101)
							{dl += '<li class="list-group-item">Air transportation through Philadelphia International Airport is captured by Delaware County.</li>';}
						$(dl).appendTo('#comm1');
					}
					d3.selectAll('#metros .prevSelection')
						.classed('prevSelection', false)
						.attr('r', 3)
						.select('circle')
							.transition()
	    					.duration(500)
								.attr('r', 3); 
					packMetros(); 
					// add tooltip and formatting
					 $('svg .sel_related circle').tipsy({ 
				        gravity: 'n', 
				        html: true, 
				        title: function() {
				          var a = this.getAttribute('val'), n = this.getAttribute('name'); var ra = round(a,2);
				          if(measure === 'ton'){ ttLabel = numeral(round((a*.001),2)).format('0,0.0') +' Ktons';
				          }else{ ttLabel = '$ '+ numeral(round((a*.000001),2)).format('0,0.0') + 'M';
				          }
				          return '<b>'+n+'</b><br>' + ttLabel ; 
				        }
				      });
					 // metro mouseover effect
					d3.selectAll('.metro circle').on('mouseover', null);
					d3.selectAll('.metro circle').on('mouseout', null);
					d3.selectAll('.sel_related circle')
						.on('mouseover', function(e) {
							//if (!packer.animating) {
								d3.select(this).classed("active", true);//.style("stroke-width", 3);
							//}
						})
						.on('mouseout', function(e) {
							d3.select(this).classed("active", false);//.style("stroke-width", 0);			
						});
				
				}
				
				// **********************************************
				
				function packMetros() {
					var elements = d3.selectAll('#metros .metro')[0];
					packer.elements(elements).start();
				}
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