// helper function to adjust trigger to half of page height
var getPageHeight = function() {
    winHeight = $(window).height();
    return winHeight / 2;
}

var pageWidth = function() {
    pw = elHeight = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return pw;
}

// update class list based on 12 columns
function updateClass(element, cols) {
    var colOffset = 12 - cols;
    document.getElementById(element).className = 'col-lg-offset-'+ colOffset +' col-lg-'+ cols ;
}
var _sizeWidth = pageWidth();
var _mapHeightOffset = (_sizeWidth < 769) ? -450 : -771;
updateSizes = function() {
    _sizeWidth = pageWidth();
    var _sizeHeight = getHeight();
    BUBBLE_PARAMETERS.height = _sizeHeight;
    var mapCols = (_sizeWidth >= 1200) ? 0.66 : 0.58333;
    (_sizeWidth < 769) ? mapCols = 0.97 : '';
    var typCols = (_sizeWidth < 769) ? 0.97 : 0.5833;
    //update map size
    distributionMap.style.width = ((_sizeWidth * mapCols) - 20) + "px";
    typologyMap.style.width = ((_sizeWidth * typCols) - 20) + "px";
    //forces size of text equal to map
    mapHeightItems.forEach(function(el) {
        el.style.height = (_sizeWidth > 768) ? _sizeHeight + "px" : "auto";
      });
    document.getElementById("js-wage-desc").style.height = (_sizeWidth > 768) ? _sizeHeight + "px" : "auto";

    if (map_exists) {
        fitRegion('distribution-map', _sizeHeight, ((_sizeWidth * mapCols) - 20), 'map')
        fitRegion('typologies-map', _sizeHeight, ((_sizeWidth * typCols) - 20), 'fcMap')
    }

    if (_sizeWidth > 768) {
        $('#distribution-map').css('opacity', '1.0')
        $('#typologies-map').css('opacity', '1.0')
    }
    
}

setGraphicPosition = function(el, position, top, margin) {
    position !== null && position?
        el.style.position = position : '';
    top !== null && top ?
        el.style.top = top +'px' : '';
    margin !== null && margin?
        el.style.margin = margin : '';
}

//DOM elements
var employmentBubbles = document.getElementById('employment-bubble');
var distributionMap = document.getElementById('distribution-map');
var typologyMap = document.getElementById('typologies-map');
var mapSource = document.getElementById('source-span');
var mapHeightItems = document.querySelectorAll('.map-height');

