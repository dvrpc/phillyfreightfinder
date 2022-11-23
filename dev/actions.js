//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////  Declare Shared Values //////////////////////

var hlweight = 7, 			//weight of highlighted feature outline
	hlColor = "#00CCFF";	//color of point, outline and line highlights


var layersearch, props, header, content, featureName, featureClass, featureIcon;

////////////////////////////////////////////////////
///Individual Feature actions ///////////////////// 

//Trucking-Highway Actions ////////////
//  freeway
function clkHwy(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>';
    var Owner = " ";
    if (props.owner===undefined){ Owner = " ";}
                else { Owner = "<div class='two_third' style='float:left;'><div class='datafield'>" + props.owner+ "</div><div class='labelfield'>Owner</div>";}

    content = "<div id='baseInfo'>"+ Owner +"</div>"
                        +"<img src='lib/images/Shields/" + props.shield_id + ".png' alt='Shield' height='50' style='padding-left:20px;'>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td class='item'><strong> </strong></td><td><strong>" + props.dir_1 + "</strong></td><td><strong>" + props.dir_2 + "</strong></td></tr>"
                                +"<tr class='active'><td class='item'><strong><a title='Predominant lane count for designated segment' data-toggle='infotooltip'>Capacity <span style='font-weight:normal;'>(lanes)</span></a>: </strong></td><td>" + props.cap_1 + "</td><td>" + props.cap_2 + "</td></tr>"
                                +"<tr class='active'><td class='item'><strong><a title='Average Annual Daily Traffic volume for truck traffic (FHWA Vehicle Classes 5-13)' data-toggle='infotooltip'>Truck AADT</a>: </strong></td><td>" + props.act_1a + "</td><td>" + props.act_2a + "</td></tr>"
                                +"<tr class='active'><td class='item'><strong>Truck share of <a title='Average Annual Daily Traffic' data-toggle='infotooltip'>AADT</a>: </strong></td><td>" + props.act_1b + "</td><td>" + props.act_2b + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.year + " " + props.source + "</div></div>",
    featureName = '<p>Type: ' + props.type + '</p>',
    featureClass = 'hwycl',
    featureIcon = 'hwyicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};
//  truck parking
function clkParking(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.owner+ "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.township + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Truck Spaces Available: </strong></td><td>" + props.capacity + "</td></tr>"
                                +"<tr class='active'><td><strong> <a title='Truck space utilization determined by single overnight count' data-toggle='infotooltip'>Truck Spaces Utilized</a>: </strong></td><td> " + props.rating + " </td></tr>"
                                +"</table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
                     // +"<p>More Information: " + props.REPORT + "</p>";
    featureName = '<p>Type: Truck Parking</p>',
    featureClass = 'hwycl',
    featureIcon = 'trkparkicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);   
};

var custom_matches = {'CI-1': 'South Philadelphia Freight Complex', 'CI-2': 'Broadway & Gloucester Marine Terminals'};

function findMatch(layer, id){
    var facility;
    $.each(layer._layers, function(key, value) {
        if(value.feature.properties.PFF_ID === id){
            facility = value.feature.properties.NAME;
        } 

    });
    return facility
}


//  NHS Connectors
function clkNHS(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>';
    var facility = findMatch(portpoly, props.link_id) || findMatch(commairpoly, props.link_id) || findMatch(intermodalpoly, props.link_id) || custom_matches[props.link_id];
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" +  facility/*props.FAC_SERVED*/ + "</div><div class='labelfield'>Facility Served</div>"
                        +"<div class='datafield'>" + props.township_s + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong> <a title='Predominant lane count for designated segment' data-toggle='infotooltip'>Lanes per direction</a>: </strong></td><td>" + props.cap_1 + "</td></tr>"
                                +"<tr class='active'><td><strong> <a title='Average Annual Daily Traffic' data-toggle='infotooltip'>AADT</a>: </strong></td><td>not available</td></tr>"
                                +"</table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
                     //           +"<br/><p>" + props.Profile + "</p>";,
    featureName = '<p>Type: NHS Connector</p>',
    featureClass = 'hwycl',
    featureIcon = 'nhsicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);       
};
//  Highway Bridges
function clkHwyRvrXing(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.line + "</div><div class='labelfield'>Highway</div>"
                        +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Tolled (y/n)</div>"
                        +"<div class='datafield'>" + props.type + "</div><div class='labelfield'>Bridge Type</div>"
                        +"<div class='datafield'>" + props.town_1 + " - " + props.town_2  + "</div><div class='labelfield'>Connecting Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong><a title='Total count of lanes, both directions.' data-toggle='infotooltip'>Travel Lanes</a>: </strong></td><td>" + props.cap_1 + "</td></tr>"
                                +"<tr class='active'><td><strong>Vertical Restriction <span style='font-weight:normal;'>(ft)</span>: </strong></td><td>" + props.cap_2 + "</td></tr>"
                                +"<tr class='active'><td><strong> <a title='Average Annual Daily Traffic' data-toggle='infotooltip'>AADT</a>: </strong></td><td>" + props.act_1 + "</td></tr>"
                                +"</table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
    featureName = '<p>Type: Highway River Crossing</p>',
    featureClass = 'hwycl',
    featureIcon = 'hwyrivicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};  

//Rail Actions
//rail lines
function clkRailline(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
            +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
            +"</div><!--close baseInfo-->"
            +"<div class='infoDivider'></div>"
            +"<div id='indactorInfo'>"
            +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
            +"<li class='active'><a href='#IntermodalCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
            +"<div id='indicator' class='tab-content'><!--tab panes-->"
            +"<div class='tab-pane active' id='IntermodalCap' style='padding-bottom: 12px;'>"
                    +"<table class='table table-hover'>"
                    +"<tr class='active'><td><strong> <a title='Predominant count of through tracks on designated segment' data-toggle='infotooltip'>Number of Tracks</a>: </strong></td><td>" + props.trk_main + "</td></tr>"
                    +"<tr class='active'><td><strong> <a title='Ability to operate double stack trains. Double stack is a technology allowing intermodal containers to be stack two high on train cars.' data-toggle='infotooltip'>Double Stack Clearance</a>: </strong></td><td> " + props.trk_dbl + " </td></tr>"
                    +"<tr class='active'><td><strong> <a title='Capacity to operate 286,000 pound rail cars on designated segment' data-toggle='infotooltip'>286k Capacity</a>: </strong></td><td>" + props.trk_weight + "</td></tr>"
                    +"<tr class='active'><td><strong> Trains Daily: </strong></td><td>not reported</td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
    featureName = '<p>Type: ' + props.type + '</p>',
    featureClass = 'railcl',
    featureIcon = 'railicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};  
//rail yards
function clkRailYard(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + findMatch(railines, props.rail_id) + "</div><div class='labelfield'>Line Serving</div>"
                        +"<div class='datafield'>" + props.township + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#IntermodalCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='IntermodalCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.gis_acres).format('0,0.0') + "</td></tr>"
                                +"<tr class='active'><td><strong>Annual Car Count: </strong></td><td>n/a</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
                        //+"<div style='height:34px;'><a href='http://www.dvrpc.org/webmaps/PhillyFreightFinder/reports/FC/FC34.pdf' target='_blank' style='line-height:34px;float:left;'><div class='pdf'></div>Related Report: " + props.REPORT + "</a></span></div></div>" ;
    featureName = '<p>Type: Rail Yard</p>',
    featureClass = 'railcl',
    featureIcon = 'railyardicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};  
//rail crossings
function clkRailXing(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.township + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong> <a title='Count of active tracks at grade crossing' data-toggle='infotooltip'>Tracks at Crossing</a>: </strong></td><td>" + props.tracks + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.source_1 + "</div></div>"
                        +"<div style='height:34px;'><a href='http://safetydata.fra.dot.gov/OfficeofSafety/publicsite/Crossing/Report.aspx?phasetype=C&rpttype=A&txtcrossingnum="+props.fra_id+"' target='_blank' style='line-height:34px;float:left;'><div class='pdf'></div>FRA Crossing History</a></div>",
                        // +"<p>" + props.Report + "</p>";
    featureName = '<p>Type: Class I Grade Crossing</p>',
    featureClass = 'railcl',
    featureIcon = 'railcrossicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};
//rail intermodal
function clkIntermodal(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.township + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#IntermodalCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='IntermodalCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.acres).format('0,0.0') + "</td></tr>"
                                +"<tr class='active'><td><strong>Activity: </strong></td><td>n/a</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
                        //+"<div style='height:34px;'><a href='http://www.dvrpc.org/webmaps/PhillyFreightFinder/reports/FC/FC34.pdf' target='_blank' style='line-height:34px;float:left;'><div class='pdf'></div>Related Report</a></span></div></div>" ;
    featureName = '<p>Type: Intermodal Rail Yard</p>',
    featureClass = 'railcl',
    featureIcon = 'railintericon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};
//rail river crossing
function clkRailRvrXing(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + findMatch(railines, props.link_id) + "</div><div class='labelfield'>Rail Line</div>"
                        +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.type + "</div><div class='labelfield'>Bridge Type</div>"
                        +"<div class='datafield'>" + props.town_1 + " - " + props.town_2  + "</div><div class='labelfield'>Connecting Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Width <span style='font-weight:normal;'>(tracks)</span>: </strong></td><td>" + props.cap_1 + "</td></tr>"
                                +"<tr class='active'><td><strong> <a title='Ability to operate double stack trains. Double stack is a technology allowing intermodal containers to be stack two high on train cars.' data-toggle='infotooltip'>Double Stack Clearance</a>: </strong></td><td>" + props.cap_2 + "</td></tr>"
                                +"<tr class='active'><td><strong> <a title='Capacity to operate 286,000 pound rail cars on designated segment' data-toggle='infotooltip'>286k Capacity</a>: </strong></td><td>" + props.cap_3 + "</td></tr>"
                                +"<tr class='active'><td><strong>Activity: </strong></td><td>" + props.act_1 + "</a></td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
    featureName = '<p>Type: Rail River Crossing</p>',
    featureClass = 'railcl',
    featureIcon = 'railrivicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};

//Ports/Waterways Features
//Ports
function clkport(e) {
    initializeHL(e); 
    header = '<p>' + props.name + '</p>';
    var contentBulk = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.township + "</div><div class='labelfield'>Municipal Location</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#portCap' data-toggle='tab'>Capacity</a></li>"
                        +"<li><a href='#portAct' data-toggle='tab'>Activity</a></li></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='portCap' style='padding-bottom: 12px;height:72px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Berth Depth <span style='font-weight:normal;'><a title='Mean Low Water' data-toggle='infotooltip'>(MLW)</a></span>: </strong></td><td>not reported</td></tr>"
                                +"<tr class='active'><td><strong>Storage Capacity: </strong></td><td>not reported</td></tr></table>"
                        +"</div>"
                        +"<div class='tab-pane' id='portAct' style='padding-bottom: 12px;height:72px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td class='item'><strong>2012 Ship Arrivals: </strong></td><td>" + props.act_1 + "</td><td>o</td></tr>"
                                +"<tr class='active'><td class='item'><strong>Cargo handled: </strong></td><td colspan='2' style='line-height:1!important;'>" + props.cargo + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>" + props.source + "</div></div>",
    contentGeneral ="<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.operator + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.township + "</div><div class='labelfield'>Municipal Location</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#portCap' data-toggle='tab'>Capacity</a></li>"
                        +"<li><a href='#portAct' data-toggle='tab'>Activity</a></li></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='portCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Qty of Berths: </strong></td><td>" + props.cap_1 + "</td></tr>"
                                +"<tr class='active'><td><strong>Total Berth Length: </strong></td><td>" + props.cap_2 + " linear ft</td></tr>"
                                +"<tr class='active'><td><strong>Berth Depth <span style='font-weight:normal;'><a title='Mean Low Water' data-toggle='infotooltip'>(MLW)</a></span>: </strong></td><td>" + props.cap_3 + " feet</td></tr>"
                                +"<tr class='active'><td><strong>Available Cranes: </strong></td><td><a title='" + props.cap_4 + "' data-toggle='infotooltip'>" + props.cap_6 + "</a></td></tr>"
                                +"<tr class='active'><td><strong>Warehouse Space: </strong></td><td>" + props.cap_5 + "</td></tr></table>"
                        +"</div>"
                        +"<div class='tab-pane' id='portAct' style='padding-bottom: 12px;height:132px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td class='item'><strong>2012 Ship Arrivals: </strong></td><td>" + props.act_1 + "</td><td>o</td></tr>"
                                +"<tr class='active'><td class='item'><strong>Cargo handled: </strong></td><td colspan='2' style='line-height:1!important;'>" + props.cargo + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>" + props.source + "</div></div>";
    if (props.type == 'Bulk'){ content = contentBulk; } else {content = contentGeneral;}
    featureName = '<p>Type: '+ props.type + ' Terminal</p>',
    featureClass = 'portcl',
    featureIcon = 'porticon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};
//anchorage
function clkanchorage(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.township_s + "</div><div class='labelfield'>Adjacent Municipality(ies)</div>"
            //+"<div class='datafield'>" + props.Start + "</div><div class='labelfield'>Start Point</div>"
            //+"<div class='datafield'>" + props.End + "</div><div class='labelfield'>End Point</div>"
            +"</div><!--close baseInfo-->"
            +"<div class='infoDivider'></div>"
            +"<div id='indactorInfo'>"
            +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
            +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
            +"<div id='indicator' class='tab-content'><!--tab panes-->"
            +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                    +"<table class='table table-hover'>"
                    //+"<tr class='active'><td><strong> Annual Ships (" + props.YEAR + "): </strong></td><td>" + props.ACT_1 + "</td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
    featureName = '<p>Type: Anchorage</p>',
    featureClass = 'portcl',
    featureIcon = 'anchicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};
//River
function clkriver(e) {
    initializeHL(e);
    header = '<p>' + props.name + '</p>',
    content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.townships + "</div><div class='labelfield'>Adjacent Municipality(ies)</div>"
            +"<div class='datafield'>" + props.start_ + "</div><div class='labelfield'> <a title='Nautical miles from Atlantic Ocean' data-toggle='infotooltip'>Start Point</a>: </div>"
            +"<div class='datafield'>" + props.end_ + "</div><div class='labelfield'> <a title='Nautical miles from Atlantic Ocean' data-toggle='infotooltip'>End Point</a>: </div>"
            +"</div><!--close baseInfo-->"
            +"<div class='infoDivider'></div>"
            +"<div id='indactorInfo'>"
            +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
            +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
            +"<div id='indicator' class='tab-content'><!--tab panes-->"
            +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                    +"<table class='table table-hover'>"
                    +"<tr class='active'><td><strong>Channel Width <span style='font-weight:normal;'>(ft)</span>: </strong></td><td>" + props.width + "</td></tr>"
                    +"<tr class='active'><td><strong> Channel Depth <span style='font-weight:normal;'><a title='Mean Lower Low Water' data-toggle='infotooltip'>(MLLW in ft)</a></span>: </strong></td><td>" + props.depth + "</td></tr>"
                    +"<tr class='active'><td><strong> <a title='Approved vertical clearance within navigable channel' data-toggle='infotooltip'>Maximum Air Draft <span style='font-weight:normal;'>(ft)</span></a>: </strong></td><td>" + props.clearance + "</td></tr>"
                    +"<tr class='active'><td><strong>Annual Activity: </strong></td><td>not reported</td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>",
    featureName = '<p>Type: River Channel</p>',
    featureClass = 'portcl',
    featureIcon = 'rivericon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};

//Freight Centers
function clkFreightCenter(e) {
    initializeHL(e);
    var fclass;
    header = '<p>' + props.types + '</p>',
    content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.townships + "</div><div class='labelfield'>Municipality(ies): </div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#Emp' data-toggle='tab'>Employment</a></li>"
                        +"<li class='updated'><a href='#Ind' data-toggle='tab'>Industrial Development</a></li></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='Emp' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td></td><td><b>Freight</b></td><td><b>Non-freight</b></td></tr>"
                                +"<tr class='active'><td><strong>Establishments: </strong></td><td>" + numeral(props.frght_est).format('0,0') + "</td><td>" + numeral(props.n_frght_es).format('0,0') + "</td></tr>"
                                +"<tr class='active'><td><strong>Employees: </strong></td><td>" + numeral(props.frght_empl).format('0,0') + "</td><td>" + numeral(props.n_frght_em).format('0,0') + "</td></tr></table>"
                                +"<div class='labelfield source'>Data Source: NETS 2013" + "</div>"
                        +"</div>"
                        +"<div class='tab-pane' id='Ind' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Structures: </strong></td><td>" + numeral(props.str_count).format('0,0') + "</td></tr>"
                                +"<tr class='active'><td><strong>Square Footage: </strong></td><td>" + numeral(props.sq_ft_area).format('0,0') + "</td></tr>"
                                +"<tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.land_area).format('0,0') + "</td></tr></table>"
                                +"<div class='labelfield source'>Data Source: CoSTAR 2017" +  "</div>"
                        +"</div></div>"
                        //+"<div class='labelfield source'>Data Source: " + props.SOURCE + "</div></div>";
                        // +"<p>" + props.REPORT + "</p>";
    if (props.Types === 'International Gateway'){
            fclass = 'fcgateway';
    }else if(props.Types === 'Heavy Industrial'){
            fclass = 'fcheavy';
    }else if (props.Types === 'Distribution and Logistics'){
            fclass = 'fcdist';
    }else if (props.Types === 'High Tech Manufacturing'){
            fclass = 'fchightech';
    }else if (props.Types === 'Local Manufacturing and Distribution'){
            fclass = 'fclocal';
    }else{
        fclass = 'fclocal';
    }

    featureName = '<p> Freight Center</p>',
    featureClass = ''+ fclass +'cl',
    featureIcon = ''+ fclass +'icon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};

//Airports
//commercial/reliever
function clkairport(e) {
    initializeHL(e);
    var aclass;
    header = '<p>(' + props.pff_id + ') ' + props.name + '</p>',
    content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.type + "</div><div class='labelfield'>Type</div>"
            +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
            +"<div class='datafield'>" + props.township + "</div><div class='labelfield'>Municipality(ies): </div>"
            +"</div><!--close baseInfo-->"
            +"<div class='infoDivider'></div>"
            +"<div id='indactorInfo'>"
            +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
            +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul>"
            +"<div id='indicator' class='tab-content'><!--tab panes-->"
            +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                    +"<table class='table table-hover'>"
                    +"<tr class='active'><td><strong>Runway(s): </strong></td><td>" + props.cap_1 + "</td></tr>"
                    +"<tr class='active'><td><strong>Runway Length(s): </strong></td><td> " + props.cap_2 + " </td></tr>"
                    +"<tr class='active'><td><strong>Total Acreage: </strong></td><td>" + props.cap_3 + "</td></tr>"
                    +"<tr class='active'><td><strong> <a title='Count of annual takeoffs and landings' data-toggle='infotooltip'>Annual Operations</a>: </strong></td><td> " + numeral(props.ACTIVITY_1).format('0,0') + " </td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.source + "</div></div>";
    if (props.type === 'Commercial'){
            aclass = 'comm';
    }else if(props.type === 'Reliever'){
            aclass = 'rel';
    } else{}
    featureName = '<p>Type: '+ props.type +' Airport</p>',
    featureClass = ''+ aclass +'aircl',
    featureIcon = ''+ aclass +'icon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};
//heliports
function clkheliport(e) {
    initializeHL(e);
    header = '<p>(' + props.pff_id + ") " +props.facility + '</p>',
    content = "<div id='baseInfo'>"
                +"<div class='datafield'>" + props.owner + "</div><div class='labelfield'>Owner</div>"
                +"<div class='datafield'>" + props.city + "</div><div class='labelfield'>Municipality(ies): </div>"
                +"</div><!--close baseInfo-->"
                +"<div class='infoDivider'></div>"
                +"<div id='indactorInfo'>"
                +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul>"
                +"<div id='indicator' class='tab-content'><!--tab panes-->"
                +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                        +"<table class='table table-hover'>"
                        +"<tr class='active'><td><strong>Diameter: </strong></td><td>" + props.size_ + " ft</td></tr>"
                        +"<tr class='active'><td><strong>Annual Operations: </strong></td><td>not available</td></tr></table>"
                +"</div></div>"
                +"<div class='labelfield source'>Data Source: 2013 DVRPC</div></div>",
    featureName = '<p>Type: Heliport</p>',
    featureClass = 'heliportcl',
    featureIcon = 'heliporticon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};

//Energy-Utilities
//pipelines
function clkpipelines(e) {
    initializeHL(e);
    header = '<p>Pipeline</p>',
    content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.TYPE + "</div><div class='labelfield'>Material Transported</div>"
            +"<div class='datafield'>" + props.COUNTY + "</div><div class='labelfield'>County</div>"
            +"<div class='labelfield source'>Data Source: " + props.SOURCE + "</div></div>",
    featureName = '<p>Type: Pipeline</p>',
    featureClass = 'energycl',
    featureIcon = 'pipelineicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};

//Community
//Freight as Good Neighbor
function clkfgneighbor(e) {
    initializeHL(e);
    header = '<p>Freight as a Good Neighbor</p>',
    content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.municipality + "</div><div class='labelfield'>Municipality</div>"
            +"<div class='datafield'>" + props.county + " County</div><div class='labelfield'>County</div>"
            +"<div class='datafield'> " + props.descr1 + props.descr2 +" "+ props.descr3 + " </div>"
            +"<div class='labelfield source'>Data Source: 2012 DVRPC</div></div>",
    featureName = '<p>Type: Freight as a Good Neighbor</p>',
    featureClass = 'communcl',
    featureIcon = 'communicon icon';
    contentPush(header,content,featureName,featureClass,featureIcon);
};



            /////////////////////////////////////////////////////
            //////////////////////////////////////////////////
            /////// Regional Highcharts graphs


$(document).ready(function() {
    
    

    $( 'a[href="#"]' ).click( function(e) {
      e.preventDefault();
     });
    
    /*Highcharts.setOptions({
        chart: {
                type: 'pie',
                backgroundColor: '#396AB2'

            },
        title: {
                verticalAlign: 'middle',
                align: 'center',
                floating: true,
                useHTML: true
            },
        yAxis: {
                title: {
                    text: ''
                }
            },
        credits: {
                enabled: false
            },
        plotOptions: {
                pie: {
                    shadow: false,
                    dataLabels: {
                        enabled: false},
                    borderColor: '#335e9f',
                    borderWidth: 0,
                    colors: ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69'],
                }
            },
        series: [{ 
                size: '230%',
                innerSize: '130%', 
            }]

    });

    $.getJSON('data/valueRegion.json', function(data) {
                    var valueData = [], tonData=[], data1 = data.region, dataLen = data1.length;
                    for (var i = 0; i < dataLen; i++){ 
                        valueData.push({
                            name: data1[i].type,
                            y:  data1[i].value}),
                        tonData.push({
                            name: data1[i].type,
                            y: data1[i].tons
                        })
                    }
                    
                    var ValChart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'containerValue',
                        },
                        
                        title: {
                            text: '<div style="text-align:center;line-height: 0.8;"><span class="chartPrefix">by</span><br><span class="chartLabel">VALUE</span></div>',
                            y: -55
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>' + this.key + '</b><br/><b>$'+ this.y + '</b> billion<br/>'+ Math.round(this.percentage*100)/100 +'%';
                            }
                        },
                        plotOptions: {
                            pie: {
                                center: ['50%', '-15%'],
                                colors: ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69'],
                                startAngle: 90,
                                endAngle: 270

                            }
                        },
                        series: [{
                            id: 'Values',
                            name: 'Value', 
                            size: '230%',
                            innerSize: '130%', 
                            data: valueData
                        }]
                    });

                    var tonChart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'containerTon',
                        },
                        
                        title: {
                            text: '<div style="text-align:center;line-height: 0.8;"><span class="chartPrefix">by</span><br><span class="chartLabel">TONNAGE</span></div>',
                            y: 55
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>' + this.key + '</b><br/><b>'+ this.y + '</b> tons<br/>'+ Math.round(this.percentage*100)/100 +'%';
                            }
                        },
                        plotOptions: {
                            pie: {
                                center: ['50%', '120%'],
                                colors: ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69'],
                                startAngle: -90,
                                endAngle: 90

                            }
                        },
                        series: [{
                            id: 'Tons',
                            name: 'Ton', 
                            size: '230%',
                            innerSize: '130%', 
                            data: tonData
                        }]
                    });

     });*/

});
function activateTooltip() {
    $("[data-toggle=infotooltip]").tooltip({ placement: 'left'});
}
//custom button functionality
function modalLink(modal, tab){
    var element =  document.getElementById(modal);
    if (typeof(element) != 'undefined' && element != null){ 
        $('#'+modal+' li:eq('+ tab +') a').tab('show'); 
    }else{
        setTimeout(function(){
          $('#'+modal+' li:eq('+ tab +') a').tab('show');
        }, 0);
    }
} 

//topoJSON handling

L.TopoJSON = L.GeoJSON.extend({  
  addData: function(jsonData) {    
    if (jsonData.type === "Topology") {
      for (key in jsonData.objects) {
        geojson = topojson.feature(jsonData, jsonData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }  
});
// Copyright (c) 2013 Ryan Clark
