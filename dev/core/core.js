//***************************************///
//  PhillyFreightFinder App Core Functions
//  Dyna Icon Markers [inactive]
//  Core.js
//  Version: 3.1.2
//

//JQuery extend..create functions for easing in place of JQuery UI
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{def: 'easeOutQuad',
easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    }
});

$.fn.capitalize = function () {
    $.each(this, function () {
        var caps = this.value;
        caps = caps.charAt(0).toUpperCase() + caps.slice(1);
        this.value = caps;
    });
    return this;
};
//store global tab variable
var current_tab;

//stop button from remaining selected


function setMap(){
    $('.landingUI').fadeOut('fast', 'easeOutQuad' , function (){
            $('.mapUI').fadeIn('fast', 'easeInQuad' );
            $('#mapDIV').fadeIn('fast', 'easeInQuad' );
            loadLayers(); 
            map.invalidateSize(); 
            resetHighlight();
            resetInfoWindow();
            //setTimeout(function() {$("#loading").hide();}, 300);
        });  
}
function loadScript(id){
    $.getScript('lib/tools/'+ id + '.js?v=1.05');
}

//load content based on hash
$(function() {
  // Javascript to enable link to tab
  var url = document.location.toString();
  var windowHeight = $(window).height() - 250;
            
  if (url.match('#')) {
    var full_hash = url.split('#')[1].split('/');
    var tab_id = full_hash[0];
    var prev_tab = url.split('#')[1];
    if (tab_id != 'map' && tab_id !== undefined) {
        $('#' + tab_id).show(); 
        
        if(tab_status[tab_id] === false){
            $('#'+ tab_id).load('includes/'+ tab_id + '.html', loadScript(tab_id));
            tab_status[tab_id] = true; 
        }
        $('#pFFlanding').css('min-height', windowHeight + 'px');
        $('.content-footer').fadeIn('slow');
    }else {
        setMap();
   }
  }else {
    $('#home').show();
    $('#pFFlanding').css('min-height', windowHeight + 'px');
    $('.content-footer').fadeIn('slow');
  }
  // Change hash for page-reload
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        window.location.hash = e.target.hash;  
  });
});
        
function getLocationHash () {
  var hashLocation = window.location.hash.substring(1),
    locations = hashLocation.split('/');
  return locations[0];
}

//create navigation of content based on hash changes for self contained app
$(window).bind('hashchange', function() {
    var tab_id = getLocationHash();
        if(tab_id === 'map?search'){
            $('#search-panel').fadeIn('fast');
            location.hash = '#map';
        }else if (tab_id != 'map') {
        	$('.mapUI').fadeOut('fast', 'easeOutQuad' , function (){
                $('.landingUI').fadeIn('fast', 'easeInQuad' );
            });
            if(tab_status[tab_id] === false){
                    $('#'+ tab_id).load('includes/'+ tab_id + '.html', loadScript(tab_id));
                    tab_status[tab_id] = true;
                }
            $('.landtab-content > .tab-pane').hide();  
            var windowHeight = $(window).height() - 250;
            $('#pFFlanding').css('min-height', windowHeight + 'px');
            $('#' + tab_id).show();  
            $('body, html, #pFFlanding').scrollTop(0);            
        }else{ 
           setMap();
        }
    
});

//ensure load sequence occurs after dom is fully rendered
function executeOnLoad(node, func) {
        var locate_node = document.getElementById(node);
       if(locate_node !== null) {
            func();
       } else {
            setTimeout(function() { executeOnLoad(node, func); }, 100);
       }
    }

//change sidebar based on screen size if screen resized
$(window).resize(function () {
    $(".tt-dropdown-menu").css("max-height", $("#container").height() - $(".navbar").height() - 20);
    //sidebar handling if small screen
    if (document.body.clientWidth <= 767) {
        $("#mapDIV").attr("class", "col-sm-12 col-lg-12 leaflet-container leaflet-fade-anim");
        $("#sidebar").css("display", "none");
        $("#toggle i").attr('class', 'glyphicon glyphicon-th-list');
    } else {
        var sidebarViz = $("#sidebar").css("display");
        if (sidebarViz == "block") {
            $("#mapDIV").attr('class', 'col-sm-8 col-lg-9 leaflet-container leaflet-fade-anim');
            $("#toggle i").attr('class', 'glyphicon glyphicon-chevron-left');
        } else {
            $("#mapDIV").attr('class', 'col-sm-12 col-lg-12 leaflet-container leaflet-fade-anim');
            $("#toggle i").attr('class', 'glyphicon glyphicon-th-list');
        }
        
    }
    map.invalidateSize(); 
});