// set the graphic DOM elements correctly
setGraphicPosition(employmentBubbles, null, null, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
setGraphicPosition(distributionMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
setGraphicPosition(typologyMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
(_sizeWidth < 769) ? $('#distribution-map').css('opacity', '0') : '';
(_sizeWidth < 769) ? $('#typologies-map').css('opacity', '0') : '';
updateSizes();

window.onresize = function() {
    updateSizes();
    updateChart();
    scrollStory.updateTriggerOffset(getPageHeight())
    
}

var employment_exists = false;
var map_exists = false;
var activeItem = '';
var map_called = false;
var map_mode = 'none';
var map_section = 'distribution';
var distNarrative = $('#distribution-narrative').height();
var typNarrative = $('#typologies').height();


// initialization and options for scroll story functionality
var scrollStory = $('#planning').scrollStory({
    scrollOffset: 75,
    autoUpdateOffsets: true,
    autoActivateFirstItem: true,
    triggerOffset: getPageHeight(),
    itemfocus: function(ev, item){
        var active_dot = $('.dotnav li[data-story-nav="'+ item.index +'"]').data('story-nav');
        
        if (active_dot === item.index) {
            $('.dotnav li.current').toggleClass('current');
            $('.dotnav li[data-story-nav="'+ item.index +'"]').toggleClass('current');
        } else {
            // console.log('shit needs to work reverse too!')
        }
        
        switch (item.data.section) {
            case 'employment':
                myBubbleChart.legendHandler(item.data.legend);
                setGraphicPosition(distributionMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0')
                break;
        }

        switch (item.index){
            case 0:
                $('#employment-bubble').css('position', 'relative');
                break;
        }

        if(item.index < 8) {
            // RETURN OPACITY AND SIZE TO NORMAL
            d3.selectAll('.bubble')  //here's how you get all the nodes
                .attr('r', function(d) {return d.scaled_radius})
                .attr('opacity', 1.0);
            setGraphicPosition(typologyMap, 'relative', -771, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0')
        }

        //clears any annotations
        $('.g-annotations').remove();
        
        //ensures color is set
        if(item.index >= 2) {
            myBubbleChart.switchMode('color');
        } 

        if(item.index > 0 && item.index < 8){
            setGraphicPosition(employmentBubbles, 'fixed', 60)
        }
        
        if(item.index > 10) {
            setGraphicPosition(employmentBubbles, 'relative', -BUBBLE_PARAMETERS.height, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0');
            
        }

        if(item.data.section === 'employment') {
            
            switch (item.data.mode){
                case 'color':
                    this.updateOffsets();
                    break;
                default :
                    myBubbleChart.switchMode(item.data.mode);
                    break;       
            }
        }

        function mapStateChecker(index, mode, section){
            if(!map_called){
                map_called = true;
                $.getScript('./lib/tools/freight-story/geo-distribution.js?ver=1.0.1', function(){
                    freightMap.repaint(mode, section);
                });
            }else if(!map_exists && map_called){
                map_mode = mode;
                map_section = section;
            }else if (map_exists) {
                mapSource.innerHTML = (freightMap.attribution[index]) ? freightMap.attribution[index] : '';
                freightMap.repaint(mode, section);
                updateSizes();
            }
        }

        if(item.index > 8 && item.data.section === 'distribution' && item.data.mode){
            //make sure employment is gone
            setGraphicPosition(employmentBubbles, 'relative', -BUBBLE_PARAMETERS.height, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0');
            setGraphicPosition(typologyMap, 'relative', -771, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0');
           
            mapStateChecker(item.index, item.data.mode, item.data.section);
           
        }

        if ( 17 > item.index && item.index > 9 && item.data.section === 'distribution'){
            setGraphicPosition(distributionMap, 'fixed', 60);
        }

        if(item.index > 17 && item.data.section === 'typologies' && item.data.mode){
            setGraphicPosition(distributionMap, 'relative', (distNarrative - BUBBLE_PARAMETERS.height), '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
            item.index > 18 ? setGraphicPosition(typologyMap, 'fixed', 60) : '';
            
            mapStateChecker(item.index, item.data.mode, item.data.section);
        }
        if(item.index > 19){
            (_sizeWidth < 769) ? $('#typologies-map').css('opacity', '1.0') : '';
        }

    },
    itemblur: function(ev, item){

    },
    updateoffsets: function() {

    },
    itementerviewport: function(ev, item) {
        activeItem = this.getActiveItem();
        switch (item.index){
            // return the employment bubble chart to fixed position on reverse scroll
            case 7:
                setGraphicPosition(employmentBubbles, 'fixed', 60)
                break;
            // lazy load map ahead of story element or return map to normal flow location on reverse scroll
            case 8:
                if(!map_exists && !map_called){
                    map_called = true;
                    $.getScript('./lib/tools/freight-story/geo-distribution.js?ver=1.0.1');
                } else if (activeItem.index >= 9){
                    setGraphicPosition(distributionMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
                    (_sizeWidth < 769) ? $('#distribution-map').css('opacity', '0') : '';
                }
                break;
            case 9: 
                if(activeItem.index === 8){
                    setGraphicPosition(employmentBubbles, 'relative', -BUBBLE_PARAMETERS.height, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0')
                }
                break;
            case 10:
                if(activeItem.index < 10){
                    (_sizeWidth < 769) ? $('#distribution-map').css('opacity', '1.0') : '';
                }
                break;
            case 18:
                if(activeItem.index < 18 && _sizeWidth > 768){
                    setGraphicPosition(distributionMap, 'relative', (distNarrative - BUBBLE_PARAMETERS.height), '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0')
                }
                if(activeItem.index > 18){
                    (_sizeWidth < 769) ? $('#typologies-map').css('opacity', '0') : '';
                }
                break;
            case 17:
                if(activeItem.index > 17){
                    setGraphicPosition(typologyMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0')
                }
                break;
            case 24:
                if(activeItem.index == 25 ){
                    setGraphicPosition(typologyMap, 'fixed', 60)
                }
                break;
            default :
                break;

        }
    },
    itemexitviewport: function(ev, item) {
        activeItem = this.getActiveItem();
        switch (item.index){
            // set map graphic to fixed position
            case 8:
                if(activeItem.index == 9){
                    setGraphicPosition(distributionMap, 'fixed', 60)
                }
                break;
            case 18:
                if(activeItem.index < 18) {
                    setGraphicPosition(distributionMap, 'fixed', 60)
                }
                if(activeItem.index > 18) {
                    (_sizeWidth < 769) ? $('#typologies-map').css('opacity', '1.0') : '';
                }
                break;
            case 17:
                if(activeItem.index > 16) {
                    setGraphicPosition(typologyMap, 'fixed', 60)
                }
                break;
            case 24:
                if(activeItem.index == 25 && _sizeWidth > 768){
                    setGraphicPosition(typologyMap, 'relative', (typNarrative - BUBBLE_PARAMETERS.height), '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
                }
                break;
            default :
                break;

        }
    },
    triggeroffsetupdate: function() {
    }

}).data('plugin_scrollStory');



window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

$('.dotnav li').on('click', function(e){

    var storyIndex = $(this).data('story-nav');

    scrollStory.index(storyIndex);
   
})

$('#fc-splash-intro a').on('click', function(e){
    var storyIndex = $(this).data('story-nav');

    scrollStory.index(storyIndex);
   
})

document.getElementById('scroll-hint').addEventListener('click', function(){
    scrollStory.index(0);
});

window.addEventListener('scroll', function () {
    var fullElement = document.querySelector('.fc-color-full.inviewport') || document.querySelector('.inviewport .fc-color-full');
    
    if(fullElement !== null && fullElement !== ''){
        var underlay = fullElement.getBoundingClientRect();
        var navDots = document.querySelectorAll('.dotnav li');
        [].forEach.call(navDots, function(item, i){
            var dot = item.getBoundingClientRect();
            if (underlay.top <= dot.top + dot.height && underlay.top + underlay.height > dot.top) {
                item.classList.add('white-overlay')
            } else if(item.classList.contains('white-overlay')){
                item.classList.remove('white-overlay')
            }
        })
    }   
});

