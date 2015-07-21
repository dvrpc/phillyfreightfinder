//declare boundary of region
var oLat = 40.018,
    oLng = -75.148,
    zLevel = 9; ///adjust lat-lon coordinates to center on your region

var map, map2, countySearch = [],
    polyLayer = [],
    highwaySearch = [],
    truckParkSearch = [],
    nhsSearch = [],
    hwyBridgeSearch = [],
    railSearch = [],
    railyardSearch = [],
    intermodalSearch = [],
    RailBridgeSearch = [],
    xingSearch = [],
    riverSearch = [],
    portSearch = [],
    anchSearch = [],
    commairSearch = [],
    relairSearch = [],
    heliportSearch = [],
    FCinterSearch = [],
    FCmajorSearch = [],
    FCmegaSearch = [],
    mcountyPrint = [];
//countyMap
//county maps
var Stamen_TonerBackground = L.tileLayer('http://{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    subdomains: 'abcd',
    opacity: 0.0
});
countymap = L.map("map2", {
    minZoom: 8,
    maxZoom: 8,
    dragging: false,
    zoomControl: false,
    boxZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    layers: [Stamen_TonerBackground]
});
//countyregions
var mcounty = L.geoJson(null, {
    style: {
        color: "#efefef",
        weight: 4,
        fillColor: "#396ab2",
        opacity: 1,
        fillOpacity: 1
    },
    onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: displayCountyname,
            mouseout: clearCountyname,
            click: populateCounty
        });
    }
});
$.getJSON("data/county5k.js", function(data) {
    mcounty.addData(data);
}).complete(function() {
    countymap.fitBounds(mcounty.getBounds());
});

    //declare basemaps
    // Basemap Layers
    var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    var Esri_transportation = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 8,
        maxZoom: 18
    });
    var Acetate_all = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png', {
        attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
        subdomains: '0123',
        minZoom: 2,
        maxZoom: 18
    });

    //create map instance
    var map = L.map("mapDIV", {
        minZoom: zLevel,
        zoomControl: false,
        layers: [Acetate_all]
    })/*.setView([oLat, oLng], zLevel)*/;

    //add Layer Control to map
    var baseLayers = {
        "Satellite": Esri_WorldImagery,
        "Street Map": Acetate_all
    };
    L.control.layers(baseLayers).addTo(map);

    

    //advanced handling of street labels
    //Base and Overlay Handling
    var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);

    function addStreetLabels() {
        var topLayer = (Esri_transportation).addTo(map);
        topPane.appendChild(topLayer.getContainer());
        topLayer.setZIndex(2);
    };
    map.on('moveend', function() {
        if (map.getZoom() > 13 && map.hasLayer(Esri_WorldImagery)) {
            addStreetLabels();

        };
        if (map.getZoom() <= 13) {
            map.removeLayer(Esri_transportation);
        };
    });
    map.on('baselayerchange', function() {
        if (map.getZoom() > 13 && map.hasLayer(Acetate_all)) {
            map.removeLayer(Esri_transportation);
        };
        if (map.getZoom() > 13 && map.hasLayer(Esri_WorldImagery)) {
            addStreetLabels();
        };
    });
    // Static DVRPC Layers
    var counties = L.geoJson(null, {
        style: function(feature) {
            return {
                color: "white",
                fill: false,
                opacity: 0.4,
                clickable: false,
            };
        },
        onEachFeature: function(feature, layer) {
            countySearch.push({
                name: layer.feature.properties.Co_Name,
                source: "Counties",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });
    $.getJSON("data/counties.js", function(data) {
        counties.addData(data);
    }).complete(function() {
        map.fitBounds(counties.getBounds());
    });
    (counties).addTo(map);


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/////////      Declare Data Layers Here        ///////////////////
//////////////////////////////////////////////////////////////////

//define Icon types for point features
var rdIconSize = 30;

var PFFcustomIcon = L.Icon.extend({
    options: {
        iconSize: [rdIconSize, rdIconSize],
        iconAnchor: [rdIconSize / 2, rdIconSize / 2],
        popupAnchor: [0, rdIconSize / 2]
    }
});
var IconPresets = {markerSet: 'open-freight', mapMarker: 'circle-cm', legendMarker:'circle-md', iconSet: 'dynico'};


var commicon = L.OpenFreightMarkers.icon({
        icon: 'airport', markerColor: 'forest', layer:'commGroup', title: 'Commercial Airport'}, IconPresets),
    relvicon = new L.OpenFreightMarkers.icon({
        icon: 'airport', markerColor: 'green', layer:'relGroup', title: 'Reliever Airport'}, IconPresets),
    helicon = L.OpenFreightMarkers.icon({
        icon: 'heliport', markerColor: 'ltgreen', layer:'heliport', title: 'Heliport'}, IconPresets),
    FCintericon = L.OpenFreightMarkers.icon({
        icon: 'center', markerColor: 'peach', layer:'FCintergroup', title: 'Intermediate Center'}, IconPresets),
    FCmajoricon = L.OpenFreightMarkers.icon({
        icon: 'center', markerColor: 'orange', layer:'FCmajorgroup', title: 'Major Center'}, IconPresets),
    FCmegaicon = L.OpenFreightMarkers.icon({
        icon: 'center', markerColor: 'red', layer:'FCmegagroup', title: 'Mega Center'}, IconPresets),
    hwyicon = L.OpenFreightMarkers.icon({
        icon: 'truck', markerColor: 'purple', layer:'freeway', title: 'Highway'}, IconPresets),
    trckprkicon = L.OpenFreightMarkers.icon({
        icon: 'parking', markerColor: 'purple', layer:'trkparkgroup', title: 'Truck Parking'}, IconPresets),
    hwybricon = L.OpenFreightMarkers.icon({
        icon: 'bridge', markerColor: 'purple', layer:'hwyrivcrossing', title: 'Highway River Crossing'}, IconPresets),
    NHSicon = L.OpenFreightMarkers.icon({
        icon: 'nhs', markerColor: 'purple', layer:'nhsgroup', title: 'NHS Connector'}, IconPresets),
    railLineicon = L.OpenFreightMarkers.icon({
        icon: 'rail', markerColor: 'gold', layer:'railines', title: 'Rail Line'}, IconPresets),
    ryicon = L.OpenFreightMarkers.icon({
        icon: 'railyard', markerColor: 'gold', layer:'railyardgroup', title: 'Rail Yard'}, IconPresets),
    imicon = L.OpenFreightMarkers.icon({
        icon: 'intermodal', markerColor: 'gold', layer:'intermodalgroup', title: 'Intermodal Yard'}, IconPresets),
    xingicon = L.OpenFreightMarkers.icon({
        icon: 'railxing', markerColor: 'gold', layer:'gradexing', title: 'Class I Grade Crossing'}, IconPresets),
    rbicon = L.OpenFreightMarkers.icon({
        icon: 'bridge', markerColor: 'gold', layer:'railbridge', title: 'Rail River Crossing'}, IconPresets),
    prticon = L.OpenFreightMarkers.icon({
        icon: 'ship', markerColor: 'blue', layer:'portGroup', title: 'Port Terminal'}, IconPresets),
    anchicon = L.OpenFreightMarkers.icon({
        icon: 'anchor', markerColor: 'blue', layer:'anchorageGroup', title: 'Anchorage'}, IconPresets),
    riverIcon = L.OpenFreightMarkers.icon({
        icon: 'river', markerColor: 'blue', layer:'river', title: 'Navigable River'}, IconPresets),
    fgnicon = L.OpenFreightMarkers.icon({
        icon: 'community', markerColor: 'teal', layer:'fgneighbor', title: 'Freight as a Good Neighbor'}, IconPresets),
    pipeIcon = L.OpenFreightMarkers.icon({
        icon: 'pipeline', markerColor: 'yellow', layer:'pipelines', title: 'Pipeline', onLoad: false}, IconPresets);
   
    //define airport layers
    //define commercial airports
    var commairpoly = L.geoJson(null, {
        style: {
            fillColor: "#216937",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkairport,
                dblclick: zoomToFeature
            });
            commairSearch.push({
                name: layer.feature.properties.Name,
                source: "CommAirports",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });
    

    var commairpt = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: commicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkairport,
                dblclick: zoomToPoint
            });
        }
    });
   

    //define releiver airports
    var relairpoly = L.geoJson(null, {
        style: {
            fillColor: "#30B34C",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkairport,
                dblclick: zoomToFeature
            });
            relairSearch.push({
                name: layer.feature.properties.Name,
                source: "ReleivAirports",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });
    

    var relvairpt = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: relvicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkairport,
                dblclick: zoomToPoint
            });
        }
    });
    

    var heliport = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: helicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkheliport,
                dblclick: zoomToPoint
            });
            heliportSearch.push({
                name: layer.feature.properties.FacilityNa,
                source: "Heliports",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    });
    

    //define freight centers
    //define intermediate centers
    var FCinterpoly = L.geoJson(null, {
        style: {
            fillColor: "#F9AB90",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkFreightCenter,
                dblclick: zoomToFeature
            });
            FCinterSearch.push({
                name: layer.feature.properties.Name,
                source: "FCInter",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });
    

    var FCinterpt = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: FCintericon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkFreightCenter,
                dblclick: zoomToFC
            });
        }
    });
    

    //define major centers
    var FCmajorpoly = L.geoJson(null, {
        style: {
            fillColor: "#F26122",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkFreightCenter,
                dblclick: zoomToFeature
            });
            FCmajorSearch.push({
                name: layer.feature.properties.Name,
                source: "FCmajor",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });



    var FCmajorpt = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: FCmajoricon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkFreightCenter,
                dblclick: zoomToFC
            });
        }
    });


    //define mega centers
    var FCmegapoly = L.geoJson(null, {
        style: {
            fillColor: "#C1332B",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkFreightCenter,
                dblclick: zoomToFeature
            });
            FCmegaSearch.push({
                name: layer.feature.properties.Name,
                source: "FCmega",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });



    var FCmegapt = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: FCmegaicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkFreightCenter,
                dblclick: zoomToFC
            });
        }
    });


    //define highway layers      
    //define truck parking polygons
    var truckparkpoly = L.geoJson(null, {
        style: {
            fillColor: "#884C9E",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkParking,
                dblclick: zoomToFeature
            });
            truckParkSearch.push({
                name: layer.feature.properties.Name,
                source: "TruckParking",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });


    var tppoints = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: trckprkicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkParking,
                dblclick: zoomToPoint
            });
        }
    });


    var hwyrivcrossing = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: hwybricon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkHwyRvrXing,
                dblclick: zoomToPoint
            });
            hwyBridgeSearch.push({
                name: layer.feature.properties.Name_1,
                source: "HwyBridges",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    })

    //define NHS polylines
    var nhspoly = L.geoJson(null, {
        style: {
            weight: 5,
            color: "#E8C3F5 ",
            opacity: 1
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkNHS,
                dblclick: zoomToFeature
            });
            nhsSearch.push({
                name: layer.feature.properties.Name_1,
                source: "NHS",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });


    var nhs = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: NHSicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkNHS,
                dblclick: zoomToPoint
            });
        }
    });

    //define freeways
    var freeway = L.geoJson(null, {
        style: function style(feature) {
            switch (feature.properties.Type) {
                case 'Limited Access Highway':
                    return {
                        color: "#C57AE0",
                        weight: 5,
                        opacity: 1
                    };
                case 'Interstate Highway':
                    return {
                        color: "#884C9E",
                        weight: 5,
                        opacity: 1
                    };
            }
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkHwy,
                dblclick: zoomToFeature
            });
            highwaySearch.push({
                name: layer.feature.properties.Name,
                source: "Highways",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }

    });


    //define rail layers
    //define rail lines
    var railines = L.geoJson(null, {
        style: function style(feature) {
            switch (feature.properties.Type) {
                case 'Industrial Track \/ Shortline':
                    return {
                        color: "#FDD195",
                        weight: 5,
                        opacity: .90
                    };
                case 'Secondary':
                    return {
                        color: "#FCBB65",
                        weight: 5,
                        opacity: .90
                    };
                case 'Interstate':
                    return {
                        color: "#FD8D3C",
                        weight: 5,
                        opacity: .90
                    };
            }
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkRailline,
                dblclick: zoomToFeature
            });
            railSearch.push({
                name: layer.feature.properties.Name,
                source: "RailLines",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });


    //define rail yards
    var railyardpoly = L.geoJson(null, {
        style: {
            fillColor: "#FBA919",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkRailYard,
                dblclick: zoomToFeature
            });
            railyardSearch.push({
                name: layer.feature.properties.Name,
                source: "RailYards",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });



    var railyardpt = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: ryicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkRailYard,
                dblclick: zoomToPoint
            });
        }
    });

    //define intermodal
    var intermodalpoly = L.geoJson(null, {
        style: {
            fillColor: "#FBA919",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkIntermodal,
                dblclick: zoomToFeature
            });
            intermodalSearch.push({
                name: layer.feature.properties.Name_1,
                source: "Intermodal",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });

    var intermodalpt = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: imicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkIntermodal,
                dblclick: zoomToPoint
            });
        }
    });

    //define grade crossings
    var gradexing = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: xingicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkRailXing,
                dblclick: zoomToPoint
            });
            xingSearch.push({
                name: layer.feature.properties.Name,
                source: "GradeCrossing",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    });
    $.getJSON("data/gradeXing.js", function(data) {
        gradexing.addData(data);
    });
    //define rail bridge
    var railbridge = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: rbicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkRailRvrXing,
                dblclick: zoomToPoint
            });
            RailBridgeSearch.push({
                name: layer.feature.properties.Name,
                source: "RailBridges",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    });

    //define maritime facilities
    //define river
    var river = L.geoJson(null, {
        style: {
            fillColor: "#55B8DF",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .65
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkriver,
                dblclick: zoomToFeature
            });
            riverSearch.push({
                name: layer.feature.properties.NAME,
                source: "Rivers",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });


    //define ports
    var portpoly = L.geoJson(null, {
        style: {
            fillColor: "#29A0CF",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .75
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkport,
                dblclick: zoomToFeature
            });
            portSearch.push({
                name: layer.feature.properties.Name,
                source: "PortTerminals",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });



    var porticon = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: prticon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkport,
                dblclick: zoomToPoint
            });
        }
    });

    //define anchorages
    var anchoragepoly = L.geoJson(null, {
        style: {
            fillColor: "#0E76BC",
            fillOpacity: .50,
            weight: 1,
            color: "#E0E0E0 ",
            opacity: .65
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkanchorage,
                dblclick: zoomToFeature
            });
            anchSearch.push({
                name: layer.feature.properties.Name,
                source: "Anchorages",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        }
    });
    

    var anchoricon = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: anchicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkanchorage,
                dblclick: zoomToPoint
            });
        }
    });


    //define energy layers
    //define pipelines
    var pipelines = L.geoJson(null, {
        style: {
            color: "#EFD315",
            weight: 3,
            opacity: .90
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkpipelines,
                dblclick: zoomToFeature
            });
        }
    });




    //pipeline visibility hack
    map.on('moveend', function() {
        if (map.getZoom() > 14) {
            $('#pipelabel').parent().addClass('disabled');
            $('#pipelabel').closest('.panel').find('.checked_all').addClass('disabled');
        };
        if (map.getZoom() > 14 && map.hasLayer(pipelines) && $("#pipelines").is(':checked')) {
            map.removeLayer(pipelines);
            var pipelinelegend = document.getElementById('pipehidden');
            pipelinelegend.innerHTML = "[not available at zoom level]";
        };
        if (map.getZoom() <= 14) {
            $('#pipelabel').parent().removeClass('disabled');
            $('#pipelabel').closest('.panel').find('.checked_all').removeClass('disabled');
        };
        if (map.getZoom() <= 14 && $("#pipelines").is(':checked')) {
            map.addLayer(pipelines);
            var pipelinelegend = document.getElementById('pipehidden');
            pipelinelegend.innerHTML = "";
            $('#pipelabel').parent().removeClass('disabled');
        };
    });

    //define community layers
    //define freight as a good neighbor
    var fgneighbor = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: fgnicon
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                click: clkfgneighbor,
                dblclick: zoomToPoint
            });
        }
    });



    




    //map.setMaxBounds(counties.getBounds());
    //add layers in groups by order
    countymap.addLayer(mcounty);
    

    var FCintergroup = new L.FeatureGroup([FCinterpt, FCinterpoly]);
    var FCmajorgroup = new L.FeatureGroup([FCmajorpt, FCmajorpoly]);
    var FCmegagroup = new L.FeatureGroup([FCmegapt, FCmegapoly]);
    var FCenters = {
        "Mega Center": FCmegagroup,
        "Major Center": FCmajorgroup,
        "Intermediate Center": FCintergroup
    };
    var railyardgroup = new L.FeatureGroup([railyardpt, railyardpoly]);
    var intermodalgroup = new L.FeatureGroup([intermodalpt, intermodalpoly]);
    var Rail = {
        "Rail Line": railines,
        "Rail Yard": railyardgroup,
        "Intermodal Yard": intermodalgroup,
        "Class I Grade Crossing": gradexing,
        "Rail River Crossing": railbridge
    };
    var portGroup = new L.FeatureGroup([porticon, portpoly]);
    var anchorageGroup = new L.FeatureGroup([anchoricon, anchoragepoly]);
    var Portwater = {
        "Navigable River": river,
        "Port Terminal": portGroup,
        "Anchorage": anchorageGroup
    };
    var commGroup = new L.FeatureGroup([commairpt, commairpoly]);
    var relGroup = new L.FeatureGroup([relvairpt, relairpoly]);
    var airport = {
        "Commercial": commGroup,
        "Reliever": relGroup
    };

    var nhsgroup = new L.FeatureGroup([nhspoly, nhs]);
    var trkparkgroup = new L.FeatureGroup([truckparkpoly, tppoints]);
    var Highway = {
        "Freeway": freeway,
        "NHS Connector": nhsgroup,
        "Truck Parking": trkparkgroup,
        "Highway River Crossing": hwyrivcrossing
    };



    ///////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //  Create search functionality using Typeahead   ////
    //////////////////////////////////////////////////////

    // Highlight search box text on click
    $("#searchbox").click(function() {
        $(this).select();
    });

    // Typeahead search functionality
    function loadSearchBar() {
        $("#loading").hide();
        var $e1 = $('#searchbox'),
            $e2 = $('#searchhome');
        var e1 = $e1[0],
            e2 = $e2[0];
        var countyBH = new Bloodhound({
            name: "Counties",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: countySearch,
            limit: 10
        });
        var hwysBH = new Bloodhound({
            name: "Highways",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: highwaySearch,
            limit: 10
        });
        var nhsBH = new Bloodhound({
            name: "NHS",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: nhsSearch,
            limit: 10
        });
        var parkingBH = new Bloodhound({
            name: "TruckParking",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: truckParkSearch,
            limit: 10
        });
        var hwyBridgeBH = new Bloodhound({
            name: "HwyBridges",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: hwyBridgeSearch,
            limit: 10
        });
        var railLineBH = new Bloodhound({
            name: "RailLines",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: railSearch,
            limit: 10
        });
        var yardsBH = new Bloodhound({
            name: "RailYards",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: railyardSearch,
            limit: 10
        });
        var intermodalBH = new Bloodhound({
            name: "Intermodal",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: intermodalSearch,
            limit: 10
        });
        var gradexingBH = new Bloodhound({
            name: "GradeCrossing",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: xingSearch,
            limit: 10
        });
        var railBridgeBH = new Bloodhound({
            name: "RailBridges",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: RailBridgeSearch,
            limit: 10
        });
        var riverBH = new Bloodhound({
            name: "Rivers",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: riverSearch,
            limit: 10
        });
        var portsBH = new Bloodhound({
            name: "PortTerminals",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: portSearch,
            limit: 10
        });
        var anchBH = new Bloodhound({
            name: "Anchorages",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: anchSearch,
            limit: 10
        });
        var commBH = new Bloodhound({
            name: "CommAirports",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: commairSearch,
            limit: 10
        });
        var releiverBH = new Bloodhound({
            name: "ReleivAirports",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: relairSearch,
            limit: 10
        });
        var heliBH = new Bloodhound({
            name: "Heliports",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: heliportSearch,
            limit: 10
        });
        var interBH = new Bloodhound({
            name: "FCinter",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: FCinterSearch,
            limit: 10
        });
        var majorBH = new Bloodhound({
            name: "FCmajor",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: FCmajorSearch,
            limit: 10
        });
        var megaBH = new Bloodhound({
            name: "FCmega",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: FCmegaSearch,
            limit: 10
        });

        var geonamesBH = new Bloodhound({
            name: "GeoNames",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
                filter: function(data) {
                    return $.map(data.geonames, function(result) {
                        return {
                            name: result.name + ", " + result.adminCode1,
                            lat: result.lat,
                            lng: result.lng,
                            source: "GeoNames"
                        };
                    });
                },
                ajax: {
                    beforeSend: function(jqXhr, settings) {
                        settings.url += "&east=" + counties.getBounds().getEast() + "&west=" + counties.getBounds().getWest() + "&north=" + counties.getBounds().getNorth() + "&south=" + counties.getBounds().getSouth();
                        $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
                    },
                    complete: function(jqXHR, status) {
                        $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
                    }
                }
            },
            limit: 10
        });
        countyBH.initialize();
        hwysBH.initialize();
        parkingBH.initialize();
        hwyBridgeBH.initialize();
        nhsBH.initialize();
        railLineBH.initialize();
        yardsBH.initialize();
        intermodalBH.initialize();
        gradexingBH.initialize();
        railBridgeBH.initialize();
        riverBH.initialize();
        portsBH.initialize();
        anchBH.initialize();
        commBH.initialize();
        releiverBH.initialize();
        heliBH.initialize();
        interBH.initialize();
        majorBH.initialize();
        megaBH.initialize();
        geonamesBH.initialize();

        $([e1, e2]).typeahead({
            minLength: 2,
            highlight: true,
            hint: false
        }, {
            //$("#searchbox").typeahead([{
            name: "Counties",
            displayKey: "name",
            source: countyBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'>County</h5>"
            }
        }, {
            name: "Highways",
            displayKey: "name",
            source: hwysBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/truck.png' class='searchico'>Highways</h5>"
            }
        }, {
            name: "NHS",
            displayKey: "name",
            source: nhsBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/nhs.png' class='searchico'>NHS Connectors</h5>"
            }
        }, {
            name: "TruckParking",
            displayKey: "name",
            source: parkingBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/parking.png' class='searchico'>Truck Parking</h5>"
            }
        }, {
            name: "HwyBridges",
            displayKey: "name",
            source: hwyBridgeBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/bridge2.png' class='searchico'>Highway River Crossings</h5>"
            }
        }, {
            name: "RailLines",
            displayKey: "name",
            source: railLineBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/train.png' class='searchico'>Rail Lines</h5>"
            }
        }, {
            name: "RailYards",
            displayKey: "name",
            source: yardsBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/railyard.png' class='searchico'>Rail Yards</h5>"
            }
        }, {
            name: "Intermodal",
            displayKey: "name",
            source: intermodalBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/intermodal.png' class='searchico'>Intermodal Rail Yards</h5>"
            }
        }, {
            name: "GradeCrossing",
            displayKey: "name",
            source: gradexingBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/gradecrossing.png' class='searchico'>Grade Crossings</h5>"
            }
        }, {
            name: "RailBridges",
            displayKey: "name",
            source: railBridgeBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/bridge1.png' class='searchico'>Rail River Crossing</h5>"
            }
        }, {
            name: "Rivers",
            displayKey: "name",
            source: riverBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/river.png' class='searchico'>River Channels</h5>"
            }
        }, {
            name: "PortTerminals",
            displayKey: "name",
            source: portsBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/ports.png' class='searchico'>Port Terminals</h5>"
            }
        }, {
            name: "Anchorages",
            displayKey: "name",
            source: anchBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/anchor.png' class='searchico'>Anchorages</h5>"
            }
        }, {
            name: "CommAirports",
            displayKey: "name",
            source: commBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/aiport1.png' class='searchico'>Commercial Airports</h5>"
            }
        }, {
            name: "ReleivAirports",
            displayKey: "name",
            source: releiverBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/airport2.png' class='searchico'>Releiver Airports</h5>"
            }
        }, {
            name: "Heliports",
            displayKey: "name",
            source: heliBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/heliport.png' class='searchico'>Heliports</h5>"
            }
        }, {
            name: "FCinter",
            displayKey: "name",
            source: interBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/17.png' class='searchico'>Intermediate Center</h5>"
            }
        }, {
            name: "FCmajor",
            displayKey: "name",
            source: majorBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/18.png' class='searchico'>Major Center</h5>"
            }
        }, {
            name: "FCmega",
            displayKey: "name",
            source: megaBH.ttAdapter(),
            templates: {
                header: "<h5 class='typeahead-header'><img src='lib/images/flat/19.png' class='searchico'>Mega Center</h5>"
            }

        }, {
            name: "GeoNames",
            displayKey: "name",
            source: geonamesBH.ttAdapter(),
            templates: {
                header: "<h4 class='typeahead-header'>Place Results</h4>"
            }
        }).on("typeahead:selected", function(obj, datum) {
            if ($('#nav_search').hasClass('hidden')) {
                $('#pFFlanding').fadeOut(800);
                $('#nav_search').removeClass('hidden');
                $('#maplink').addClass('hidden');
            };
            if (datum.source === "Counties") {
                map.fitBounds(datum.bounds);
            };
            if (datum.source === "Highways") {
                if (!map.hasLayer(freeway)) {
                    map.addLayer(freeway);
                    $("#freeway").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "NHS") {
                if (!map.hasLayer(nhsgroup)) {
                    map.addLayer(nhsgroup);
                    $("#nhsgroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "TruckParking") {
                if (!map.hasLayer(trkparkgroup)) {
                    map.addLayer(trkparkgroup);
                    $("#trkparkgroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "HwyBridges") {
                if (!map.hasLayer(hwyrivcrossing)) {
                    map.addLayer(hwyrivcrossing);
                    $("#hwyrivcrossing").prop("checked", true);
                };
                map.setView([datum.lat, datum.lng], 17);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "RailLines") {
                if (!map.hasLayer(railines)) {
                    map.addLayer(railines);
                    $("#railines").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "RailYards") {
                if (!map.hasLayer(railyardgroup)) {
                    map.addLayer(railyardgroup);
                    $("#railyardgroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "Intermodal") {
                if (!map.hasLayer(intermodalgroup)) {
                    map.addLayer(intermodalgroup);
                    $("#intermodalgroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "GradeCrossing") {
                if (!map.hasLayer(gradexing)) {
                    map.addLayer(gradexing);
                    $("#gradexing").prop("checked", true);
                };
                map.setView([datum.lat, datum.lng], 17);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "RailBridges") {
                if (!map.hasLayer(railbridgept)) {
                    map.addLayer(railbridgept);
                    $("#railbridgept").prop("checked", true);
                };
                map.setView([datum.lat, datum.lng], 17);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "Rivers") {
                if (!map.hasLayer(river)) {
                    map.addLayer(river);
                    $("#river").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "PortTerminals") {
                if (!map.hasLayer(portGroup)) {
                    map.addLayer(portGroup);
                    $("#portGroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                    //highlightportpoly(map._layers[datum.id]);
                };
            };
            if (datum.source === "Anchorages") {
                if (!map.hasLayer(anchorageGroup)) {
                    map.addLayer(anchorageGroup);
                    $("#anchorageGroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "CommAirports") {
                if (!map.hasLayer(commGroup)) {
                    map.addLayer(commGroup);
                    $("#commGroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "ReleivAirports") {
                if (!map.hasLayer(relGroup)) {
                    map.addLayer(relGroup);
                    $("#relGroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "Heliports") {
                if (!map.hasLayer(heliport)) {
                    map.addLayer(heliport);
                    $("#heliport").prop("checked", true);
                };
                map.setView([datum.lat, datum.lng], 17);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "FCinter") {
                if (!map.hasLayer(FCintergroup)) {
                    map.addLayer(FCintergroup);
                    $("#FCintergroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "FCmajor") {
                if (!map.hasLayer(FCmajorgroup)) {
                    map.addLayer(FCmajorgroup);
                    $("#FCmajorgroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "FCmega") {
                if (!map.hasLayer(FCmegagroup)) {
                    map.addLayer(FCmegagroup);
                    $("#FCmegagroup").prop("checked", true);
                };
                map.fitBounds(datum.bounds);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                };
            };
            if (datum.source === "GeoNames") {
                map.setView([datum.lat, datum.lng], 14);
            };
            if ($(".navbar-collapse").height() > 50) {
                $(".navbar-collapse").collapse("hide");
            };
            /*}).on("typeahead:initialized ", function () {
                $(".tt-dropdown-menu").css("max-height", 300);*/
        }).on("typeahead:opened", function() {
            $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
            $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
        }).on("typeahead:closed", function() {
            $(".navbar-collapse.in").css("max-height", "");
            $(".navbar-collapse.in").css("height", "");
        });
        $(".twitter-typeahead").css("position", "static");
        $(".twitter-typeahead").css("display", "block");
    }
function renderLayers(){
    var layers = [];
    $('input:checkbox[name="LayerCont"]').each(function () {
                    // Remove all overlay layers
                    map.removeLayer(window[$(this).attr('id')]);
                    if ($('#' + $(this).attr('id')).is(':checked')) {
                        // Add checked layers to array for sorting
                        layers.push({
                            'z-index': $(this).attr('z-index'),
                            'layer': $(this)
                        });
                    }
                    
                }); 
                var orderedLayers = sortByKey(layers, 'z-index');
                     // Loop through ordered layers array and add to map in correct order
                    $.each(orderedLayers, function () {
                        map.addLayer(window[$(this)[0].layer[0].id]);
            });
}
function loadLayers (){
    var mapLoad = $('#mapLoad').val();
        if(mapLoad === 'false'){
        
        $.getJSON("data/FCinterPoly.js", function(data) {
            FCinterpoly.addData(data);
        });
        polyLayer.push('FCinterpoly');
        $.getJSON("data/FCinterPts.js", function(data) {
            FCinterpt.addData(data);
        });
        $.getJSON("data/FCmajorPoly.js", function(data) {
            FCmajorpoly.addData(data);
        });
        polyLayer.push('FCmajorpoly');
        $.getJSON("data/FCmajorPts.js", function(data) {
            FCmajorpt.addData(data);
        });
        $.getJSON("data/FCmegaPoly.js", function(data) {
            FCmegapoly.addData(data);
        });
        polyLayer.push('FCmegapoly');
        $.getJSON("data/FCmegaPts.js", function(data) {
            FCmegapt.addData(data);
        });
        $.getJSON("data/commPoly.js", function(data) {
            commairpoly.addData(data);
        });
        polyLayer.push('commairpoly');

        $.getJSON("data/commPts.js", function(data) {
            commairpt.addData(data);
        });

        $.getJSON("data/releivPoly.js", function(data) {
            relairpoly.addData(data);
        });
        polyLayer.push('relairpoly');

        $.getJSON("data/releivPts.js", function(data) {
            relvairpt.addData(data);
        });

        $.getJSON("data/heliports.js", function(data) {
            heliport.addData(data);
        });
        $.getJSON("data/truckparkPoly.js", function(data) {
            truckparkpoly.addData(data);
        });
        polyLayer.push('truckparkpoly');
        $.getJSON("data/truckparkPts.js", function(data) {
            tppoints.addData(data);
        });
        $.getJSON("data/hwybrdgPts.js", function(data) {
            hwyrivcrossing.addData(data);
        });
        $.getJSON("data/river.js", function(data) {
            river.addData(data);
        });
        polyLayer.push('river');
        $.getJSON("data/portPoly.js", function(data) {
            portpoly.addData(data);
        });
        $.getJSON("data/nhsPts.js", function(data) {
            nhs.addData(data);
        });
        
        $.getJSON("data/freightrail.js", function(data) {
            railines.addData(data);
        });
        polyLayer.push('railines');
        $.getJSON("data/railyardPoly.js", function(data) {
            railyardpoly.addData(data);
        });
        polyLayer.push('railyardpoly');
        $.getJSON("data/railyardPts.js", function(data) {
            railyardpt.addData(data);
        });
        $.getJSON("data/intermodalPoly.js", function(data) {
            intermodalpoly.addData(data);
        });
        polyLayer.push('intermodalpoly');
        $.getJSON("data/intermodalPts.js", function(data) {
            intermodalpt.addData(data);
        });
        $.getJSON("data/railbrdgPts.js", function(data) {
            railbridge.addData(data);
        });
        polyLayer.push('portpoly');
        $.getJSON("data/portPts.js", function(data) {
            porticon.addData(data);
        });
        polyLayer.push('anchoragepoly');
        $.getJSON("data/anchPts.js", function(data) {
            anchoricon.addData(data);
        });
        $.getJSON("data/nhsPoly.js", function(data) {
            nhspoly.addData(data);
        });
        polyLayer.push('nhspoly');
        $.getJSON("data/highways.js", function(data) {
            freeway.addData(data);
        });
        polyLayer.push('freeway');
        $.getJSON("data/anchPoly.js", function(data) {
            anchoragepoly.addData(data);
        });
        $.getJSON("data/pipelines.js", function(data) {
            pipelines.addData(data);
        });
        polyLayer.push('pipelines');
        $.getJSON("data/goodneighbor.js", function(data) {
            fgneighbor.addData(data);
        });
        $('.panelinfo').addClass('dynico dynico-info');
        //set checkbox status
        
        $('input#mapLoad').attr('value', 'true');
        
     $('.legPanel').each(function(){
            var loadall = $(this).find('input.layer').length;
            var loadchecked = $(this).find('input.layer:checked').length;
            if (loadall == loadchecked) {
                $(this).closest('.panel').find('.checked_all').html('<div class="chkicon dynico dynico-check-square-o"></div>');
                $(this).closest('.panel-body').append('<input type="hidden" class="Chkd" value="false" />');
            } else {
                $(this).closest('.panel').find('.checked_all').html('<div class="chkicon dynico dynico-square-o"></div>');
                $(this).closest('.panel-body').append('<input type="hidden" class="Chkd" value="true" />');
            }
            var cbo = $(this).find('.dynacheck').length;
                if (cbo > 0){
                    $(this).find('input.layer:checked').siblings('.dynacheck').find('.legend-check').html('<i class="dynico dynico-check-square-o"></i>');
                }
            });
     //renderLayers
     renderLayers();
     //re-render layers (hack to ordering based on load delay)
     setTimeout(function() { renderLayers();loadSearchBar();}, 3500);
     setTimeout(function() { renderLayers();loadSearchBar(); }, 5500);
    }
    
}