// Placeholder hack for IE
if (navigator.appName == "Microsoft Internet Explorer") {
    $("input").each(function () {
        if ($(this).val() == "" && $(this).attr("placeholder") != "") {
            $(this).val($(this).attr("placeholder"));
            $(this).focus(function () {
                if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
            });
            $(this).blur(function () {
                if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
            });
        }
    });
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

   
//Document Ready
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    if (document.body.clientWidth <= 767) {
        $("#mapDIV").css("class", "col-sm-12 col-lg-12");
        $("#sidebar").css("display", "none");
    }
    
    //layer group check all functionality
    $('.checked_all').on("click", function (e) {
        var listPanel = $(this).parent().siblings('.panel-collapse').children('.panel-body').children('input.Chkd');
        var $element = $(this);
            if (listPanel.attr('value') == 'true') {
                loadBar().done(function() {
                    $element.children().attr('class', 'chkicon dynico dynico-check-square-o');
                    $(listPanel).siblings('.checkbox').children('input').prop('checked', true).change();
                    $(listPanel).val('false');
                    $("#loadingtm").fadeOut(150);
                });
            } else {
                $element.children().attr('class', 'chkicon dynico dynico-square-o');
                $(listPanel).siblings('.checkbox').children('input').prop('checked', false).change();
                $(listPanel).val('true');
            } 

     });
    function loadBar(){
        return $("#loadingtm").show().delay(100).promise();
    }
});

///LayerControls: Order and add to Map as legend items are changed
//Z-index not yet functional in Leaflet
$('input:checkbox[name="LayerCont"]').on('change', function () {
    var layers = [];

    if ($('#' + $(this).attr('id')).is(':checked')) {
        $("#loadingtm").show();
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
        // Sort layers array by z-index
        var orderedLayers = sortByKey(layers, 'z-index');
        // Loop through ordered layers array and add to map in correct order
        $.each(orderedLayers, function () {
            map.addLayer(window[$(this)[0].layer[0].id]);
        });
        $("#loadingtm").delay(100).fadeOut(150);
    } else {
        // Simply remove unchecked layers
        map.removeLayer(window[$(this).attr('id')]);
    }
});
//update check all button on layer toggle
$('.layer').change(function () {
    var all = $(this).closest('.panel-body').find('input.layer').length;
    var checked = $(this).closest('.panel-body').find('input.layer:checked').length;
    if (all == checked) {
        $(this).closest('.panel').find('.checked_all').children().attr('class', 'chkicon dynico dynico-check-square-o');
        $(this).closest('.panel-body').find('.Chkd').val('false');
    } else {
        $(this).closest('.panel').find('.checked_all').children().attr('class', 'chkicon dynico dynico-square-o');
        $(this).closest('.panel-body').find('.Chkd').val('true');
    }
    var cbo = $(this).siblings('.dynacheck').length;
    if (cbo > 0){
        if($(this).is(':checked')){
            $(this).siblings('.dynacheck').find('.legend-check i').attr('class', 'dynico dynico-check-square-o');
        }else{
            $(this).siblings('.dynacheck').find('.legend-check i').attr('class', 'dynico dynico-square-o');
        }
    }
});
//Sidebar Toggle button
$("#toggle").click(function () {
    $("#toggle i").toggleClass("glyphicon-chevron-left glyphicon-th-list");
    $("#mapDIV").toggleClass("col-sm-8 col-lg-9 col-sm-12 col-lg-12");
    var sidebarViz = $("#sidebar").css("display");
    if (sidebarViz == "block") {
        $("#sidebar").css("display", "none");
    } else {
        $("#sidebar").css("display", "block");
    }
    if (document.body.clientWidth <= 767) {
        $("#mapDIV").toggleClass("hidden");
    }
    map.invalidateSize(); 
    return false;
});

