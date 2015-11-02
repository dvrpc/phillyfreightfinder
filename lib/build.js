/*-----------------------------------------------------------
    Open Freight Dynamic Markers is a customized version of the Leaflet.AwesomeMarkers. 
    This plugin provides Open Freight App with the ability to add icon sets as markers.
    (c) 2014 Michael Ruane DVRPC

/*--------------------------------------------------------
  Leaflet.AwesomeMarkers, a plugin that adds colorful iconic markers for Leaflet, based on the Font Awesome icons
  (c) 2012-2013, Lennard Voogdt

  http://leafletjs.com
  https://github.com/lvoogdt
*/


/*global L*/

(function (window, document, undefined) {
    "use strict";
    /*
     * Leaflet.AwesomeMarkers assumes that you have already included the Leaflet library.
     */

    L.OpenFreightMarkers = {};

    L.OpenFreightMarkers.version = '1.0.0';

    L.OpenFreightMarkers.Icon = L.Icon.extend({
        options: {
            iconSize: [35, 46],
            iconAnchor:   [17, 42],
            popupAnchor: [1, -32],
            shadowAnchor: [10, 12],
            shadowSize: [36, 16],
            markerSet: 'open-freight',
            mapMarker: 'circle-md',
            iconSet: 'dynico',
            spinClass: 'fa-spin',
            extraClasses: '',
            icon: 'home',
            markerColor: 'blue',
            iconColor: 'white',
            legendMarker: 'circle-md',
            layer:'',
            title: '',
            onLoad: true
        },

        initialize: function (options) {
            options = L.Util.setOptions(this, options);
        },

        createIcon: function () {
            var div = document.createElement('div'),
                options = this.options;

            if (options.icon) {
                div.innerHTML = this._createInner();
            }

            if (options.bgPos) {
                div.style.backgroundPosition =
                    (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
            }

            this._setIconStyles(div, 'icon-' + options.markerColor);
            return div;

        },

        _createInner: function() {
            var iconClass, iconSpinClass = "", iconColorClass = "", iconColorStyle = "", options = this.options;

            if(options.icon.slice(0,options.iconSet.length+1) === options.iconSet + "-") {
                iconClass = options.icon;
            } else {
                iconClass = options.iconSet + "-" + options.icon;
            }

            if(options.spin && typeof options.spinClass === "string") {
                iconSpinClass = options.spinClass;
            }

            if(options.iconColor) {
                if(options.iconColor === 'white' || options.iconColor === 'black') {
                    iconColorClass = "icon-" + options.iconColor;
                } else {
                    iconColorStyle = "style='color: " + options.iconColor + "' ";
                }
            }

            return "<i " + iconColorStyle + "class='" + options.extraClasses + " " + options.iconSet + " " + iconClass + " " + iconSpinClass + " " + iconColorClass + "'></i>";
        },

        _setIconStyles: function (img, name) {
            var options = this.options,
                size, 
                anchor;
            if (options.mapMarker === 'circle-sm') {
                if (name === 'shadow') {size = L.point([30,30]);} else {size = L.point([28,28]);}
            } else if (options.mapMarker === 'circle-md') {
                if (name === 'shadow') {size = L.point([34,34]);} else {size = L.point([32,32]);}
            } else if (options.mapMarker === 'circle-cm') {
                if (name === 'shadow') {size = L.point([34,16]);} else {size = L.point([28,36]);}
            }
            else {
                size = L.point(options[name === 'shadow' ? 'shadowSize' : 'iconSize']);
            }
            

            if (name === 'shadow') {
                if (options.mapMarker === 'circle-cm') {
                    anchor = L.point([10,12]);
                } else if(options.mapMarker === 'circle-sm') {
                    
                } else if (options.mapMarker === 'circle-md') {
                    
                } else {
                    anchor = L.point(options.shadowAnchor || options.iconAnchor);
                }
            } else {
                if (options.mapMarker === 'circle-cm') {
                    anchor = L.point([14,34]);
                } else if(options.mapMarker === 'circle-sm') {
                    
                }else if (options.mapMarker === 'circle-md') {
                  
                } else {
                    anchor = L.point(options.iconAnchor);
                }
            }

            if (!anchor && size) {
                anchor = size.divideBy(2, true);
            }
            if (name=== 'shadow') {
                img.className = options.mapMarker + '-' + name + ' ' + options.mapMarker;
            } else {
                img.className = options.markerSet + '-' + name + ' ' + options.mapMarker;
            }

            if (anchor) {
                img.style.marginLeft = (-anchor.x) + 'px';
                img.style.marginTop  = (-anchor.y) + 'px';
            }

            if (size) {
                img.style.width  = size.x + 'px';
                img.style.height = size.y + 'px';
            }
        },

        createShadow: function () {
            var div = document.createElement('div');

            this._setIconStyles(div, 'shadow');
            return div;
      }

      
    });
	//Dynamic Icon Marker Legend + Info Window Functionality
    L.createLegend = function (options) {
        window['DynaIcon' + options.layer] = ''+ options.iconSet +' '+ options.iconSet +'-'+options.icon+'';
        window['DynaClass'+ options.layer] =  ''+options.markerColor+'';
        window['DynaTitle' + options.layer] = ''+options.title+'';
        if(options.legendMarker === 'checkbox'){
             $('#' + options.layer + '.dyna').wrap('<div class="checkbox" data-toggle="tooltip" title="Click to toggle layer"></div>').after('<label for="' + options.layer + '" class="dynacheck"><div class="legend-check"><i class="dynico dynico-square-o"></i></div> '+options.title+'</label>');
        }else{
            $('#' + options.layer + '.dyna').wrap('<div class="checkbox" data-toggle="tooltip" title="Click to toggle layer"></div>').after('<label for="' + options.layer + '"><div class="'+ options.legendMarker +' legend-icon '+ options.markerSet +'-icon-'+ options.markerColor +'"><i class="dynico dynico-'+options.icon+'"></i></div> '+options.title+'</label>');
        }
        if(options.onLoad === false){
        }else{
        	$('#' + options.layer + '.dyna').attr('checked', true);
        }
        
    };

    L.OpenFreightMarkers.icon = function (options, presets) {
            var Options = $.extend({},presets, options);
            L.createLegend(Options);
            return new L.OpenFreightMarkers.Icon(Options);
            
           
    };



}(this, document));;
(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object") ?
    exports.bootstrap :
    (exports.bootstrap = {});

  bootstrap.tooltip = function() {

    var tooltip = function(selection) {
        selection.each(setup);
      },
      animation = d3.functor(false),
      html = d3.functor(false),
      title = function() {
        var title = this.getAttribute("data-original-title");
        if (title) {
          return title;
        } else {
          title = this.getAttribute("title");
          this.removeAttribute("title");
          this.setAttribute("data-original-title", title);
        }
        return title;
      },
      over = "mouseenter.tooltip",
      out = "mouseleave.tooltip",
      placements = "top left bottom right".split(" "),
      placement = d3.functor("top");

    tooltip.title = function(_) {
      if (arguments.length) {
        title = d3.functor(_);
        return tooltip;
      } else {
        return title;
      }
    };

    tooltip.html = function(_) {
      if (arguments.length) {
        html = d3.functor(_);
        return tooltip;
      } else {
        return html;
      }
    };

    tooltip.placement = function(_) {
      if (arguments.length) {
        placement = d3.functor(_);
        return tooltip;
      } else {
        return placement;
      }
    };

    tooltip.show = function(selection) {
      selection.each(show);
    };

    tooltip.hide = function(selection) {
      selection.each(hide);
    };

    tooltip.toggle = function(selection) {
      selection.each(toggle);
    };

    tooltip.destroy = function(selection) {
      selection
        .on(over, null)
        .on(out, null)
        .attr("title", function() {
          return this.getAttribute("data-original-title") || this.getAttribute("title");
        })
        .attr("data-original-title", null)
        .select(".tooltip")
        .remove();
    };

    function setup() {
      var root = d3.select(this),
          animate = animation.apply(this, arguments),
          tip = root.append("div")
            .attr("class", "tooltip");

      if (animate) {
        tip.classed("fade", true);
      }

      // TODO "inside" checks?

      tip.append("div")
        .attr("class", "tooltip-arrow");
      tip.append("div")
        .attr("class", "tooltip-inner");

      var place = placement.apply(this, arguments);
      tip.classed(place, true);

      root.on(over, show);
      root.on(out, hide);
    }

    function show() {
      var root = d3.select(this),
          content = title.apply(this, arguments),
          tip = root.select(".tooltip")
            .classed("in", true),
          markup = html.apply(this, arguments),
          innercontent = tip.select(".tooltip-inner")[markup ? "html" : "text"](content),
          place = placement.apply(this, arguments),
          pos = root.style("position"),
          outer = getPosition(root.node()),
          inner = getPosition(tip.node()),
          style;

      if (pos === "absolute" || pos === "relative") {
          outer.x = outer.y = 0;
      }

      var style;
      switch (place) {
        case "top":
          style = {x: outer.x + (outer.w - inner.w) / 2, y: outer.y - inner.h};
          break;
        case "right":
          style = {x: outer.x + outer.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "left":
          style = {x: outer.x - inner.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "bottom":
          style = {x: Math.max(0, outer.x + (outer.w - inner.w) / 2), y: outer.y + outer.h};
          break;
      }

      tip.style(style ?
        {left: ~~style.x + "px", top: ~~style.y + "px"} :
        {left: null, top: null});

      this.tooltipVisible = true;
    }

    function hide() {
      d3.select(this).select(".tooltip")
        .classed("in", false);

      this.tooltipVisible = false;
    }

    function toggle() {
      if (this.tooltipVisible) {
        hide.apply(this, arguments);
      } else {
        show.apply(this, arguments);
      }
    }

    return tooltip;
  };

  function getPosition(node) {
    var mode = d3.select(node).style('position');
    if (mode === 'absolute' || mode === 'static') {
      return {
        x: node.offsetLeft,
        y: node.offsetTop,
        w: node.offsetWidth,
        h: node.offsetHeight
      };
    } else {
      return {
        x: 0,
        y: 0,
        w: node.offsetWidth,
        h: node.offsetHeight
      };
    }
  }

})(this);;
/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:v()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:50,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(p()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",B),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&I(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},p=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},v=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.delegate("a","click",q)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.delegate(".bx-start","click",k),o.controls.autoEl.delegate(".bx-stop","click",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},q=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},I=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),"horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0)}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},B=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider())};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&I(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",51).fadeIn(o.settings.speed,function(){t(this).css("zIndex",50),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",p()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),I(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",B))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);;
/*! nouislider - 8.0.2 - 2015-07-06 13:22:09 */

!function(a){if("function"==typeof define&&define.amd)define([],a);else if("object"==typeof exports){var b=require("fs");module.exports=a(),module.exports.css=function(){return b.readFileSync(__dirname+"/nouislider.min.css","utf8")}}else window.noUiSlider=a()}(function(){"use strict";function a(a){return a.filter(function(a){return this[a]?!1:this[a]=!0},{})}function b(a,b){return Math.round(a/b)*b}function c(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.defaultView||c.parentWindow,e=c.documentElement,f=d.pageXOffset;return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(f=0),{top:b.top+d.pageYOffset-e.clientTop,left:b.left+f-e.clientLeft}}function d(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function e(a){var b=Math.pow(10,7);return Number((Math.round(a*b)/b).toFixed(7))}function f(a,b,c){j(a,b),setTimeout(function(){k(a,b)},c)}function g(a){return Math.max(Math.min(a,100),0)}function h(a){return Array.isArray(a)?a:[a]}function i(a){var b=a.split(".");return b.length>1?b[1].length:0}function j(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function k(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function l(a,b){a.classList?a.classList.contains(b):new RegExp("(^| )"+b+"( |$)","gi").test(a.className)}function m(a,b){return 100/(b-a)}function n(a,b){return 100*b/(a[1]-a[0])}function o(a,b){return n(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function p(a,b){return b*(a[1]-a[0])/100+a[0]}function q(a,b){for(var c=1;a>=b[c];)c+=1;return c}function r(a,b,c){if(c>=a.slice(-1)[0])return 100;var d,e,f,g,h=q(c,a);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],f+o([d,e],c)/m(f,g)}function s(a,b,c){if(c>=100)return a.slice(-1)[0];var d,e,f,g,h=q(c,b);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],p([d,e],(c-f)*m(f,g))}function t(a,c,d,e){if(100===e)return e;var f,g,h=q(e,a);return d?(f=a[h-1],g=a[h],e-f>(g-f)/2?g:f):c[h-1]?a[h-1]+b(e-a[h-1],c[h-1]):e}function u(a,b,c){var e;if("number"==typeof b&&(b=[b]),"[object Array]"!==Object.prototype.toString.call(b))throw new Error("noUiSlider: 'range' contains invalid value.");if(e="min"===a?0:"max"===a?100:parseFloat(a),!d(e)||!d(b[0]))throw new Error("noUiSlider: 'range' value isn't numeric.");c.xPct.push(e),c.xVal.push(b[0]),e?c.xSteps.push(isNaN(b[1])?!1:b[1]):isNaN(b[1])||(c.xSteps[0]=b[1])}function v(a,b,c){return b?void(c.xSteps[a]=n([c.xVal[a],c.xVal[a+1]],b)/m(c.xPct[a],c.xPct[a+1])):!0}function w(a,b,c,d){this.xPct=[],this.xVal=[],this.xSteps=[d||!1],this.xNumSteps=[!1],this.snap=b,this.direction=c;var e,f=[];for(e in a)a.hasOwnProperty(e)&&f.push([a[e],e]);for(f.sort(function(a,b){return a[0]-b[0]}),e=0;e<f.length;e++)u(f[e][1],f[e][0],this);for(this.xNumSteps=this.xSteps.slice(0),e=0;e<this.xNumSteps.length;e++)v(e,this.xNumSteps[e],this)}function x(a,b){if(!d(b))throw new Error("noUiSlider: 'step' is not numeric.");a.singleStep=b}function y(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider: 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");a.spectrum=new w(b,a.snap,a.dir,a.singleStep)}function z(a,b){if(b=h(b),!Array.isArray(b)||!b.length||b.length>2)throw new Error("noUiSlider: 'start' option is incorrect.");a.handles=b.length,a.start=b}function A(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'snap' option must be a boolean.")}function B(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'animate' option must be a boolean.")}function C(a,b){if("lower"===b&&1===a.handles)a.connect=1;else if("upper"===b&&1===a.handles)a.connect=2;else if(b===!0&&2===a.handles)a.connect=3;else{if(b!==!1)throw new Error("noUiSlider: 'connect' option doesn't match handle count.");a.connect=0}}function D(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider: 'orientation' option is invalid.")}}function E(a,b){if(!d(b))throw new Error("noUiSlider: 'margin' option must be numeric.");if(a.margin=a.spectrum.getMargin(b),!a.margin)throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.")}function F(a,b){if(!d(b))throw new Error("noUiSlider: 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit)throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.")}function G(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1,a.connect=[0,2,1,3][a.connect];break;default:throw new Error("noUiSlider: 'direction' option was not recognized.")}}function H(a,b){if("string"!=typeof b)throw new Error("noUiSlider: 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0;a.events={tap:c||f,drag:d,fixed:e,snap:f}}function I(a,b){if(a.format=b,"function"==typeof b.to&&"function"==typeof b.from)return!0;throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.")}function J(a){var b,c={margin:0,limit:0,animate:!0,format:U};b={step:{r:!1,t:x},start:{r:!0,t:z},connect:{r:!0,t:C},direction:{r:!0,t:G},snap:{r:!1,t:A},animate:{r:!1,t:B},range:{r:!0,t:y},orientation:{r:!1,t:D},margin:{r:!1,t:E},limit:{r:!1,t:F},behaviour:{r:!0,t:H},format:{r:!1,t:I}};var d={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal"};return Object.keys(d).forEach(function(b){void 0===a[b]&&(a[b]=d[b])}),Object.keys(b).forEach(function(d){var e=b[d];if(void 0===a[d]){if(e.r)throw new Error("noUiSlider: '"+d+"' is required.");return!0}e.t(c,a[d])}),c.pips=a.pips,c.style=c.ort?"top":"left",c}function K(a,b,c){var d=a+b[0],e=a+b[1];return c?(0>d&&(e+=Math.abs(d)),e>100&&(d-=e-100),[g(d),g(e)]):[d,e]}function L(a){a.preventDefault();var b,c,d=0===a.type.indexOf("touch"),e=0===a.type.indexOf("mouse"),f=0===a.type.indexOf("pointer"),g=a;return 0===a.type.indexOf("MSPointer")&&(f=!0),d&&(b=a.changedTouches[0].pageX,c=a.changedTouches[0].pageY),(e||f)&&(b=a.clientX+window.pageXOffset,c=a.clientY+window.pageYOffset),g.points=[b,c],g.cursor=e||f,g}function M(a,b){var c=document.createElement("div"),d=document.createElement("div"),e=["-lower","-upper"];return a&&e.reverse(),j(d,T[3]),j(d,T[3]+e[b]),j(c,T[2]),c.appendChild(d),c}function N(a,b,c){switch(a){case 1:j(b,T[7]),j(c[0],T[6]);break;case 3:j(c[1],T[6]);case 2:j(c[0],T[7]);case 0:j(b,T[6])}}function O(a,b,c){var d,e=[];for(d=0;a>d;d+=1)e.push(c.appendChild(M(b,d)));return e}function P(a,b,c){j(c,T[0]),j(c,T[8+a]),j(c,T[4+b]);var d=document.createElement("div");return j(d,T[1]),c.appendChild(d),d}function Q(b,d){function e(a,b,c){if("range"===a||"steps"===a)return M.xVal;if("count"===a){var d,e=100/(b-1),f=0;for(b=[];(d=f++*e)<=100;)b.push(d);a="positions"}return"positions"===a?b.map(function(a){return M.fromStepping(c?M.getStep(a):a)}):"values"===a?c?b.map(function(a){return M.fromStepping(M.getStep(M.toStepping(a)))}):b:void 0}function m(b,c,d){var e=M.direction,f={},g=M.xVal[0],h=M.xVal[M.xVal.length-1],i=!1,j=!1,k=0;return M.direction=0,d=a(d.slice().sort(function(a,b){return a-b})),d[0]!==g&&(d.unshift(g),i=!0),d[d.length-1]!==h&&(d.push(h),j=!0),d.forEach(function(a,e){var g,h,l,m,n,o,p,q,r,s,t=a,u=d[e+1];if("steps"===c&&(g=M.xNumSteps[e]),g||(g=u-t),t!==!1&&void 0!==u)for(h=t;u>=h;h+=g){for(m=M.toStepping(h),n=m-k,q=n/b,r=Math.round(q),s=n/r,l=1;r>=l;l+=1)o=k+l*s,f[o.toFixed(5)]=["x",0];p=d.indexOf(h)>-1?1:"steps"===c?2:0,!e&&i&&(p=0),h===u&&j||(f[m.toFixed(5)]=[h,p]),k=m}}),M.direction=e,f}function n(a,b,c){function e(a){return["-normal","-large","-sub"][a]}function f(a,b,c){return'class="'+b+" "+b+"-"+h+" "+b+e(c[1])+'" style="'+d.style+": "+a+'%"'}function g(a,d){M.direction&&(a=100-a),d[1]=d[1]&&b?b(d[0],d[1]):d[1],i.innerHTML+="<div "+f(a,"noUi-marker",d)+"></div>",d[1]&&(i.innerHTML+="<div "+f(a,"noUi-value",d)+">"+c.to(d[0])+"</div>")}var h=["horizontal","vertical"][d.ort],i=document.createElement("div");return j(i,"noUi-pips"),j(i,"noUi-pips-"+h),Object.keys(a).forEach(function(b){g(b,a[b])}),i}function o(a){var b=a.mode,c=a.density||1,d=a.filter||!1,f=a.values||!1,g=a.stepped||!1,h=e(b,f,g),i=m(c,b,h),j=a.format||{to:Math.round};return I.appendChild(n(i,d,j))}function p(){return G["offset"+["Width","Height"][d.ort]]}function q(a,b){void 0!==b&&(b=Math.abs(b-d.dir)),Object.keys(R).forEach(function(c){var d=c.split(".")[0];a===d&&R[c].forEach(function(a){a(h(B()),b,r(Array.prototype.slice.call(Q)))})})}function r(a){return 1===a.length?a[0]:d.dir?a.reverse():a}function s(a,b,c,e){var f=function(b){return I.hasAttribute("disabled")?!1:l(I,T[14])?!1:(b=L(b),a===S.start&&void 0!==b.buttons&&b.buttons>1?!1:(b.calcPoint=b.points[d.ort],void c(b,e)))},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,!1),g.push([a,f])}),g}function t(a,b){var c,d,e=b.handles||H,f=!1,g=100*(a.calcPoint-b.start)/p(),h=e[0]===H[0]?0:1;if(c=K(g,b.positions,e.length>1),f=y(e[0],c[h],1===e.length),e.length>1){if(f=y(e[1],c[h?0:1],!1)||f)for(d=0;d<b.handles.length;d++)q("slide",d)}else f&&q("slide",h)}function u(a,b){var c=G.getElementsByClassName(T[15]),d=b.handles[0]===H[0]?0:1;c.length&&k(c[0],T[15]),a.cursor&&(document.body.style.cursor="",document.body.removeEventListener("selectstart",document.body.noUiListener));var e=document.documentElement;e.noUiListeners.forEach(function(a){e.removeEventListener(a[0],a[1])}),k(I,T[12]),q("set",d),q("change",d)}function v(a,b){var c=document.documentElement;if(1===b.handles.length&&(j(b.handles[0].children[0],T[15]),b.handles[0].hasAttribute("disabled")))return!1;a.stopPropagation();var d=s(S.move,c,t,{start:a.calcPoint,handles:b.handles,positions:[J[0],J[H.length-1]]}),e=s(S.end,c,u,{handles:b.handles});if(c.noUiListeners=d.concat(e),a.cursor){document.body.style.cursor=getComputedStyle(a.target).cursor,H.length>1&&j(I,T[12]);var f=function(){return!1};document.body.noUiListener=f,document.body.addEventListener("selectstart",f,!1)}}function w(a){var b,e,g=a.calcPoint,h=0;return a.stopPropagation(),H.forEach(function(a){h+=c(a)[d.style]}),b=h/2>g||1===H.length?0:1,g-=c(G)[d.style],e=100*g/p(),d.events.snap||f(I,T[14],300),H[b].hasAttribute("disabled")?!1:(y(H[b],e),q("slide",b),q("set",b),q("change",b),void(d.events.snap&&v(a,{handles:[H[h]]})))}function x(a){var b,c;if(!a.fixed)for(b=0;b<H.length;b+=1)s(S.start,H[b].children[0],v,{handles:[H[b]]});a.tap&&s(S.start,G,w,{handles:H}),a.drag&&(c=[G.getElementsByClassName(T[7])[0]],j(c[0],T[10]),a.fixed&&c.push(H[c[0]===H[0]?1:0].children[0]),c.forEach(function(a){s(S.start,a,v,{handles:H})}))}function y(a,b,c){var e=a!==H[0]?1:0,f=J[0]+d.margin,h=J[1]-d.margin,i=J[0]+d.limit,l=J[1]-d.limit;return H.length>1&&(b=e?Math.max(b,f):Math.min(b,h)),c!==!1&&d.limit&&H.length>1&&(b=e?Math.min(b,i):Math.max(b,l)),b=M.getStep(b),b=g(parseFloat(b.toFixed(7))),b===J[e]?!1:(a.style[d.style]=b+"%",a.previousSibling||(k(a,T[17]),b>50&&j(a,T[17])),J[e]=b,Q[e]=M.fromStepping(b),q("update",e),!0)}function z(a,b){var c,e,f;for(d.limit&&(a+=1),c=0;a>c;c+=1)e=c%2,f=b[e],null!==f&&f!==!1&&("number"==typeof f&&(f=String(f)),f=d.format.from(f),(f===!1||isNaN(f)||y(H[e],M.toStepping(f),c===3-d.dir)===!1)&&q("update",e))}function A(a){var b,c,e=h(a);for(d.dir&&d.handles>1&&e.reverse(),d.animate&&-1!==J[0]&&f(I,T[14],300),b=H.length>1?3:1,1===e.length&&(b=1),z(b,e),c=0;c<H.length;c++)q("set",c)}function B(){var a,b=[];for(a=0;a<d.handles;a+=1)b[a]=d.format.to(Q[a]);return r(b)}function C(){T.forEach(function(a){a&&k(I,a)}),I.innerHTML="",delete I.noUiSlider}function D(){var a=J.map(function(a,b){var c=M.getApplicableStep(a),d=i(String(c[2])),e=Q[b],f=100===a?null:c[2],g=Number((e-c[2]).toFixed(d)),h=0===a?null:g>=c[1]?c[2]:c[0]||!1;return[h,f]});return r(a)}function E(a,b){R[a]=R[a]||[],R[a].push(b),"update"===a.split(".")[0]&&H.forEach(function(a,b){q("update",b)})}function F(a){var b=a.split(".")[0],c=a.substring(b.length);Object.keys(R).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete R[a]})}var G,H,I=b,J=[-1,-1],M=d.spectrum,Q=[],R={};if(I.noUiSlider)throw new Error("Slider was already initialized.");return G=P(d.dir,d.ort,I),H=O(d.handles,d.dir,G),N(d.connect,I,H),x(d.events),d.pips&&o(d.pips),{destroy:C,steps:D,on:E,off:F,get:B,set:A}}function R(a,b){if(!a.nodeName)throw new Error("noUiSlider.create requires a single element.");var c=J(b,a),d=Q(a,c);d.set(c.start),a.noUiSlider=d}var S=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},T=["noUi-target","noUi-base","noUi-origin","noUi-handle","noUi-horizontal","noUi-vertical","noUi-background","noUi-connect","noUi-ltr","noUi-rtl","noUi-dragable","","noUi-state-drag","","noUi-state-tap","noUi-active","","noUi-stacking"];w.prototype.getMargin=function(a){return 2===this.xPct.length?n(this.xVal,a):!1},w.prototype.toStepping=function(a){return a=r(this.xVal,this.xPct,a),this.direction&&(a=100-a),a},w.prototype.fromStepping=function(a){return this.direction&&(a=100-a),e(s(this.xVal,this.xPct,a))},w.prototype.getStep=function(a){return this.direction&&(a=100-a),a=t(this.xPct,this.xSteps,this.snap,a),this.direction&&(a=100-a),a},w.prototype.getApplicableStep=function(a){var b=q(a,this.xPct),c=100===a?2:1;return[this.xNumSteps[b-2],this.xVal[b-c],this.xNumSteps[b-c]]},w.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var U={to:function(a){return a.toFixed(2)},from:Number};return{create:R}});;
(function(){function e(e){this._value=e}function t(e,t,n,r){var i,s,o=Math.pow(10,t);return s=(n(e*o)/o).toFixed(t),r&&(i=new RegExp("0{1,"+r+"}$"),s=s.replace(i,"")),s}function n(e,t,n){var r;return r=t.indexOf("$")>-1?i(e,t,n):t.indexOf("%")>-1?s(e,t,n):t.indexOf(":")>-1?o(e,t):a(e._value,t,n)}function r(e,t){var n,r,i,s,o,a=t,f=["KB","MB","GB","TB","PB","EB","ZB","YB"],l=!1;if(t.indexOf(":")>-1)e._value=u(t);else if(t===d)e._value=0;else{for("."!==h[p].delimiters.decimal&&(t=t.replace(/\./g,"").replace(h[p].delimiters.decimal,".")),n=new RegExp("[^a-zA-Z]"+h[p].abbreviations.thousand+"(?:\\)|(\\"+h[p].currency.symbol+")?(?:\\))?)?$"),r=new RegExp("[^a-zA-Z]"+h[p].abbreviations.million+"(?:\\)|(\\"+h[p].currency.symbol+")?(?:\\))?)?$"),i=new RegExp("[^a-zA-Z]"+h[p].abbreviations.billion+"(?:\\)|(\\"+h[p].currency.symbol+")?(?:\\))?)?$"),s=new RegExp("[^a-zA-Z]"+h[p].abbreviations.trillion+"(?:\\)|(\\"+h[p].currency.symbol+")?(?:\\))?)?$"),o=0;o<=f.length&&!(l=t.indexOf(f[o])>-1?Math.pow(1024,o+1):!1);o++);e._value=(l?l:1)*(a.match(n)?Math.pow(10,3):1)*(a.match(r)?Math.pow(10,6):1)*(a.match(i)?Math.pow(10,9):1)*(a.match(s)?Math.pow(10,12):1)*(t.indexOf("%")>-1?.01:1)*((t.split("-").length+Math.min(t.split("(").length-1,t.split(")").length-1))%2?1:-1)*Number(t.replace(/[^0-9\.]+/g,"")),e._value=l?Math.ceil(e._value):e._value}return e._value}function i(e,t,n){var r,i=t.indexOf("$")<=1?!0:!1,s="";return t.indexOf(" $")>-1?(s=" ",t=t.replace(" $","")):t.indexOf("$ ")>-1?(s=" ",t=t.replace("$ ","")):t=t.replace("$",""),r=a(e._value,t,n),i?r.indexOf("(")>-1||r.indexOf("-")>-1?(r=r.split(""),r.splice(1,0,h[p].currency.symbol+s),r=r.join("")):r=h[p].currency.symbol+s+r:r.indexOf(")")>-1?(r=r.split(""),r.splice(-1,0,s+h[p].currency.symbol),r=r.join("")):r=r+s+h[p].currency.symbol,r}function s(e,t,n){var r,i="",s=100*e._value;return t.indexOf(" %")>-1?(i=" ",t=t.replace(" %","")):t=t.replace("%",""),r=a(s,t,n),r.indexOf(")")>-1?(r=r.split(""),r.splice(-1,0,i+"%"),r=r.join("")):r=r+i+"%",r}function o(e){var t=Math.floor(e._value/60/60),n=Math.floor((e._value-60*60*t)/60),r=Math.round(e._value-60*60*t-60*n);return t+":"+(10>n?"0"+n:n)+":"+(10>r?"0"+r:r)}function u(e){var t=e.split(":"),n=0;return 3===t.length?(n+=60*60*Number(t[0]),n+=60*Number(t[1]),n+=Number(t[2])):2===t.length&&(n+=60*Number(t[0]),n+=Number(t[1])),Number(n)}function a(e,n,r){var i,s,o,u,a,f,l=!1,c=!1,v=!1,m="",g="",y="",w=Math.abs(e),E=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],S="",x=!1;if(0===e&&null!==d)return d;if(n.indexOf("(")>-1?(l=!0,n=n.slice(1,-1)):n.indexOf("+")>-1&&(c=!0,n=n.replace(/\+/g,"")),n.indexOf("a")>-1&&(n.indexOf(" a")>-1?(m=" ",n=n.replace(" a","")):n=n.replace("a",""),w>=Math.pow(10,12)?(m+=h[p].abbreviations.trillion,e/=Math.pow(10,12)):w<Math.pow(10,12)&&w>=Math.pow(10,9)?(m+=h[p].abbreviations.billion,e/=Math.pow(10,9)):w<Math.pow(10,9)&&w>=Math.pow(10,6)?(m+=h[p].abbreviations.million,e/=Math.pow(10,6)):w<Math.pow(10,6)&&w>=Math.pow(10,3)&&(m+=h[p].abbreviations.thousand,e/=Math.pow(10,3))),n.indexOf("b")>-1)for(n.indexOf(" b")>-1?(g=" ",n=n.replace(" b","")):n=n.replace("b",""),o=0;o<=E.length;o++)if(i=Math.pow(1024,o),s=Math.pow(1024,o+1),e>=i&&s>e){g+=E[o],i>0&&(e/=i);break}return n.indexOf("o")>-1&&(n.indexOf(" o")>-1?(y=" ",n=n.replace(" o","")):n=n.replace("o",""),y+=h[p].ordinal(e)),n.indexOf("[.]")>-1&&(v=!0,n=n.replace("[.]",".")),u=e.toString().split(".")[0],a=n.split(".")[1],f=n.indexOf(","),a?(a.indexOf("[")>-1?(a=a.replace("]",""),a=a.split("["),S=t(e,a[0].length+a[1].length,r,a[1].length)):S=t(e,a.length,r),u=S.split(".")[0],S=S.split(".")[1].length?h[p].delimiters.decimal+S.split(".")[1]:"",v&&0===Number(S.slice(1))&&(S="")):u=t(e,null,r),u.indexOf("-")>-1&&(u=u.slice(1),x=!0),f>-1&&(u=u.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1"+h[p].delimiters.thousands)),0===n.indexOf(".")&&(u=""),(l&&x?"(":"")+(!l&&x?"-":"")+(!x&&c?"+":"")+u+S+(y?y:"")+(m?m:"")+(g?g:"")+(l&&x?")":"")}function f(e,t){h[e]=t}var l,c="1.5.2",h={},p="en",d=null,v="0,0",m="undefined"!=typeof module&&module.exports;l=function(t){return l.isNumeral(t)?t=t.value():0===t||"undefined"==typeof t?t=0:Number(t)||(t=l.fn.unformat(t)),new e(Number(t))},l.version=c,l.isNumeral=function(t){return t instanceof e},l.language=function(e,t){if(!e)return p;if(e&&!t){if(!h[e])throw new Error("Unknown language : "+e);p=e}return(t||!h[e])&&f(e,t),l},l.languageData=function(e){if(!e)return h[p];if(!h[e])throw new Error("Unknown language : "+e);return h[e]},l.language("en",{delimiters:{thousands:",",decimal:"."},abbreviations:{thousand:"k",million:"m",billion:"b",trillion:"t"},ordinal:function(e){var t=e%10;return 1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th"},currency:{symbol:"$"}}),l.zeroFormat=function(e){d="string"==typeof e?e:null},l.defaultFormat=function(e){v="string"==typeof e?e:"0.0"},l.fn=e.prototype={clone:function(){return l(this)},format:function(e,t){return n(this,e?e:v,void 0!==t?t:Math.round)},unformat:function(e){return"[object Number]"===Object.prototype.toString.call(e)?e:r(this,e?e:v)},value:function(){return this._value},valueOf:function(){return this._value},set:function(e){return this._value=Number(e),this},add:function(e){return this._value=this._value+Number(e),this},subtract:function(e){return this._value=this._value-Number(e),this},multiply:function(e){return this._value=this._value*Number(e),this},divide:function(e){return this._value=this._value/Number(e),this},difference:function(e){var t=this._value-Number(e);return 0>t&&(t=-t),t}},m&&(module.exports=l),"undefined"==typeof ender&&(this.numeral=l),"function"==typeof define&&define.amd&&define([],function(){return l})}).call(this);
// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function($) {
    
    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    }
    
    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    }
    
    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();
                
                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);
                
                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth || 0,
                    height: this.$element[0].offsetHeight || 0
                });

                if (typeof this.$element[0].nearestViewportElement == 'object') {
                    // SVG
					var el = this.$element[0];
                    var rect = el.getBoundingClientRect();
					pos.width = rect.width;
					pos.height = rect.height;
                }

                
                var actualWidth = $tip[0].offsetWidth,
                    actualHeight = $tip[0].offsetHeight,
                    gravity = maybeCall(this.options.gravity, this.$element[0]);
                
                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }
                
                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                
                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }
                
                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }

                var t = this;
                var set_hovered  = function(set_hover){
                    return function(){
                        t.$tip.stop();
                        t.tipHovered = set_hover;
                        if (!set_hover){
                            if (t.options.delayOut === 0) {
                                t.hide();
                            } else {
                                setTimeout(function() { 
                                    if (t.hoverState == 'out') t.hide(); }, t.options.delayOut);
                            }
                        }
                    };
                };
               $tip.hover(set_hovered(true), set_hovered(false));
            }
        },
        
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        
        fixTitle: function() {
            var $e = this.$element;
            
            if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
            }
            if (typeof $e.context.nearestViewportElement == 'object'){                                                        
                if ($e.children('title').length){
                    $e.append('<original-title>' + ($e.children('title').text() || '') + '</original-title>')
                        .children('title').remove();
                }
            }
        },
        
        getTitle: function() {
            
            var title, $e = this.$element, o = this.options;
            this.fixTitle();

            if (typeof o.title == 'string') {
                var title_name = o.title == 'title' ? 'original-title' : o.title;
                if ($e.children(title_name).length){
                    title = $e.children(title_name).html();
                } else{
                    title = $e.attr(title_name);
                }
                
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },
        
        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
            }
            return this.$tip;
        },
        
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    
    $.fn.tipsy = function(options) {
        
        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy) tipsy[options]();
            return this;
        }
        
        options = $.extend({}, $.fn.tipsy.defaults, options);

        if (options.hoverlock && options.delayOut === 0) {
	    options.delayOut = 100;
	}
        
        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }
        
        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn === 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        }
        
        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut === 0) {
                tipsy.hide();
            } else {
                var to = function() {
                    if (!tipsy.tipHovered || !options.hoverlock){
                        if (tipsy.hoverState == 'out') tipsy.hide(); 
                    }
                };
                setTimeout(to, options.delayOut);
            }    
        }

        if (options.trigger != 'manual') {
            var binder = options.live ? 'live' : 'bind',
                eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        
        return this;
        
    };
    
    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover',
        hoverlock: false
    };
    
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    
    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    
    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
    
    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable 
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
     $.fn.tipsy.autoBounds = function(margin, prefer) {
		return function() {
			var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
			    boundTop = $(document).scrollTop() + margin,
			    boundLeft = $(document).scrollLeft() + margin,
			    $this = $(this);

			if ($this.offset().top < boundTop) dir.ns = 'n';
			if ($this.offset().left < boundLeft) dir.ew = 'w';
			if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
			if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

			return dir.ns + (dir.ew ? dir.ew : '');
		};
    };
})(jQuery);;
/*!
 * typeahead.js 0.10.5
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

!function(a){var b=function(){"use strict";return{isMsie:function(){return/(msie|trident)/i.test(navigator.userAgent)?navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]:!1},isBlankString:function(a){return!a||/^\s*$/.test(a)},escapeRegExChars:function(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},isString:function(a){return"string"==typeof a},isNumber:function(a){return"number"==typeof a},isArray:a.isArray,isFunction:a.isFunction,isObject:a.isPlainObject,isUndefined:function(a){return"undefined"==typeof a},toStr:function(a){return b.isUndefined(a)||null===a?"":a+""},bind:a.proxy,each:function(b,c){function d(a,b){return c(b,a)}a.each(b,d)},map:a.map,filter:a.grep,every:function(b,c){var d=!0;return b?(a.each(b,function(a,e){return(d=c.call(null,e,a,b))?void 0:!1}),!!d):d},some:function(b,c){var d=!1;return b?(a.each(b,function(a,e){return(d=c.call(null,e,a,b))?!1:void 0}),!!d):d},mixin:a.extend,getUniqueId:function(){var a=0;return function(){return a++}}(),templatify:function(b){function c(){return String(b)}return a.isFunction(b)?b:c},defer:function(a){setTimeout(a,0)},debounce:function(a,b,c){var d,e;return function(){var f,g,h=this,i=arguments;return f=function(){d=null,c||(e=a.apply(h,i))},g=c&&!d,clearTimeout(d),d=setTimeout(f,b),g&&(e=a.apply(h,i)),e}},throttle:function(a,b){var c,d,e,f,g,h;return g=0,h=function(){g=new Date,e=null,f=a.apply(c,d)},function(){var i=new Date,j=b-(i-g);return c=this,d=arguments,0>=j?(clearTimeout(e),e=null,g=i,f=a.apply(c,d)):e||(e=setTimeout(h,j)),f}},noop:function(){}}}(),c="0.10.5",d=function(){"use strict";function a(a){return a=b.toStr(a),a?a.split(/\s+/):[]}function c(a){return a=b.toStr(a),a?a.split(/\W+/):[]}function d(a){return function(){var c=[].slice.call(arguments,0);return function(d){var e=[];return b.each(c,function(c){e=e.concat(a(b.toStr(d[c])))}),e}}}return{nonword:c,whitespace:a,obj:{nonword:d(c),whitespace:d(a)}}}(),e=function(){"use strict";function c(c){this.maxSize=b.isNumber(c)?c:100,this.reset(),this.maxSize<=0&&(this.set=this.get=a.noop)}function d(){this.head=this.tail=null}function e(a,b){this.key=a,this.val=b,this.prev=this.next=null}return b.mixin(c.prototype,{set:function(a,b){var c,d=this.list.tail;this.size>=this.maxSize&&(this.list.remove(d),delete this.hash[d.key]),(c=this.hash[a])?(c.val=b,this.list.moveToFront(c)):(c=new e(a,b),this.list.add(c),this.hash[a]=c,this.size++)},get:function(a){var b=this.hash[a];return b?(this.list.moveToFront(b),b.val):void 0},reset:function(){this.size=0,this.hash={},this.list=new d}}),b.mixin(d.prototype,{add:function(a){this.head&&(a.next=this.head,this.head.prev=a),this.head=a,this.tail=this.tail||a},remove:function(a){a.prev?a.prev.next=a.next:this.head=a.next,a.next?a.next.prev=a.prev:this.tail=a.prev},moveToFront:function(a){this.remove(a),this.add(a)}}),c}(),f=function(){"use strict";function a(a){this.prefix=["__",a,"__"].join(""),this.ttlKey="__ttl__",this.keyMatcher=new RegExp("^"+b.escapeRegExChars(this.prefix))}function c(){return(new Date).getTime()}function d(a){return JSON.stringify(b.isUndefined(a)?null:a)}function e(a){return JSON.parse(a)}var f,g;try{f=window.localStorage,f.setItem("~~~","!"),f.removeItem("~~~")}catch(h){f=null}return g=f&&window.JSON?{_prefix:function(a){return this.prefix+a},_ttlKey:function(a){return this._prefix(a)+this.ttlKey},get:function(a){return this.isExpired(a)&&this.remove(a),e(f.getItem(this._prefix(a)))},set:function(a,e,g){return b.isNumber(g)?f.setItem(this._ttlKey(a),d(c()+g)):f.removeItem(this._ttlKey(a)),f.setItem(this._prefix(a),d(e))},remove:function(a){return f.removeItem(this._ttlKey(a)),f.removeItem(this._prefix(a)),this},clear:function(){var a,b,c=[],d=f.length;for(a=0;d>a;a++)(b=f.key(a)).match(this.keyMatcher)&&c.push(b.replace(this.keyMatcher,""));for(a=c.length;a--;)this.remove(c[a]);return this},isExpired:function(a){var d=e(f.getItem(this._ttlKey(a)));return b.isNumber(d)&&c()>d?!0:!1}}:{get:b.noop,set:b.noop,remove:b.noop,clear:b.noop,isExpired:b.noop},b.mixin(a.prototype,g),a}(),g=function(){"use strict";function c(b){b=b||{},this.cancelled=!1,this.lastUrl=null,this._send=b.transport?d(b.transport):a.ajax,this._get=b.rateLimiter?b.rateLimiter(this._get):this._get,this._cache=b.cache===!1?new e(0):i}function d(c){return function(d,e){function f(a){b.defer(function(){h.resolve(a)})}function g(a){b.defer(function(){h.reject(a)})}var h=a.Deferred();return c(d,e,f,g),h}}var f=0,g={},h=6,i=new e(10);return c.setMaxPendingRequests=function(a){h=a},c.resetCache=function(){i.reset()},b.mixin(c.prototype,{_get:function(a,b,c){function d(b){c&&c(null,b),k._cache.set(a,b)}function e(){c&&c(!0)}function i(){f--,delete g[a],k.onDeckRequestArgs&&(k._get.apply(k,k.onDeckRequestArgs),k.onDeckRequestArgs=null)}var j,k=this;this.cancelled||a!==this.lastUrl||((j=g[a])?j.done(d).fail(e):h>f?(f++,g[a]=this._send(a,b).done(d).fail(e).always(i)):this.onDeckRequestArgs=[].slice.call(arguments,0))},get:function(a,c,d){var e;return b.isFunction(c)&&(d=c,c={}),this.cancelled=!1,this.lastUrl=a,(e=this._cache.get(a))?b.defer(function(){d&&d(null,e)}):this._get(a,c,d),!!e},cancel:function(){this.cancelled=!0}}),c}(),h=function(){"use strict";function c(b){b=b||{},b.datumTokenizer&&b.queryTokenizer||a.error("datumTokenizer and queryTokenizer are both required"),this.datumTokenizer=b.datumTokenizer,this.queryTokenizer=b.queryTokenizer,this.reset()}function d(a){return a=b.filter(a,function(a){return!!a}),a=b.map(a,function(a){return a.toLowerCase()})}function e(){return{ids:[],children:{}}}function f(a){for(var b={},c=[],d=0,e=a.length;e>d;d++)b[a[d]]||(b[a[d]]=!0,c.push(a[d]));return c}function g(a,b){function c(a,b){return a-b}var d=0,e=0,f=[];a=a.sort(c),b=b.sort(c);for(var g=a.length,h=b.length;g>d&&h>e;)a[d]<b[e]?d++:a[d]>b[e]?e++:(f.push(a[d]),d++,e++);return f}return b.mixin(c.prototype,{bootstrap:function(a){this.datums=a.datums,this.trie=a.trie},add:function(a){var c=this;a=b.isArray(a)?a:[a],b.each(a,function(a){var f,g;f=c.datums.push(a)-1,g=d(c.datumTokenizer(a)),b.each(g,function(a){var b,d,g;for(b=c.trie,d=a.split("");g=d.shift();)b=b.children[g]||(b.children[g]=e()),b.ids.push(f)})})},get:function(a){var c,e,h=this;return c=d(this.queryTokenizer(a)),b.each(c,function(a){var b,c,d,f;if(e&&0===e.length)return!1;for(b=h.trie,c=a.split("");b&&(d=c.shift());)b=b.children[d];return b&&0===c.length?(f=b.ids.slice(0),void(e=e?g(e,f):f)):(e=[],!1)}),e?b.map(f(e),function(a){return h.datums[a]}):[]},reset:function(){this.datums=[],this.trie=e()},serialize:function(){return{datums:this.datums,trie:this.trie}}}),c}(),i=function(){"use strict";function d(a){return a.local||null}function e(d){var e,f;return f={url:null,thumbprint:"",ttl:864e5,filter:null,ajax:{}},(e=d.prefetch||null)&&(e=b.isString(e)?{url:e}:e,e=b.mixin(f,e),e.thumbprint=c+e.thumbprint,e.ajax.type=e.ajax.type||"GET",e.ajax.dataType=e.ajax.dataType||"json",!e.url&&a.error("prefetch requires url to be set")),e}function f(c){function d(a){return function(c){return b.debounce(c,a)}}function e(a){return function(c){return b.throttle(c,a)}}var f,g;return g={url:null,cache:!0,wildcard:"%QUERY",replace:null,rateLimitBy:"debounce",rateLimitWait:300,send:null,filter:null,ajax:{}},(f=c.remote||null)&&(f=b.isString(f)?{url:f}:f,f=b.mixin(g,f),f.rateLimiter=/^throttle$/i.test(f.rateLimitBy)?e(f.rateLimitWait):d(f.rateLimitWait),f.ajax.type=f.ajax.type||"GET",f.ajax.dataType=f.ajax.dataType||"json",delete f.rateLimitBy,delete f.rateLimitWait,!f.url&&a.error("remote requires url to be set")),f}return{local:d,prefetch:e,remote:f}}();!function(c){"use strict";function e(b){b&&(b.local||b.prefetch||b.remote)||a.error("one of local, prefetch, or remote is required"),this.limit=b.limit||5,this.sorter=j(b.sorter),this.dupDetector=b.dupDetector||k,this.local=i.local(b),this.prefetch=i.prefetch(b),this.remote=i.remote(b),this.cacheKey=this.prefetch?this.prefetch.cacheKey||this.prefetch.url:null,this.index=new h({datumTokenizer:b.datumTokenizer,queryTokenizer:b.queryTokenizer}),this.storage=this.cacheKey?new f(this.cacheKey):null}function j(a){function c(b){return b.sort(a)}function d(a){return a}return b.isFunction(a)?c:d}function k(){return!1}var l,m;return l=c.Bloodhound,m={data:"data",protocol:"protocol",thumbprint:"thumbprint"},c.Bloodhound=e,e.noConflict=function(){return c.Bloodhound=l,e},e.tokenizers=d,b.mixin(e.prototype,{_loadPrefetch:function(b){function c(a){f.clear(),f.add(b.filter?b.filter(a):a),f._saveToStorage(f.index.serialize(),b.thumbprint,b.ttl)}var d,e,f=this;return(d=this._readFromStorage(b.thumbprint))?(this.index.bootstrap(d),e=a.Deferred().resolve()):e=a.ajax(b.url,b.ajax).done(c),e},_getFromRemote:function(a,b){function c(a,c){b(a?[]:f.remote.filter?f.remote.filter(c):c)}var d,e,f=this;if(this.transport)return a=a||"",e=encodeURIComponent(a),d=this.remote.replace?this.remote.replace(this.remote.url,a):this.remote.url.replace(this.remote.wildcard,e),this.transport.get(d,this.remote.ajax,c)},_cancelLastRemoteRequest:function(){this.transport&&this.transport.cancel()},_saveToStorage:function(a,b,c){this.storage&&(this.storage.set(m.data,a,c),this.storage.set(m.protocol,location.protocol,c),this.storage.set(m.thumbprint,b,c))},_readFromStorage:function(a){var b,c={};return this.storage&&(c.data=this.storage.get(m.data),c.protocol=this.storage.get(m.protocol),c.thumbprint=this.storage.get(m.thumbprint)),b=c.thumbprint!==a||c.protocol!==location.protocol,c.data&&!b?c.data:null},_initialize:function(){function c(){e.add(b.isFunction(f)?f():f)}var d,e=this,f=this.local;return d=this.prefetch?this._loadPrefetch(this.prefetch):a.Deferred().resolve(),f&&d.done(c),this.transport=this.remote?new g(this.remote):null,this.initPromise=d.promise()},initialize:function(a){return!this.initPromise||a?this._initialize():this.initPromise},add:function(a){this.index.add(a)},get:function(a,c){function d(a){var d=f.slice(0);b.each(a,function(a){var c;return c=b.some(d,function(b){return e.dupDetector(a,b)}),!c&&d.push(a),d.length<e.limit}),c&&c(e.sorter(d))}var e=this,f=[],g=!1;f=this.index.get(a),f=this.sorter(f).slice(0,this.limit),f.length<this.limit?g=this._getFromRemote(a,d):this._cancelLastRemoteRequest(),g||(f.length>0||!this.transport)&&c&&c(f)},clear:function(){this.index.reset()},clearPrefetchCache:function(){this.storage&&this.storage.clear()},clearRemoteCache:function(){this.transport&&g.resetCache()},ttAdapter:function(){return b.bind(this.get,this)}}),e}(this);var j=function(){return{wrapper:'<span class="twitter-typeahead"></span>',dropdown:'<span class="tt-dropdown-menu"></span>',dataset:'<div class="tt-dataset-%CLASS%"></div>',suggestions:'<span class="tt-suggestions"></span>',suggestion:'<div class="tt-suggestion"></div>'}}(),k=function(){"use strict";var a={wrapper:{position:"relative",display:"inline-block"},hint:{position:"absolute",top:"0",left:"0",borderColor:"transparent",boxShadow:"none",opacity:"1"},input:{position:"relative",verticalAlign:"top",backgroundColor:"transparent"},inputWithNoHint:{position:"relative",verticalAlign:"top"},dropdown:{position:"absolute",top:"100%",left:"0",zIndex:"100",display:"none"},suggestions:{display:"block"},suggestion:{whiteSpace:"nowrap",cursor:"pointer"},suggestionChild:{whiteSpace:"normal"},ltr:{left:"0",right:"auto"},rtl:{left:"auto",right:" 0"}};return b.isMsie()&&b.mixin(a.input,{backgroundImage:"url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"}),b.isMsie()&&b.isMsie()<=7&&b.mixin(a.input,{marginTop:"-1px"}),a}(),l=function(){"use strict";function c(b){b&&b.el||a.error("EventBus initialized without el"),this.$el=a(b.el)}var d="typeahead:";return b.mixin(c.prototype,{trigger:function(a){var b=[].slice.call(arguments,1);this.$el.trigger(d+a,b)}}),c}(),m=function(){"use strict";function a(a,b,c,d){var e;if(!c)return this;for(b=b.split(i),c=d?h(c,d):c,this._callbacks=this._callbacks||{};e=b.shift();)this._callbacks[e]=this._callbacks[e]||{sync:[],async:[]},this._callbacks[e][a].push(c);return this}function b(b,c,d){return a.call(this,"async",b,c,d)}function c(b,c,d){return a.call(this,"sync",b,c,d)}function d(a){var b;if(!this._callbacks)return this;for(a=a.split(i);b=a.shift();)delete this._callbacks[b];return this}function e(a){var b,c,d,e,g;if(!this._callbacks)return this;for(a=a.split(i),d=[].slice.call(arguments,1);(b=a.shift())&&(c=this._callbacks[b]);)e=f(c.sync,this,[b].concat(d)),g=f(c.async,this,[b].concat(d)),e()&&j(g);return this}function f(a,b,c){function d(){for(var d,e=0,f=a.length;!d&&f>e;e+=1)d=a[e].apply(b,c)===!1;return!d}return d}function g(){var a;return a=window.setImmediate?function(a){setImmediate(function(){a()})}:function(a){setTimeout(function(){a()},0)}}function h(a,b){return a.bind?a.bind(b):function(){a.apply(b,[].slice.call(arguments,0))}}var i=/\s+/,j=g();return{onSync:c,onAsync:b,off:d,trigger:e}}(),n=function(a){"use strict";function c(a,c,d){for(var e,f=[],g=0,h=a.length;h>g;g++)f.push(b.escapeRegExChars(a[g]));return e=d?"\\b("+f.join("|")+")\\b":"("+f.join("|")+")",c?new RegExp(e):new RegExp(e,"i")}var d={node:null,pattern:null,tagName:"strong",className:null,wordsOnly:!1,caseSensitive:!1};return function(e){function f(b){var c,d,f;return(c=h.exec(b.data))&&(f=a.createElement(e.tagName),e.className&&(f.className=e.className),d=b.splitText(c.index),d.splitText(c[0].length),f.appendChild(d.cloneNode(!0)),b.parentNode.replaceChild(f,d)),!!c}function g(a,b){for(var c,d=3,e=0;e<a.childNodes.length;e++)c=a.childNodes[e],c.nodeType===d?e+=b(c)?1:0:g(c,b)}var h;e=b.mixin({},d,e),e.node&&e.pattern&&(e.pattern=b.isArray(e.pattern)?e.pattern:[e.pattern],h=c(e.pattern,e.caseSensitive,e.wordsOnly),g(e.node,f))}}(window.document),o=function(){"use strict";function c(c){var e,f,h,i,j=this;c=c||{},c.input||a.error("input is missing"),e=b.bind(this._onBlur,this),f=b.bind(this._onFocus,this),h=b.bind(this._onKeydown,this),i=b.bind(this._onInput,this),this.$hint=a(c.hint),this.$input=a(c.input).on("blur.tt",e).on("focus.tt",f).on("keydown.tt",h),0===this.$hint.length&&(this.setHint=this.getHint=this.clearHint=this.clearHintIfInvalid=b.noop),b.isMsie()?this.$input.on("keydown.tt keypress.tt cut.tt paste.tt",function(a){g[a.which||a.keyCode]||b.defer(b.bind(j._onInput,j,a))}):this.$input.on("input.tt",i),this.query=this.$input.val(),this.$overflowHelper=d(this.$input)}function d(b){return a('<pre aria-hidden="true"></pre>').css({position:"absolute",visibility:"hidden",whiteSpace:"pre",fontFamily:b.css("font-family"),fontSize:b.css("font-size"),fontStyle:b.css("font-style"),fontVariant:b.css("font-variant"),fontWeight:b.css("font-weight"),wordSpacing:b.css("word-spacing"),letterSpacing:b.css("letter-spacing"),textIndent:b.css("text-indent"),textRendering:b.css("text-rendering"),textTransform:b.css("text-transform")}).insertAfter(b)}function e(a,b){return c.normalizeQuery(a)===c.normalizeQuery(b)}function f(a){return a.altKey||a.ctrlKey||a.metaKey||a.shiftKey}var g;return g={9:"tab",27:"esc",37:"left",39:"right",13:"enter",38:"up",40:"down"},c.normalizeQuery=function(a){return(a||"").replace(/^\s*/g,"").replace(/\s{2,}/g," ")},b.mixin(c.prototype,m,{_onBlur:function(){this.resetInputValue(),this.trigger("blurred")},_onFocus:function(){this.trigger("focused")},_onKeydown:function(a){var b=g[a.which||a.keyCode];this._managePreventDefault(b,a),b&&this._shouldTrigger(b,a)&&this.trigger(b+"Keyed",a)},_onInput:function(){this._checkInputValue()},_managePreventDefault:function(a,b){var c,d,e;switch(a){case"tab":d=this.getHint(),e=this.getInputValue(),c=d&&d!==e&&!f(b);break;case"up":case"down":c=!f(b);break;default:c=!1}c&&b.preventDefault()},_shouldTrigger:function(a,b){var c;switch(a){case"tab":c=!f(b);break;default:c=!0}return c},_checkInputValue:function(){var a,b,c;a=this.getInputValue(),b=e(a,this.query),c=b?this.query.length!==a.length:!1,this.query=a,b?c&&this.trigger("whitespaceChanged",this.query):this.trigger("queryChanged",this.query)},focus:function(){this.$input.focus()},blur:function(){this.$input.blur()},getQuery:function(){return this.query},setQuery:function(a){this.query=a},getInputValue:function(){return this.$input.val()},setInputValue:function(a,b){this.$input.val(a),b?this.clearHint():this._checkInputValue()},resetInputValue:function(){this.setInputValue(this.query,!0)},getHint:function(){return this.$hint.val()},setHint:function(a){this.$hint.val(a)},clearHint:function(){this.setHint("")},clearHintIfInvalid:function(){var a,b,c,d;a=this.getInputValue(),b=this.getHint(),c=a!==b&&0===b.indexOf(a),d=""!==a&&c&&!this.hasOverflow(),!d&&this.clearHint()},getLanguageDirection:function(){return(this.$input.css("direction")||"ltr").toLowerCase()},hasOverflow:function(){var a=this.$input.width()-2;return this.$overflowHelper.text(this.getInputValue()),this.$overflowHelper.width()>=a},isCursorAtEnd:function(){var a,c,d;return a=this.$input.val().length,c=this.$input[0].selectionStart,b.isNumber(c)?c===a:document.selection?(d=document.selection.createRange(),d.moveStart("character",-a),a===d.text.length):!0},destroy:function(){this.$hint.off(".tt"),this.$input.off(".tt"),this.$hint=this.$input=this.$overflowHelper=null}}),c}(),p=function(){"use strict";function c(c){c=c||{},c.templates=c.templates||{},c.source||a.error("missing source"),c.name&&!f(c.name)&&a.error("invalid dataset name: "+c.name),this.query=null,this.highlight=!!c.highlight,this.name=c.name||b.getUniqueId(),this.source=c.source,this.displayFn=d(c.display||c.displayKey),this.templates=e(c.templates,this.displayFn),this.$el=a(j.dataset.replace("%CLASS%",this.name))}function d(a){function c(b){return b[a]}return a=a||"value",b.isFunction(a)?a:c}function e(a,c){function d(a){return"<p>"+c(a)+"</p>"}return{empty:a.empty&&b.templatify(a.empty),header:a.header&&b.templatify(a.header),footer:a.footer&&b.templatify(a.footer),suggestion:a.suggestion||d}}function f(a){return/^[_a-zA-Z0-9-]+$/.test(a)}var g="ttDataset",h="ttValue",i="ttDatum";return c.extractDatasetName=function(b){return a(b).data(g)},c.extractValue=function(b){return a(b).data(h)},c.extractDatum=function(b){return a(b).data(i)},b.mixin(c.prototype,m,{_render:function(c,d){function e(){return p.templates.empty({query:c,isEmpty:!0})}function f(){function e(b){var c;return c=a(j.suggestion).append(p.templates.suggestion(b)).data(g,p.name).data(h,p.displayFn(b)).data(i,b),c.children().each(function(){a(this).css(k.suggestionChild)}),c}var f,l;return f=a(j.suggestions).css(k.suggestions),l=b.map(d,e),f.append.apply(f,l),p.highlight&&n({className:"tt-highlight",node:f[0],pattern:c}),f}function l(){return p.templates.header({query:c,isEmpty:!o})}function m(){return p.templates.footer({query:c,isEmpty:!o})}if(this.$el){var o,p=this;this.$el.empty(),o=d&&d.length,!o&&this.templates.empty?this.$el.html(e()).prepend(p.templates.header?l():null).append(p.templates.footer?m():null):o&&this.$el.html(f()).prepend(p.templates.header?l():null).append(p.templates.footer?m():null),this.trigger("rendered")}},getRoot:function(){return this.$el},update:function(a){function b(b){c.canceled||a!==c.query||c._render(a,b)}var c=this;this.query=a,this.canceled=!1,this.source(a,b)},cancel:function(){this.canceled=!0},clear:function(){this.cancel(),this.$el.empty(),this.trigger("rendered")},isEmpty:function(){return this.$el.is(":empty")},destroy:function(){this.$el=null}}),c}(),q=function(){"use strict";function c(c){var e,f,g,h=this;c=c||{},c.menu||a.error("menu is required"),this.isOpen=!1,this.isEmpty=!0,this.datasets=b.map(c.datasets,d),e=b.bind(this._onSuggestionClick,this),f=b.bind(this._onSuggestionMouseEnter,this),g=b.bind(this._onSuggestionMouseLeave,this),this.$menu=a(c.menu).on("click.tt",".tt-suggestion",e).on("mouseenter.tt",".tt-suggestion",f).on("mouseleave.tt",".tt-suggestion",g),b.each(this.datasets,function(a){h.$menu.append(a.getRoot()),a.onSync("rendered",h._onRendered,h)})}function d(a){return new p(a)}return b.mixin(c.prototype,m,{_onSuggestionClick:function(b){this.trigger("suggestionClicked",a(b.currentTarget))},_onSuggestionMouseEnter:function(b){this._removeCursor(),this._setCursor(a(b.currentTarget),!0)},_onSuggestionMouseLeave:function(){this._removeCursor()},_onRendered:function(){function a(a){return a.isEmpty()}this.isEmpty=b.every(this.datasets,a),this.isEmpty?this._hide():this.isOpen&&this._show(),this.trigger("datasetRendered")},_hide:function(){this.$menu.hide()},_show:function(){this.$menu.css("display","block")},_getSuggestions:function(){return this.$menu.find(".tt-suggestion")},_getCursor:function(){return this.$menu.find(".tt-cursor").first()},_setCursor:function(a,b){a.first().addClass("tt-cursor"),!b&&this.trigger("cursorMoved")},_removeCursor:function(){this._getCursor().removeClass("tt-cursor")},_moveCursor:function(a){var b,c,d,e;if(this.isOpen){if(c=this._getCursor(),b=this._getSuggestions(),this._removeCursor(),d=b.index(c)+a,d=(d+1)%(b.length+1)-1,-1===d)return void this.trigger("cursorRemoved");-1>d&&(d=b.length-1),this._setCursor(e=b.eq(d)),this._ensureVisible(e)}},_ensureVisible:function(a){var b,c,d,e;b=a.position().top,c=b+a.outerHeight(!0),d=this.$menu.scrollTop(),e=this.$menu.height()+parseInt(this.$menu.css("paddingTop"),10)+parseInt(this.$menu.css("paddingBottom"),10),0>b?this.$menu.scrollTop(d+b):c>e&&this.$menu.scrollTop(d+(c-e))},close:function(){this.isOpen&&(this.isOpen=!1,this._removeCursor(),this._hide(),this.trigger("closed"))},open:function(){this.isOpen||(this.isOpen=!0,!this.isEmpty&&this._show(),this.trigger("opened"))},setLanguageDirection:function(a){this.$menu.css("ltr"===a?k.ltr:k.rtl)},moveCursorUp:function(){this._moveCursor(-1)},moveCursorDown:function(){this._moveCursor(1)},getDatumForSuggestion:function(a){var b=null;return a.length&&(b={raw:p.extractDatum(a),value:p.extractValue(a),datasetName:p.extractDatasetName(a)}),b},getDatumForCursor:function(){return this.getDatumForSuggestion(this._getCursor().first())},getDatumForTopSuggestion:function(){return this.getDatumForSuggestion(this._getSuggestions().first())},update:function(a){function c(b){b.update(a)}b.each(this.datasets,c)},empty:function(){function a(a){a.clear()}b.each(this.datasets,a),this.isEmpty=!0},isVisible:function(){return this.isOpen&&!this.isEmpty},destroy:function(){function a(a){a.destroy()}this.$menu.off(".tt"),this.$menu=null,b.each(this.datasets,a)}}),c}(),r=function(){"use strict";function c(c){var e,f,g;c=c||{},c.input||a.error("missing input"),this.isActivated=!1,this.autoselect=!!c.autoselect,this.minLength=b.isNumber(c.minLength)?c.minLength:1,this.$node=d(c.input,c.withHint),e=this.$node.find(".tt-dropdown-menu"),f=this.$node.find(".tt-input"),g=this.$node.find(".tt-hint"),f.on("blur.tt",function(a){var c,d,g;c=document.activeElement,d=e.is(c),g=e.has(c).length>0,b.isMsie()&&(d||g)&&(a.preventDefault(),a.stopImmediatePropagation(),b.defer(function(){f.focus()}))}),e.on("mousedown.tt",function(a){a.preventDefault()}),this.eventBus=c.eventBus||new l({el:f}),this.dropdown=new q({menu:e,datasets:c.datasets}).onSync("suggestionClicked",this._onSuggestionClicked,this).onSync("cursorMoved",this._onCursorMoved,this).onSync("cursorRemoved",this._onCursorRemoved,this).onSync("opened",this._onOpened,this).onSync("closed",this._onClosed,this).onAsync("datasetRendered",this._onDatasetRendered,this),this.input=new o({input:f,hint:g}).onSync("focused",this._onFocused,this).onSync("blurred",this._onBlurred,this).onSync("enterKeyed",this._onEnterKeyed,this).onSync("tabKeyed",this._onTabKeyed,this).onSync("escKeyed",this._onEscKeyed,this).onSync("upKeyed",this._onUpKeyed,this).onSync("downKeyed",this._onDownKeyed,this).onSync("leftKeyed",this._onLeftKeyed,this).onSync("rightKeyed",this._onRightKeyed,this).onSync("queryChanged",this._onQueryChanged,this).onSync("whitespaceChanged",this._onWhitespaceChanged,this),this._setLanguageDirection()}function d(b,c){var d,f,h,i;d=a(b),f=a(j.wrapper).css(k.wrapper),h=a(j.dropdown).css(k.dropdown),i=d.clone().css(k.hint).css(e(d)),i.val("").removeData().addClass("tt-hint").removeAttr("id name placeholder required").prop("readonly",!0).attr({autocomplete:"off",spellcheck:"false",tabindex:-1}),d.data(g,{dir:d.attr("dir"),autocomplete:d.attr("autocomplete"),spellcheck:d.attr("spellcheck"),style:d.attr("style")}),d.addClass("tt-input").attr({autocomplete:"off",spellcheck:!1}).css(c?k.input:k.inputWithNoHint);try{!d.attr("dir")&&d.attr("dir","auto")}catch(l){}return d.wrap(f).parent().prepend(c?i:null).append(h)}function e(a){return{backgroundAttachment:a.css("background-attachment"),backgroundClip:a.css("background-clip"),backgroundColor:a.css("background-color"),backgroundImage:a.css("background-image"),backgroundOrigin:a.css("background-origin"),backgroundPosition:a.css("background-position"),backgroundRepeat:a.css("background-repeat"),backgroundSize:a.css("background-size")}}function f(a){var c=a.find(".tt-input");b.each(c.data(g),function(a,d){b.isUndefined(a)?c.removeAttr(d):c.attr(d,a)}),c.detach().removeData(g).removeClass("tt-input").insertAfter(a),a.remove()}var g="ttAttrs";return b.mixin(c.prototype,{_onSuggestionClicked:function(a,b){var c;(c=this.dropdown.getDatumForSuggestion(b))&&this._select(c)},_onCursorMoved:function(){var a=this.dropdown.getDatumForCursor();this.input.setInputValue(a.value,!0),this.eventBus.trigger("cursorchanged",a.raw,a.datasetName)},_onCursorRemoved:function(){this.input.resetInputValue(),this._updateHint()},_onDatasetRendered:function(){this._updateHint()},_onOpened:function(){this._updateHint(),this.eventBus.trigger("opened")},_onClosed:function(){this.input.clearHint(),this.eventBus.trigger("closed")},_onFocused:function(){this.isActivated=!0,this.dropdown.open()},_onBlurred:function(){this.isActivated=!1,this.dropdown.empty(),this.dropdown.close()},_onEnterKeyed:function(a,b){var c,d;c=this.dropdown.getDatumForCursor(),d=this.dropdown.getDatumForTopSuggestion(),c?(this._select(c),b.preventDefault()):this.autoselect&&d&&(this._select(d),b.preventDefault())},_onTabKeyed:function(a,b){var c;(c=this.dropdown.getDatumForCursor())?(this._select(c),b.preventDefault()):this._autocomplete(!0)},_onEscKeyed:function(){this.dropdown.close(),this.input.resetInputValue()},_onUpKeyed:function(){var a=this.input.getQuery();this.dropdown.isEmpty&&a.length>=this.minLength?this.dropdown.update(a):this.dropdown.moveCursorUp(),this.dropdown.open()},_onDownKeyed:function(){var a=this.input.getQuery();this.dropdown.isEmpty&&a.length>=this.minLength?this.dropdown.update(a):this.dropdown.moveCursorDown(),this.dropdown.open()},_onLeftKeyed:function(){"rtl"===this.dir&&this._autocomplete()},_onRightKeyed:function(){"ltr"===this.dir&&this._autocomplete()},_onQueryChanged:function(a,b){this.input.clearHintIfInvalid(),b.length>=this.minLength?this.dropdown.update(b):this.dropdown.empty(),this.dropdown.open(),this._setLanguageDirection()},_onWhitespaceChanged:function(){this._updateHint(),this.dropdown.open()},_setLanguageDirection:function(){var a;this.dir!==(a=this.input.getLanguageDirection())&&(this.dir=a,this.$node.css("direction",a),this.dropdown.setLanguageDirection(a))},_updateHint:function(){var a,c,d,e,f,g;a=this.dropdown.getDatumForTopSuggestion(),a&&this.dropdown.isVisible()&&!this.input.hasOverflow()?(c=this.input.getInputValue(),d=o.normalizeQuery(c),e=b.escapeRegExChars(d),f=new RegExp("^(?:"+e+")(.+$)","i"),g=f.exec(a.value),g?this.input.setHint(c+g[1]):this.input.clearHint()):this.input.clearHint()},_autocomplete:function(a){var b,c,d,e;b=this.input.getHint(),c=this.input.getQuery(),d=a||this.input.isCursorAtEnd(),b&&c!==b&&d&&(e=this.dropdown.getDatumForTopSuggestion(),e&&this.input.setInputValue(e.value),this.eventBus.trigger("autocompleted",e.raw,e.datasetName))},_select:function(a){this.input.setQuery(a.value),this.input.setInputValue(a.value,!0),this._setLanguageDirection(),this.eventBus.trigger("selected",a.raw,a.datasetName),this.dropdown.close(),b.defer(b.bind(this.dropdown.empty,this.dropdown))},open:function(){this.dropdown.open()},close:function(){this.dropdown.close()},setVal:function(a){a=b.toStr(a),this.isActivated?this.input.setInputValue(a):(this.input.setQuery(a),this.input.setInputValue(a,!0)),this._setLanguageDirection()},getVal:function(){return this.input.getQuery()},destroy:function(){this.input.destroy(),this.dropdown.destroy(),f(this.$node),this.$node=null}}),c}();!function(){"use strict";var c,d,e;c=a.fn.typeahead,d="ttTypeahead",e={initialize:function(c,e){function f(){var f,g,h=a(this);b.each(e,function(a){a.highlight=!!c.highlight}),g=new r({input:h,eventBus:f=new l({el:h}),withHint:b.isUndefined(c.hint)?!0:!!c.hint,minLength:c.minLength,autoselect:c.autoselect,datasets:e}),h.data(d,g)}return e=b.isArray(e)?e:[].slice.call(arguments,1),c=c||{},this.each(f)},open:function(){function b(){var b,c=a(this);(b=c.data(d))&&b.open()}return this.each(b)},close:function(){function b(){var b,c=a(this);(b=c.data(d))&&b.close()}return this.each(b)},val:function(b){function c(){var c,e=a(this);(c=e.data(d))&&c.setVal(b)}function e(a){var b,c;return(b=a.data(d))&&(c=b.getVal()),c}return arguments.length?this.each(c):e(this.first())},destroy:function(){function b(){var b,c=a(this);(b=c.data(d))&&(b.destroy(),c.removeData(d))}return this.each(b)}},a.fn.typeahead=function(b){var c;return e[b]&&"initialize"!==b?(c=this.filter(function(){return!!a(this).data(d)}),e[b].apply(c,[].slice.call(arguments,1))):e.initialize.apply(this,arguments)},a.fn.typeahead.noConflict=function(){return a.fn.typeahead=c,this}}()}(window.jQuery);
;
/*! VelocityJS.org (1.2.3). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */
!function(a){function b(a){var b=a.length,d=c.type(a);return"function"===d||c.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===d||0===b||"number"==typeof b&&b>0&&b-1 in a}if(!a.jQuery){var c=function(a,b){return new c.fn.init(a,b)};c.isWindow=function(a){return null!=a&&a==a.window},c.type=function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?e[g.call(a)]||"object":typeof a},c.isArray=Array.isArray||function(a){return"array"===c.type(a)},c.isPlainObject=function(a){var b;if(!a||"object"!==c.type(a)||a.nodeType||c.isWindow(a))return!1;try{if(a.constructor&&!f.call(a,"constructor")&&!f.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(d){return!1}for(b in a);return void 0===b||f.call(a,b)},c.each=function(a,c,d){var e,f=0,g=a.length,h=b(a);if(d){if(h)for(;g>f&&(e=c.apply(a[f],d),e!==!1);f++);else for(f in a)if(e=c.apply(a[f],d),e===!1)break}else if(h)for(;g>f&&(e=c.call(a[f],f,a[f]),e!==!1);f++);else for(f in a)if(e=c.call(a[f],f,a[f]),e===!1)break;return a},c.data=function(a,b,e){if(void 0===e){var f=a[c.expando],g=f&&d[f];if(void 0===b)return g;if(g&&b in g)return g[b]}else if(void 0!==b){var f=a[c.expando]||(a[c.expando]=++c.uuid);return d[f]=d[f]||{},d[f][b]=e,e}},c.removeData=function(a,b){var e=a[c.expando],f=e&&d[e];f&&c.each(b,function(a,b){delete f[b]})},c.extend=function(){var a,b,d,e,f,g,h=arguments[0]||{},i=1,j=arguments.length,k=!1;for("boolean"==typeof h&&(k=h,h=arguments[i]||{},i++),"object"!=typeof h&&"function"!==c.type(h)&&(h={}),i===j&&(h=this,i--);j>i;i++)if(null!=(f=arguments[i]))for(e in f)a=h[e],d=f[e],h!==d&&(k&&d&&(c.isPlainObject(d)||(b=c.isArray(d)))?(b?(b=!1,g=a&&c.isArray(a)?a:[]):g=a&&c.isPlainObject(a)?a:{},h[e]=c.extend(k,g,d)):void 0!==d&&(h[e]=d));return h},c.queue=function(a,d,e){function f(a,c){var d=c||[];return null!=a&&(b(Object(a))?!function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;)a[e++]=b[d++];if(c!==c)for(;void 0!==b[d];)a[e++]=b[d++];return a.length=e,a}(d,"string"==typeof a?[a]:a):[].push.call(d,a)),d}if(a){d=(d||"fx")+"queue";var g=c.data(a,d);return e?(!g||c.isArray(e)?g=c.data(a,d,f(e)):g.push(e),g):g||[]}},c.dequeue=function(a,b){c.each(a.nodeType?[a]:a,function(a,d){b=b||"fx";var e=c.queue(d,b),f=e.shift();"inprogress"===f&&(f=e.shift()),f&&("fx"===b&&e.unshift("inprogress"),f.call(d,function(){c.dequeue(d,b)}))})},c.fn=c.prototype={init:function(a){if(a.nodeType)return this[0]=a,this;throw new Error("Not a DOM node.")},offset:function(){var b=this[0].getBoundingClientRect?this[0].getBoundingClientRect():{top:0,left:0};return{top:b.top+(a.pageYOffset||document.scrollTop||0)-(document.clientTop||0),left:b.left+(a.pageXOffset||document.scrollLeft||0)-(document.clientLeft||0)}},position:function(){function a(){for(var a=this.offsetParent||document;a&&"html"===!a.nodeType.toLowerCase&&"static"===a.style.position;)a=a.offsetParent;return a||document}var b=this[0],a=a.apply(b),d=this.offset(),e=/^(?:body|html)$/i.test(a.nodeName)?{top:0,left:0}:c(a).offset();return d.top-=parseFloat(b.style.marginTop)||0,d.left-=parseFloat(b.style.marginLeft)||0,a.style&&(e.top+=parseFloat(a.style.borderTopWidth)||0,e.left+=parseFloat(a.style.borderLeftWidth)||0),{top:d.top-e.top,left:d.left-e.left}}};var d={};c.expando="velocity"+(new Date).getTime(),c.uuid=0;for(var e={},f=e.hasOwnProperty,g=e.toString,h="Boolean Number String Function Array Date RegExp Object Error".split(" "),i=0;i<h.length;i++)e["[object "+h[i]+"]"]=h[i].toLowerCase();c.fn.init.prototype=c.fn,a.Velocity={Utilities:c}}}(window),function(a){"object"==typeof module&&"object"==typeof module.exports?module.exports=a():"function"==typeof define&&define.amd?define(a):a()}(function(){return function(a,b,c,d){function e(a){for(var b=-1,c=a?a.length:0,d=[];++b<c;){var e=a[b];e&&d.push(e)}return d}function f(a){return p.isWrapped(a)?a=[].slice.call(a):p.isNode(a)&&(a=[a]),a}function g(a){var b=m.data(a,"velocity");return null===b?d:b}function h(a){return function(b){return Math.round(b*a)*(1/a)}}function i(a,c,d,e){function f(a,b){return 1-3*b+3*a}function g(a,b){return 3*b-6*a}function h(a){return 3*a}function i(a,b,c){return((f(b,c)*a+g(b,c))*a+h(b))*a}function j(a,b,c){return 3*f(b,c)*a*a+2*g(b,c)*a+h(b)}function k(b,c){for(var e=0;p>e;++e){var f=j(c,a,d);if(0===f)return c;var g=i(c,a,d)-b;c-=g/f}return c}function l(){for(var b=0;t>b;++b)x[b]=i(b*u,a,d)}function m(b,c,e){var f,g,h=0;do g=c+(e-c)/2,f=i(g,a,d)-b,f>0?e=g:c=g;while(Math.abs(f)>r&&++h<s);return g}function n(b){for(var c=0,e=1,f=t-1;e!=f&&x[e]<=b;++e)c+=u;--e;var g=(b-x[e])/(x[e+1]-x[e]),h=c+g*u,i=j(h,a,d);return i>=q?k(b,h):0==i?h:m(b,c,c+u)}function o(){y=!0,(a!=c||d!=e)&&l()}var p=4,q=.001,r=1e-7,s=10,t=11,u=1/(t-1),v="Float32Array"in b;if(4!==arguments.length)return!1;for(var w=0;4>w;++w)if("number"!=typeof arguments[w]||isNaN(arguments[w])||!isFinite(arguments[w]))return!1;a=Math.min(a,1),d=Math.min(d,1),a=Math.max(a,0),d=Math.max(d,0);var x=v?new Float32Array(t):new Array(t),y=!1,z=function(b){return y||o(),a===c&&d===e?b:0===b?0:1===b?1:i(n(b),c,e)};z.getControlPoints=function(){return[{x:a,y:c},{x:d,y:e}]};var A="generateBezier("+[a,c,d,e]+")";return z.toString=function(){return A},z}function j(a,b){var c=a;return p.isString(a)?t.Easings[a]||(c=!1):c=p.isArray(a)&&1===a.length?h.apply(null,a):p.isArray(a)&&2===a.length?u.apply(null,a.concat([b])):p.isArray(a)&&4===a.length?i.apply(null,a):!1,c===!1&&(c=t.Easings[t.defaults.easing]?t.defaults.easing:s),c}function k(a){if(a){var b=(new Date).getTime(),c=t.State.calls.length;c>1e4&&(t.State.calls=e(t.State.calls));for(var f=0;c>f;f++)if(t.State.calls[f]){var h=t.State.calls[f],i=h[0],j=h[2],n=h[3],o=!!n,q=null;n||(n=t.State.calls[f][3]=b-16);for(var r=Math.min((b-n)/j.duration,1),s=0,u=i.length;u>s;s++){var w=i[s],y=w.element;if(g(y)){var z=!1;if(j.display!==d&&null!==j.display&&"none"!==j.display){if("flex"===j.display){var A=["-webkit-box","-moz-box","-ms-flexbox","-webkit-flex"];m.each(A,function(a,b){v.setPropertyValue(y,"display",b)})}v.setPropertyValue(y,"display",j.display)}j.visibility!==d&&"hidden"!==j.visibility&&v.setPropertyValue(y,"visibility",j.visibility);for(var B in w)if("element"!==B){var C,D=w[B],E=p.isString(D.easing)?t.Easings[D.easing]:D.easing;if(1===r)C=D.endValue;else{var F=D.endValue-D.startValue;if(C=D.startValue+F*E(r,j,F),!o&&C===D.currentValue)continue}if(D.currentValue=C,"tween"===B)q=C;else{if(v.Hooks.registered[B]){var G=v.Hooks.getRoot(B),H=g(y).rootPropertyValueCache[G];H&&(D.rootPropertyValue=H)}var I=v.setPropertyValue(y,B,D.currentValue+(0===parseFloat(C)?"":D.unitType),D.rootPropertyValue,D.scrollData);v.Hooks.registered[B]&&(g(y).rootPropertyValueCache[G]=v.Normalizations.registered[G]?v.Normalizations.registered[G]("extract",null,I[1]):I[1]),"transform"===I[0]&&(z=!0)}}j.mobileHA&&g(y).transformCache.translate3d===d&&(g(y).transformCache.translate3d="(0px, 0px, 0px)",z=!0),z&&v.flushTransformCache(y)}}j.display!==d&&"none"!==j.display&&(t.State.calls[f][2].display=!1),j.visibility!==d&&"hidden"!==j.visibility&&(t.State.calls[f][2].visibility=!1),j.progress&&j.progress.call(h[1],h[1],r,Math.max(0,n+j.duration-b),n,q),1===r&&l(f)}}t.State.isTicking&&x(k)}function l(a,b){if(!t.State.calls[a])return!1;for(var c=t.State.calls[a][0],e=t.State.calls[a][1],f=t.State.calls[a][2],h=t.State.calls[a][4],i=!1,j=0,k=c.length;k>j;j++){var l=c[j].element;if(b||f.loop||("none"===f.display&&v.setPropertyValue(l,"display",f.display),"hidden"===f.visibility&&v.setPropertyValue(l,"visibility",f.visibility)),f.loop!==!0&&(m.queue(l)[1]===d||!/\.velocityQueueEntryFlag/i.test(m.queue(l)[1]))&&g(l)){g(l).isAnimating=!1,g(l).rootPropertyValueCache={};var n=!1;m.each(v.Lists.transforms3D,function(a,b){var c=/^scale/.test(b)?1:0,e=g(l).transformCache[b];g(l).transformCache[b]!==d&&new RegExp("^\\("+c+"[^.]").test(e)&&(n=!0,delete g(l).transformCache[b])}),f.mobileHA&&(n=!0,delete g(l).transformCache.translate3d),n&&v.flushTransformCache(l),v.Values.removeClass(l,"velocity-animating")}if(!b&&f.complete&&!f.loop&&j===k-1)try{f.complete.call(e,e)}catch(o){setTimeout(function(){throw o},1)}h&&f.loop!==!0&&h(e),g(l)&&f.loop===!0&&!b&&(m.each(g(l).tweensContainer,function(a,b){/^rotate/.test(a)&&360===parseFloat(b.endValue)&&(b.endValue=0,b.startValue=360),/^backgroundPosition/.test(a)&&100===parseFloat(b.endValue)&&"%"===b.unitType&&(b.endValue=0,b.startValue=100)}),t(l,"reverse",{loop:!0,delay:f.delay})),f.queue!==!1&&m.dequeue(l,f.queue)}t.State.calls[a]=!1;for(var p=0,q=t.State.calls.length;q>p;p++)if(t.State.calls[p]!==!1){i=!0;break}i===!1&&(t.State.isTicking=!1,delete t.State.calls,t.State.calls=[])}var m,n=function(){if(c.documentMode)return c.documentMode;for(var a=7;a>4;a--){var b=c.createElement("div");if(b.innerHTML="<!--[if IE "+a+"]><span></span><![endif]-->",b.getElementsByTagName("span").length)return b=null,a}return d}(),o=function(){var a=0;return b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||function(b){var c,d=(new Date).getTime();return c=Math.max(0,16-(d-a)),a=d+c,setTimeout(function(){b(d+c)},c)}}(),p={isString:function(a){return"string"==typeof a},isArray:Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},isFunction:function(a){return"[object Function]"===Object.prototype.toString.call(a)},isNode:function(a){return a&&a.nodeType},isNodeList:function(a){return"object"==typeof a&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(a))&&a.length!==d&&(0===a.length||"object"==typeof a[0]&&a[0].nodeType>0)},isWrapped:function(a){return a&&(a.jquery||b.Zepto&&b.Zepto.zepto.isZ(a))},isSVG:function(a){return b.SVGElement&&a instanceof b.SVGElement},isEmptyObject:function(a){for(var b in a)return!1;return!0}},q=!1;if(a.fn&&a.fn.jquery?(m=a,q=!0):m=b.Velocity.Utilities,8>=n&&!q)throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");if(7>=n)return void(jQuery.fn.velocity=jQuery.fn.animate);var r=400,s="swing",t={State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),isChrome:b.chrome,isFirefox:/Firefox/i.test(navigator.userAgent),prefixElement:c.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:m,Redirects:{},Easings:{},Promise:b.Promise,defaults:{queue:"",duration:r,easing:s,begin:d,complete:d,progress:d,display:d,visibility:d,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},init:function(a){m.data(a,"velocity",{isSVG:p.isSVG(a),isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}})},hook:null,mock:!1,version:{major:1,minor:2,patch:2},debug:!1};b.pageYOffset!==d?(t.State.scrollAnchor=b,t.State.scrollPropertyLeft="pageXOffset",t.State.scrollPropertyTop="pageYOffset"):(t.State.scrollAnchor=c.documentElement||c.body.parentNode||c.body,t.State.scrollPropertyLeft="scrollLeft",t.State.scrollPropertyTop="scrollTop");var u=function(){function a(a){return-a.tension*a.x-a.friction*a.v}function b(b,c,d){var e={x:b.x+d.dx*c,v:b.v+d.dv*c,tension:b.tension,friction:b.friction};return{dx:e.v,dv:a(e)}}function c(c,d){var e={dx:c.v,dv:a(c)},f=b(c,.5*d,e),g=b(c,.5*d,f),h=b(c,d,g),i=1/6*(e.dx+2*(f.dx+g.dx)+h.dx),j=1/6*(e.dv+2*(f.dv+g.dv)+h.dv);return c.x=c.x+i*d,c.v=c.v+j*d,c}return function d(a,b,e){var f,g,h,i={x:-1,v:0,tension:null,friction:null},j=[0],k=0,l=1e-4,m=.016;for(a=parseFloat(a)||500,b=parseFloat(b)||20,e=e||null,i.tension=a,i.friction=b,f=null!==e,f?(k=d(a,b),g=k/e*m):g=m;;)if(h=c(h||i,g),j.push(1+h.x),k+=16,!(Math.abs(h.x)>l&&Math.abs(h.v)>l))break;return f?function(a){return j[a*(j.length-1)|0]}:k}}();t.Easings={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},spring:function(a){return 1-Math.cos(4.5*a*Math.PI)*Math.exp(6*-a)}},m.each([["ease",[.25,.1,.25,1]],["ease-in",[.42,0,1,1]],["ease-out",[0,0,.58,1]],["ease-in-out",[.42,0,.58,1]],["easeInSine",[.47,0,.745,.715]],["easeOutSine",[.39,.575,.565,1]],["easeInOutSine",[.445,.05,.55,.95]],["easeInQuad",[.55,.085,.68,.53]],["easeOutQuad",[.25,.46,.45,.94]],["easeInOutQuad",[.455,.03,.515,.955]],["easeInCubic",[.55,.055,.675,.19]],["easeOutCubic",[.215,.61,.355,1]],["easeInOutCubic",[.645,.045,.355,1]],["easeInQuart",[.895,.03,.685,.22]],["easeOutQuart",[.165,.84,.44,1]],["easeInOutQuart",[.77,0,.175,1]],["easeInQuint",[.755,.05,.855,.06]],["easeOutQuint",[.23,1,.32,1]],["easeInOutQuint",[.86,0,.07,1]],["easeInExpo",[.95,.05,.795,.035]],["easeOutExpo",[.19,1,.22,1]],["easeInOutExpo",[1,0,0,1]],["easeInCirc",[.6,.04,.98,.335]],["easeOutCirc",[.075,.82,.165,1]],["easeInOutCirc",[.785,.135,.15,.86]]],function(a,b){t.Easings[b[0]]=i.apply(null,b[1])});var v=t.CSS={RegEx:{isHex:/^#([A-f\d]{3}){1,2}$/i,valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Lists:{colors:["fill","stroke","stopColor","color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],transformsBase:["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"],transforms3D:["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]},Hooks:{templates:{textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0px"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){for(var a=0;a<v.Lists.colors.length;a++){var b="color"===v.Lists.colors[a]?"0 0 0 1":"255 255 255 1";v.Hooks.templates[v.Lists.colors[a]]=["Red Green Blue Alpha",b]}var c,d,e;if(n)for(c in v.Hooks.templates){d=v.Hooks.templates[c],e=d[0].split(" ");var f=d[1].match(v.RegEx.valueSplit);"Color"===e[0]&&(e.push(e.shift()),f.push(f.shift()),v.Hooks.templates[c]=[e.join(" "),f.join(" ")])}for(c in v.Hooks.templates){d=v.Hooks.templates[c],e=d[0].split(" ");for(var a in e){var g=c+e[a],h=a;v.Hooks.registered[g]=[c,h]}}},getRoot:function(a){var b=v.Hooks.registered[a];return b?b[0]:a},cleanRootPropertyValue:function(a,b){return v.RegEx.valueUnwrap.test(b)&&(b=b.match(v.RegEx.valueUnwrap)[1]),v.Values.isCSSNullValue(b)&&(b=v.Hooks.templates[a][1]),b},extractValue:function(a,b){var c=v.Hooks.registered[a];if(c){var d=c[0],e=c[1];return b=v.Hooks.cleanRootPropertyValue(d,b),b.toString().match(v.RegEx.valueSplit)[e]}return b},injectValue:function(a,b,c){var d=v.Hooks.registered[a];if(d){var e,f,g=d[0],h=d[1];return c=v.Hooks.cleanRootPropertyValue(g,c),e=c.toString().match(v.RegEx.valueSplit),e[h]=b,f=e.join(" ")}return c}},Normalizations:{registered:{clip:function(a,b,c){switch(a){case"name":return"clip";case"extract":var d;return v.RegEx.wrappedValueAlreadyExtracted.test(c)?d=c:(d=c.toString().match(v.RegEx.valueUnwrap),d=d?d[1].replace(/,(\s+)?/g," "):c),d;case"inject":return"rect("+c+")"}},blur:function(a,b,c){switch(a){case"name":return t.State.isFirefox?"filter":"-webkit-filter";case"extract":var d=parseFloat(c);if(!d&&0!==d){var e=c.toString().match(/blur\(([0-9]+[A-z]+)\)/i);d=e?e[1]:0}return d;case"inject":return parseFloat(c)?"blur("+c+")":"none"}},opacity:function(a,b,c){if(8>=n)switch(a){case"name":return"filter";case"extract":var d=c.toString().match(/alpha\(opacity=(.*)\)/i);return c=d?d[1]/100:1;case"inject":return b.style.zoom=1,parseFloat(c)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(c),10)+")"}else switch(a){case"name":return"opacity";case"extract":return c;case"inject":return c}}},register:function(){9>=n||t.State.isGingerbread||(v.Lists.transformsBase=v.Lists.transformsBase.concat(v.Lists.transforms3D));for(var a=0;a<v.Lists.transformsBase.length;a++)!function(){var b=v.Lists.transformsBase[a];v.Normalizations.registered[b]=function(a,c,e){switch(a){case"name":return"transform";case"extract":return g(c)===d||g(c).transformCache[b]===d?/^scale/i.test(b)?1:0:g(c).transformCache[b].replace(/[()]/g,"");case"inject":var f=!1;switch(b.substr(0,b.length-1)){case"translate":f=!/(%|px|em|rem|vw|vh|\d)$/i.test(e);break;case"scal":case"scale":t.State.isAndroid&&g(c).transformCache[b]===d&&1>e&&(e=1),f=!/(\d)$/i.test(e);break;case"skew":f=!/(deg|\d)$/i.test(e);break;case"rotate":f=!/(deg|\d)$/i.test(e)}return f||(g(c).transformCache[b]="("+e+")"),g(c).transformCache[b]}}}();for(var a=0;a<v.Lists.colors.length;a++)!function(){var b=v.Lists.colors[a];v.Normalizations.registered[b]=function(a,c,e){switch(a){case"name":return b;case"extract":var f;if(v.RegEx.wrappedValueAlreadyExtracted.test(e))f=e;else{var g,h={black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",red:"rgb(255, 0, 0)",white:"rgb(255, 255, 255)"};/^[A-z]+$/i.test(e)?g=h[e]!==d?h[e]:h.black:v.RegEx.isHex.test(e)?g="rgb("+v.Values.hexToRgb(e).join(" ")+")":/^rgba?\(/i.test(e)||(g=h.black),f=(g||e).toString().match(v.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=n||3!==f.split(" ").length||(f+=" 1"),f;case"inject":return 8>=n?4===e.split(" ").length&&(e=e.split(/\s+/).slice(0,3).join(" ")):3===e.split(" ").length&&(e+=" 1"),(8>=n?"rgb":"rgba")+"("+e.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(a){return a.replace(/-(\w)/g,function(a,b){return b.toUpperCase()})},SVGAttribute:function(a){var b="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";return(n||t.State.isAndroid&&!t.State.isChrome)&&(b+="|transform"),new RegExp("^("+b+")$","i").test(a)},prefixCheck:function(a){if(t.State.prefixMatches[a])return[t.State.prefixMatches[a],!0];for(var b=["","Webkit","Moz","ms","O"],c=0,d=b.length;d>c;c++){var e;if(e=0===c?a:b[c]+a.replace(/^\w/,function(a){return a.toUpperCase()}),p.isString(t.State.prefixElement.style[e]))return t.State.prefixMatches[a]=e,[e,!0]}return[a,!1]}},Values:{hexToRgb:function(a){var b,c=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,d=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;return a=a.replace(c,function(a,b,c,d){return b+b+c+c+d+d}),b=d.exec(a),b?[parseInt(b[1],16),parseInt(b[2],16),parseInt(b[3],16)]:[0,0,0]},isCSSNullValue:function(a){return 0==a||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(a)},getUnitType:function(a){return/^(rotate|skew)/i.test(a)?"deg":/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(a)?"":"px"},getDisplayType:function(a){var b=a&&a.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(b)?"inline":/^(li)$/i.test(b)?"list-item":/^(tr)$/i.test(b)?"table-row":/^(table)$/i.test(b)?"table":/^(tbody)$/i.test(b)?"table-row-group":"block"},addClass:function(a,b){a.classList?a.classList.add(b):a.className+=(a.className.length?" ":"")+b},removeClass:function(a,b){a.classList?a.classList.remove(b):a.className=a.className.toString().replace(new RegExp("(^|\\s)"+b.split(" ").join("|")+"(\\s|$)","gi")," ")}},getPropertyValue:function(a,c,e,f){function h(a,c){function e(){j&&v.setPropertyValue(a,"display","none")}var i=0;if(8>=n)i=m.css(a,c);else{var j=!1;if(/^(width|height)$/.test(c)&&0===v.getPropertyValue(a,"display")&&(j=!0,v.setPropertyValue(a,"display",v.Values.getDisplayType(a))),!f){if("height"===c&&"border-box"!==v.getPropertyValue(a,"boxSizing").toString().toLowerCase()){var k=a.offsetHeight-(parseFloat(v.getPropertyValue(a,"borderTopWidth"))||0)-(parseFloat(v.getPropertyValue(a,"borderBottomWidth"))||0)-(parseFloat(v.getPropertyValue(a,"paddingTop"))||0)-(parseFloat(v.getPropertyValue(a,"paddingBottom"))||0);return e(),k}if("width"===c&&"border-box"!==v.getPropertyValue(a,"boxSizing").toString().toLowerCase()){var l=a.offsetWidth-(parseFloat(v.getPropertyValue(a,"borderLeftWidth"))||0)-(parseFloat(v.getPropertyValue(a,"borderRightWidth"))||0)-(parseFloat(v.getPropertyValue(a,"paddingLeft"))||0)-(parseFloat(v.getPropertyValue(a,"paddingRight"))||0);return e(),l}}var o;o=g(a)===d?b.getComputedStyle(a,null):g(a).computedStyle?g(a).computedStyle:g(a).computedStyle=b.getComputedStyle(a,null),"borderColor"===c&&(c="borderTopColor"),i=9===n&&"filter"===c?o.getPropertyValue(c):o[c],(""===i||null===i)&&(i=a.style[c]),e()}if("auto"===i&&/^(top|right|bottom|left)$/i.test(c)){var p=h(a,"position");("fixed"===p||"absolute"===p&&/top|left/i.test(c))&&(i=m(a).position()[c]+"px")}return i}var i;if(v.Hooks.registered[c]){var j=c,k=v.Hooks.getRoot(j);e===d&&(e=v.getPropertyValue(a,v.Names.prefixCheck(k)[0])),v.Normalizations.registered[k]&&(e=v.Normalizations.registered[k]("extract",a,e)),i=v.Hooks.extractValue(j,e)}else if(v.Normalizations.registered[c]){var l,o;l=v.Normalizations.registered[c]("name",a),"transform"!==l&&(o=h(a,v.Names.prefixCheck(l)[0]),v.Values.isCSSNullValue(o)&&v.Hooks.templates[c]&&(o=v.Hooks.templates[c][1])),i=v.Normalizations.registered[c]("extract",a,o)}if(!/^[\d-]/.test(i))if(g(a)&&g(a).isSVG&&v.Names.SVGAttribute(c))if(/^(height|width)$/i.test(c))try{i=a.getBBox()[c]}catch(p){i=0}else i=a.getAttribute(c);else i=h(a,v.Names.prefixCheck(c)[0]);return v.Values.isCSSNullValue(i)&&(i=0),t.debug>=2&&console.log("Get "+c+": "+i),i},setPropertyValue:function(a,c,d,e,f){var h=c;if("scroll"===c)f.container?f.container["scroll"+f.direction]=d:"Left"===f.direction?b.scrollTo(d,f.alternateValue):b.scrollTo(f.alternateValue,d);else if(v.Normalizations.registered[c]&&"transform"===v.Normalizations.registered[c]("name",a))v.Normalizations.registered[c]("inject",a,d),h="transform",d=g(a).transformCache[c];else{if(v.Hooks.registered[c]){var i=c,j=v.Hooks.getRoot(c);e=e||v.getPropertyValue(a,j),d=v.Hooks.injectValue(i,d,e),c=j}if(v.Normalizations.registered[c]&&(d=v.Normalizations.registered[c]("inject",a,d),c=v.Normalizations.registered[c]("name",a)),h=v.Names.prefixCheck(c)[0],8>=n)try{a.style[h]=d}catch(k){t.debug&&console.log("Browser does not support ["+d+"] for ["+h+"]")}else g(a)&&g(a).isSVG&&v.Names.SVGAttribute(c)?a.setAttribute(c,d):a.style[h]=d;t.debug>=2&&console.log("Set "+c+" ("+h+"): "+d)}return[h,d]},flushTransformCache:function(a){function b(b){return parseFloat(v.getPropertyValue(a,b))}var c="";if((n||t.State.isAndroid&&!t.State.isChrome)&&g(a).isSVG){var d={translate:[b("translateX"),b("translateY")],skewX:[b("skewX")],skewY:[b("skewY")],scale:1!==b("scale")?[b("scale"),b("scale")]:[b("scaleX"),b("scaleY")],rotate:[b("rotateZ"),0,0]};m.each(g(a).transformCache,function(a){/^translate/i.test(a)?a="translate":/^scale/i.test(a)?a="scale":/^rotate/i.test(a)&&(a="rotate"),d[a]&&(c+=a+"("+d[a].join(" ")+") ",delete d[a])})}else{var e,f;m.each(g(a).transformCache,function(b){return e=g(a).transformCache[b],"transformPerspective"===b?(f=e,!0):(9===n&&"rotateZ"===b&&(b="rotate"),void(c+=b+e+" "))}),f&&(c="perspective"+f+" "+c)}v.setPropertyValue(a,"transform",c)}};v.Hooks.register(),v.Normalizations.register(),t.hook=function(a,b,c){var e=d;return a=f(a),m.each(a,function(a,f){if(g(f)===d&&t.init(f),c===d)e===d&&(e=t.CSS.getPropertyValue(f,b));else{var h=t.CSS.setPropertyValue(f,b,c);"transform"===h[0]&&t.CSS.flushTransformCache(f),e=h}}),e};var w=function(){function a(){return h?B.promise||null:i}function e(){function a(){function a(a,b){var c=d,e=d,g=d;return p.isArray(a)?(c=a[0],!p.isArray(a[1])&&/^[\d-]/.test(a[1])||p.isFunction(a[1])||v.RegEx.isHex.test(a[1])?g=a[1]:(p.isString(a[1])&&!v.RegEx.isHex.test(a[1])||p.isArray(a[1]))&&(e=b?a[1]:j(a[1],h.duration),a[2]!==d&&(g=a[2]))):c=a,b||(e=e||h.easing),p.isFunction(c)&&(c=c.call(f,y,x)),p.isFunction(g)&&(g=g.call(f,y,x)),[c||0,e,g]}function l(a,b){var c,d;return d=(b||"0").toString().toLowerCase().replace(/[%A-z]+$/,function(a){return c=a,""}),c||(c=v.Values.getUnitType(a)),[d,c]}function n(){var a={myParent:f.parentNode||c.body,position:v.getPropertyValue(f,"position"),fontSize:v.getPropertyValue(f,"fontSize")},d=a.position===I.lastPosition&&a.myParent===I.lastParent,e=a.fontSize===I.lastFontSize;I.lastParent=a.myParent,I.lastPosition=a.position,I.lastFontSize=a.fontSize;var h=100,i={};if(e&&d)i.emToPx=I.lastEmToPx,i.percentToPxWidth=I.lastPercentToPxWidth,i.percentToPxHeight=I.lastPercentToPxHeight;else{var j=g(f).isSVG?c.createElementNS("http://www.w3.org/2000/svg","rect"):c.createElement("div");t.init(j),a.myParent.appendChild(j),m.each(["overflow","overflowX","overflowY"],function(a,b){t.CSS.setPropertyValue(j,b,"hidden")}),t.CSS.setPropertyValue(j,"position",a.position),t.CSS.setPropertyValue(j,"fontSize",a.fontSize),t.CSS.setPropertyValue(j,"boxSizing","content-box"),m.each(["minWidth","maxWidth","width","minHeight","maxHeight","height"],function(a,b){t.CSS.setPropertyValue(j,b,h+"%")}),t.CSS.setPropertyValue(j,"paddingLeft",h+"em"),i.percentToPxWidth=I.lastPercentToPxWidth=(parseFloat(v.getPropertyValue(j,"width",null,!0))||1)/h,i.percentToPxHeight=I.lastPercentToPxHeight=(parseFloat(v.getPropertyValue(j,"height",null,!0))||1)/h,i.emToPx=I.lastEmToPx=(parseFloat(v.getPropertyValue(j,"paddingLeft"))||1)/h,a.myParent.removeChild(j)}return null===I.remToPx&&(I.remToPx=parseFloat(v.getPropertyValue(c.body,"fontSize"))||16),null===I.vwToPx&&(I.vwToPx=parseFloat(b.innerWidth)/100,I.vhToPx=parseFloat(b.innerHeight)/100),i.remToPx=I.remToPx,i.vwToPx=I.vwToPx,i.vhToPx=I.vhToPx,t.debug>=1&&console.log("Unit ratios: "+JSON.stringify(i),f),i}if(h.begin&&0===y)try{h.begin.call(o,o)}catch(r){setTimeout(function(){throw r},1)}if("scroll"===C){var u,w,z,A=/^x$/i.test(h.axis)?"Left":"Top",D=parseFloat(h.offset)||0;h.container?p.isWrapped(h.container)||p.isNode(h.container)?(h.container=h.container[0]||h.container,u=h.container["scroll"+A],z=u+m(f).position()[A.toLowerCase()]+D):h.container=null:(u=t.State.scrollAnchor[t.State["scrollProperty"+A]],w=t.State.scrollAnchor[t.State["scrollProperty"+("Left"===A?"Top":"Left")]],z=m(f).offset()[A.toLowerCase()]+D),i={scroll:{rootPropertyValue:!1,startValue:u,currentValue:u,endValue:z,unitType:"",easing:h.easing,scrollData:{container:h.container,direction:A,alternateValue:w}},element:f},t.debug&&console.log("tweensContainer (scroll): ",i.scroll,f)}else if("reverse"===C){if(!g(f).tweensContainer)return void m.dequeue(f,h.queue);"none"===g(f).opts.display&&(g(f).opts.display="auto"),"hidden"===g(f).opts.visibility&&(g(f).opts.visibility="visible"),g(f).opts.loop=!1,g(f).opts.begin=null,g(f).opts.complete=null,s.easing||delete h.easing,s.duration||delete h.duration,h=m.extend({},g(f).opts,h);var E=m.extend(!0,{},g(f).tweensContainer);for(var F in E)if("element"!==F){var G=E[F].startValue;E[F].startValue=E[F].currentValue=E[F].endValue,E[F].endValue=G,p.isEmptyObject(s)||(E[F].easing=h.easing),t.debug&&console.log("reverse tweensContainer ("+F+"): "+JSON.stringify(E[F]),f)}i=E}else if("start"===C){var E;g(f).tweensContainer&&g(f).isAnimating===!0&&(E=g(f).tweensContainer),m.each(q,function(b,c){if(RegExp("^"+v.Lists.colors.join("$|^")+"$").test(b)){var e=a(c,!0),f=e[0],g=e[1],h=e[2];if(v.RegEx.isHex.test(f)){for(var i=["Red","Green","Blue"],j=v.Values.hexToRgb(f),k=h?v.Values.hexToRgb(h):d,l=0;l<i.length;l++){var m=[j[l]];g&&m.push(g),k!==d&&m.push(k[l]),q[b+i[l]]=m}delete q[b]}}});for(var H in q){var K=a(q[H]),L=K[0],M=K[1],N=K[2];H=v.Names.camelCase(H);var O=v.Hooks.getRoot(H),P=!1;if(g(f).isSVG||"tween"===O||v.Names.prefixCheck(O)[1]!==!1||v.Normalizations.registered[O]!==d){(h.display!==d&&null!==h.display&&"none"!==h.display||h.visibility!==d&&"hidden"!==h.visibility)&&/opacity|filter/.test(H)&&!N&&0!==L&&(N=0),h._cacheValues&&E&&E[H]?(N===d&&(N=E[H].endValue+E[H].unitType),P=g(f).rootPropertyValueCache[O]):v.Hooks.registered[H]?N===d?(P=v.getPropertyValue(f,O),N=v.getPropertyValue(f,H,P)):P=v.Hooks.templates[O][1]:N===d&&(N=v.getPropertyValue(f,H));var Q,R,S,T=!1;if(Q=l(H,N),N=Q[0],S=Q[1],Q=l(H,L),L=Q[0].replace(/^([+-\/*])=/,function(a,b){return T=b,""}),R=Q[1],N=parseFloat(N)||0,L=parseFloat(L)||0,"%"===R&&(/^(fontSize|lineHeight)$/.test(H)?(L/=100,R="em"):/^scale/.test(H)?(L/=100,R=""):/(Red|Green|Blue)$/i.test(H)&&(L=L/100*255,R="")),/[\/*]/.test(T))R=S;else if(S!==R&&0!==N)if(0===L)R=S;else{e=e||n();var U=/margin|padding|left|right|width|text|word|letter/i.test(H)||/X$/.test(H)||"x"===H?"x":"y";switch(S){case"%":N*="x"===U?e.percentToPxWidth:e.percentToPxHeight;break;case"px":break;default:N*=e[S+"ToPx"]}switch(R){case"%":N*=1/("x"===U?e.percentToPxWidth:e.percentToPxHeight);break;case"px":break;default:N*=1/e[R+"ToPx"]}}switch(T){case"+":L=N+L;break;case"-":L=N-L;break;case"*":L=N*L;break;case"/":L=N/L}i[H]={rootPropertyValue:P,startValue:N,currentValue:N,endValue:L,unitType:R,easing:M},t.debug&&console.log("tweensContainer ("+H+"): "+JSON.stringify(i[H]),f)}else t.debug&&console.log("Skipping ["+O+"] due to a lack of browser support.")}i.element=f}i.element&&(v.Values.addClass(f,"velocity-animating"),J.push(i),""===h.queue&&(g(f).tweensContainer=i,g(f).opts=h),g(f).isAnimating=!0,y===x-1?(t.State.calls.push([J,o,h,null,B.resolver]),t.State.isTicking===!1&&(t.State.isTicking=!0,k())):y++)}var e,f=this,h=m.extend({},t.defaults,s),i={};switch(g(f)===d&&t.init(f),parseFloat(h.delay)&&h.queue!==!1&&m.queue(f,h.queue,function(a){t.velocityQueueEntryFlag=!0,g(f).delayTimer={setTimeout:setTimeout(a,parseFloat(h.delay)),next:a}}),h.duration.toString().toLowerCase()){case"fast":h.duration=200;break;case"normal":h.duration=r;break;case"slow":h.duration=600;break;default:h.duration=parseFloat(h.duration)||1}t.mock!==!1&&(t.mock===!0?h.duration=h.delay=1:(h.duration*=parseFloat(t.mock)||1,h.delay*=parseFloat(t.mock)||1)),h.easing=j(h.easing,h.duration),h.begin&&!p.isFunction(h.begin)&&(h.begin=null),h.progress&&!p.isFunction(h.progress)&&(h.progress=null),h.complete&&!p.isFunction(h.complete)&&(h.complete=null),h.display!==d&&null!==h.display&&(h.display=h.display.toString().toLowerCase(),"auto"===h.display&&(h.display=t.CSS.Values.getDisplayType(f))),h.visibility!==d&&null!==h.visibility&&(h.visibility=h.visibility.toString().toLowerCase()),h.mobileHA=h.mobileHA&&t.State.isMobile&&!t.State.isGingerbread,h.queue===!1?h.delay?setTimeout(a,h.delay):a():m.queue(f,h.queue,function(b,c){return c===!0?(B.promise&&B.resolver(o),!0):(t.velocityQueueEntryFlag=!0,void a(b))}),""!==h.queue&&"fx"!==h.queue||"inprogress"===m.queue(f)[0]||m.dequeue(f)}var h,i,n,o,q,s,u=arguments[0]&&(arguments[0].p||m.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names||p.isString(arguments[0].properties));if(p.isWrapped(this)?(h=!1,n=0,o=this,i=this):(h=!0,n=1,o=u?arguments[0].elements||arguments[0].e:arguments[0]),o=f(o)){u?(q=arguments[0].properties||arguments[0].p,s=arguments[0].options||arguments[0].o):(q=arguments[n],s=arguments[n+1]);var x=o.length,y=0;if(!/^(stop|finish|finishAll)$/i.test(q)&&!m.isPlainObject(s)){var z=n+1;s={};for(var A=z;A<arguments.length;A++)p.isArray(arguments[A])||!/^(fast|normal|slow)$/i.test(arguments[A])&&!/^\d/.test(arguments[A])?p.isString(arguments[A])||p.isArray(arguments[A])?s.easing=arguments[A]:p.isFunction(arguments[A])&&(s.complete=arguments[A]):s.duration=arguments[A]}var B={promise:null,resolver:null,rejecter:null};h&&t.Promise&&(B.promise=new t.Promise(function(a,b){B.resolver=a,B.rejecter=b}));var C;switch(q){case"scroll":C="scroll";break;case"reverse":C="reverse";break;case"finish":case"finishAll":case"stop":m.each(o,function(a,b){g(b)&&g(b).delayTimer&&(clearTimeout(g(b).delayTimer.setTimeout),g(b).delayTimer.next&&g(b).delayTimer.next(),delete g(b).delayTimer),"finishAll"!==q||s!==!0&&!p.isString(s)||(m.each(m.queue(b,p.isString(s)?s:""),function(a,b){p.isFunction(b)&&b()}),m.queue(b,p.isString(s)?s:"",[]))});var D=[];return m.each(t.State.calls,function(a,b){b&&m.each(b[1],function(c,e){var f=s===d?"":s;return f===!0||b[2].queue===f||s===d&&b[2].queue===!1?void m.each(o,function(c,d){d===e&&((s===!0||p.isString(s))&&(m.each(m.queue(d,p.isString(s)?s:""),function(a,b){p.isFunction(b)&&b(null,!0)
}),m.queue(d,p.isString(s)?s:"",[])),"stop"===q?(g(d)&&g(d).tweensContainer&&f!==!1&&m.each(g(d).tweensContainer,function(a,b){b.endValue=b.currentValue}),D.push(a)):("finish"===q||"finishAll"===q)&&(b[2].duration=1))}):!0})}),"stop"===q&&(m.each(D,function(a,b){l(b,!0)}),B.promise&&B.resolver(o)),a();default:if(!m.isPlainObject(q)||p.isEmptyObject(q)){if(p.isString(q)&&t.Redirects[q]){var E=m.extend({},s),F=E.duration,G=E.delay||0;return E.backwards===!0&&(o=m.extend(!0,[],o).reverse()),m.each(o,function(a,b){parseFloat(E.stagger)?E.delay=G+parseFloat(E.stagger)*a:p.isFunction(E.stagger)&&(E.delay=G+E.stagger.call(b,a,x)),E.drag&&(E.duration=parseFloat(F)||(/^(callout|transition)/.test(q)?1e3:r),E.duration=Math.max(E.duration*(E.backwards?1-a/x:(a+1)/x),.75*E.duration,200)),t.Redirects[q].call(b,b,E||{},a,x,o,B.promise?B:d)}),a()}var H="Velocity: First argument ("+q+") was not a property map, a known action, or a registered redirect. Aborting.";return B.promise?B.rejecter(new Error(H)):console.log(H),a()}C="start"}var I={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPx:null,vwToPx:null,vhToPx:null},J=[];m.each(o,function(a,b){p.isNode(b)&&e.call(b)});var K,E=m.extend({},t.defaults,s);if(E.loop=parseInt(E.loop),K=2*E.loop-1,E.loop)for(var L=0;K>L;L++){var M={delay:E.delay,progress:E.progress};L===K-1&&(M.display=E.display,M.visibility=E.visibility,M.complete=E.complete),w(o,"reverse",M)}return a()}};t=m.extend(w,t),t.animate=w;var x=b.requestAnimationFrame||o;return t.State.isMobile||c.hidden===d||c.addEventListener("visibilitychange",function(){c.hidden?(x=function(a){return setTimeout(function(){a(!0)},16)},k()):x=b.requestAnimationFrame||o}),a.Velocity=t,a!==b&&(a.fn.velocity=w,a.fn.velocity.defaults=t.defaults),m.each(["Down","Up"],function(a,b){t.Redirects["slide"+b]=function(a,c,e,f,g,h){var i=m.extend({},c),j=i.begin,k=i.complete,l={height:"",marginTop:"",marginBottom:"",paddingTop:"",paddingBottom:""},n={};i.display===d&&(i.display="Down"===b?"inline"===t.CSS.Values.getDisplayType(a)?"inline-block":"block":"none"),i.begin=function(){j&&j.call(g,g);for(var c in l){n[c]=a.style[c];var d=t.CSS.getPropertyValue(a,c);l[c]="Down"===b?[d,0]:[0,d]}n.overflow=a.style.overflow,a.style.overflow="hidden"},i.complete=function(){for(var b in n)a.style[b]=n[b];k&&k.call(g,g),h&&h.resolver(g)},t(a,l,i)}}),m.each(["In","Out"],function(a,b){t.Redirects["fade"+b]=function(a,c,e,f,g,h){var i=m.extend({},c),j={opacity:"In"===b?1:0},k=i.complete;i.complete=e!==f-1?i.begin=null:function(){k&&k.call(g,g),h&&h.resolver(g)},i.display===d&&(i.display="In"===b?"auto":"none"),t(this,j,i)}}),t}(window.jQuery||window.Zepto||window,window,document)});
;
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
                        +"<div class='labelfield source'>Data Source: " + props.Source_1 + "</div></div>"
                        +"<div style='height:34px;'><a href='http://safetydata.fra.dot.gov/OfficeofSafety/publicsite/Crossing/Report.aspx?phasetype=C&rpttype=A&txtcrossingnum="+props.CROSSING+"' target='_blank' style='line-height:34px;float:left;'><div class='pdf'></div>Related Report:</a></div>",
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
	header = '<p>' + props.Name + '</p>',
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

