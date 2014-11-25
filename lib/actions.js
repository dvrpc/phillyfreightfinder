//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////  Declare Shared Values //////////////////////

var hlweight = 6, 			//weight of highlighted feature outline
	hlColor = "#EFA06A";	//color of point, outline and line highlights



var layersearch, props, header, content, featureName, featureClass, featureIcon;

////////////////////////////////////////////////////
///Individual Feature actions /////////////////////	

//Trucking-Highway Actions ////////////
//  freeway
function clkHwy(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>';
	if (props.Owner===undefined){ var Owner = " ";}
				else { var Owner = "<div class='two_third' style='float:left;'><div class='datafield'>" + props.Owner+ "</div><div class='labelfield'>Owner</div>";}

	content = "<div id='baseInfo'>"+ Owner +"</div>"
						+"<img src='lib/images/Shields/" + props.SHLD_ID + ".png' alt='Shield' height='50' style='padding-left:20px;'>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td class='item'><strong> </strong></td><td><strong>" + props.DIR_1 + "</strong></td><td><strong>" + props.DIR_2 + "</strong></td></tr>"
                                +"<tr class='active'><td class='item'><strong><a title='Predominant lane count for designated segment' data-toggle='infotooltip'>Capacity <span style='font-weight:normal;'>(lanes)</span></a>: </strong></td><td>" + props.CAP_1 + "</td><td>" + props.CAP_2 + "</td></tr>"
                                +"<tr><td class='item'><strong><a title='Average Annual Daily Traffic volume for truck traffic (FHWA Vehicle Classes 5-13)' data-toggle='infotooltip'>Truck AADT</a>: </strong></td><td>" + props.ACT_1A + "</td><td>" + props.ACT_2A + "</td></tr>"
                                +"<tr><td class='item'><strong>Truck share of <a title='Average Annual Daily Traffic' data-toggle='infotooltip'>AADT</a>: </strong></td><td>" + props.ACT_1B + "</td><td>" + props.ACT_2B + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.YEAR + " " + props.SOURCE + "</div></div>",
	featureName = '<p>Type: ' + props.Type + '</p>',
	featureClass = 'hwycl',
	featureIcon = 'hwyicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};
//  truck parking
function clkParking(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Owner+ "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Truck Spaces Available: </strong></td><td>" + props.Capacity + "</td></tr>"
                                +"<tr><td><strong> <a title='Truck space utilization determined by single overnight count' data-toggle='infotooltip'>Truck Spaces Utilized</a>: </strong></td><td> " + props.Activity_1 + " </td></tr>"
                                +"</table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
		             // +"<p>More Information: " + props.REPORT + "</p>";
	featureName = '<p>Type: Truck Parking</p>',
	featureClass = 'hwycl',
	featureIcon = 'trkparkicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);	
};
//  NHS Connectors
function clkNHS(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>';
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Fac_Served + "</div><div class='labelfield'>Facility Served</div>"
                        +"<div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong> <a title='Predominant lane count for designated segment' data-toggle='infotooltip'>Lanes per direction</a>: </strong></td><td>" + props.Cap_1 + "</td></tr>"
                                +"<tr><td><strong> <a title='Average Annual Daily Traffic' data-toggle='infotooltip'>AADT</a>: </strong></td><td>not available</td></tr>"
                                +"</table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
		             //           +"<br/><p>" + props.Profile + "</p>";,
	featureName = '<p>Type: NHS Connector</p>',
	featureClass = 'hwycl',
	featureIcon = 'nhsicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);		
};
//  Highway Bridges
function clkHwyRvrXing(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Line + "</div><div class='labelfield'>Highway</div>"
                        +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Tolled (y/n)</div>"
                        +"<div class='datafield'>" + props.Type_1 + "</div><div class='labelfield'>Bridge Type</div>"
                        +"<div class='datafield'>" + props.Town_1 + " - " + props.Town_2  + "</div><div class='labelfield'>Connecting Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong><a title='Total count of lanes, both directions.' data-toggle='infotooltip'>Travel Lanes</a>: </strong></td><td>" + props.Cap_1 + "</td></tr>"
                                +"<tr><td><strong>Vertical Restriction <span style='font-weight:normal;'>(ft)</span>: </strong></td><td>" + props.Cap_2 + "</td></tr>"
                                +"<tr class='active'><td><strong> <a title='Average Annual Daily Traffic' data-toggle='infotooltip'>AADT</a>: </strong></td><td>" + props.Act_1 + "</td></tr>"
                                +"</table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
	featureName = '<p>Type: Highway River Crossing</p>',
	featureClass = 'hwycl',
	featureIcon = 'hwyrivicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};	

//Rail Actions
//rail lines
function clkRailline(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
            +"<div class='datafield'>" + props.Operator + "</div><div class='labelfield'>Operator(s)</div>"
            +"</div><!--close baseInfo-->"
            +"<div class='infoDivider'></div>"
            +"<div id='indactorInfo'>"
            +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
            +"<li class='active'><a href='#IntermodalCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
            +"<div id='indicator' class='tab-content'><!--tab panes-->"
            +"<div class='tab-pane active' id='IntermodalCap' style='padding-bottom: 12px;'>"
                    +"<table class='table table-hover'>"
                    +"<tr class='active'><td><strong> <a title='Predominant count of through tracks on designated segment' data-toggle='infotooltip'>Number of Tracks</a>: </strong></td><td>" + props.Cap1 + "</td></tr>"
                    +"<tr><td><strong> <a title='Ability to operate double stack trains. Double stack is a technology allowing intermodal containers to be stack two high on train cars.' data-toggle='infotooltip'>Double Stack Clearance</a>: </strong></td><td> " + props.Cap2 + " </td></tr>"
                    +"<tr class='active'><td><strong> <a title='Capacity to operate 286,000 pound rail cars on designated segment' data-toggle='infotooltip'>286k Capacity</a>: </strong></td><td>" + props.Cap3 + "</td></tr>"
                    +"<tr><td><strong> Trains Daily: </strong></td><td>not reported</td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
	featureName = '<p>Type: ' + props.Type + '</p>',
	featureClass = 'railcl',
	featureIcon = 'railicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};	
//rail yards
function clkRailYard(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.Rail_Line + "</div><div class='labelfield'>Line Serving</div>"
                        +"<div class='datafield'>" + props.Township + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#IntermodalCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='IntermodalCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.GIS_Acres).format('0,0.0') + "</td></tr>"
                                +"<tr><td><strong>Annual Car Count: </strong></td><td>n/a</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
                        //+"<div style='height:34px;'><a href='http://www.dvrpc.org/webmaps/PhillyFreightFinder/reports/FC/FC34.pdf' target='_blank' style='line-height:34px;float:left;'><div class='pdf'></div>Related Report: " + props.REPORT + "</a></span></div></div>" ;
	featureName = '<p>Type: Rail Yard</p>',
	featureClass = 'railcl',
	featureIcon = 'railyardicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};	
//rail crossings
function clkRailXing(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Owner_1 + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.Township + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong> <a title='Count of active tracks at grade crossing' data-toggle='infotooltip'>Tracks at Crossing</a>: </strong></td><td>" + props.Cap + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source_1 + "</div></div>",
                        // +"<p>" + props.Report + "</p>";
	featureName = '<p>Type: Class I Grade Crossing</p>',
	featureClass = 'railcl',
	featureIcon = 'railcrossicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};
//rail intermodal
function clkIntermodal(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.Township + "</div><div class='labelfield'>Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#IntermodalCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='IntermodalCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.GIS_Acres).format('0,0.0') + "</td></tr>"
                                +"<tr><td><strong>Activity: </strong></td><td>n/a</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
                        //+"<div style='height:34px;'><a href='http://www.dvrpc.org/webmaps/PhillyFreightFinder/reports/FC/FC34.pdf' target='_blank' style='line-height:34px;float:left;'><div class='pdf'></div>Related Report</a></span></div></div>" ;
	featureName = '<p>Type: Intermodal Rail Yard</p>',
	featureClass = 'railcl',
	featureIcon = 'railintericon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};
//rail river crossing
function clkRailRvrXing(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Line + "</div><div class='labelfield'>Rail Line</div>"
                        +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.Type_1 + "</div><div class='labelfield'>Bridge Type</div>"
                        +"<div class='datafield'>" + props.Town_1 + " - " + props.Town_2  + "</div><div class='labelfield'>Connecting Municipality(ies)</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#RailrivCap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='RailrivCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Width <span style='font-weight:normal;'>(tracks)</span>: </strong></td><td>" + props.Cap_1 + "</td></tr>"
                                +"<tr><td><strong> <a title='Ability to operate double stack trains. Double stack is a technology allowing intermodal containers to be stack two high on train cars.' data-toggle='infotooltip'>Double Stack Clearance</a>: </strong></td><td>" + props.Cap_2 + "</td></tr>"
                                +"<tr class='active'><td><strong> <a title='Capacity to operate 286,000 pound rail cars on designated segment' data-toggle='infotooltip'>286k Capacity</a>: </strong></td><td>" + props.Cap_3 + "</td></tr>"
                                +"<tr><td><strong>Activity: </strong></td><td>" + props.Act_1 + "</a></td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
   	featureName = '<p>Type: Rail River Crossing</p>',
	featureClass = 'railcl',
	featureIcon = 'railrivicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};

//Ports/Waterways Features
//Ports
function clkport(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>';
	var contentBulk = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.Township + "</div><div class='labelfield'>Municipal Location</div>"
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
                                +"<tr class='active'><td class='item'><strong>2012 Ship Arrivals: </strong></td><td>" + props.Act_1 + "</td><td>o</td></tr>"
                                +"<tr class='active'><td class='item'><strong>Cargo handled: </strong></td><td colspan='2' style='line-height:1!important;'>" + props.Cargo + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>" + props.Source + "</div></div>",
    contentGeneral ="<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
                        +"<div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>"
                        +"<div class='datafield'>" + props.Township + "</div><div class='labelfield'>Municipal Location</div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#portCap' data-toggle='tab'>Capacity</a></li>"
                        +"<li><a href='#portAct' data-toggle='tab'>Activity</a></li></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='portCap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Qty of Berths: </strong></td><td>" + props.Cap_1 + "</td></tr>"
                                +"<tr><td><strong>Total Berth Length: </strong></td><td>" + props.Cap_2 + " linear ft</td></tr>"
                                +"<tr class='active'><td><strong>Berth Depth <span style='font-weight:normal;'><a title='Mean Low Water' data-toggle='infotooltip'>(MLW)</a></span>: </strong></td><td>" + props.Cap_3 + " feet</td></tr>"
                                +"<tr><td><strong>Available Cranes: </strong></td><td><a title='" + props.Cap_4 + "' data-toggle='infotooltip'>" + props.Cap_41 + "</a></td></tr>"
                                +"<tr class='active'><td><strong>Warehouse Space: </strong></td><td>" + props.Cap_5 + "</td></tr></table>"
                        +"</div>"
                        +"<div class='tab-pane' id='portAct' style='padding-bottom: 12px;height:132px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td class='item'><strong>2012 Ship Arrivals: </strong></td><td>" + props.Act_1 + "</td><td>o</td></tr>"
                                +"<tr class='active'><td class='item'><strong>Cargo handled: </strong></td><td colspan='2' style='line-height:1!important;'>" + props.Cargo + "</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>" + props.Source + "</div></div>";
    if (props.Type == 'Bulk'){ content = contentBulk; } else {content = contentGeneral;}
   	featureName = '<p>Type: '+ props.Type + ' Terminal</p>',
	featureClass = 'portcl',
	featureIcon = 'porticon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};
//anchorage
function clkanchorage(e) {
	initializeHL(e);
	header = '<p>' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Adjacent Municipality(ies)</div>"
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
                    +"<tr class='active'><td><strong> Annual Ships (" + props.YEAR + "): </strong></td><td>" + props.Act_1 + "</td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
   	featureName = '<p>Type: Anchorage</p>',
	featureClass = 'portcl',
	featureIcon = 'anchicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};
//River
function clkriver(e) {
	initializeHL(e);
	header = '<p>' + props.NAME + '</p>',
	content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Adjacent Municipality(ies)</div>"
            +"<div class='datafield'>" + props.Start + "</div><div class='labelfield'> <a title='Nautical miles from Atlantic Ocean' data-toggle='infotooltip'>Start Point</a>: </div>"
            +"<div class='datafield'>" + props.End + "</div><div class='labelfield'> <a title='Nautical miles from Atlantic Ocean' data-toggle='infotooltip'>End Point</a>: </div>"
            +"</div><!--close baseInfo-->"
            +"<div class='infoDivider'></div>"
            +"<div id='indactorInfo'>"
            +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
            +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
            +"<div id='indicator' class='tab-content'><!--tab panes-->"
            +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                    +"<table class='table table-hover'>"
                    +"<tr class='active'><td><strong>Channel Width <span style='font-weight:normal;'>(ft)</span>: </strong></td><td>" + props.Cap_1 + "</td></tr>"
                    +"<tr><td><strong> Channel Depth <span style='font-weight:normal;'><a title='Mean Lower Low Water' data-toggle='infotooltip'>(MLLW in ft)</a></span>: </strong></td><td>" + props.Cap_2 + "</td></tr>"
                    +"<tr class='active'><td><strong> <a title='Approved vertical clearance within navigable channel' data-toggle='infotooltip'>Maximum Air Draft <span style='font-weight:normal;'>(ft)</span></a>: </strong></td><td>" + props.Cap_3 + "</td></tr>"
                    +"<tr><td><strong>Annual Activity: </strong></td><td>not reported</td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
   	featureName = '<p>Type: River Channel</p>',
	featureClass = 'portcl',
	featureIcon = 'rivericon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};

//Freight Centers
function clkFreightCenter(e) {
	initializeHL(e);
	var fclass;
	header = '<p>' + props.NAME + '</p>',
	content = "<div id='baseInfo'>"
                        +"<div class='datafield'>" + props.Center_Typ + "</div><div class='labelfield'>Type</div>"
                        +"<div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Municipality(ies): </div>"
                        +"</div><!--close baseInfo-->"
                        +"<div class='infoDivider'></div>"
                        +"<div id='indactorInfo'>"
                        +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                        +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>"
                        +"<div id='indicator' class='tab-content'><!--tab panes-->"
                        +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                                +"<table class='table table-hover'>"
                                +"<tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.Acres).format('0,0.0') + "</td></tr>"
                                +"<tr><td><strong>Output: </strong></td><td>not available</td></tr></table>"
                        +"</div></div>"
                        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>";
                        // +"<p>" + props.REPORT + "</p>";
    if (props.Center_Typ === 'Intermediate'){
    		fclass = 'fcinter';
    }else if(props.Center_Typ === 'Major'){
    		fclass = 'fcmajor';
    }else if (props.Center_Typ === 'Mega'){
    		fclass = 'fcmega';
    }else{}

   	featureName = '<p>Type: '+ props.Center_Typ +' Freight Center</p>',
	featureClass = ''+ fclass +'cl',
	featureIcon = ''+ fclass +'icon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};

//Airports
//commercial/reliever
function clkairport(e) {
	initializeHL(e);
	var aclass;
	header = '<p>(' + props.NAVID + ') ' + props.Name + '</p>',
	content = "<div id='baseInfo'>"
            +"<div class='datafield'>" + props.Airport_Ty + "</div><div class='labelfield'>Type</div>"
            +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
            +"<div class='datafield'>" + props.Township + "</div><div class='labelfield'>Municipality(ies): </div>"
            +"</div><!--close baseInfo-->"
            +"<div class='infoDivider'></div>"
            +"<div id='indactorInfo'>"
            +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
            +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul>"
            +"<div id='indicator' class='tab-content'><!--tab panes-->"
            +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                    +"<table class='table table-hover'>"
                    +"<tr class='active'><td><strong>Runway(s): </strong></td><td>" + props.Cap_1 + "</td></tr>"
                    +"<tr><td><strong>Runway Length(s): </strong></td><td> " + props.Cap_2 + " </td></tr>"
                    +"<tr class='active'><td><strong>Total Acreage: </strong></td><td>" + props.Cap_3 + "</td></tr>"
                    +"<tr><td><strong> <a title='Count of annual takeoffs and landings' data-toggle='infotooltip'>Annual Operations</a>: </strong></td><td> " + props.Activity_1 + " </td></tr></table>"
            +"</div></div>"
            +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>";
	if (props.Airport_Ty === 'Commercial'){
    		aclass = 'comm';
    }else if(props.Airport_Ty === 'Reliever'){
    		aclass = 'rel';
    } else{}
   	featureName = '<p>Type: '+ props.Airport_Ty +' Airport</p>',
	featureClass = ''+ aclass +'aircl',
	featureIcon = ''+ aclass +'icon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};
//heliports
function clkheliport(e) {
	initializeHL(e);
	header = '<p>(' + props.LocationID + ") " +props.FacilityNa + '</p>',
	content = "<div id='baseInfo'>"
                +"<div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>"
                +"<div class='datafield'>" + props.City + "</div><div class='labelfield'>Municipality(ies): </div>"
                +"</div><!--close baseInfo-->"
                +"<div class='infoDivider'></div>"
                +"<div id='indactorInfo'>"
                +"<ul class='nav nav-tabs'><!--tabs for indicators-->"
                +"<li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul>"
                +"<div id='indicator' class='tab-content'><!--tab panes-->"
                +"<div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>"
                        +"<table class='table table-hover'>"
                        +"<tr class='active'><td><strong>Diameter: </strong></td><td>" + props.Size + " ft</td></tr>"
                        +"<tr><td><strong>Annual Operations: </strong></td><td>not available</td></tr></table>"
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
	        +"<div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
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
            +"<div class='datafield'>" + props.Municipali + "</div><div class='labelfield'>Municipality</div>"
            +"<div class='datafield'>" + props.County + " County</div><div class='labelfield'>County</div>"
            +"<div class='datafield'> " + props.Descr1 + props.Descr2 +" "+ props.Descr3 + " </div>"
            +"<div class='labelfield source'>Data Source: 2012 DVRPC</div></div>",
   	featureName = '<p>Type: Freight as a Good Neighbor</p>',
	featureClass = 'communcl',
	featureIcon = 'communicon icon';
	contentPush(header,content,featureName,featureClass,featureIcon);
};

//county data controls and functions
            function displayCountyname(e) {
                var layer = e.target;
                layer.bringToFront();
                layer.setStyle({color: "#312867"});
                var props = layer.feature.properties
                var county = '<p>' + props.NAME + ' County</p>';
                document.getElementById('countyname').innerHTML = county; 
                if($('#countyname').hasClass('hidden')){
                    $('#countyname').removeClass('hidden');
                }        
            }
            function clearCountyname(e) {
                var layer = e.target;
                layer.setStyle({color: "#efefef"});
                document.getElementById('countyname').innerHTML = " ";
                $('#countyname').addClass('hidden');
            }
            function showRegional(){
            	resetCounty();
            	window.location.hash = '#region';
            	if($('#dataContainer').hasClass('hidden')){
                	$('#dataContainer').removeClass('hidden');
                	$('#dataCounty').addClass('hidden');
                	populateCharts();
                }
            }

            serialize = function(obj) {
			  var str = [];
			  for(var p in obj)
			    if (obj.hasOwnProperty(p)) {
			      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    }
			  return str.join("&");
			}
            function populateCounty(e) {
                mcounty.setStyle({fillColor: "#396ab2"});
                var layer = e.target;
                layer.setStyle({fillColor: "#312867"});
                if($('#dataCounty').hasClass('hidden')){
                	$('#dataContainer').addClass('hidden');
                	$('#dataCounty').removeClass('hidden');
                }
                
                var props = layer.feature.properties
                
                var countyHash = '#region,'+ layer._leaflet_id
                window.location.hash = countyHash;
                
                var slideshow = "<ul class='bxslider'><li><img src='lib/images/county/small/"+ props.NAME +"/1.jpg'  title='"+props.one+"' /></li>"
                		+"<li><img src='lib/images/county/small/"+ props.NAME +"/2.jpg' title='"+props.two+"' /></li>"
                		+"<li><img src='lib/images/county/small/"+ props.NAME +"/3.jpg' title='"+props.three+"' /></li>"
                		+"<li><img src='lib/images/county/small/"+ props.NAME +"/4.jpg' title='"+props.four+"' /></li>"
                		+"<li><img src='lib/images/county/small/"+ props.NAME +"/5.jpg' title='"+props.five+"' /></li>"
                		+"<li><img src='lib/images/county/small/"+ props.NAME +"/6.jpg' title='"+props.six+"' /></li>"
                		+"<li><img src='lib/images/county/small/"+ props.NAME +"/7.jpg' title='"+props.seven+"' /></li>"
                		+"<li><img src='lib/images/county/small/"+ props.NAME +"/8.jpg' title='"+props.eight+"' /></li></ul>";

                $('#ctyDataName').html(''+ props.NAME +' County');
                $('#data-1').html(''+ props.IntRouteMi +'');
                $('#data-2').html(''+ props.NatHwyMile +'');
                $('#data-5').html(''+ props.truckMiles +'');
                $('#data-6').html(''+ props.freightRai +'');
                $('#data-8').html(''+ props.portTermin +'');
                var FCnumber = parseInt(props.megaCtr, 10) + parseInt(props.majCtr, 10) + parseInt(props.intCtr, 10);
                
                $('#data-10').html(''+ FCnumber +'');
                $('#data-11').html(''+ props.FCacreage +'');
                $('#data-3').html(''+ props.NHS +'');
                $('#data-4').html(''+ props.interch +'');
                $('#data-7').html(''+ props.yards +'');
                //$('#data-12').html(''+ props.FCacreage +'');
                //$('#data-13').html(''+ props.LTmiles +'');
                //$('#data-14').html(''+ props.HTmiles +'');
                $('#data-9').html(''+ props.ShipCalls +'');
                $('#ctySlideshow').html(''+slideshow+'');

                var name = props.NAME
                var data1 = props.IntRouteMi
                var data2 = props.NatHwyMile
                var data3 = props.truckMiles
                var data4 = props.freightRai
                var data5 = props.portTermin
                var data6 = props.megaCtr
                var data7 = props.majCtr
                var data8 = props.intCtr
                var data9 = props.NHS
                var data10 = props.interch
                var data11 = props.yards
                var data12 = props.FCacreage
                var data13 = props.LTmiles
                var data14 = props.HTmiles
                var data15 = props.ShipCalls
                var photo = Math.floor(Math.random() * 8) + 1;
                if(photo=1){
                	var caption = props.one
                }else if(photo=2){
                	var caption = props.two
                }else if(photo=3){
                	var caption = props.three
                }else if(photo=4){
                	var caption = props.four
                }else if(photo=5){
                	var caption = props.five
                }else if(photo=6){
                	var caption = props.six
                }else if(photo=7){
                	var caption = props.seven	
                }else if(photo=8){
                	var caption = props.eight
                }else if(photo=9){
                }

                var countyBounds = e.target.getBounds(),

                    mcountyPrint = ({name: name, 1: data1, 2: data2, 3: data3, 4:data4, 5:data5, 6:data6, 7:data7, 8:data8, 9:data9, 10:data10, 11:data11, 12:data12,13:data13,14:data14,15:data15,16:photo,17:caption}),
                            
                    mcLink = 'modals/mcountyPrint.html?'+ serialize(mcountyPrint);
                    console.log(countyBounds);
                //console.log(mcLink);
                $('#countyBtn').html('<a href="'+ mcLink +'" target="_blank"><button class="btn btn-primary" ><i class="dynico dynico-compass"></i>&nbsp;&nbsp;Print Version</button></a>');
                

                $('#countyBoundsLink').html('<a href="#map" onClick="zoomToCounty('+countyBounds._southWest.lat+', '+countyBounds._southWest.lng+', '+countyBounds._northEast.lat+', '+countyBounds._northEast.lng+');"><button class="btn btn-primary" ><i class="dynico dynico-map"></i>&nbsp;&nbsp;Browse by Map</button></a>');

                var slider = $('.bxslider').bxSlider({
                    auto: true,
                    slideMargin: 5,
                    captions: true
                });
                

            }
            function resetCounty(e) {
                mcounty.setStyle({fillColor: "#396ab2"});
            }
            
            function activateTooltip() {
            	$("[data-toggle=infotooltip]").tooltip({ placement: 'left'});
            }

            function zoomToCounty (a, b, c, d){
                    map.invalidateSize();
                    setTimeout(function() {                        
                        map.fitBounds([[a,b],[c,d]]);
                    }, 500);
            }

            function loadBar2(){
                map.invalidateSize();
                return $("#loading").show().delay(100).promise();
            }


            /////////////////////////////////////////////////////
            //////////////////////////////////////////////////
            /////// Regional Highcharts graphs

$(document).ready(function() {
    var dataID, dwnID, dwnName; 
    console.log('pre');
    $.getJSON("http://dvrpcfreight.github.io/phillyfreightfinder/data/download/dataUpdates.js", function(data) {
        console.log('running');
        for(var i = 0; i < data.length; i++){
            dwnID = data[i].id, dwnName = data[i].name;
            console.log(dwnID);
            console.log(dwnName);
        }
    });
    

    $( 'a[href="#"]' ).click( function(e) {
      e.preventDefault();
     });
    
    Highcharts.setOptions({
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

     });

});