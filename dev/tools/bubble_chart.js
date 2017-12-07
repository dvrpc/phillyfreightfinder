var getSize = function() {
    elWidth = $('#employment-chart').width();

    return elWidth;
}

var BUBBLE_PARAMETERS = {
    "data_file": "regional_employment_data.csv",
    "report_title": "DVRPC Employment",
    "footer_text": "Concept for PFF Freight Employment tool",
    "width": getSize(),
    "height": 700,
    "force_strength": 0.06,
    "force_type": "charge",
    "radius_field": "employment",
    "numeric_fields": ["employment", "establishments", "wages"],
    "fill_color": {
        "data_field": "type",
        "color_groups": {
            "E": "#312867",
            "P": "#396ab2",
            "D": "#f4b387",
            "C": "#bdcbde"
        }
    },
    "types": ["E","P","D"],
    "modes": [
        {
            "button_text": "All Sectors",
            "button_id": "all",
            "type": "grid",
            "labels": null,
            "grid_dimensions": {"rows": 1, "columns": 1},
            "data_field": null
        },
        {
            "button_text": "Merged bubbles",
            "button_id": "full",
            "type": "grid",
            "labels": null,
            "grid_dimensions": {"rows": 1, "columns": 1},
            "data_field": null
        },
        {
            "button_text": "Color 'em",
            "button_id": "color",
            "type": "color",
            "labels": null,
            "grid_dimensions": {"rows": 1, "columns": 1},
            "data_field": null
        },
        {
            "button_text": "Extraction Industries",
            "button_id": "extraction",
            "type": "isolate",
            "labels": ["Extraction"],
            "isolate": ["E"],
            "grid_dimensions": {"rows": 2, "columns": 1},
            "data_field": "type"
        },
        {
            "button_text": "Production Industries",
            "button_id": "production",
            "type": "isolate",
            "labels": ["Production"],
            "isolate": ["P"],
            "grid_dimensions": {"rows": 2, "columns": 1},
            "data_field": "type"
        },
        {
            "button_text": "Distribution Industries",
            "button_id": "distribution",
            "type": "isolate",
            "labels": ["Distribution"],
            "isolate": ["D"],
            "grid_dimensions": {"rows": 2, "columns": 1},
            "data_field": "type"
        },
        {
            "button_text": "Consumption",
            "button_id": "consumption",
            "type": "isolate",
            "labels": ["Consumption"],
            "isolate": ["C"],
            "grid_dimensions": {"rows": 2, "columns": 1},
            "data_field": "type"
        },
        {
            "button_text": "Wage",
            "button_id": "wage",
            "type": "scatterplot",
            "x_data_field": "wages",
            "y_data_field": "employment",
            "x_format_string": ",.2r",
            "y_format_string": ",.2r"
        }
    ]
};


/* Bubble chart
 * 
 * Based on Jim Vallandingham's work
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */

