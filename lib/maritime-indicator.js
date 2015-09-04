      var margin = {top: 20, right: 55, bottom: 30, left: 60},
          width  = 750 - margin.left - margin.right,
          height = 200  - margin.top  - margin.bottom;

      var parseDate = d3.time.format("%Y").parse;
      
      var bisectDate = d3.bisector(function (d) {
          return d.year;
      }).right;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
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

      d3.csv("data/d3/maritimeIndicators.csv", function (data) {
        var labelVar = 'year';
        
        var varNames = ['swt-export','swt-import','domestic'];
        
        color.domain(varNames);

        var seriesArr = [], series = {};

        varNames.forEach(function (name) {
            series[name] = {name: name, values:[]};
            seriesArr.push(series[name]);
        });
        
        var l = new Date();
        var thisYear = l.getFullYear();
        data.map(function (d) {
          //if(d.year != thisYear-1){
            varNames.map(function (name) {
              series[name].values.push({label: parseDate(d[labelVar]), value: +d[name]});
            });
          //}else{

          //}
        });

        //x.domain(data.map(function (d) { if(d.year != thisYear-1){return d.year;}else{} }));

        x.domain([d3.min(seriesArr, function(d) { return d3.min(d.values, function (d) { return d.label; }); }),
           d3.max(seriesArr, function(d) { return d3.max(d.values, function (d) { return d.label; }); })]);

        //x.domain(data.map(function (d) { var idate = new Date(d.year); return parseDate(idate)}));
        
        stack(seriesArr);

        y.domain([0, d3.max(seriesArr, function (c) { 
            return d3.max(c.values, function (d) { return d.y0 + d.y; });
          })]);


        var selection = svg.selectAll(".series")
          .data(seriesArr)
          .enter().append("g")
            .attr("class", "series");

        selection.append("path")
          .attr("class", "streamPath")
          .attr("d", function (d) { return area(d.values); })
          .style("fill", function (d) { return color(d.name); })
          .style("stroke", "white");
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("total tons of trade");

        var focus = svg.append('g')
            .attr('class', 'focus')
            .style('display', 'none');

        var circles = focus.selectAll('circle')
            .data(seriesArr)
            .enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('r', 6)
            .attr('fill', function (d) {
                return color(d.name);
            })
            .attr('stroke', '#fff');

        svg.append("path") // this is the black vertical line to follow mouse
            .attr("class","mouseLine")  
            .style("stroke","black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        svg.append('svg:rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', function () {
                focus.style('display', null);
            })
                .on('mouseout', function () {
                focus.style('display', 'none');
            })
            .on('mousemove', mousemove);

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                dd0 = x0.getFullYear(),
                i = bisectDate(data, dd0, 1),
                d0 = data[i - 1].year,
                d1 = data[i].year,
                c = dd0 - d0 > d1 - dd0 ? [d1, i] : [d0, i - 1];
                
            circles.attr('transform', function (d) {
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
                return 'translate(' + x(parseDate(c[0])) + ',' + y(yV) + ')'
            });
          }
      });