/////////////////////////////////////
/// Populate Download data/////////
//////////////////////////////////

var dataID, dwnID, dwnName, dwnFile, dwnDate; 

// Access data update file and push data/////
    var baseURL = window.location.href.split('#')[0];
    var dataURL = baseURL+'data/download/dataUpdates.js';
    var sandboxURL = baseURL.substring(0, baseURL.length-10)+'/data/download/dataUpdates.js';
    $.getJSON(dataURL, function(data) {
        for(var i = 0; i < data.length; i++){
            dwnID = data[i].id, dwnName = data[i].name, dwnFile = data[i].filename, dwnDate = data[i].date;
            $('.dataDwnld-' + dwnID).append('<div class="right dl"><div class="noLink">Last Update: '+ dwnDate +'</div><div class="noLink">Download: </div><a class="dlLink" href="http://dvrpcfreight.github.io/phillyfreightfinder/data/download/'+ dwnFile + '.zip" data-toggle="tooltip" title="Download Shapefile" >shp</a><a class="dlLink" href="http://dvrpcfreight.github.io/phillyfreightfinder/data/download/'+ dwnFile + '.csv" data-toggle="tooltip" title="Download CSV" >csv</a><a class="dlLink" href="http://dvrpcfreight.github.io/phillyfreightfinder/data/download/'+ dwnFile + '.json" download="'+ dwnFile +'.json" data-toggle="tooltip" title="Download JSON" >json</a></div>' );
            $('[data-toggle="tooltip"]').tooltip(); 
        }
    });