function createBubbleChart() {
    /* bubbleChart creation function. Returns a function that will
     * instantiate a new bubble chart given a DOM element to display
     * it in and a dataset to visualize.
     */

    // Tooltip object for mouseover functionality
    var tipUp = d3.select('.g-tip-up');
    var tipDown = d3.select('.g-tip-down');
    var tipMetric = d3.selectAll(".g-tip-metric")
      .datum(function() { return this.getAttribute("data-name"); });
    var format = d3.format(",");
    // These will be set in the `bubbleChart` function
    var svg = null, inner_svg = null;
    var bubbles = null;
    var forceSim = null;
    var fillColorScale = null;
    var radiusScale = null;
    var nodes = [];
    var margin = null;
    var width = null;
    var height = null;
    var dataExtents = {};
    // For scatterplots (initialized if applicable)
    var xAxis = null;
    var yAxis = null;
    var xScale = null;
    var yScale = null;


    // event handlers
    $('.industry-list').on('mouseover', 'span', function(e){
        var _id = '#' + this.getAttribute('class');
        var circle = d3.select(_id).datum();
        mouseover(circle);
    });

    $('.industry-list').on('mouseout', 'span', function(e){
        var _id = '#' + this.getAttribute('class');
        var circle = d3.selectAll(_id).datum();

        mouseout(circle);
    });

    function getFillColorScale() {
        // Obtain a color mapping from keys to color values specified in our parameters file

        // Get the keys and values from the parameters file
        var color_groupsKeys = Object.keys(BUBBLE_PARAMETERS.fill_color.color_groups)
        var color_groupsValues = []
        for (var i=0; i<color_groupsKeys.length; i++) {
            var key = color_groupsKeys[i]
            color_groupsValues.push(BUBBLE_PARAMETERS.fill_color.color_groups[key])
        }
        
        // Generate the key -> value mapping for colors
        var fillColorScale = d3.scaleOrdinal()
            .domain(color_groupsKeys)
            .range(color_groupsValues);

        return fillColorScale;
    }

    function getFillColorOpacity(d) {
        // Obtain a color mapping from keys to color values specified in our parameters file
        if(d.wages == 10000){
            return 0.0
        }

        return 1.0;
    }

    
    function createNodes(rawData) {
        /*
         * This data manipulation function takes the raw data from
         * the CSV file and converts it into an array of node objects.
         * Each node will store data and visualization values to visualize
         * a bubble.
         *
         * rawData is expected to be an array of data objects, read in from
         * one of d3's loading functions like d3.csv.
         *
         * This function returns the new node array, with a node in that
         * array for each element in the rawData input.
         */
        // Use map() to convert raw data into node data.
        var myNodes = rawData.map(function (data_row) {
            node = {
                id: data_row.naics,
                scaled_radius: radiusScale(+data_row[BUBBLE_PARAMETERS.radius_field]),
                actual_radius: +data_row[BUBBLE_PARAMETERS.radius_field],
                sm_scaled_radius: smRadiusScale(+data_row[BUBBLE_PARAMETERS.radius_field]),
                fill_color_group: data_row[BUBBLE_PARAMETERS.fill_color.data_field],
                // Put each node initially in a random location
                x: Math.random() * width,
                y: Math.random() * height
            };
            for(var key in data_row) {
                // Skip loop if the property is from prototype
                if (!data_row.hasOwnProperty(key)) continue;
                node[key] = data_row[key];
            }
            
            return node;
        });

        // Sort them to prevent occlusion of smaller nodes.
        myNodes.sort(function (a, b) { return b.actual_radius - a.actual_radius; });

        return myNodes;
    }

    function getGridTargetFunction(mode) {
        // Given a mode, return an anonymous function that maps nodes to target coordinates
        if (mode.type != "grid") {
            throw "Error: getGridTargetFunction called with mode != 'grid'";
        }
        return function (node) {
            // Given a mode and node, return the correct target
            if(mode.size == 1) {
                // If there is no grid, our target is the default center
                target = mode.gridCenters[""];
            } else {
                // If the grid size is greater than 1, look up the appropriate target
                // coordinate using the relevant node_tag for the mode we are in
                node_tag = node[mode.dataField]
                target = mode.gridCenters[node_tag];
            }
            
            return target;
        }
    }

    function getIsolateTargetFunction(mode) {
        // Given a mode, return an anonymous function that maps nodes to target coordinates
        if (mode.type != "isolate") {
            throw "Error: getGridTargetFunction called with mode != 'isolate'";
        }
        return function (node) {
            // Given a mode and node, return the correct target
            
            // If the grid size is greater than 1, look up the appropriate target
            // coordinate using the relevant node_tag for the mode we are in
            // node_tag = node[mode.dataField]
            
            if(node.type == mode.isolateKey){
                node_tag = node.type;

            } else { node_tag = "A"}
            
            target = mode.gridCenters[node_tag];
            // console.log(target)
            return target;
        }
    }
    
    function getAxis(node) {
        if(node.type == "C"){
            var yConsumerIndustry = height * 0.66;
            return yConsumerIndustry;
        } else {
            var yFreightIndustry = height * 0.33;
            return yFreightIndustry;
        }      

    }


    function showLabels(mode) {
        /*
         * Shows labels for each of the positions in the grid.
         */
        
        var currentLabels = mode.labels; 
        var labelData = [];
        if(mode.type == "isolate") {
            
            for(var i=0; i<currentLabels.length; i++){
                // console.log(mode.isolate[i], currentLabels[i])
                labelData[currentLabels[i]] = mode.isolate[i];
             }
            

            var bubble_group_labels = inner_svg.selectAll('.bubble_group_label')
            .data(currentLabels);

            var grid_element_half_height = height / (mode.gridDimensions.rows * 2);

            bubble_group_labels.enter().append('text')
                .attr('class', 'bubble_group_label')
                .attr('x', function (d) { return mode.gridCenters[mode.isolateKey].x; })
                .attr('y', function (d) { return mode.gridCenters[mode.isolateKey].y + (grid_element_half_height * 1.4 ); })
                .attr('text-anchor', 'middle')                // centre the text
                .attr('dominant-baseline', 'hanging') // so the text is immediately below the bounding box, rather than above
                .text(function (d) { return d });   
      
        }else{
            var bubble_group_labels = inner_svg.selectAll('.bubble_group_label')
            .data(currentLabels);

            var grid_element_half_height = height / (mode.gridDimensions.rows * 2);
            // console.log(bubble_group_labels)
            bubble_group_labels.enter().append('text')
                .attr('class', 'bubble_group_label')
                .attr('x', function (d) { return mode.gridCenters[d].x; })
                .attr('y', function (d) { return mode.gridCenters[d].y - grid_element_half_height; })
                .attr('text-anchor', 'middle')                // centre the text
                .attr('dominant-baseline', 'hanging') // so the text is immediately below the bounding box, rather than above
                .text(function (d) { return d; });
        }
    }

    function mouseover(d) {
        d3.select('#industry-' + d.naics).attr('stroke', 'black').attr('stroke-width', 1.5);
        var dx, dy;
        var adjust_scale = (currentMode.type === 'scatterplot') ? d.sm_scaled_radius : d.scaled_radius;


        dx = d.x, dy = d.y;

        if (dy > 200) {
            dy -= 120, dx -= 45; // margin fudge factors

            tipUp.style("display", null)
                .style("top", (dy - adjust_scale ) + "px")
                .style("left", dx + "px");

            tipUp.select(".g-tip-title")
                .text(d.SubSector);
        } else {
            dy += 20, dx -= 45; // margin fudge factors

            tipDown.style("display", null)
                .style("top", (dy + adjust_scale ) + "px")
                .style("left", dx + "px");

            tipDown.select(".g-tip-title")
                .text(d.SubSector);
        }

        tipMetric.select(".g-tip-metric-value").text(function(name) {
          switch (name) {
            case "establishments": return format(d.establishments);
            case "employment": return format(d.employment);
            case "wages": return '$' + format(d.wages);
          }
        });
    }

    function mouseout(d) {
        tipUp.style("display", "none");
        tipDown.style("display", "none");

        var originalColor = d3.rgb(fillColorScale(d.fill_color_group)).darker()
        d3.select('#industry-' + d.naics).attr('stroke', originalColor).attr('stroke-width', 0.5);
    }


    function ticked() {
        bubbles.each(function (node) {})
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function showWageAxis(mode) {
        /*
         *  Show the axes.
         */

        // Set up axes
        xAxis = xScale; //d3.scaleBand().rangeRound([0, width]).padding(0.1);
        yAxis = yScale; //d3.scaleLinear().rangeRound([height, 0]);  

        //build freight industry axis
        inner_svg.insert("g", ":first-child")
            .attr("class", "axis wage-industry-axis")
            .attr("transform", "translate(0," + height * 0.33 + ")")
            .call(d3.axisBottom(xAxis)
                .tickSizeOuter(0))
            .selectAll(".tick").remove()

        // build the non-freight axis
        inner_svg.insert("g", ":first-child")
            .attr("class", "axis wage-industry-axis")
            .attr("transform", "translate(0," + height * 0.66 + ")")
            .call(d3.axisBottom(xAxis)
                .tickSizeOuter(0))
            .selectAll(".tick").remove()

        // add annotation container
        var annotation = inner_svg.append("g")
            .attr("class", "g-annotations");

        var freightOverall = annotation.append("g")
              .attr("class", "g-overall")
              .attr("transform", "translate(" + xAxis(69869) + "," + height * 0.33 + ")");

        freightOverall.append("line")
            .attr("y1", -100)
            .attr("y2", +60)
            .attr("stroke", "#000000")
            .attr("stroke-width", 2.0);

        var freightIndustryText = freightOverall.append("text")
            .attr("y", -90)
            .style("font-weight", "bold");

        freightIndustryText.append("tspan")
            .attr("x", 10)
            .style("font-size", "13px")
            .text("$69,869");

        var nonFreightOverall = annotation.append("g")
              .attr("class", "g-overall")
              .attr("transform", "translate(" + xAxis(50180) + "," + height * 0.66 + ")");

        nonFreightOverall.append("line")
          .attr("y1", -100)
          .attr("y2", +60)
          .attr("stroke", "#000000")
          .attr("stroke-width", 2.0);

        var nonFreightInudstryText = nonFreightOverall.append("text")
            .attr("y", -90)
            .style("font-weight", "bold");

        nonFreightInudstryText.append("tspan")
            .attr("x", 10)
            .style("font-size", "13px")
            .text("$50,180");

        // build the living wage line
        var livingWage = annotation.append("g")
              .attr("class", "line-living-wage")
              .attr("transform", "translate(" + xAxis(47004) + "," + height * 0.85 + ")");

        livingWage.append("line")
          .attr("y1", -height * 0.75)
          .attr("y2", 0)
          .attr("stroke", "#000000")
          .attr('stroke-dasharray', '6 4')
          .attr("stroke-width", 2.0);

        var livingWageText = livingWage.append("text")
            .attr("y", -(height * 0.75) + 10)
            .attr("x", 10);
        
        livingWageText.append("tspan")
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .text("Family Living Wage");

        livingWageText.append("tspan")
            .attr("dy", 18)
            .attr("x", 10)
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .text("$47,004");

        livingWageText.append("tspan")
            .attr("class", "text-lighter")
            .attr("x", 24)
            .attr("dy", 18)
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("2 adults");

        livingWageText.append("tspan")
            .attr("class", "text-lighter")
            .attr("x", 24)
            .attr("dy", 15)
            .style("font-size", "12px")
            .text("(1 working)");

        livingWageText.append("tspan")
            .attr("class", "text-lighter")
            .attr("x", 24)
            .attr("dy", 15)
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("1 child");


        

        inner_svg.append("g")
            .attr("class", "axis axis--x x-wage-label")
            .attr("transform", "translate(0," + height * 0.85 + ")")
            .call(d3.axisBottom(xAxis)
                .tickValues([30000, 50000, 70000, 90000, 110000, 130000])
                .tickFormat(function(d) { return "$" + format(d); }))
            .select(".domain").remove()
        
        function _firstTickLocation() {
            var labelXAxis = document.getElementsByClassName('axis axis--x x-wage-label');
            var children = labelXAxis[0].children[0].attributes.transform.nodeValue
            var thisXPos = children.substring(10, children.lastIndexOf(","));
            
            //return split string
            return thisXPos - 10;

        }

        inner_svg.append("text")
            .attr("class", "axis axis--x x-wage-header")
            .attr("transform", "translate(" + _firstTickLocation() +", " + height * 0.85 + ")")
            .attr("text-anchor", "end")
            .attr("dy", "0.4em")
            .text("Average Annual Wage");
    }

    function populateLists() {
        // Add data from each node to the correct list
        
        function getRelatedIndustries(type) {
            var _industries = '';
            
            for(var i=0; i<nodes.length; i++) {
                if (type === nodes[i].type){
                    _industries += '<span class="industry-'+ nodes[i].id +'">' + nodes[i].SubSector + ';</span>&nbsp;&nbsp;';
                }
                
            }
            //remove the last semicolon
            _industries = _industries.slice(0, -13);

            return _industries;
        }
        
        for(var i=0; i<BUBBLE_PARAMETERS.types.length; i++) {
            
            var _currSector = BUBBLE_PARAMETERS.types[i];
            var _industryList = getRelatedIndustries(_currSector);

            $('#js-' + _currSector + '-list').html(_industryList);
        }
        

    }

    function createBubbles() {
        // Bind nodes data to what will become DOM elements to represent them.
        inner_svg.selectAll('.bubble')
            .data(nodes, function (d) { return d.naics; })
            // Create new circle elements each with class `bubble`.
            // There will be one circle.bubble for each object in the nodes array.
            .enter()
            .append('circle').attr('r', 0) // Initially, their radius (r attribute) will be 0.
            .attr('id', function (d) { return 'industry-' + d.naics; })
            .classed('bubble', true)
            // .attr('fill', function (d) { return fillColorScale(d.fill_color_group); })
            // .attr('stroke', function (d) { return d3.rgb(fillColorScale(d.fill_color_group)).darker(); })
            .attr('fill', '#bdcbde')
            .attr('stroke', function() { return d3.rgb('#bdcbde').darker(); })
            .attr('stroke-width', 0.5)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        bubbles = d3.selectAll('.bubble');

        // Fancy transition to make bubbles appear, ending with the correct radius
        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) { return d.scaled_radius; });
    }


    function colorBubbles() {
        inner_svg.selectAll('.bubble')
            .attr('fill', function (d) { return fillColorScale(d.fill_color_group); })
            .attr('stroke', function (d) { return d3.rgb(fillColorScale(d.fill_color_group)).darker(); });
    }
    
    function addForceLayout(isStatic) {
        if (forceSim) {
            // Stop any forces currently in progress
            forceSim.stop();
        }

        // Configure the force layout holding the bubbles apart
        forceSim = d3.forceSimulation()
            .nodes(nodes)
            .velocityDecay(0.22)
            .on("tick", ticked);

        if(isStatic) {
            var bubbleCollideForce = d3.forceCollide()
                    .radius(function(d) { return d.sm_scaled_radius + 0.5; })
                    .iterations(8)
            forceSim
                .force("collide", bubbleCollideForce)
        }
        
        if (!isStatic) {
          
            // Decide what kind of force layout to use: "collide" or "charge"
            if(BUBBLE_PARAMETERS.force_type == "collide") {
                var bubbleCollideForce = d3.forceCollide()
                    .radius(function(d) { return d.scaled_radius + 0.5; })
                    .iterations(8)
                forceSim
                    .force("collide", bubbleCollideForce)
            }
            if(BUBBLE_PARAMETERS.force_type == "charge") {
                function bubbleCharge(d) {
                    return -Math.pow(d.scaled_radius, 2.0) * (+BUBBLE_PARAMETERS.force_strength);
                }    
                forceSim
                    .force('charge', d3.forceManyBody().strength(bubbleCharge))

// @in progress- need to improve the overlap collision which may require a new tick method
                    // .force('collide', d3.forceCollide().radius(function(d) {
                    //     return d.radius
                    //   }));
            }
        }
    }

    function createCanvas(parentDOMElement) {
        // Create a SVG element inside the provided selector with desired size.
        svg = d3.select(parentDOMElement)
            .append('svg')
            .attr('width', BUBBLE_PARAMETERS.width)
            .attr('height', BUBBLE_PARAMETERS.height);

        // Specify margins and the inner width and height
        margin = {top: 20, right: 20, bottom: 50, left: 80},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

        // Create an inner SVG panel with padding on all sides for axes
        inner_svg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");        
    }    
    //////////////////////////////////////////////////////////////
    
    var bubbleChart = function bubbleChart(parentDOMElement, rawData) {
        /*
         * Main entry point to the bubble chart. This function is returned
         * by the parent closure. It prepares the rawData for visualization
         * and adds an svg element to the provided selector and starts the
         * visualization creation process.
         *
         * parentDOMElement is expected to be a DOM element or CSS selector that
         * points to the parent element of the bubble chart. Inside this
         * element, the code will add the SVG continer for the visualization.
         *
         * rawData is expected to be an array of data objects as provided by
         * a d3 loading function like d3.csv.
         */
        
        // Capture all the maximums and minimums in the numeric fields, which
        // will be used in any scatterplots.
        for (var numeric_field_index in BUBBLE_PARAMETERS.numeric_fields) {
            var numeric_field = BUBBLE_PARAMETERS.numeric_fields[numeric_field_index];
            dataExtents[numeric_field] = d3.extent(rawData, function (d) { return +d[numeric_field]; });
        }
        // Scale bubble radii using ^(0.5)
        // We size bubbles based on area instead of radius
        var maxRadius = dataExtents[BUBBLE_PARAMETERS.radius_field][1];
        radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([5, 60])  // Range between 2 and 25 pixels
            .domain([0, maxRadius]);   // Domain between 0 and the largest bubble radius

        smRadiusScale = d3.scalePow()
            .exponent(0.5)
            .range([3, 30])  // Range between 2 and 25 pixels
            .domain([0, maxRadius]);   // Domain between 0 and the largest bubble radius

        fillColorScale = getFillColorScale();
        
        // Initialize the "nodes" with the data we've loaded
        nodes = createNodes(rawData);

        // Add the data on sectors to list DOM elements
        populateLists();

        // Initialize svg and inner_svg, which we will attach all our drawing objects to.
        createCanvas(parentDOMElement);

        // Create the bubbles and the force holding them apart
        createBubbles();
    };

    bubbleChart.switchMode = function (buttonID) {
        /*
         * Externally accessible function (this is attached to the
         * returned chart function). Allows the visualization to toggle
         * between display modes.
         *
         * buttonID is expected to be a string corresponding to one of the modes.
         */
        // Get data on the new mode we have just switched to
        currentMode = new ViewMode(buttonID, width, height);

        // Remove current labels
        inner_svg.selectAll('.bubble_group_label').remove();
        // Remove current debugging elements
        inner_svg.selectAll('.mc_debug').remove(); // DEBUG
        // Remove axes components
        inner_svg.selectAll('.axis').remove();
        // Remove map
        inner_svg.selectAll('.world_map').remove();

        if (currentMode.type == "color") {
            colorBubbles();
            return bubbleChart;
        }

        // SHOW LABELS 
        if (currentMode.type == "grid" || currentMode.type == "isolate" ) {
            showLabels(currentMode);
        }

        

        // SHOW AXIS (if our mode is scatter plot)
        if (currentMode.type == "scatterplot") {
            
            // inner_svg.selectAll('.bubble')
            inner_svg.selectAll('.bubble')  //here's how you get all the nodes
                .attr('r', function(d) {return d.sm_scaled_radius})
                .attr('opacity', function(d) {return getFillColorOpacity(d)});


            xScale = d3.scaleLinear().rangeRound([0, width])
                .domain([dataExtents[currentMode.xDataField][0], dataExtents[currentMode.xDataField][1]]);
            yScale = d3.scaleLinear().rangeRound([height, 0])
                .domain([dataExtents[currentMode.yDataField][0], dataExtents[currentMode.yDataField][1]]);
            
            showWageAxis(currentMode);

        }

        // ADD FORCE LAYOUT
        if (currentMode.type == "scatterplot" ) {
            addForceLayout(true);  // make it static so we can plot bubbles
        } else {
            addForceLayout(false); // the bubbles should repel about the grid centers
        }

        
        
        // MOVE BUBBLES TO THEIR NEW LOCATIONS
        var targetFunction;
        if (currentMode.type == "grid") {
            targetFunction = getGridTargetFunction(currentMode);
        }
        if (currentMode.type == "isolate") {
            targetFunction = getIsolateTargetFunction(currentMode);
        }
      
        if (currentMode.type == "scatterplot") {
            targetFunction = function (d) {
                return { 
                    x: xScale(d[currentMode.xDataField]),
                    y: getAxis(d)
                       //                        yScale(d[currentMode.yDataField])
                };
            };
        }
       

        // Given the mode we are in, obtain the node -> target mapping
        var targetForceX = d3.forceX(function(d) {return targetFunction(d).x})
            .strength(+BUBBLE_PARAMETERS.force_strength);
        var targetForceY = d3.forceY(function(d) {return targetFunction(d).y})
            .strength(+BUBBLE_PARAMETERS.force_strength);
 
        // Specify the target of the force layout for each of the circles
        
        forceSim
            .force("x", targetForceX)
            .force("y", targetForceY);

        // Restart the force layout simulation
        forceSim.alphaTarget(0).restart();

        
    };
    
    // Return the bubbleChart function from closure.
    return bubbleChart;
}