///////////////////////////////////////////////////
/////   Info window Functionality   //////////////
//////////////////////////////////////////////////
function toggleinfo(e) {
    if ($('#togbtn').hasClass('hide')) {
        $('#togbtn').removeClass('hide');
    }
    if ($('#togbtn').hasClass('glyphicon-plus')) {
        $('#togbtn').attr('class', 'glyphicon glyphicon-minus InfoTgl');
    } else {}
    var h = document.getElementById('info').offsetHeight + document.getElementById('infoheader').offsetHeight+0;
    $('#infobox_').addClass('active').css('bottom', h);
}

function togglemin(e) {
    if ($('#togbtn').hasClass('glyphicon-plus')) {} else {
        $('#togbtn').attr('class', 'glyphicon glyphicon-plus InfoTgl');
    }
    $('#infobox_').css('bottom', 0).removeClass('active');
}

$(".InfoTgl").click(function () {
    if ($('#infobox_').hasClass('active')) {
        togglemin();
    } else {
        toggleinfo();
    }
});
$('#mobileInfo_modal').on('hide.bs.modal',function(){
            resetHighlight();
        }); 

//////////////////////////////////////////////////
////            UI Functions            //////////
//////////////////////////////////////////////////

///On load loading bar functionality
$( document ).ajaxStop(function() {
    setTimeout(function() {
              $("#loadingtm").hide();
            }, 300);

});


/////////////////////////////////////////////////
//////////// New Leaflet Control ////////////////
/////////// Add Center to Region //////////////
///////////////////////////////////////////////

L.Control.mapCenter = L.Control.Zoom.extend({
  options: {
    position: "topleft",
    zoomInText: "+",
    zoomInTitle: "Zoom in",
    zoomOutText: "-",
    zoomOutTitle: "Zoom out",
    zoomMinText: "<i class='dynico dynico-dvrpc'></i>",
    zoomMinTitle: "View Full Region",
    vcLatLng: [oLat, oLng],
    vcZoom: 9
  },

  onAdd: function (map) {
    var zoomName = "leaflet-control-zoom"
      , container = L.DomUtil.create("div", zoomName + " leaflet-bar")
      , options = this.options

    this._map = map

    this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
     zoomName + '-in', container, this._zoomIn, this)

    this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
     zoomName + '-out', container, this._zoomOut, this)

    this._zoomMinButton = this._createButton(options.zoomMinText, options.zoomMinTitle,
     zoomName + '-min', container, this._zoomMin, this)

    this._updateDisabled()
    map.on('zoomend zoomlevelschange', this._updateDisabled, this)

    return container
  },

  
  
  _zoomMin: function () {
    var opts = this.options
    var zoom = opts.vcZoom || 6;
    this._map.setView(opts.vcLatLng, zoom)
  },

  _updateDisabled: function () {
    var map = this._map
      , className = "leaflet-disabled"

    L.DomUtil.removeClass(this._zoomInButton, className)
    L.DomUtil.removeClass(this._zoomOutButton, className)
    L.DomUtil.removeClass(this._zoomMinButton, className)

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomOutButton, className)
    }

    if (map._zoom === map.getMaxZoom()) {
      L.DomUtil.addClass(this._zoomInButton, className)
    }

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomMinButton, className)
    }
  }
})
//Add controls
map.addControl(new L.Control.mapCenter());


/////////////////////////////////////////// 
//Action on feature selections////////////    
//Initialize highlight function, clear map and define click source
function initializeHL(e){
    resetHighlight();
    layersearch = e.feature;            //define layer value for search event
    if (layersearch===undefined){       //if click event set highlight style and define prop value
        highlightMapFeature(e.target);
        props = e.target.feature.properties;
    }else{                              //if search event set highlight style define prop value
        highlightMapFeature(e);
        props = layersearch.properties;
    }
    $('#search-panel').fadeOut('fast');
    $('#searchbox').typeahead('val', '');
    return props;
}