//Scroll to anchor functionality for table of contents
    $('.tocLink').on('click', function(){
        var elementID = $(this).attr('val'),
        element = document.getElementById(elementID);
        element.scrollIntoView(true);
    });



            /////////////////////////////////////////////////////
            //////////////////////////////////////////////////
            /////// Regional Highcharts graphs


$(document).ready(function() {
    
    

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
;
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

;
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


//stop button from remaining selected


function setMap(){
    $('.landingUI').fadeOut('fast', 'easeOutQuad' , function (){
             $('.mapUI').fadeIn('fast', 'easeInQuad' );
             $('#mapDIV').fadeIn('fast', 'easeInQuad' );
             loadLayers(); 
             map.invalidateSize(); 
             resetHighlight();
             resetInfoWindow ();
             setTimeout(function() {$("#loading").hide();}, 300);
        });  
}
function loadScript(id){
    $.getScript('lib/tools/'+ id + '.js');
}

//load content based on hash
$(function() {
  // Javascript to enable link to tab
  var url = document.location.toString();
  if (url.match('#')) {
    var full_hash = url.split('#')[1].split('/');
    var tab_id = full_hash[0];
    var prev_tab = url.split('#')[1];
    if (tab_id != 'map' && tab_id !== undefined) {
        $('#' + tab_id).show(); 
        countymap.invalidateSize();  
        if(tab_status[tab_id] === false){
            $('#'+ tab_id).load('includes/'+ tab_id + '.html', loadScript(tab_id));
            tab_status[tab_id] = true; 
        }
    }else {
        setMap();
   }
  }else {
    $('#home').show();
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
    if (tab_id != 'map') {
    	$('.mapUI').fadeOut('fast', 'easeOutQuad' , function (){
            $('.landingUI').fadeIn('fast', 'easeInQuad' );
            countymap.invalidateSize();
        });
        if(tab_status[tab_id] === false){
                $('#'+ tab_id).load('includes/'+ tab_id + '.html', loadScript(tab_id));
                tab_status[tab_id] = true;
            }
        $('.landtab-content > .tab-pane').hide();
        $("#pFFlanding").animate({ scrollTop: 0 }, 50);
        $('#' + tab_id).show();
        countymap.invalidateSize();
          
    }else { 
       setMap(); 
       countymap.invalidateSize();
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
        
    };
    map.invalidateSize(); 
    countymap.invalidateSize();
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
    };
    
    //layer group check all functionality
    $('.checked_all').on("click", function (e) {
        var listPanel = $(this).parent().siblings('.panel-collapse').children('.panel-body').children('input.Chkd');
        var $element = $(this);
            if (listPanel.attr('value') == 'true') {
                loadBar().done(function() {
                    $element.children().attr('class', 'chkicon dynico dynico-check-square-o');
                    $(listPanel).siblings('.checkbox').children('input').prop('checked', true).change();
                    $(listPanel).val('false');
                    $("#loading").fadeOut(150);
                });
            } else {
                $element.children().attr('class', 'chkicon dynico dynico-square-o');
                $(listPanel).siblings('.checkbox').children('input').prop('checked', false).change();
                $(listPanel).val('true');
            } 

     });
    function loadBar(){
        return $("#loading").show().delay(100).promise();
    }
});

///LayerControls: Order and add to Map as legend items are changed
//Z-index not yet functional in Leaflet
$('input:checkbox[name="LayerCont"]').on('change', function () {
    var layers = [];
    if ($('#' + $(this).attr('id')).is(':checked')) {
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
    };
    map.invalidateSize(); mountymap.invalidateSize();
    return false;
});

///////////////////////////////////////////////////
/////   Info window Functionality   //////////////
//////////////////////////////////////////////////
function toggleinfo(e) {
    if ($('#togbtn').hasClass('hide')) {
        $('#togbtn').removeClass('hide');
    };
    if ($('#togbtn').hasClass('glyphicon-plus')) {
        $('#togbtn').attr('class', 'glyphicon glyphicon-minus InfoTgl');
    } else {};
    var h = document.getElementById('info').offsetHeight + document.getElementById('infoheader').offsetHeight+0;
    $('#infobox_').addClass('active').css('bottom', h);
};

function togglemin(e) {
    if ($('#togbtn').hasClass('glyphicon-plus')) {} else {
        $('#togbtn').attr('class', 'glyphicon glyphicon-plus InfoTgl');
    };
    $('#infobox_').css('bottom', 0).removeClass('active');
};

$(".InfoTgl").click(function () {
    if ($('#infobox_').hasClass('active')) {
        togglemin();
    } else {
        toggleinfo();
    };
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
              $("#loading").hide();
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
        document.getElementById('mobileMdHeader').className = ''+ featureClass +' modal-header';;                 //push class to create style for info header
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
};

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
        iconElem.id = 'preselect'
        
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
};

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
};

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
// Clear the tooltip and clear highlights when map is clicked   
map.on('click',function(e){
        resetHighlight();
        resetInfoWindow();
        
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
            return $this.trigger('click')
        }

        var desc = ' li:not(.divider):visible a';
        var desc1 = 'li:not(.divider):visible > input:not(disabled) ~ label';
        var $items = $parent.find(desc1 + ', ' + '[role="menu"]' + desc + ', [role="listbox"]' + desc);

        if (!$items.length) return;

        var index = $items.index($items.filter(':focus'));

        if (e.keyCode == 38 && index > 0)                 index--;                        // up
        if (e.keyCode == 40 && index < $items.length - 1) index++;                        // down
        if (!~index)                                      index = 0;

        $items.eq(index).trigger('focus')
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
