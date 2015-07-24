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

				
				sizeMetros(currCty, currDir);



				//***********************************************
				
				// load commodity data 
				
				function loadCommodities(c, m, d, mo){
					var cty = c, meas = m, cdir = d, cmode = mo, matchComm = [], sortFunction;
					//console.log(cdir, cty, cmode);
					for(var i = 0; i < CoData.length; i++){
						var comm = CoData[i];
						
						if(comm.dir === cdir && parseInt(comm.region) === cty && comm.mode.toLowerCase() === cmode){
							matchComm.push(comm);
						}
					}
					var sortedComms = sortCommodities(matchComm, meas);
					//populateTable(sortedComms);
					newCommBarChart(sortedComms);	
				}

				function sortCommodities(c, meas){
					if(meas === 'ton'){c.sort(function(a,b){return b.ton - a.ton});
						}else{c.sort(function(a,b){return b.value - a.value});}
					return c
				}


				// **********************************************
				// Create bar chart of commodities

				function newCommBarChart(comms){
					var stccNames = [], values = [];
					$('#commChart').html('');
					var commColors= ["#312A6A","#323576","#35478A","#36559A","#2E5EA5","#396ab2","#4276c2","#5584c9","#6992cf","#7ca0d5"]
					var commodityName = function(stccCode){
						var result = null;
						for (var i = 0; i < stcc.length; i++) {
							var code = stcc[i];
							if (parseInt(code.stcc) === parseInt(stccCode.stcc4)) {
								result = code.name;
							}
						}
						return result;
					}

					function prepChartData(commItem){
							var ci = commodityName(commItem);
							if(measure === 'ton'){
								values.push(parseInt(commItem.ton));
							}else{
								values.push(parseInt(commItem.value));
							}
							stccNames.push(ci);
					}

					if(comms.length < 10){
						for (var i = 0; i < comms.length; i++){				
							var commItem = comms[i];
							prepChartData(commItem);		
						}
					}else{
						for (var i = 0; i < 10; i++){
							var commItem = comms[i];
							prepChartData(commItem);
						}
					}

	
					var width = document.getElementById('topCommoditiesChart').offsetWidth,
					    height = 305,
					    xheight = 275;

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
					         .orient("bottom")
					         .ticks(5)         
					}

					var	yAxis = d3.svg.axis()
						.orient('left')
						.scale(yscale)
						.ticks(stccNames.length)
						.tickSize(0)
						.tickFormat(function(d,i){ return stccNames[i]; });

					function formatValues(d){
						if(measure === 'ton'){
							var value = numeral(round((d*.001),2)).format('0,0');
						}else{
							var value = '$ '+ numeral(round((d*.000001),2)).format('0,0');
						}
						return value
					}
					var barHeight = (height-30) / values.length;
					
					var chart = d3.select("#commChart")
					    .attr("width", width)
					    .attr("height", height);

					chart.append("g")
					      .attr("class", "x axis")
					      .attr("transform", "translate(220," + xheight + ")")
					      .call(make_x_axis()
					      	.tickSize(2)
					      	.tickFormat(formatValues)
					 		);

					chart.append("g")         
				        .attr("class", "grid")
				        .attr("transform", "translate(220," + xheight + ")")
				        .style("stroke-dasharray", ("1, 2"))
				        .call(make_x_axis()
				            .tickSize(-xheight, 0, 0)
				            .tickFormat("")
				        );

				    var bar = chart.append("g")
				    	.attr("transform", "translate(220, 0)")
				    	.attr('id', 'bars')
				    	.selectAll('rect')
							.data(values)
					    .enter();
				    
					
					bar.append("rect")
						.attr("transform", function(d, i) { return "translate(0, " + i * barHeight + ")"; })
					    .attr("width", 0)
						.attr("height", barHeight - 2)
						.attr("class", "barTip")
						.style('fill',function(d,i){ return colorScale(i); })
					    .transition()
						      .delay(function(d, i) { return i * 100; })
						      .duration(400)
						      .attr("width", x)
						      .attr('val', function(d,i){ return d });

					var y_xis = chart.append('g')
						  .attr("transform", "translate(220,0)")
						  .attr('id','yaxis')
						  .call(yAxis)
						  		.selectAll('text')
					      		.attr('y', barHeight/2 );

					function xLabel(){
						if(measure==='ton'){return 'thousand tons of activity'}
							else{return 'million dollars of activity'}
					}

					chart.append("text")
					    .attr("class", "x-label")
					    .attr("text-anchor", "end")
					    .attr("x", (width/2) + 110 )
					    .attr("y", height-2)
					    .text(xLabel);	

					$('.barTip').tipsy({ 
				        gravity: 'n', 
				        html: true, 
				        title: function() {
				          var a = this.getAttribute('val');
				          if(measure === 'ton'){ var bLabel = numeral(round((a*.001),2)).format('0,0.0') +' ktons';
				          }else{ var bLabel = '$ '+ numeral(round((a*.000001),2)).format('0,0.0') + ' M';
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
						if(measure === 'ton'){
							var value = numeral(round((c.ton*.001),2)).format('0,0.0') +' ktons';
						}else{
							var value = '$ '+ numeral(round((c.value*.000001),2)).format('0,0.0') + ' M';
						}
						return value;
					}
					var commodityName = function(stccCode){
						var result = null;
					
						for (var i = 0; i < stcc.length; i++) {
							var code = stcc[i];
							if (parseInt(code.stcc) === parseInt(stccCode.stcc4)) {
								result = code.name;
							}
						}
						return result;
					}
					for (var i = 0; i < 5; i++){
						var commItem = comms[i],
							number = i + 1,
							ci = '<li class="list-group-item"><span class="badge">'+ value(commItem) +'</span><span class="rankNumber">'+ number + '</span> <b>'+ commodityName(commItem) +'</b></li>';
						$(ci).appendTo('#commList1');
					}
					for (var i = 5; i < 10; i++){
						var commItem = comms[i],
							number = i + 1,
							ci = '<li class="list-group-item"><span class="badge">'+ value(commItem) +'</span><span class="rankNumber">'+ number + '</span> <b>'+ commodityName(commItem) +'</b></li>';
						$(ci).appendTo('#commList2');
					}
				}



		
				// **********************************************
				// commodity flow button controls
				$('input[name="dir"]').change(function() {
					currDir = $(this).val();
					var dirName = ((currDir==='in') ? 'Inbound' : 'Outbound');
					sizeMetros(currCty, currDir);
					$('#comm-'+ currDir).prop('checked',true);
					$('#tradeDirection').html(dirName+ ' <span class="caret"></span>')
				});


				$('input[name="county"]').change(function() {
					d3.selectAll('#temp text').remove();
					county = this.id;
					currCty = parseInt($(this).val());
					sizeMetros(currCty, currDir);
				});

				$('input[name="measure"]').change(function() {
					measure = $(this).val();
					var measureName = ((measure==='ton') ? 'Volume' : 'Value');
					sizeMetros(currCty, currDir, 'measure');
					$('#comm-'+ measure).prop('checked',true);
					$('#tradeMeasure').html(measureName+ ' <span class="caret"></span>')
				});

				$('input[name="mode"]').change(function() {
					mode = $(this).val();
					sizeMetros(currCty, currDir, 'mode');
				});
				
				$('input[name="tradeMeasure"]').change(function() {
					measure = $(this).val();
					$("#radio_"+measure).trigger("click");
				});

				$('input[name="tradeDirection"]').change(function() {
					measure = $(this).val();
					$("#radio_"+measure).trigger("click");
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
					$('#tradeList').html('');

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
							formatNum = numeral(round((num*.001),2)).format('0,0.0') +' ktons';
						}else{r = scale(d.val),
							num = d.val,
							formatNum = '$ '+ numeral(round((num*.000001),2)).format('0,0.0') + ' M';
						}
												

						if (parseInt(d.region_id) === metroId && d.dir === dir && d.rel_region_id != d.region_id && d.mode === mode) {						
								var elem = d3.select('#metro_' + d.rel_region_id),
									a = getMetro(d.rel_region_id);
								var	name = a.familiar_name;
								if(num > 0){
									var listItem = '<li class="list-group-item"><span class="badge partner-val">'+ formatNum +'</span>'+name+'</li>'; 
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
							$(dl).appendTo('#tradeList');
						}
					}else{
						var capitalized = county.slice(0,1).toUpperCase() + county.slice(1, county.length);
						var dl = '<li class="list-group-item"><b>'+ capitalized +' County</b> has no domestic trade using <b>'+ mode +' transportation.</b></li>';
						if(mode === 'air' && metroId === 42101)
							{dl += '<li class="list-group-item">Air transportation through Philadelphia International Airport is captured by Delaware County.</li>';}
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
				          if(measure === 'ton'){ ttLabel = numeral(round((a*.001),2)).format('0,0.0') +' ktons';
				          }else{ ttLabel = '$ '+ numeral(round((a*.000001),2)).format('0,0.0') + ' M';
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
	
	// **********************************************
	/*var commData;	
	d3.csv('../lib/data/commodities.csv', function(CoData) {
		for (var i = 0; i < CoData.length; i++) {
			console.log(CoData[i]);
		}



	});*/

	
/*	}*/
	
})();