/////////////////////////////////////////////////////////////////////////////////////
function ViewMode(button_id, width, height) {
    /* ViewMode: an object that has useful parameters for each view mode.
     * initialize it with your desired view mode, then use its parameters.
     * Attributes:
     - mode_index (which button was pressed)
     - buttonId     (which button was pressed)
     - gridDimensions    e.g. {"rows": 10, "columns": 20}
     - gridCenters       e.g. {"group1": {"x": 10, "y": 20}, ...}
     - dataField    (string)
     - labels       (an array)
     - type         (type of grouping: "grouping" or "scatterplot")
     - size         (number of groups)
     */
    // Find which button was pressed
    var mode_index;
    for(mode_index=0; mode_index<BUBBLE_PARAMETERS.modes.length; mode_index++) {
        if(BUBBLE_PARAMETERS.modes[mode_index].button_id == button_id) {
            break;
        }
    }
    if(mode_index>=BUBBLE_PARAMETERS.modes.length) {
        console.log("Error: can't find mode with button_id = ", button_id)
    }
    
    var curMode = BUBBLE_PARAMETERS.modes[mode_index];
    this.buttonId = curMode.button_id;
    this.type = curMode.type;
    
    if (this.type == "grid") {
        this.gridDimensions = curMode.grid_dimensions;
        this.labels = curMode.labels;
        if (this.labels == null) { this.labels = [""]; }
        this.dataField = curMode.data_field;
        this.size = this.labels.length;
        // Loop through all grid labels and assign the centre coordinates
        this.gridCenters = {};
        for(var i=0; i<this.size; i++) {
            var cur_row = Math.floor(i / this.gridDimensions.columns);    // indexed starting at zero
            var cur_col = i % this.gridDimensions.columns;    // indexed starting at zero
            var currentCenter = {
                // x: (2 * cur_col + 1) * (width / (this.gridDimensions.columns * 2)),
                x: (width * 0.7),
                y: (2 * cur_row + 1) * (height / (this.gridDimensions.rows * 2))
            };
            this.gridCenters[this.labels[i]] = currentCenter;
        }
    }

    if (this.type == "isolate") {
        this.gridDimensions = curMode.grid_dimensions;
        this.labels = curMode.labels;
        if (this.labels == null) { this.labels = [""]; }
        this.dataField = curMode.data_field;
        var all = ["A"];
        
        all.splice(1,0,curMode.isolate[0]);
       
        this.isolate = all;
        this.isolateKey = curMode.isolate;
        this.size = this.isolate.length;
        // Loop through all grid labels and assign the centre coordinates
        this.gridCenters = {};
        this.gridCenters[this.isolateKey] = { 
            x: (width * 0.7), 
            y: (height * 0.6)
        }
        this.gridCenters["A"] = {
            x: (width * 0.7), 
            y: (height * 0.4)
        }
        
    }

    if (this.type == "scatterplot") {
        // Set up the x and y scales (domains need to be set using the actual data)
        this.xDataField = curMode.x_data_field;
        this.yDataField = curMode.y_data_field;
        this.xFormatString = curMode.x_format_string;
        this.yFormatString = curMode.y_format_string;
    }
};


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


// Create a new bubble chart instance
var myBubbleChart = createBubbleChart();

// Load data
d3.csv("data/" + BUBBLE_PARAMETERS.data_file, function (error, data) {
    // Once the data is loaded...
    
    if (error) { console.log(error); }

    // wait for the scroll action to start...  

});