function contentPush(header, content, featureName, featureClass, featureIcon){
    //push content to DOM elements using JS
    //if (featureName != ''){var FNclass = featureClass;}
    //if (featureIcon != ''){var icons = ''+ featureIcon +' icon'}
    if (document.body.clientWidth <= 375) {
        document.getElementById('mobileheader').innerHTML = header;                         //push content to info box header
        document.getElementById('mobileinfo').innerHTML = content;                          //push content to info box
        document.getElementById('mobilefeatureName').innerHTML = featureName;    //push Feature Type (optional, see below for manual version)
        document.getElementById('mobileMdHeader').className = ''+ featureClass +' modal-header';                 //push class to create style for info header
        //document.getElementById('mobileiconography').className = ''+ icons +'';       //push icon class information (optional)
        $('#mobileInfo_modal').modal('show');
    } else {    
        document.getElementById('infoheader').innerHTML = header;                   //push content to info box header
        document.getElementById('info').innerHTML = content;                        //push content to info box
        document.getElementById('featureName').innerHTML = featureName;             //push Feature Type (optional, see below for manual version)
        document.getElementById('featureName').className = ''+ featureClass +'';          //push class to create style for feature name
        document.getElementById('infoheader').className = ''+ featureClass +'';           //push class to create style for info header
        document.getElementById('iconography').className = ''+ featureIcon +'';       //push icon class information (optional)
    }
    toggleinfo();
    activateTooltip();            
}

//zoom to polygon feature
function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
}
function zoomToPoint(e){
    var layer= e.target;
    var latLng = layer.getLatLng();
        map.setView(latLng, 15);
}   
function zoomToFC(e){
        var layer= e.target;
        var latLng = layer.getLatLng();
            map.setView(latLng, 13);
            }   
//determine feature type and highlight              
function highlightMapFeature(lyr){
    var id = lyr.feature.geometry.type;
    if (id != 'Point'){
        lyr.setStyle({weight: hlweight, color: ""+ hlColor +""});
    } else {
        iconElem = L.DomUtil.get(lyr._icon);
        iconElem.id = 'preselect';
        
        if ($(iconElem).is('img')){
            hlmarkerSize = rdIconSize + 8;
            iconElem.style.border="4px " + hlColor + " solid";
            iconElem.style.height= hlmarkerSize + "px";
            iconElem.style.width= hlmarkerSize + "px";
            iconElem.style.marginTop="-" + hlmarkerSize/2 + "px";
            iconElem.style.marginLeft="-" + hlmarkerSize/2 + "px";
            iconElem.id="selectedIcon";
        } else if($('#preselect').hasClass('circle-cm')) {
            $(iconElem).append('<div class="markerBox cm" style="border-color:'+hlColor+'"></div>');
            iconElem.id='selectedIcon';
        }else if($('#preselect').hasClass('circle-sm')) {
            $(iconElem).append('<div class="markerBox sm" style="border-color:'+hlColor+'"></div>');
            iconElem.id='selectedIcon';
        }
        else if($('#preselect').hasClass('circle-md')) {
            $(iconElem).append('<div class="markerBox md" style="border-color:'+hlColor+'"></div>');
            iconElem.id='selectedIcon';
        }
    }
}          
//reset all layer styles before highlight (LONG HANDED--Revision in works)      
function resetHighlight(){
    //reset poly features individually
    for (var i = 0, l = polyLayer.length; i < l; i++) {
        var nm = polyLayer[i],
        resStyle = window[nm].options.style;
        window[nm].setStyle(resStyle);
    }
    resetIconhighlights();

}

//hack to remove highlight from markers
function resetIconhighlights(){
    var highlticon = document.getElementById('selectedIcon');
    if (highlticon!=undefined){
        highlticon.id = 'prehide';
        $('.markerBox').remove();

        if( $(iconElem).is('img')){
            highlticon.style.border="";
            highlticon.style.height= rdIconSize + "px";
            highlticon.style.width= rdIconSize + "px";
            highlticon.style.marginTop="-" + rdIconSize/2 + "px";
            highlticon.style.marginLeft="-" + rdIconSize/2 + "px";
            highlticon.id="";
        } else {
            highlticon.id="";
        }
    }else{
        //do nothing
    }
}

