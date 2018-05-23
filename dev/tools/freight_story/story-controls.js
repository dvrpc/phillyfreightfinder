// helper function to adjust trigger to half of page height
var getPageHeight = function() {
    winHeight = $(window).height();
    return winHeight / 2;
}

// update class list based on 12 columns
function updateClass(element, cols) {
    var colOffset = 12 - cols;
    document.getElementById(element).className = 'col-lg-offset-'+ colOffset +' col-lg-'+ cols ;
}

setGraphicPosition = function(el, position, top, margin) {
    position !== null && position?
        el.style.position = position : '';
    top !== null && top ?
        el.style.top = top+'px' : '';
    margin !== null && margin?
        el.style.margin = margin : '';
}

//DOM elements
var employmentBubbles = document.getElementById('employment-bubble');
var distributionMap = document.getElementById('distribution-map');
var typologyMap = document.getElementById('typologies-map');
var mapSource = document.getElementById('source-span');

// set the graphic DOM elements correctly
setGraphicPosition(employmentBubbles, null, null, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
setGraphicPosition(distributionMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
setGraphicPosition(typologyMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0');
document.getElementById("js-wage-desc").style.height = BUBBLE_PARAMETERS.height + "px";
document.querySelector('.map-height').style.minHeight = BUBBLE_PARAMETERS.height + "px";

var employment_exists = false;
var map_exists = false;
var activeItem = '';
var map_called = false;
var map_mode = 'none';
var map_section = 'distribution';
var distNarrative = document.getElementById('distribution-narrative').offsetHeight;

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
        }

        //clears any annotations
        $('.g-annotations').remove();
        
        //ensures color is set
        if(item.index >= 2) {
            myBubbleChart.switchMode('color');
        } 

        if(item.index > 0 && item.data.section === 'employment' && item.index != 8) {
            $('#employment-bubble').css('position', 'fixed');
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

        // if(item.data.section === 'typologies') {
        //     document.getElementById('distribution-map').style.opacity = 1.0;
        //     freightMap.repaint(item.data.mode, item.data.section);
        //     switch (item.data.mode) {
        //         case 'hide':
        //             document.getElementById('distribution-map').style.opacity = 0;
        //             updateClass('map-parent', 8);
                    
        //             freightMap.fitRegion('distribution-map', false);
        //             break;
        //         case 'all':
        //             updateClass('map-parent', 7);
        //             freightMap.fitRegion('distribution-map', true);
        //             break;
        //         default:
        //             updateClass('map-parent', 7);
        //             freightMap.fitRegion('distribution-map', true);
        //             break;
        //     }
            
        // }

        if(item.index > 8 && item.data.section === 'distribution' && item.data.mode){
            //make sure employment is gone
            setGraphicPosition(employmentBubbles, 'relative', -BUBBLE_PARAMETERS.height, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0')
            setGraphicPosition(typologyMap, 'relative', -771, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0')

            if(!map_called){
                map_called = true;
                // console.log('called by focus', item.index);
                
                $.getScript('./lib/tools/freight-story/geo-distribution.js', function(){
                    freightMap.repaint(item.data.mode, item.data.section);
                });
            }else if(!map_exists && map_called){
                map_mode = item.data.mode;
                map_section = item.data.section;
            }else if (map_exists) {
                
                freightMap.repaint(item.data.mode, item.data.section);
            }
            //set the source 
            mapSource.innerHTML = (freightMap.attribution[item.index]) ? freightMap.attribution[item.index] : '';
        }

        if ( 17 > item.index && item.index > 9 && item.data.section === 'distribution'){
            setGraphicPosition(distributionMap, 'fixed', 60);
        }

        if(item.index > 17 && item.data.section === 'typologies' && item.data.mode){
            item.index > 18 ? setGraphicPosition(typologyMap, 'fixed', 60) : '';
            freightMap.repaint(item.data.mode, item.data.section);
        }

    },
    itemblur: function(ev, item){

    },
    updateoffsets: function() {

    },
    itementerviewport: function(ev, item) {
        // this.updateOffsets();
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
                    $.getScript('./lib/tools/freight-story/geo-distribution.js');
                } else if (activeItem.index >= 9){
                    setGraphicPosition(distributionMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0')
                }
                break;
            case 9: 
                if(activeItem.index === 8){
                    setGraphicPosition(employmentBubbles, 'relative', -BUBBLE_PARAMETERS.height, '0 0 -'+ (BUBBLE_PARAMETERS.height) +'px 0')
                }
                break;
            case 18:
                if(activeItem.index < 18){
                    setGraphicPosition(distributionMap, 'relative', (distNarrative - BUBBLE_PARAMETERS.height), '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0')
                }
                break;
            case 17:
                if(activeItem.index > 17){
                    setGraphicPosition(typologyMap, 'relative', -771, '0 0 -'+ BUBBLE_PARAMETERS.height +'px 0')
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
                break;
            case 17:
                if(activeItem.index > 16) {
                    setGraphicPosition(typologyMap, 'fixed', 60)
                }
                break;
            default :
                break;

        }
    }


}).data('plugin_scrollStory');


window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

$('.dotnav li').on('click', function(e){

    var storyIndex = $(this).data('story-nav');

    scrollStory.index(storyIndex);
   
})

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

