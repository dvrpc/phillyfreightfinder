      var margin = {top: 20, right: 55, bottom: 30, left: 60},
          width  = 750 - margin.left - margin.right,
          height = 200  - margin.top  - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

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
        
       var varNames = ['domestic','swt-export','swt-import'];
        
        /*var varNames = d3.keys(data[0])
            .filter(function (key) { return key !== labelVar;});
            //console.log(error);*/
            //console.log(data);
        color.domain(varNames);

        var seriesArr = [], series = {};

        varNames.forEach(function (name) {
          series[name] = {name: name, values:[]};
          seriesArr.push(series[name]);
        });
        
        var d = new Date();
        var thisYear = d.getFullYear();
        data.forEach(function (d) {
          if(d.year != thisYear-1){
            varNames.map(function (name) {
              series[name].values.push({label: d[labelVar], value: +d[name]});
            });
          }else{

          }
        });

        x.domain(data.map(function (d) { if(d.year != thisYear-1){return d.year;}else{} }));
        
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
        
        var points = svg.selectAll(".seriesPoints")
          .data(seriesArr)
          .enter().append("g")
            .attr("class", "seriesPoints");

        points.selectAll(".point")
          .data(function (d) { return d.values; })
          .enter().append("circle")
           .attr("class", "mi-point")
           .attr("cx", function (d) { return x(d.label) + x.rangeBand() / 2; })
           .attr("cy", function (d) { return y(d.y0 + d.y); })
           .attr("r", "4px")
           .style("fill",function (d) { return color(d.name); })
           //.on("mouseover", function (d) { showPopover.call(this, d); })
           //.on("mouseout",  function (d) { removePopovers(); })

        function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }

        function showPopover (d) {
          $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html : true,
            content: function() { 
              return "Quarter: " + d.label + 
                     "<br/>Rounds: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
          });
          $(this).popover('show')
        }
        console.log(seriesArr);
      });
