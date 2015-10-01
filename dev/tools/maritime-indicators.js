$(function() {
    console.log('maritime indicators loaded');
    var miYear, updateTradePanel, sizePorts;
    var packer = sm.packer();
    var ind_up = '<i class="glyphicon glyphicon-circle-arrow-up"></i>',
        ind_even = '<i class="glyphicon glyphicon-circle-arrow-right"></i>',
        ind_down = '<i class="glyphicon glyphicon-circle-arrow-down"></i>';

    

    // ********************************************
    // Open data sets

    d3.csv('data/d3/port_diagram.csv', function(port_points) {
        d3.csv('data/d3/port_activity.csv', function(port_data) {
            d3.json("data/d3/river_diagram.json", function(json) {
                //build the port diagram
                var port_dia_width = $('#mi-port-diagram-wrapper').width() + 40,
                    port_dia_height = $('#mi-port-diagram-wrapper').height() + 30;

                var port_svg = d3.select('#mi-port-diagram').append('svg')
                    .attr('width', port_dia_width)
                    .attr('height', port_dia_height)
                    .attr('id', 'port_map');

                var river = port_svg.append('g')
                    .attr('width', port_dia_width)
                    .attr('height', port_dia_height)
                    .attr('id', 'river');

                port_svg.append('g')
                    .attr('width', port_dia_width)
                    .attr('height', port_dia_height)
                    .attr('id', 'ports');
                // draw river outline
                var dia_projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0).rotate([0, -10, 0]);

                var river_path = d3.geo.path().projection(dia_projection);
                var bounds = river_path.bounds(json);

                var scale = 1.12 / Math.max((bounds[1][0] - bounds[0][0]) / (port_dia_width), ((bounds[1][1] - bounds[0][1]) / port_dia_height));

                var transl = [(port_dia_width - 200 - scale * (bounds[1][0] + bounds[0][0])) / 2, (port_dia_height - 90 - scale * (bounds[1][1] + bounds[0][1])) / 2];

                dia_projection.scale(scale).translate(transl);

                river.selectAll("path")
                    .data(json.features)
                    .enter().append("path")
                    .attr("d", river_path);

                var portCount, prevPortCount, portCallChange;

                // ***********************************************************/
                // add port circles to port diagram

                function addPortCircles(a, r) {
                    for (var i = 0; i < a.length; i++) {
                        var port = a[i];


                        var xy = dia_projection([port.lon, port.lat]);

                        var element = d3.select('#ports').append('g')
                            .attr('transform', 'translate(' + Math.round(xy[0]) + ',' + Math.round(xy[1]) + ')')
                            .attr('r', r)
                            .attr('id', 'port_' + port.port_link)
                            .attr('class', function(){
                                if(port.port_typ === 'b'){
                                   return 'port mi-bulk-terminal'; 
                                }else{
                                    return 'port mi-general-terminal';
                                } 
                            });

                        element.append('circle')
                            .attr('r', r);

                        element.append("text")
                            .attr("class","mi-port-label")
                            .attr("text-anchor", function(){
                                return (port.dir === 'l') ? "end" : "start";
                            })
                            .attr("x", function(){
                                return ((port.dir === 'l') ? -18 : 18);
                            })
                            .attr("y",0)
                            .attr("dy", ".35em")
                            .text(port.port_name)
                            .call(wrap, 100)
                            .attr("transform", "rotate(65)" );
                    }

                    var tspanItems = d3.selectAll(".mi-two-line");
                    tspanItems.each(function(){
                        var parent = d3.select(this.parentNode);
                        parent.select('tspan.mi-child')
                            .attr("dy", "-.25em");
                        
                        

                    });
                }


                function wrap(text, width) {
                    text.each(function () {
                        var text = d3.select(this),
                            words = text.text().split(/\s+/).reverse(),
                            word,
                            line = [],
                            lineNumber = 0,
                            lineHeight = 0.9, // ems
                            x = text.attr("x"),
                            y = text.attr("y"),
                            dy = 0.35, //parseFloat(text.attr("dy")),
                            tspan = text.text(null)
                                        .append("tspan")
                                        .attr("class","mi-child")
                                        .attr("x", x)
                                        .attr("y", y)
                                        .attr("dy", dy + "em");
                        while (word = words.pop()) {
                            line.push(word);
                            tspan.text(line.join(" "));
                            if (tspan.node().getComputedTextLength() > width) {
                                line.pop();
                                tspan.text(line.join(" "));
                                line = [word];
                                tspan = text.append("tspan")
                                            .classed("mi-child", false)
                                            .attr("class", "mi-two-line")
                                            .attr("x", x)
                                            .attr("y", y)
                                            .attr("dy", ".65em")
                                            .text(word);
                            }
                        }
                    });
                }
                console.log('maritime indicators parsed');
                addPortCircles(port_points, 3);

                // *********************************************
                // size port circles based on ship calls

                function sizePorts(count_year) {
                    var scaleRange = [],
                        minSize = [],
                        maxSize = [],
                        tc = 0,
                        pc = 0, pLabel;
                    for (var i = 0; i < port_data.length; i++) {
                        var d = port_data[i];
                        //if(parseInt(d.year) === count_year){
                        scaleRange.push(parseInt(d.calls));
                        //}
                    }

                    var minSize = d3.min(scaleRange),
                        maxSize = d3.max(scaleRange),
                        portScale = d3.scale.pow()
                        .exponent(0.8)
                        .domain([minSize, maxSize])
                        .range([5, 19]);
                            

                    // loop through data and size metros related to primary
                    for (var i = 0; i < port_data.length; i++) {
                        var d = port_data[i],
                            r, j = 0;

                        //identify measurement of moves 
                        r = portScale(parseInt(d.calls));

                        if (parseInt(d.year) === count_year && d.calls > 0) {
                            tc = Number(tc) + Number(d.calls); 
                            var elem = d3.select('#port_' + d.link_id);
                            elem.attr('r', r)
                                .classed({'mi-no-activity':false})
                                .select('circle')
                                .transition()
                                .duration(500)
                                .attr('r', r)
                                .attr('i', j)
                                .attr('val', d.calls)
                                .attr('name', portname(d.link_id));
                            j++
                        }else if (parseInt(d.year) === count_year){
                            var elem = d3.select('#port_' + d.link_id);
                            elem.attr('r', 4)
                                .classed({'mi-no-activity':true})
                                .select('circle')
                                .transition()
                                .duration(500)
                                .attr('r', 4)
                                .attr('val', d.calls)
                                .attr('name', portname(d.link_id));
                        }

                        if (parseInt(d.year) === (count_year - 1)) {
                            pc = Number(pc) + Number(d.calls); 
                        }
                    }

                    for (var i = 0; i < port_data.length; i++) {
                        var d = port_data[i];
                        if(parseInt(d.year) === (count_year - 1)){
                            var elem = d3.select('#port_' + d.link_id);
                            elem.select('circle').attr('prev', d.calls);
                        }
                    }

                    $("svg circle").unbind('mouseenter mouseleave');

                    $('#mi-vessel-count').html(numeral(tc).format('0,0'));
                    var totalCallChange = ((tc - pc) / pc)*100;
                    $('#mi-vessel-percent').html((totalCallChange).toFixed(0) + '%');
                    if (totalCallChange > 5) {
                        $('#mi-vessel-icon').html(ind_up);
                    } else if (totalCallChange < -5) {
                        $('#mi-vessel-icon').html(ind_down);
                    } else {
                        $('#mi-vessel-icon').html(ind_even);
                    }    

                    packPorts(); //run packer on resized ports
                    
                    d3.selectAll('.port circle').on('mouseover', null);
                    d3.selectAll('.port circle').on('mouseout', null);
                    d3.selectAll('.port circle')
                        .on('mouseover', function(e) {
                            d3.select(this).classed("active", true);
                            var a = this.getAttribute('val'), p = this.getAttribute('prev'), n = this.getAttribute('name');
                            var portCallChange = ((a - p) / p)*100;
                            $('#mi-vessel-count').html(numeral(a).format('0,0')); 
                            $('#mi-vessel-percent').html((portCallChange).toFixed(0) + '%');
                            $('#mi-vessel-title').html(n);
                            if (portCallChange > 5) {
                                $('#mi-vessel-icon').html(ind_up);
                            } else if (portCallChange < -5) {
                                $('#mi-vessel-icon').html(ind_down);
                            } else {
                                $('#mi-vessel-icon').html(ind_even);
                            }
                            
                        })
                        .on('mouseout', function(e) {
                            d3.select(this).classed("active", false);//.style("stroke-width", 0);   
                            $('#mi-vessel-count').html(numeral(tc).format('0,0'));   
                            $('#mi-vessel-percent').html((totalCallChange).toFixed(0) + '%'); 
                            $('#mi-vessel-title').html('All DVRPC Terminals');
                            if (totalCallChange > 5) {
                                $('#mi-vessel-icon').html(ind_up);
                            } else if (totalCallChange < -5) {
                                $('#mi-vessel-icon').html(ind_down);
                            } else {
                                $('#mi-vessel-icon').html(ind_even);
                            }    
                        });
                    
                }

                function portname(id){
                    for (var i = 0; i < port_points.length; i++) {
                        var dn = port_points[i];
                        if(dn.port_link === id){
                            return dn.port_name;
                        }
                    }
                }

                

                function packPorts() {
                    var elements = d3.selectAll('#ports .port')[0];
                    packer.elements(elements).start();
                }

                //configure maritime trade chart presets
                var margin = {
                        top: 20,
                        right: 55,
                        bottom: 30,
                        left: 60
                    },
                    chartW = $('#maritimeChartWrapper').width(),
                    width = chartW - margin.left - margin.right,
                    height = 200 - margin.top - margin.bottom;

                var parseDate = d3.time.format("%Y").parse;

                var bisectDate = d3.bisector(function(d) {
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
                    .values(function(d) {
                        return d.values;
                    })
                    .x(function(d) {
                        return x(d.label);
                    })
                    .y(function(d) {
                        return d.value;
                    });

                var area = d3.svg.area()
                    .interpolate("cardinal")
                    .x(function(d) {
                        return x(d.label);
                    })
                    .y0(function(d) {
                        return y(d.y0);
                    })
                    .y1(function(d) {
                        return y(d.y0 + d.y);
                    });

                var color = d3.scale.ordinal()
                    .range(["#7ca0d5", "#396ab2", "#312A6A"]);

                var svg = d3.select("#maritimeTradeChart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // *******************************************
                // maritime trade chart functions
                function formatYvalues(n) {
                    var value = n * 0.000001 + ' M';
                    return value;
                }

                function formatY0values(n) {
                    var value = n * 0.001 + ' k';
                    return value;
                }

                // ****************************************
                // load maritime trade chart data and build chart

                d3.csv("data/d3/maritimeIndicators.csv", function(data) {
                    var labelVar = 'year';

                    var l = new Date();
                    var thisYear = l.getFullYear();

                    var varNames = ['swt_export', 'swt_import', 'domestic'];

                    color.domain(varNames);

                    var seriesArr = [],
                        series = {},
                        containers = [];

                    varNames.forEach(function(name) {
                        series[name] = {
                            name: name,
                            values: []
                        };
                        seriesArr.push(series[name]);
                    });

                    var maxDataYear = d3.max(data, function(d) {
                        return d.year;
                    });
                    miYear = maxDataYear - 1;
                    $('#mi-year-select').html(miYear + ' <span class="caret"></span>');
                    for (var i = 2003; i <= maxDataYear; i++) {
                        $('#maritime-year-dropdown').append('<li><input type="radio" id="m' + i + '" class="miYear" name="miYear" value="' + i + '"><label for="m' + i + '">' + i + '</label></li>');
                    }
                    $('#m' + (maxDataYear - 1)).prop('checked', true);

                    data.map(function(d) {
                        if (d.year != thisYear - 1 && d.year > 2002) {
                            varNames.map(function(name) {
                                series[name].values.push({
                                    label: parseDate(d[labelVar]),
                                    value: +d[name]
                                });
                            });
                            //prep y0 data [containers]
                            containers.push({
                                year: parseDate(d.year),
                                value: +d.cont_teu
                            });
                        }
                    });


                    //define min and max years
                    var minYear = d3.min(seriesArr, function(d) {
                            return d3.min(d.values, function(d) {
                                return d.label;
                            });
                        }),
                        maxYear = d3.max(seriesArr, function(d) {
                            return d3.max(d.values, function(d) {
                                return d.label;
                            });
                        });

                    //push to label
                    $('#mi-trade-date-min').html(minYear.getFullYear());
                    $('#mi-trade-date-max').html(maxYear.getFullYear());

                    x.domain([minYear, maxYear]);

                    stack(seriesArr);

                    y.domain([0, d3.max(seriesArr, function(c) {
                        return d3.max(c.values, function(d) {
                            return d.y0 + d.y;
                        });
                    })]);

                    y0.domain([0, d3.max(containers, function(d) {
                        return Math.max(d.value);
                    })]);

                    var selection = svg.selectAll(".series")
                        .data(seriesArr)
                        .enter().append("g")
                        .attr("class", "series");

                    selection.append("path")
                        .attr("class", "streamPath")
                        .attr("d", function(d) {
                            return area(d.values);
                        })
                        .style("fill", function(d) {
                            return color(d.name);
                        })
                        .style("stroke", "white");

                    var line = d3.svg.line()
                        .interpolate("cardinal")
                        .x(function(d) {
                            return x(d.year);
                        })
                        .y(function(d) {
                            return y0(d.value);
                        });

                    svg.append("path")
                        .attr("d", line(containers))
                        .attr("stroke", "#EAA51B")
                        .attr("fill", "none")
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
                        .attr("x", -height / 2)
                        .attr("transform", "rotate(-90)")
                        .style("text-anchor", "middle")
                        .text("tons of trade");

                    svg.append("g")
                        .attr("class", "y0 axis")
                        .attr("transform", "translate(" + width + ",0)")
                        .call(yAxisRight)
                        .append("text")
                        .attr("y", 45)
                        .attr("dy", ".71em")
                        .attr("x", -height / 2)
                        .attr("transform", "rotate(-90)")
                        .style("text-anchor", "middle")
                        .text("TEUs of containerized cargo");

                    var focus = svg.append('g')
                        .attr('class', 'focus')
                        .style('display', 'none')
                        .attr("x1", 100).attr("x2", 100);

                    //hover line to track mouse position
                    var mouseLine = focus.append("line")
                        .attr("class", "mouseLine")
                        .attr("stroke-dasharray", "2,2")
                        .attr("stroke-linecap", "round")
                        .style("stroke", "#efefef")
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
                        .attr('fill', function(d) {
                            return color(d.name);
                        })
                        .attr('stroke', '#fff')
                        .attr('transform', function(d) {
                            return 'translate(0,' + y(d.values[0].y) + ')';
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
                        .html('<div class="mi-dw-title">Trade for <span class="mi-dw-year">2014</span></div><div class=""><div class="mi-data-swatch dkblue-bg"></div> Domestic: <span class="right_align"><span class="mi-dw-domestic">xxx</span> M tons</span></div><div class=""><div class="mi-data-swatch blue-bg"></div>Imports: <span class="right_align"><span class="mi-dw-import">xxx</span> M tons</span></div><div class=""><div class="mi-data-swatch ltblue-bg"></div>Exports: <span class="right_align"><span class="mi-dw-export">xxx</span> M tons</span></div><div class="mi-data-swatch orange-bg"></div>Containers: <span class="right_align"><span class="mi-dw-containers">xxx</span> k TEUs</span></div>');

                    //create overlay to read mouseevents
                    svg.append('svg:rect')
                        .attr('class', 'overlay')
                        .attr('width', width)
                        .attr('height', height)
                        .on('mouseover', function() {
                            focus.style('display', null);
                            dataWindow.style('display', 'block');
                        })
                        .on('mouseout', function() {
                            focus.style('display', 'none');
                            dataWindow.style('display', 'none');
                        })
                        .on('mousemove', mousemove);

                    function mousemove() {
                        //identify current mouseover position and move circles
                        var x0 = x.invert(d3.mouse(this)[0]);
                        if (x0.getMonth() > 5) {
                            var dd0 = x0.getFullYear() + 1;
                        } else {
                            var dd0 = x0.getFullYear();
                        }
                        var i = bisectDate(data, dd0, 1),
                            d0 = data[i - 1].year,
                            d1 = data[i].year,
                            c = dd0 - d0 > d1 - dd0 ? [d1, i - 1] : [d0, i - 2]; //adjust i to reflect drop of 2002 from data

                        circles.transition()
                            .duration(50)
                            .attr('transform', function(d) {
                                var yV,
                                    exp_val = seriesArr[0].values[c[1]].value,
                                    imp_val = seriesArr[1].values[c[1]].value,
                                    dom_val = seriesArr[2].values[c[1]].value;
                                switch (d.name) {
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
                                $('.mi-dw-domestic').html((dom_val * 0.000001).toFixed(2));
                                $('.mi-dw-import').html((imp_val * 0.000001).toFixed(2));
                                $('.mi-dw-export').html((exp_val * 0.000001).toFixed(2));
                                return 'translate(' + x(parseDate(c[0])) + ',' + y(yV) + ')';
                            });

                        contCircles.transition()
                            .duration(50)
                            .attr('transform', function(d) {
                                $('.mi-dw-containers').html((containers[c[1]].value * 0.001).toFixed(0));
                                return 'translate(' + x(parseDate(c[0])) + ',' + y0(containers[c[1]].value) + ')';
                            });

                        //create tracking for hover line
                        mouseLine.transition()
                            .duration(50)
                            .attr("x1", x(parseDate(c[0]))).attr("x2", x(parseDate(c[0])));
                        if (x(parseDate(c[0])) > width / 2) {
                            dataWindow.transition()
                                .duration(50)
                                .style('left', (x(parseDate(c[0])) - 115) + 'px');
                        } else {
                            dataWindow.transition()
                                .duration(50)
                                .style('left', (x(parseDate(c[0])) + 95) + 'px');
                        }
                    }

                    //********************************************************
                    //  Controls for side panel data based on year of input
                    //
                    //********************************************************

                    

                    function calcDifference(val1, val2) {
                        if (val1 < 0 && val2 < 0) {
                            return (val1 > val2) ? -(val2 - val1) : val1 - val2;
                        } else if (val1 < 0 && val2 > 0) {
                            return -(val2 - val1);
                        } else {
                            return (val1 > val2) ? val1 - val2 : val2 - val1;
                        }
                    }

                    function calcChange(value) {
                        return (value > 0) ? 'change' : 'change';
                    }
                    updateTradePanel = function(mYear) {
                        $('#mi-export-graph').html('');
                        $('#mi-container-graph').html('');
                        $('.mi-activity-year').html(mYear);
                        var yr = mYear - 2002;
                        if (data[yr].port_rank !== "") {
                            //port rank indicator calculations
                            var portRank = data[yr].port_rank,
                                prevRank = data[yr - 1].port_rank,
                                portChange = portRank - prevRank,
                                //trade indicator calculations
                                totalTrade = parseInt(data[yr].swt_import) + parseInt(data[yr].swt_export) + parseInt(data[yr].domestic),
                                totalTradefm = numeral((totalTrade) * 0.000001).format('0,0.0') + ' M',
                                prevTrade = parseInt(data[yr - 1].swt_import) + parseInt(data[yr - 1].swt_export) + parseInt(data[yr - 1].domestic),
                                regionalTradeChange = (((totalTrade - prevTrade) / prevTrade) * 100).toFixed(1),
                                nationalTradeChange = (((parseInt(data[yr].nation_tot) - parseInt(data[yr - 1].nation_tot)) / parseInt(data[yr - 1].nation_tot)) * 100).toFixed(1),
                                tradeComparison = calcDifference(regionalTradeChange, nationalTradeChange),
                                //foreign trade indicator calculations
                                foreignTrade = data[yr].foreign_val,
                                foreignTradefm = '$' + numeral((foreignTrade * 0.000000001)).format('0,0') + ' B',
                                prevForeign = data[yr - 1].foreign_val,
                                foreignChange = ((foreignTrade - prevForeign) / prevForeign) * 100,
                                usForeignChange = ((data[yr].us_foreign - data[yr - 1].us_foreign) / data[yr - 1].us_foreign) * 100,
                                foreignComparison = calcDifference(foreignChange, usForeignChange),
                                //export indicators
                                exportPercent = (parseInt(data[yr].swt_export) / (parseInt(data[yr].swt_export) + parseInt(data[yr].swt_import))) * 100,
                                exportArray = [exportPercent, 100 - exportPercent],
                                prevExport = (parseInt(data[yr - 1].swt_export) / (parseInt(data[yr - 1].swt_export) + parseInt(data[yr - 1].swt_import))) * 100,
                                exportChange = ((parseInt(data[yr].swt_export) - parseInt(data[yr - 1].swt_export)) / parseInt(data[yr - 1].swt_export)) * 100,
                                usExportChange = ((parseInt(data[yr].us_export) - parseInt(data[yr - 1].us_export)) / parseInt(data[yr - 1].us_export)) * 100,
                                exportTons = parseInt(data[yr].swt_export) * 0.000001,
                                exportComparison = calcDifference(exportChange, usExportChange),

                                //export indicators
                                containerPercent = (parseInt(data[yr].swt_cont_tons) / (parseInt(data[yr].swt_export) + parseInt(data[yr].swt_import))) * 100,
                                containerArray = [containerPercent, 100 - containerPercent],
                                prevContainer = (parseInt(data[yr - 1].swt_cont_tons) / (parseInt(data[yr - 1].swt_export) + parseInt(data[yr - 1].swt_import))) * 100,
                                containerChange = ((containerPercent - prevContainer) / prevContainer) * 100;
                        }


                        //update port rank indicators
                        $('#mi-rank-value').html(portRank);
                        if (portChange < 0) {
                            $('#mi-rank-icon').html(ind_up);
                        } else if (portChange > 0) {
                            $('#mi-rank-icon').html(ind_down);
                        } else {
                            $('#mi-rank-icon').html(ind_even);
                        }

                        //update total trade indicators
                        $('#mi-regional').html(regionalTradeChange + '%');
                        $('#mi-national').html(nationalTradeChange + '%');
                        $('#mi-total-trade-value').html(totalTradefm);
                        if (tradeComparison < -5) {
                            $('#mi-total-icon').html(ind_down);
                        } else if (tradeComparison > 5) {
                            $('#mi-total-icon').html(ind_up);
                        } else {
                            $('#mi-total-icon').html(ind_even);
                        }

                        //update foreign trade indicators
                        $('#mi-foreign-value').html(foreignTradefm);
                        $('#mi-foreign-percent').html((foreignChange).toFixed(1) + '%');
                        $('#mi-foreign-national').html((usForeignChange).toFixed(1) + '%');
                        if (foreignComparison > 5) {
                            $('#mi-foreign-icon').html(ind_up);
                        } else if (foreignComparison < -5) {
                            $('#mi-foreign-icon').html(ind_down);
                        } else {
                            $('#mi-foreign-icon').html(ind_even);
                        }

                        //build pie charts
                        var pieHeight = 67,
                            pieWidth = $('#mi-export-graph').width(),
                            radius = 67 / 2,
                            //radius = Math.min(pieHeight, pieWidth) / 2,
                            donutWidth = 15,
                            tp = (pieWidth *0.05).toFixed(0);

                        if(pieWidth > 280) {
                            $('#mi-export-percent').css('left', Number(103) + Number(tp) +'px');
                            $('#mi-export-overlay').css('background', 'url("images/mi_export_overlay.png") no-repeat;').css('left', Number(15) + Number(tp) +'px');
                            $('#mi-export-info-label').css('left', Number(190) + Number(tp) +'px');

                            var donutColor = d3.scale.ordinal()
                                .range(['#EAA51B', '#fff']);

                            var exportDonutColor = donutColor.domain(exportArray);
                            var containerDonutColor = donutColor.domain(containerArray);

                            var exportDonut = d3.select('#mi-export-graph')
                                .append('svg')
                                .attr('width', pieWidth)
                                .attr('height', 108)
                                .append('g')
                                .attr('transform', 'translate('+ (Number(46) + Number(tp)) +',' + (108 / 2) + ')');

                            var containerDonut = d3.select('#mi-container-graph')
                                .append('svg')
                                .attr('width', pieWidth)
                                .attr('height', 108)
                                .append('g')
                                .attr('transform', 'translate(' + (pieWidth / 2) + ',' + (108 / 2) + ')');

                            var leftArc = d3.svg.arc()
                                .outerRadius(radius)
                                .startAngle(function(d) {
                                    return d.startAngle + Math.PI;
                                })
                                .endAngle(function(d) {
                                    return d.endAngle + Math.PI;
                                });

                            var rightArc = d3.svg.arc()
                                .innerRadius(radius - donutWidth)
                                .outerRadius(radius)
                                .startAngle(function(d) {
                                    return Math.PI - d.startAngle;
                                })
                                .endAngle(function(d) {
                                    return Math.PI - d.endAngle;
                                });

                            var pie = d3.layout.pie()
                                .value(function(d, i) {
                                    return d;
                                })
                                .sort(null);

                            var exportPath = exportDonut.selectAll('path')
                                .data(pie(exportArray))
                                .enter()
                                .append('path')
                                .attr('d', leftArc)
                                .attr('fill', function(d, i) {
                                    return exportDonutColor(d.value);
                                })

                            var exportLabel = d3.select('#mi-export-graph')
                                .append('div')
                                .attr('id', 'mi-export-label')
                                .style('top', (pieHeight / 2) - 12 + 'px');
                            
                        } else {
                            $('#mi-export-percent').css('left', Number(28) + Number(tp *0.5) +'px');
                            $('#mi-export-overlay').css('background', 'url("lib/images/mi_export_overlay-sm.png") no-repeat').css('left', Number(20) + Number(tp *.5) +'px');
                            $('#mi-export-info-label').css('left', Number(120) + Number(tp *0.45) +'px');
                            
                        }
                        if(pieWidth > 280 && pieWidth < 300){
                            $('#mi-export-percent').css('left', '103px');
                            $('#mi-export-overlay').css('left', '15px');
                            $('#mi-export-info-label').css('left', '180px');
                            $('#mi-export-graph').css('transform', 'translate(-15px,0)');
                        }
                        
                        $('#mi-export-percent').css('display', 'block');
                        $('#mi-export-overlay').css('display', 'block');
                        $('#mi-export-info-label').css('display', 'block');

                        //update export indicators
                        $('#mi-export-change').html((exportChange).toFixed(1) + '%');
                        $('#mi-export-percent').html(exportPercent.toFixed(0) + '%');
                        $('#mi-export-national').html((usExportChange).toFixed(1) + '%');
                        $('#mi-export-value').html(exportTons.toFixed(1) + ' M');
                        $('#mi-export-indicator').html(calcChange(exportChange));
                        if (exportComparison > 5) {
                            $('#mi-export-icon').html(ind_up);
                        } else if (exportComparison < -5) {
                            $('#mi-export-icon').html(ind_down);
                        } else {
                            $('#mi-export-icon').html(ind_even);
                        }

                        //update export indicators
                        $('#mi-container-percent').html((containerChange).toFixed(0) + '%');
                        $('#mi-container-indicator').html(calcChange(containerChange));
                        if (containerChange > 3) {
                            $('#mi-container-icon').html(ind_up);
                        } else if (containerChange < -3) {
                            $('#mi-container-icon').html(ind_down);
                        } else {
                            $('#mi-container-icon').html(ind_even);
                        }


                    }

                    //load data once on document ready
                    updateTradePanel(miYear);
                    sizePorts(miYear);

                    var newYear = miYear;
                    $('#maritime-year-dropdown').on('change', 'input', function() {
                        newYear = parseInt($(this).val());
                        var minYear = document.getElementById("m"+ (newYear - 1));
                        updateTradePanel(newYear);
                        sizePorts(newYear);
                        if(!minYear){
                            $('#mi-year-prev').prop('disabled', true);
                        }else if(!maxYear){
                            $('#mi-year-next').prop('disabled', true);
                        }else{
                            $('#mi-year-prev').prop('disabled', false);
                            $('#mi-year-next').prop('disabled', false);
                        }
                    });

                    $('#mi-year-prev').on('click', function() {
                        var changeSelect = $("#m"+ (newYear - 1));
                        changeSelect.trigger('click'); 
                                             
                    });
                    $('#mi-year-next').on('click', function() {
                        var changeSelect = $("#m"+ (newYear + 1));
                        changeSelect.trigger('click'); 
                                             
                    });
                    $(".btn").mouseup(function(){
                        $(this).blur();
                    });



                });
            });
        });
    });



});
