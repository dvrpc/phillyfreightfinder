$(function() {
    //hack to fix the load sequence of rendered HTML
    executeOnLoad("dataTabFC", load_data_download); 

    function load_data_download(){
        var dataID, dwnID, dwnName, dwnFile, dwnDate; 

        // Access data update file and push data/////
        var baseURL = window.location.href.split('#')[0];
        var dataURL = baseURL+'data/d3/dataUpdates.js';
        var sandboxURL = baseURL.substring(0, baseURL.length-10)+'/data/d3/dataUpdates.js';
        $.getJSON(dataURL, function(data) {
            for(var i = 0; i < data.length; i++){
                dwnID = data[i].id, dwnName = data[i].name, dwnFile = data[i].filename, dwnDate = data[i].date;
                $('.dataDwnld-' + dwnID).append('<div class="right dl"><div class="noLink">Last Update: '+ dwnDate +'</div><div class="noLink">Download: </div><a class="dlLink" href="http://dvrpcfreight.github.io/phillyfreightfinder/data/download/shp/'+ dwnFile + '.zip" data-toggle="tooltip" title="Download Shapefile" >shp</a><a class="dlLink" href="http://dvrpcfreight.github.io/phillyfreightfinder/data/download/csv/'+ dwnFile + '.csv" data-toggle="tooltip" title="Download CSV" >csv</a><a class="dlLink" href="http://dvrpcfreight.github.io/phillyfreightfinder/data/download/json/'+ dwnFile + '.json" download="'+ dwnFile +'.json" data-toggle="tooltip" title="Download JSON" >json</a></div>' );
                $('[data-toggle="tooltip"]').tooltip(); 
            }
        });

        //Scroll to anchor functionality for table of contents
        $('.tocLink').on('click', function(){
            var elementID = $(this).attr('val'),
            element = document.getElementById(elementID);
            element.scrollIntoView(true);
        });
    }
});