function resetInfoWindow (){
        $('#togbtn').addClass('hide');
        $('#infobox_').removeClass('active').css('bottom',0);
        document.getElementById('featureName').innerHTML = '';
        document.getElementById('infoheader').innerHTML = '<p>Click feature to view details</p>';
        document.getElementById('infoheader').className = '';
        document.getElementById('featureName').className = '';
        document.getElementById('iconography').className = '';
        document.getElementById('info').innerHTML = '';
}
// Clear the tooltip, highlights, and search bar when map is clicked   
map.on('click',function(e){
        resetHighlight();
        resetInfoWindow();
        $('#search-panel').fadeOut('fast');
        $('#searchbox').typeahead('val', '');        
});


// Tooltip Provisions for the Sidebar Legend elements
$('.tab-content').find('.panel-group.legend .panel-heading').first().find('a > div').attr('data-placement', 'bottom');
$('.panel-group.legend').find('.panellink').attr('data-toggle', 'tooltip').attr('title', 'View/hide layers in group');
$('.panel-group.legend').find('.panelinfo').attr('data-toggle', 'tooltip').attr('title', 'Learn about these layers');
$('.panel-group.legend').find('.checked_all').attr('data-toggle', 'tooltip').attr('title', 'Toggle All Layers').attr('data-placement', 'left');




