$(function() {
      var margin = {top: 20, right: 55, bottom: 30, left: 60},
          chartW = $('#maritimeChartWrapper').width(),
          width  = chartW - margin.left - margin.right,
          height = 200  - margin.top  - margin.bottom;

      var parseDate = d3.time.format("%Y").parse;
      
      var bisectDate = d3.bisector(function (d) {
          return d.year;
      }).right;

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

      d3.csv("data/d3/maritimeIndicators.csv", function (data) {
        var labelVar = 'year';
        
        var varNames = ['swt-export','swt-import','domestic'];
        
        color.domain(varNames);

        var seriesArr = [], series = {}, containers = [];

        varNames.forEach(function (name) {
            series[name] = {name: name, values:[]};
            seriesArr.push(series[name]);
        });
        
        var l = new Date();
        var thisYear = l.getFullYear();
        data.map(function (d) {
          if(d.year != thisYear-1){
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
          .interpolate("basis")
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y0(d.value); });

        svg.append("path")
          //.attr("class", "streamPath")
          .attr("d", line(containers))
          .attr("stroke", "black")
          .attr("fill","none")
          .attr("stroke-width", 3);
        

       
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickFormat(formatYvalues)
            .orient("left");

        var yAxisRight = d3.svg.axis()
            .scale(y0)
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
            .text("total tons of trade");

        var focus = svg.append('g')
            .attr('class', 'focus')
            .style('display', 'none')
            .attr("x1", 100).attr("x2", 100);

       

        var mouseLine = focus.append("line") // create a vertical line to follow mouse
            .attr("class","mouseLine") 
            .attr("stroke-dasharray","2,2")
            .attr("stroke-linecap","round") 
            .style("stroke","white")
            .style("stroke-width", "1px")
            .attr("x1", 10).attr("x2", 10) 
            .attr("y1", 0).attr("y2", height);

         var circles = focus.selectAll('circle')
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

          //create tooltip and tooltip elements
          var dataWindow = d3.select('#maritimeTradeChart')
              .append("div")
              .attr("class", "mi-data-window panel panel-primary");

          dataWindow.append('div')
              .html('<div class="mi-dw-title">Trade for <span class="mi-dw-year">2014</span></div><div class=""><div class="mi-data-swatch dkblue-bg"></div> <em>Domestic:</em> <span class="mi-dw-domestic">xxx</span> M tons</div><div class=""><div class="mi-data-swatch blue-bg"></div><em>Imports:</em> <span class="mi-dw-import">xxx</span> M tons</div><div class=""><div class="mi-data-swatch ltblue-bg"></div><em>Exports:</em> <span class="mi-dw-export">xxx</span> M tons</div>');


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
            //identify current mouseover position and add circles
            var x0 = x.invert(d3.mouse(this)[0]);
                if(x0.getMonth() > 5){
                  var dd0 =  x0.getFullYear() + 1;
                }else{ var dd0 = x0.getFullYear();}
            var i = bisectDate(data, dd0, 1),
                d0 = data[i - 1].year,
                d1 = data[i].year,
                c = dd0 - d0 > d1 - dd0 ? [d1, i] : [d0, i - 1];
                
            circles.transition()
                .duration(50)
                .attr('transform', function (d) {
                var yV,
                    exp_val = seriesArr[0].values[c[1]].value,
                    imp_val = seriesArr[1].values[c[1]].value,
                    dom_val = seriesArr[2].values[c[1]].value;
                switch(d.name){
                  case 'swt-import': 
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
      });
});