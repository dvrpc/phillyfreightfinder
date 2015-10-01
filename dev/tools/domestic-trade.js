(function() {

	'use strict';

	// load data
	d3.csv('data/d3/commRegions_v2.csv', function(regionLookup) {
		d3.csv('data/d3/totalFlowsBEA.csv', function(regionData) {
			d3.csv('data/d3/commodities.csv', function(CoData) {
			d3.csv('data/d3/stcc.csv', function(stcc) {	
				var packer = sm.packer();
	
				var currDir = 'in',
					measure = 'ton',
					mode = 'all',
					currCty = 42017,
					county = 'bucks',
					singleComm, bLabel, commItem;
				
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
				// draw state outlines
				var projection = d3.geo.albersUsa().scale(900).translate([960 / 2, 500 / 2]);
				var path = d3.geo.path()
					.projection(projection);

				d3.json('data/d3/us_states_shapes.json', function(json) {
					states.selectAll('path')
						.data(json.features)
						.enter().append('path')
						.attr('d', path)
						.attr('class','states_outline');
						
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

				
				sizeMetros(currCty, currDir);



				//***********************************************
				// load commodity data 
				
				function loadCommodities(c, m, d, mo){
					var cty = c, meas = m, cdir = d, cmode = mo, matchComm = [], sortFunction, l;
					
					for(l = 0; l < CoData.length; l++){
						var comm = CoData[l];
						
						if(comm.dir === cdir && parseInt(comm.region) === cty && comm.mode.toLowerCase() === cmode){
							matchComm.push(comm);
						}
					}
					var sortedComms = sortCommodities(matchComm, meas);
					//populateTable(sortedComms);
					buildBarChart(sortedComms);	
				}

				function sortCommodities(c, meas){
					if(meas === 'ton'){
						c.sort(function(a,b){return b.ton - a.ton;});
					}else{
						c.sort(function(a,b){return b.value - a.value;});
					}
					return c;
				}


				// **********************************************
				// Create bar chart of commodities

				function buildBarChart(comms){
					var stccNames = [], values = [];
					$('#commChart').empty().html('');
					
					// define the data variables
					var commColors= ['#312A6A','#323576','#35478A','#36559A','#2E5EA5','#396ab2','#4276c2','#5584c9','#6992cf','#7ca0d5'];
					
					var commodityName = function(stccCode){
						var result = null, p;
						for (p= 0; p < stcc.length; p++) {
							var code = stcc[p];
							if (parseInt(code.stcc) === parseInt(stccCode.stcc4)) {
								result = code.name;
							}
						}
						return result;
					};

					function prepChartData(citem){
							var ci = commodityName(citem);
							if(measure === 'ton'){
								values.push(parseInt(citem.ton));
							}else{
								values.push(parseInt(citem.value));
							}
							stccNames.push(ci);
					}
					var k;
					if(comms.length < 10){
						for (k = 0; k < comms.length; k++){				
							singleComm = comms[k];
							prepChartData(singleComm);		
						}
					}else{
						for (k = 0; k < 10; k++){
							singleComm = comms[k];
							prepChartData(singleComm);
						}
					}

					// define chart size and presets
					var width = document.getElementById('topCommoditiesChart').offsetWidth,
					    height = 305,
					    xheight = 275;

					var barHeight = (height-30) / values.length;
					
					// build the chart
					var chart = d3.select('#commChart')
					    .attr('width', width)
					    .attr('height', height);

					var colorScale = d3.scale.quantize()
						.domain([0,stccNames.length])
						.range(commColors);
    
					var x = d3.scale.linear()
					    .range([0, width-250])
					    .domain([0, d3.max(values)]);

					var yscale = d3.scale.linear()
						.domain([0,stccNames.length])
						.range([0,xheight]);

					function make_x_axis() {        
					    return d3.svg.axis()
					        .scale(x)
					         .orient('bottom')
					         .ticks(5);         
					}

					function xLabel(){
						if(measure==='ton'){return 'thousand tons of activity';}
							else{return 'million dollars of activity';}
					}

					function formatValues(d){
						var dv;
						if(measure === 'ton'){
							dv = numeral(round((d*0.001),2)).format('0,0');
						}else{
							dv = '$ '+ numeral(round((d*0.000001),2)).format('0,0');
						}
						return dv;
					}

					// add axis, labels, and grid
					var	yAxis = d3.svg.axis()
						.orient('left')
						.scale(yscale)
						.ticks(stccNames.length)
						.tickSize(0)
						.tickFormat(function(d,i){ return stccNames[i]; });

					chart.append('g')
					      .attr('class', 'x axis')
					      .attr('transform', 'translate(220,' + xheight + ')')
					      .call(make_x_axis()
					      	.tickSize(2)
					      	.tickFormat(formatValues)
					 		);

					chart.append('g')         
				        .attr('class', 'grid')
				        .attr('transform', 'translate(220,' + xheight + ')')
				        .style('stroke-dasharray', ('1, 2'))
				        .call(make_x_axis()
				            .tickSize(-xheight, 0, 0)
				            .tickFormat('')
				        );

				    var y_xis = chart.append('g')
						  .attr('transform', 'translate(220,0)')
						  .attr('id','yaxis')
						  .call(yAxis)
						  		.selectAll('text')
					      		.attr('y', barHeight/2 );

					chart.append('text')
					    .attr('class', 'x-label')
					    .attr('text-anchor', 'end')
					    .attr('x', (width/2) + 110 )
					    .attr('y', height-2)
					    .text(xLabel);	

				    //build bars
				    var bar = chart.append('g')
				    	.attr('transform', 'translate(220, 0)')
				    	.attr('id', 'bars')
				    	.selectAll('rect')
							.data(values)
					    .enter();
				   					
					bar.append('rect')
						.attr('transform', function(d, i) { return 'translate(0, ' + i * barHeight + ')'; })
					    .attr('width', 0)
						.attr('height', barHeight - 2)
						.attr('class', 'barTip')
						.style('fill',function(d,i){ return colorScale(i); })
					    .transition()
						      .delay(function(d, i) { return i * 100; })
						      .duration(400)
						      .attr('width', x)
						      .attr('val', function(d,i){ return d; });


					$('.barTip').tipsy({ 
				        gravity: 'n', 
				        html: true, 
				        title: function() {
				          var a = this.getAttribute('val');
				          if(measure === 'ton'){ bLabel = numeral(round((a*0.001),2)).format('0,0.0') +' ktons';
				          }else{ bLabel = '$ '+ numeral(round((a*0.000001),2)).format('0,0.0') + ' M';
				          }
				          return bLabel ; 
				        }
				      });	      
				}


				// *************************************************
				// Populate the table based on commodities  

				function populateTable(comms){
					$('#commList1').html('');
					$('#commList2').html('');
					var value = function(c){
						var mv;
						if(measure === 'ton'){
							mv = numeral(round((c.ton*0.001),2)).format('0,0.0') +' ktons';
						}else{
							mv = '$ '+ numeral(round((c.value*0.000001),2)).format('0,0.0') + ' M';
						}
						return mv;
					};
					var commodityName = function(stccCode){
						var result = null, s;
					
						for (s = 0; s < stcc.length; s++) {
							var code = stcc[s];
							if (parseInt(code.stcc) === parseInt(stccCode.stcc4)) {
								result = code.name;
							}
						}
						return result;
					};
					var commItem, number, ciString, cu;
					
					for (cu = 0; cu < 5; cu++){
							commItem = comms[cu],
							number = cu + 1,
							ciString = '<li class=\'list-group-item\'><span class=\'badge\'>' + value(commItem) + '</span><span class=\'rankNumber\'>'+ number + '</span> <b>' + commodityName(commItem) + '</b></li>';
						$(ciString).appendTo('#commList1');
					}
					for (cu = 5; cu < 10; cu++){
							commItem = comms[cu],
							number = cu + 1,
							ciString = '<li class=\'list-group-item\'><span class=\'badge\'>'+ value(commItem) +'</span><span class=\'rankNumber\'>'+ number + '</span> <b>'+ commodityName(commItem) +'</b></li>';
						$(ciString).appendTo('#commList2');
					}
				}



		
				// **********************************************
				// commodity flow button controls

				$('input[name=\'dir\']').change(function() {
					currDir = $(this).val();
					var dirName = ((currDir==='in') ? 'Inbound' : 'Outbound');
					sizeMetros(currCty, currDir);
					$('#comm-'+ currDir).prop('checked',true);
					$('#tradeDirection').html(dirName+ ' <span class=\'caret\'></span>');
				});


				$('input[name=\'county\']').change(function() {
					d3.selectAll('#temp text').remove();
					county = this.id;
					currCty = parseInt($(this).val());
					sizeMetros(currCty, currDir);
				});

				$('input[name=\'measure\']').change(function() {
					measure = $(this).val();
					var measureName = ((measure==='ton') ? 'Volume' : 'Value');
					sizeMetros(currCty, currDir, 'measure');
					$('#comm-'+ measure).prop('checked',true);
					$('#tradeMeasure').html(measureName+ ' <span class=\'caret\'></span>');
				});

				$('input[name=\'mode\']').change(function() {
					mode = $(this).val();
					sizeMetros(currCty, currDir, 'mode');
				});
				
				$('input[name=\'tradeMeasure\']').change(function() {
					measure = $(this).val();
					$('#radio_'+measure).trigger('click');
				});

				$('input[name=\'tradeDirection\']').change(function() {
					currDir = $(this).val();
					$('#radio_'+currDir).trigger('click');
				});


				$('#dt-county-prev').on('click', function() {
                    var changeSelect = $('#'+ county).parent().prev().children();
                    changeSelect.trigger('click'); 
                                         
                });
                $('#dt-county-next').on('click', function() {
                    var changeSelect = $('#'+ county).parent().next().children();
                    changeSelect.trigger('click'); 
                                         
                });
                $('.btn').mouseup(function(){
                    $(this).blur();
                });
				
				// key functions
				// **********************************************
				
				function sortNumber(a, b) {
					return a - b;
				}
				
				// **********************************************
				
				function sortedAndDeDuped(a) {
				
					a = a.sort(sortNumber);
				
					var trimmed = [], o;
					for (o = 0; o < a.length; o++) {
						if (a[o] !== a[o - 1]) {
							trimmed.push(a[o]);
						}
					}
					return trimmed;
				}
			
				// **********************************************
				
				function getMetro(id) {
								
					var result = null, gm;
					
					for (gm = 0; gm < regionLookup.length; gm++) {
						var metro = regionLookup[gm];
						if (parseInt(metro.id) === parseInt(id)) {
							result = metro;
						}
					}
					return result;
				}
			
				// **********************************************
				
				function addCirclesToMap(a, r) {
				
					var pixelLoc = d3.geo.albersUsa(), cl;
			
					for (cl = 0; cl < a.length; cl++) {
						var metro = getMetro(a[cl]);
						
						if (metro) {
							var xy = projection([metro.lon, metro.lat]);
							
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
					
					if(county === 'bucks'){
						$('#dt-county-prev').prop('disabled', true);
					}else if(county === 'philadelphia'){
						$('#dt-county-next').prop('disabled', true);
					}else{ $('#dt-county-next').prop('disabled', false);
						$('#dt-county-prev').prop('disabled', false);}
				}
				
				// **********************************************

				function sortRegions(regions, measure){
					if(measure === 'ton'){regions.sort(function(a,b){return b.ton - a.ton;});
						}else{regions.sort(function(a,b){return b.val - a.val;});}
					return regions;

				}

				function round(value, decimals) {
				    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
				}

				// **********************************************
				
				function sizeMetros(metroId, dir, source) {
					$('.flowBtn').attr('disabled', true);
					$('#tradeList').html('');

					setTimeout(buttonsActive, 520);
					//identify range based on data
					var sortedRegions = sortRegions(regionData, measure);

					var scaleRange = [], minSize = [], maxSize = [], listItems = [], j=0, h;
					for (h = 0; h < sortedRegions.length; h++) {
						var d = sortedRegions[h];
						if(parseInt(d.region_id) === metroId && d.rel_region_id != d.region_id && d.dir === dir && d.mode === mode){
							if(measure === 'ton'){
								scaleRange.push(parseInt(d.ton));
							}else{scaleRange.push(parseInt(d.val));}
						}
					}

					minSize = d3.min(scaleRange);
					maxSize = d3.max(scaleRange);
					var	scale = d3.scale.pow()
							.exponent(0.6)
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
					

					
					$('svg circle').unbind('mouseenter mouseleave');
					
					// size primary metro
					d3.select('#metro_' + metroId)
						.attr('r', 15)
						.classed('sel_primary', true)
						.classed('prevSelection', false)
						.select('circle')
							.attr('r', 15);
//remove now!
					//prep data for all
				/*	if(mode === 'all'){
						for(i = 0; i < regionData.length; i++){
							if (parseInt(d.region_id) === metroId && d.dir === dir && d.rel_region_id != d.region_id) {
								
							}
						}
					}*/

					// loop through data and size metros related to primary
					var q;
					for (q = 0; q < sortedRegions.length; q++) {
						var t = sortedRegions[q], r, ttLabel, num, formatNum;
							//r = scale(Math.sqrt(d.val / Math.PI));
						//identify measurement of moves	
						if(measure === 'ton'){
							r = scale(t.ton);
							num = t.ton;
							formatNum = numeral(round((num*0.001),2)).format('0,0.0') +' ktons';
						}else{
							r = scale(t.val);
							num = t.val;
							formatNum = '$ '+ numeral(round((num*0.000001),2)).format('0,0.0') + ' M';
						}
												

						if (parseInt(t.region_id) === metroId && t.dir === dir && t.rel_region_id != t.region_id && t.mode === mode) {						
								var elem = d3.select('#metro_' + t.rel_region_id),
									a = getMetro(t.rel_region_id);
								var	name = a.familiar_name;
								if(num > 0){
									var listItem = '<li class=\'list-group-item\'><span class=\'badge partner-val\'>'+ formatNum +'</span>'+name+'</li>'; 
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
								j++;												
						}
					}

					var dl;

					if(listItems.length>0){
						for (i = 0; i < 10; i++) {
							dl = listItems[i];
							$(dl).appendTo('#tradeList');
						}
					}else{
						var capitalized = county.slice(0,1).toUpperCase() + county.slice(1, county.length);
						dl = '<li class=\'list-group-item\'><b>'+ capitalized +' County</b> has no domestic trade using <b>'+ mode +' transportation.</b></li>';
						if(mode === 'air' && metroId === 42101)
							{dl += '<li class=\'list-group-item\'>Air transportation through Philadelphia International Airport is captured by Delaware County.</li>';}
						$(dl).appendTo('#tradeList');
					}

					d3.selectAll('#metros .prevSelection')
						.classed('prevSelection', false)
						.attr('r', 3)
						.select('circle')
							.transition()
	    					.duration(500)
								.attr('r', 3); 
					packMetros();

					//process commodities
					 

					// add tooltip and formatting
					 $('svg .sel_related circle').tipsy({ 
				        gravity: 'n', 
				        html: true, 
				        title: function() {
				          var a = this.getAttribute('val'), n = this.getAttribute('name'); var ra = round(a,2);
				          if(measure === 'ton'){ ttLabel = numeral(round((a*0.001),2)).format('0,0.0') +' ktons';
				          }else{ ttLabel = '$ '+ numeral(round((a*0.000001),2)).format('0,0.0') + ' M';
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
								d3.select(this).classed('active', true);//.style('stroke-width', 3);
							//}
						})
						.on('mouseout', function(e) {
							d3.select(this).classed('active', false);//.style('stroke-width', 0);			
						});
					
					loadCommodities(currCty, measure, dir, mode);


					
					}
				
				// **********************************************
				
				function packMetros() {
					var elements = d3.selectAll('#metros .metro')[0];
					packer.elements(elements).start();
				}
			});
			});
		});
	});	
})();