/* ========================================================================
 * Bootstrap Dropdowns Enhancement: dropdowns-enhancement.js v3.1.1 (Beta 1)
 * http://behigh.github.io/bootstrap_dropdowns_enhancement/
 * ========================================================================
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

(function($) {
    "use strict";

    var toggle   = '[data-toggle="dropdown"]',
        disabled = '.disabled, :disabled',
        backdrop = '.dropdown-backdrop',
        menuClass = 'dropdown-menu',
        subMenuClass = 'dropdown-submenu',
        namespace = '.bs.dropdown.data-api',
        eventNamespace = '.bs.dropdown',
        openClass = 'open',
        touchSupport = 'ontouchstart' in document.documentElement,
        opened;


    function Dropdown(element) {
        $(element).on('click' + eventNamespace, this.toggle)
    }

    var proto = Dropdown.prototype;

    proto.toggle = function(event) {
        var $element = $(this);

        if ($element.is(disabled)) return;

        var $parent = getParent($element);
        var isActive = $parent.hasClass(openClass);
        var isSubMenu = $parent.hasClass(subMenuClass);
        var menuTree = isSubMenu ? getSubMenuParents($parent) : null;

        closeOpened(event, menuTree);

        if (!isActive) {
            if (!menuTree)
                menuTree = [$parent];

            if (touchSupport && !$parent.closest('.navbar-nav').length && !menuTree[0].find(backdrop).length) {
                // if mobile we use a backdrop because click events don't delegate
                $('<div class="' + backdrop.substr(1) + '"/>').appendTo(menuTree[0]).on('click', closeOpened)
            }

            for (var i = 0, s = menuTree.length; i < s; i++) {
                if (!menuTree[i].hasClass(openClass)) {
                    menuTree[i].addClass(openClass);
                    positioning(menuTree[i].children('.' + menuClass), menuTree[i]);
                }
            }
            opened = menuTree[0];
        }

        return false;
    };

    proto.keydown = function (e) {
        if (!/(38|40|27)/.test(e.keyCode)) return;

        var $this = $(this);

        e.preventDefault();
        e.stopPropagation();

        if ($this.is('.disabled, :disabled')) return;

        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');

        if (!isActive || (isActive && e.keyCode == 27)) {
            if (e.which == 27) $parent.find(toggle).trigger('focus');
            return $this.trigger('click');
        }

        var desc = ' li:not(.divider):visible a';
        var desc1 = 'li:not(.divider):visible > input:not(disabled) ~ label';
        var $items = $parent.find(desc1 + ', ' + '[role="menu"]' + desc + ', [role="listbox"]' + desc);

        if (!$items.length) return;

        var index = $items.index($items.filter(':focus'));

        if (e.keyCode == 38 && index > 0)                 index--;                        // up
        if (e.keyCode == 40 && index < $items.length - 1) index++;                        // down
        if (!~index)                                      index = 0;

        $items.eq(index).trigger('focus');
    };

    proto.change = function (e) {

        var
            $parent,
            $menu,
            $toggle,
            selector,
            text = '',
            $items;

        $menu = $(this).closest('.' + menuClass);

        $toggle = $menu.parent().find('[data-label-placement]');

        if (!$toggle || !$toggle.length) {
            $toggle = $menu.parent().find(toggle);
        }

        if (!$toggle || !$toggle.length || $toggle.data('placeholder') === false)
            return; // do nothing, no control

        ($toggle.data('placeholder') == undefined && $toggle.data('placeholder', $.trim($toggle.text())));
        text = $.data($toggle[0], 'placeholder');

        $items = $menu.find('li > input:checked');

        if ($items.length) {
            text = [];
            $items.each(function () {
                var str = $(this).parent().find('label').eq(0),
                    label = str.find('.data-label');

                if (label.length) {
                    var p = $('<p></p>');
                    p.append(label.clone());
                    str = p.html();
                }
                else {
                    str = str.html();
                }


                str && text.push($.trim(str));
            });

            text = text.length < 4 ? text.join(', ') : text.length + ' selected';
        }

        var caret = $toggle.find('.caret');

        $toggle.html(text || '&nbsp;');
        if (caret.length)
            $toggle.append(' ') && caret.appendTo($toggle);

    };

    function positioning($menu, $control) {
        if ($menu.hasClass('pull-center')) {
            $menu.css('margin-right', $menu.outerWidth() / -2);
        }

        if ($menu.hasClass('pull-middle')) {
            $menu.css('margin-top', ($menu.outerHeight() / -2) - ($control.outerHeight() / 2));
        }
    }

    function closeOpened(event, menuTree) {
        if (opened) {

            if (!menuTree) {
                menuTree = [opened];
            }

            var parent;

            if (opened[0] !== menuTree[0][0]) {
                parent = opened;
            } else {
                parent = menuTree[menuTree.length - 1];
                if (parent.parent().hasClass(menuClass)) {
                    parent = parent.parent();
                }
            }

            parent.find('.' + openClass).removeClass(openClass);

            if (parent.hasClass(openClass))
                parent.removeClass(openClass);

            if (parent === opened) {
                opened = null;
                $(backdrop).remove();
            }
        }
    }

    function getSubMenuParents($submenu) {
        var result = [$submenu];
        var $parent;
        while (!$parent || $parent.hasClass(subMenuClass)) {
            $parent = ($parent || $submenu).parent();
            if ($parent.hasClass(menuClass)) {
                $parent = $parent.parent();
            }
            if ($parent.children(toggle)) {
                result.unshift($parent);
            }
        }
        return result;
    }

    function getParent($this) {
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        var $parent = selector && $(selector);

        return $parent && $parent.length ? $parent : $this.parent()
    }

    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    var old = $.fn.dropdown;

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.dropdown');

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)));
            if (typeof option == 'string') data[option].call($this);
        })
    };

    $.fn.dropdown.Constructor = Dropdown;

    $.fn.dropdown.clearMenus = function(e) {
        $(backdrop).remove();
        $('.' + openClass + ' ' + toggle).each(function () {
            var $parent = getParent($(this));
            var relatedTarget = { relatedTarget: this };
            if (!$parent.hasClass('open')) return;
            $parent.trigger(e = $.Event('hide' + eventNamespace, relatedTarget));
            if (e.isDefaultPrevented()) return;
            $parent.removeClass('open').trigger('hidden' + eventNamespace, relatedTarget);
        });
        return this;
    };


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this
    };


    $(document).off(namespace)
        .on('click' + namespace, closeOpened)
        .on('click' + namespace, toggle, proto.toggle)
        .on('click' + namespace, '.dropdown-menu > li > input[type="checkbox"] ~ label, .dropdown-menu > li > input[type="checkbox"], .dropdown-menu.noclose > li', function (e) {
            e.stopPropagation()
        })
        .on('change' + namespace, '.dropdown-menu > li > input[type="checkbox"], .dropdown-menu > li > input[type="radio"]', proto.change)
        .on('keydown' + namespace, toggle + ', [role="menu"], [role="listbox"]', proto.keydown)
}(jQuery));