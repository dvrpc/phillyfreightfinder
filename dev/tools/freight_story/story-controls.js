// helper function to adjust trigger to half of page height
var getPageHeight = function() {
    winHeight = $(window).height();
    return winHeight / 2;
}

var employment_exists = false;
var map_exists = false;
var activeItem = '';
var map_called = false;
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
            console.log('shit needs to work reverse too!')
        }
        
        switch (item.data.section) {
            case 'employment':
                myBubbleChart.legendHandler(item.data.legend);
                document.getElementById('distribution-map').style.position = 'relative';
                document.getElementById('distribution-map').style.top = '-771px';
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

        if(item.index > 8 && item.data.section === 'distribution' && item.data.mode){
            //make sure employment is gone
            
            document.getElementById('employment-bubble').setAttribute('style','position:relative; top:-'+ BUBBLE_PARAMETERS.height +'px;left:-15px;margin-bottom:-'+ (BUBBLE_PARAMETERS.height) +'px;');

            if(!map_called){
                map_called = true;
                console.log('called by focus', item.index);
                
                $.getScript('dev/tools/freight_story/geo-distribution.js', function(){
                    freightMap.repaint(item.data.mode);
                });
            }else if(!map_exists && map_called){
                freightMap.activeMode = item.data.mode;
            }else if (map_exists) {
                
                freightMap.repaint(item.data.mode);
            }
        }

        if (item.index > 9 && item.data.section === 'distribution'){
            document.getElementById('distribution-map').style.position = 'fixed';
            document.getElementById('distribution-map').style.top = '60px';
        }

    },
    itemblur: function(ev, item){

    },
    updateoffsets: function() {
        
    },
    itementerviewport: function(ev, item) {
        this.updateOffsets();
        activeItem = this.getActiveItem();
        switch (item.index){
            // return the employment bubble chart to fixed position on reverse scroll
            case 7:
                document.getElementById('employment-bubble').setAttribute('style','position:fixed; top: 60px;left: 8.333%;');
                break;
            // lazy load map ahead of story element or return map to normal flow location on reverse scroll
            case 8:
                if(!map_exists && !map_called){
                    map_called = true;
                    $.getScript('dev/tools/freight_story/geo-distribution.js');
                } else if (activeItem.index >= 9){
                    // console.log('return to fixe map')
                    // document.getElementById('distribution-map').setAttribute('style','position:relative; top:-771px;');
                    document.getElementById('distribution-map').style.position = 'relative';
                    document.getElementById('distribution-map').style.top = '-771px';
                }
                break;
            case 9: 
                if(activeItem.index === 8){
                    document.getElementById('employment-bubble').setAttribute('style','position:relative; top:-'+ BUBBLE_PARAMETERS.height +'px;left:-15px;margin-bottom:-'+ (BUBBLE_PARAMETERS.height) +'px;');
                }
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
                    document.getElementById('distribution-map').style.position = 'fixed';
                    document.getElementById('distribution-map').style.top = '60px';
                    // document.getElementById('distribution-map').setAttribute('style','position:fixed; top:60px;');
                }  
            default :
                break;

        }
    }


}).data('plugin_scrollStory');


window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

$('.dotnav li').on('click', function(e){
    console.log(e);
    var storyIndex = $(this).data('story-nav');

    scrollStory.index(storyIndex);
   
})