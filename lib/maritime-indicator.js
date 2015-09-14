$(function() {
      var miYear, updateTradePanel;

      
      //configure maritime trade chart presets
      var margin = {top: 20, right: 55, bottom: 30, left: 60},
          chartW = $('#maritimeChartWrapper').width(),
          width  = chartW - margin.left - margin.right,
          height = 200  - margin.top  - margin.bottom;

      var parseDate = d3.time.format("%Y").parse;
      
      var bisectDate = d3.bisector(function (d) {
          return d.year;
      }).right;

      //define scales: x, y-left, y-right
      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .rangeRound([height, 0]);

      var y0 = d3.scale.linear()
          .rangeRound([height, 0]);

      var stack = d3.layout.stack()
          .offset("zero")
          .values(function (d) { return d.values; })
          .x(function (d) { return x(d.label); })
          .y(function (d) { return d.value; });

      var area = d3.svg.area()
          .interpolate("cardinal")
          .x(function (d) { return x(d.label); })
          .y0(function (d) { return y(d.y0); })
          .y1(function (d) { return y(d.y0 + d.y); });

      var color = d3.scale.ordinal()
          .range(["#7ca0d5","#396ab2","#312A6A"]);

      var svg = d3.select("#maritimeTradeChart").append("svg")
          .attr("width",  width  + margin.left + margin.right)
          .attr("height", height + margin.top  + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      function formatYvalues(n){
            var value = n*.000001 + ' M';
            return value
          }
      
      function formatY0values(n){
            var value = n*.001 + ' k';
            return value
          }

      d3.csv("data/d3/maritimeIndicators.csv", function (data) {
        var labelVar = 'year';

        var l = new Date();
        var thisYear = l.getFullYear();

        var varNames = ['swt_export','swt_import','domestic'];
        
        color.domain(varNames);

        var seriesArr = [], series = {}, containers = [];

        varNames.forEach(function (name) {
            series[name] = {name: name, values:[]};
            seriesArr.push(series[name]);
        });
        
        var maxDataYear = d3.max(data, function(d) { return d.year});
        miYear = maxDataYear-1;
        $('#mi-year-select').html(miYear+ ' <span class="caret"></span>');
        for(var i = 2003; i <= maxDataYear; i++ ){
          $('#maritime-year-dropdown').append('<li><input type="radio" id="m'+ i +'" class="miYear" name="miYear" value="'+ i +'"><label for="m'+ i +'">'+ i +'</label></li>'); 
        }
        $('#m'+ (maxDataYear-1)).prop('checked',true);
        
        data.map(function (d) {
          if(d.year != thisYear-1 && d.year > 2002){
            varNames.map(function (name) {
              series[name].values.push({label: parseDate(d[labelVar]), value: +d[name]});
            });
            //prep y0 data [containers]
            containers.push({year: parseDate(d.year), value: +d.cont_teu});
          }
        });


        //define min and max years
        var minYear = d3.min(seriesArr, function(d) { return d3.min(d.values, function (d) { return d.label; }); }),
            maxYear = d3.max(seriesArr, function(d) { return d3.max(d.values, function (d) { return d.label; }); })

        //push to label
        $('#mi-trade-date-min').html(minYear.getFullYear());
        $('#mi-trade-date-max').html(maxYear.getFullYear());

        x.domain([minYear,maxYear]);
        
        stack(seriesArr);

        y.domain([0, d3.max(seriesArr, function (c) { 
            return d3.max(c.values, function (d) { return d.y0 + d.y; });
          })]);

        y0.domain([0, d3.max(containers, function(d) { return Math.max(d.value); })])
        

        var selection = svg.selectAll(".series")
          .data(seriesArr)
          .enter().append("g")
            .attr("class", "series");

        selection.append("path")
          .attr("class", "streamPath")
          .attr("d", function (d) { return area(d.values); })
          .style("fill", function (d) { return color(d.name); })
          .style("stroke", "white");

        var line = d3.svg.line()
          .interpolate("cardinal")
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y0(d.value); });

        svg.append("path")
          .attr("d", line(containers))
          .attr("stroke", "#EAA51B")
          .attr("fill","none")
          .attr("stroke-width", 2);
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(5)
            .tickFormat(formatYvalues)
            .orient("left");

        var yAxisRight = d3.svg.axis()
            .scale(y0)
            .tickFormat(formatY0values)
            .ticks(6)
            .orient("right");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("y", -55)
            .attr("dy", '.71em')
            .attr("x", -height/2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("tons of trade");

        svg.append("g")
            .attr("class", "y0 axis")
            .attr("transform", "translate("+ width +",0)")
            .call(yAxisRight)
          .append("text")
            .attr("y", 45)
            .attr("dy", ".71em")
            .attr("x", -height/2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("TEUs of containerized cargo");

        var focus = svg.append('g')
            .attr('class', 'focus')
            .style('display', 'none')
            .attr("x1", 100).attr("x2", 100);

       
        //hover line to track mouse position
        var mouseLine = focus.append("line") 
            .attr("class","mouseLine") 
            .attr("stroke-dasharray","2,2")
            .attr("stroke-linecap","round") 
            .style("stroke","#efefef")
            .style("stroke-width", "1px")
            .attr("x1", 10).attr("x2", 10) 
            .attr("y1", 0).attr("y2", height);

        //trade data point circles for mouseover
         var circles = focus.selectAll('.circle')
            .data(seriesArr)
            .enter()
            .append('circle')
              .attr('class', 'circle')
              .attr('r', 6)
              .attr('fill', function (d) {
                  return color(d.name);
              })
              .attr('stroke', '#fff')
              .attr('transform', function (d) {
                return 'translate(0,'+ y(d.values[0].y) +')'
              });

          //container data point circles for mouseover
          var contCircles = focus.selectAll('.containerCircle')
            .data(containers)
            .enter()
            .append('circle')
              .attr('class', 'containerCircle')
              .attr('r', 6)
              .attr('fill', '#EAA51B')
              .attr('stroke', '#fff');
  
          //create tooltip and tooltip elements
          var dataWindow = d3.select('#maritimeTradeChart')
              .append("div")
              .attr("class", "mi-data-window panel panel-primary");

          dataWindow.append('div')
              .html('<div class="mi-dw-title">Trade for <span class="mi-dw-year">2014</span></div><div class=""><div class="mi-data-swatch dkblue-bg"></div> <em>Domestic:</em> <span class="mi-dw-domestic">xxx</span> M tons</div><div class=""><div class="mi-data-swatch blue-bg"></div><em>Imports:</em> <span class="mi-dw-import">xxx</span> M tons</div><div class=""><div class="mi-data-swatch ltblue-bg"></div><em>Exports:</em> <span class="mi-dw-export">xxx</span> M tons</div><div class="mi-data-swatch orange-bg"></div><em>Containers:</em> <span class="mi-dw-containers">xxx</span> k TEUs</div>');

        //create overlay to read mouseevents
        svg.append('svg:rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', function () {
                focus.style('display', null);
                dataWindow.style('display','block');
            })
            .on('mouseout', function () {
                focus.style('display', 'none');
                dataWindow.style('display','none');
            })
            .on('mousemove', mousemove);

        function mousemove() {
            //identify current mouseover position and move circles
            var x0 = x.invert(d3.mouse(this)[0]);
                if(x0.getMonth() > 5){
                  var dd0 =  x0.getFullYear() + 1;
                }else{ var dd0 = x0.getFullYear();}
            var i = bisectDate(data, dd0, 1),
                d0 = data[i - 1].year,
                d1 = data[i].year,
                c = dd0 - d0 > d1 - dd0 ? [d1, i - 1] : [d0, i - 2];  //adjust i to reflect drop of 2002 from data
                console.log(d0);
                console.log(c);
            //console.log(i);
                
            circles.transition()
                .duration(50)
                .attr('transform', function (d) {
                var yV,
                    exp_val = seriesArr[0].values[c[1]].value,
                    imp_val = seriesArr[1].values[c[1]].value,
                    dom_val = seriesArr[2].values[c[1]].value;
                switch(d.name){
                  case 'swt_import': 
                      yV = d.values[c[1]].value + exp_val;
                      break;
                  case 'domestic':
                      yV = d.values[c[1]].value + imp_val + exp_val;
                      break;
                  default: 
                      yV = d.values[c[1]].value;
                }
                //push values to div and then update position
                $('.mi-dw-year').html(d0);
                $('.mi-dw-domestic').html((dom_val*.000001).toFixed(2));
                $('.mi-dw-import').html((imp_val*.000001).toFixed(2));
                $('.mi-dw-export').html((exp_val*.000001).toFixed(2));
                return 'translate(' + x(parseDate(c[0])) + ',' + y(yV) + ')'
            });

            contCircles.transition()
                .duration(50)
                .attr('transform', function (d) {
                  $('.mi-dw-containers').html((containers[c[1]].value*.001).toFixed(0))
                  return 'translate(' + x(parseDate(c[0])) + ',' + y0(containers[c[1]].value) + ')'
            });

            //create tracking for hover line
            mouseLine.transition()
              .duration(50)
              .attr("x1", x(parseDate(c[0]))).attr("x2", x(parseDate(c[0])));
            if(x(parseDate(c[0])) > width/2){
              dataWindow.transition()
                .duration(50)
                .style('left', (x(parseDate(c[0])) - 115) + 'px');
            }else{
              dataWindow.transition()
                .duration(50)
                .style('left', (x(parseDate(c[0])) + 95) + 'px');
            }
          }
      
      //********************************************************
      //  Controls for side panel data based on year of input
      //
      //********************************************************

      var ind_up = '<i class="glyphicon glyphicon-circle-arrow-up"></i>',
          ind_even = '<i class="glyphicon glyphicon-circle-arrow-right"></i>',
          ind_down = '<i class="glyphicon glyphicon-circle-arrow-down"></i>';
      function calcDifference(val1, val2){
        if(val1 < 0 && val2 < 0){
          return (val1 > val2)? -(val2 - val1) : val1 - val2;
        }else if(val1 < 0 && val2 > 0){
          return -(val2 - val1);
        }
        else{ return (val1 > val2)? val1 - val2 : val2 - val1;}
      }
      function calcChange(value){
        return (value > 0)? 'change' : 'change';
      }
      updateTradePanel = function(mYear){
        $('#mi-export-graph').html('');
        $('#mi-container-graph').html('');
        $('.mi-activity-year').html(mYear);
        var yr = mYear - 2002;
        if(data[yr].port_rank !== ""){
            //port rank indicator calculations
          var portRank = data[yr].port_rank,
            prevRank = data[yr-1].port_rank,
            portChange = portRank - prevRank,
            //trade indicator calculations
            totalTrade = parseInt(data[yr].swt_import) + parseInt(data[yr].swt_export) + parseInt(data[yr].domestic),
            totalTradefm = numeral((totalTrade)*.000001).format('0,0.0')+' M',
            prevTrade = parseInt(data[yr-1].swt_import) + parseInt(data[yr-1].swt_export) + parseInt(data[yr-1].domestic),
            regionalTradeChange = (((totalTrade - prevTrade) / prevTrade)*100).toFixed(1),
            nationalTradeChange =  (((parseInt(data[yr].nation_tot) - parseInt(data[yr-1].nation_tot)) / parseInt(data[yr-1].nation_tot))*100).toFixed(1),
            tradeComparison = calcDifference(regionalTradeChange, nationalTradeChange),
            //foreign trade indicator calculations
            foreignTrade = data[yr].foreign_val,
            foreignTradefm = '$'+ numeral((foreignTrade*0.000000001)).format('0,0') +' B',
            prevForeign = data[yr-1].foreign_val,
            foreignChange = ((foreignTrade - prevForeign) / prevForeign)*100,
            usForeignChange = ((data[yr].us_foreign - data[yr-1].us_foreign)/data[yr-1].us_foreign)*100,
            foreignComparison = calcDifference(foreignChange, usForeignChange),
            //export indicators
            exportPercent = (parseInt(data[yr].swt_export) / (parseInt(data[yr].swt_export) + parseInt(data[yr].swt_import)))*100,
            exportArray = [exportPercent, 100 - exportPercent],
            prevExport = (parseInt(data[yr-1].swt_export) / (parseInt(data[yr-1].swt_export) + parseInt(data[yr-1].swt_import)))*100,
            exportChange = ((parseInt(data[yr].swt_export) - parseInt(data[yr-1].swt_export)) / parseInt(data[yr-1].swt_export))*100,
            usExportChange = ((parseInt(data[yr].us_export) - parseInt(data[yr-1].us_export)) / parseInt(data[yr-1].us_export))*100,
            exportTons = parseInt(data[yr].swt_export )*.000001,
            exportComparison = calcDifference(exportChange, usExportChange),
            
            //export indicators
            containerPercent = (parseInt(data[yr].swt_cont_tons) / (parseInt(data[yr].swt_export) + parseInt(data[yr].swt_import)))*100,
            containerArray = [containerPercent, 100 - containerPercent],
            prevContainer = (parseInt(data[yr-1].swt_cont_tons) / (parseInt(data[yr-1].swt_export) + parseInt(data[yr-1].swt_import)))*100,
            containerChange = ((containerPercent - prevContainer) / prevContainer)*100;
        }
        console.log(tradeComparison);
        console.log(foreignComparison);

        //update port rank indicators
        $('#mi-rank-value').html(portRank);
        if(portChange < 0){
          $('#mi-rank-icon').html(ind_up); 
        }else if(portChange > 0){
          $('#mi-rank-icon').html(ind_down); 
        }else{$('#mi-rank-icon').html(ind_even);}

        //update total trade indicators
        $('#mi-regional').html(regionalTradeChange + '%');
        $('#mi-national').html(nationalTradeChange + '%');
        $('#mi-total-trade-value').html(totalTradefm);
        if(tradeComparison < -5){
          $('#mi-total-icon').html(ind_down); 
        }else if(tradeComparison > 5){
          $('#mi-total-icon').html(ind_up); 
        }else{$('#mi-total-icon').html(ind_even);}
        
        //update foreign trade indicators
        $('#mi-foreign-value').html(foreignTradefm);
        $('#mi-foreign-percent').html((foreignChange).toFixed(1) + '%');
        $('#mi-foreign-national').html((usForeignChange).toFixed(1) + '%');
        if(foreignComparison > 5){
          $('#mi-foreign-icon').html(ind_up); 
        }else if(foreignComparison < -5){
          $('#mi-foreign-icon').html(ind_down); 
        }else{$('#mi-foreign-icon').html(ind_even);} 
        
        //build pie charts
        var pieHeight = 98,
            pieWidth = $('#mi-export-graph').width(),
            radius = Math.min(pieHeight, pieWidth) / 2,
            donutWidth = 15;
       
        var donutColor = d3.scale.ordinal()
          .range(['#EAA51B','#efefef']);

        var exportDonutColor = donutColor.domain(exportArray);
        var containerDonutColor = donutColor.domain(containerArray);

        var exportDonut = d3.select('#mi-export-graph')
          .append('svg')
          .attr('width',pieWidth)
          .attr('height',108)
          .append('g')
          .attr('transform', 'translate(' + (pieWidth / 2)+','+ (108 / 2) + ')');

        var containerDonut = d3.select('#mi-container-graph')
          .append('svg')
          .attr('width',pieWidth)
          .attr('height',108)
          .append('g')
          .attr('transform', 'translate(' + (pieWidth / 2)+','+ (108 / 2) + ')');

        var leftArc = d3.svg.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius)
          .startAngle(function (d){ return d.startAngle + Math.PI;})
          .endAngle(function (d){ return d.endAngle + Math.PI;});
        
        var rightArc = d3.svg.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius)
          .startAngle(function (d){ return Math.PI - d.startAngle;})
          .endAngle(function (d){ return Math.PI - d.endAngle;});

        var pie = d3.layout.pie()
          .value(function(d, i){return d; })
          .sort(null);

        var exportPath = exportDonut.selectAll('path')
          .data(pie(exportArray))
          .enter()
          .append('path')
          .attr('d', leftArc)
          .attr('fill', function(d, i){
            return exportDonutColor(d.value);
          })

        var exportLabel = d3.select('#mi-export-graph')
          .append('div')
          .attr('id', 'mi-export-label')
          .style('top', (pieHeight / 2) - 12 + 'px');
          //.html(exportPercent.toFixed(0) + '%');

        var containerPath = containerDonut.selectAll('path')
          .data(pie(containerArray))
          .enter()
          .append('path')
          .attr('d', rightArc)
          .attr('fill', function(d, i){
            return containerDonutColor(d.value);
          });
        
        var containerLabel = d3.select('#mi-container-graph')
          .append('div')
          .attr('id', 'mi-container-label')
          .style('top', (pieHeight / 2) - 12 + 'px')
          .html(containerPercent.toFixed(0) + '%');

          //update export indicators
        $('#mi-export-change').html((exportChange).toFixed(1) + '%');
        $('#mi-export-percent').html(exportPercent.toFixed(0) + '%');
        $('#mi-export-national').html((usExportChange).toFixed(1) + '%');
        $('#mi-export-value').html(exportTons.toFixed(1) + ' M');
        $('#mi-export-indicator').html(calcChange(exportChange));
        if(exportComparison > 5){
          $('#mi-export-icon').html(ind_up); 
        }else if(exportComparison < -5){
          $('#mi-export-icon').html(ind_down); 
        }else{$('#mi-export-icon').html(ind_even);} 

        //update export indicators
        $('#mi-container-percent').html((containerChange).toFixed(0) + '%');
        $('#mi-container-indicator').html(calcChange(containerChange));
        if(containerChange > 3){
          $('#mi-container-icon').html(ind_up); 
        }else if(containerChange < -3){
          $('#mi-container-icon').html(ind_down); 
        }else{$('#mi-container-icon').html(ind_even);} 
        

      }
        
//load data once on document ready
      updateTradePanel(miYear);



      });
  $( '#maritime-year-dropdown' ).on( 'change', 'input', function () {
        var newYear = parseInt($(this).val());
        updateTradePanel(newYear);
      });
});

    