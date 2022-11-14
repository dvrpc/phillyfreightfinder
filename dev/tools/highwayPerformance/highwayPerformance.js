const loadScript = (FILE_URL, async = true, type = "text/javascript") => {
    return new Promise((resolve, reject) => {
        try {
            const scriptEle = document.createElement("script");
            scriptEle.type = type;
            scriptEle.async = async;
            scriptEle.src = FILE_URL;

            scriptEle.addEventListener("load", (ev) => {
                resolve({
                    status: true
                });
            });

            scriptEle.addEventListener("error", (ev) => {
                reject({
                    status: false,
                    message: `Failed to load the script ＄{FILE_URL}`
                });
            });

            document.body.appendChild(scriptEle);
        } catch (error) {
            reject(error);
        }
    });
};

let map = {}

//set map height
const MAP_WRAPPER = document.getElementById('hp-map-wrapper');
let hp_map_height = window.innerHeight - 355;

MAP_WRAPPER.style.height = hp_map_height + 'px';


//register DOM elements
const legend = document.getElementById('hp_legend');
const icon = document.querySelectorAll('.icon');
const speedControl = document.getElementById('speed-btns');
const speeds = speedControl.querySelectorAll('button');
const TIME_LABEL = document.getElementById('dat-time-label');
const hp_title = document.getElementById('hp_title_metric');

const clearActive = (items) => {
  items.forEach(item => {
    item.classList.remove('active');
  })
}

speeds.forEach(elem => {
  elem.addEventListener('click', function (e) {
    animation.speed = e.target.dataset.speed;
    clearActive(speeds);
    e.target.classList.add('active');
  });
})

document.addEventListener('click', function(e) {
    //toggle performance type
    if (e.target.classList.contains('toggle-pm')) {
      let pm = e.target.dataset.mode;
      truckPerformance.type = pm;
      truckPerformance.color();
      legend.innerHTML = truckPerformance.htmlChunks[truckPerformance.type].legend;
      hp_title.innerHTML = truckPerformance.htmlChunks[truckPerformance.type].title;
    } else if (e.target.classList.contains('play')) {
        e.preventDefault();
        animation.playHandler(e.target);
    } 
})


const playBtn = '<i class="glyphicon glyphicon-play"></i>&nbsp;&nbsp;Play';
const pauseBtn = '<i class="glyphicon glyphicon-pause"></i>&nbsp;&nbsp;Pause';

const animation = {
    hour: 0,
    mins: 0,
    timePerFrame: 10,
    speed: 1,
    animate: '',
    animatedLayers: 0,
    
    togglePanel: function(count) {
        animation.animatedLayers += count;

        if (animation.animatedLayers > 0) {
            document.getElementById('time-panel').classList.remove('hidden');
        } else {
            document.getElementById('time-panel').classList.add('hidden');
        }
    },

    start: function(time) {
        this.animate = setInterval(function() {
            animation.updateTime();
            truckPerformance.color();
            animation.minCounter();

        }, 150);
    },

    stop: function() {
        clearInterval(this.animate);
    },

    minCounter: function() {
        animation.mins += ((animation.timePerFrame * animation.speed) / 60);
    },

    playHandler: function(btn) {
        if (btn.classList.contains('playing')) {
          animation.stop();
          btn.innerHTML = playBtn;
        } else {
          animation.start();
          btn.innerHTML = pauseBtn;  
        }
        btn.classList.toggle('playing')
        return false;
    },

    updateTime: function() {

        if (animation.mins >= 0.99 && animation.hour < 23) {
            animation.mins = 0, animation.hour++;

        } else if (animation.mins >= 0.99 && animation.hour == 23) {
            animation.mins = 0, animation.hour = 0;
        }
        var suffix = (animation.hour >= 12) ? ' PM' : ' AM';
        var twelveHour = (animation.hour <= 12) ? animation.hour : animation.hour - 12;
        twelveHour = (twelveHour === 0) ? 12 : twelveHour;

        var minutes = (animation.mins * 60).toLocaleString('en');

        minutes = ('0' + minutes).slice(-2);
        var hourString = twelveHour + ':' + minutes + suffix;

      TIME_LABEL.innerHTML = hourString;
    }
    
}

const truckPerformance = {
    exists: false,
    visible: false,
    type: 'S',
    dirs: ['B', 'T', 'F'],
    
    //map 24 hr periods to bins create from analysis
    timeMap: ['00', '00', '00', '00', '00', '05', '05', '07', '07', '09', '09', '11', '11', '13', '13', '15', '15', '17', '17', '19', '19', '19', '19', '19'],

    color: function(time) {
        var style = {
            'S': {
                "property": this.type + this.timeMap[animation.hour],
                "type": "categorical",
                "stops": [
                    ['z', '#9c9c9c'],
                    ['k', '#730000'],
                    ['r', '#e60000'],
                    ['o', '#f07d02'],
                    ['a', '#ffcb0d'],
                    ['y', '#FF0'],
                    ['c', '#AF0'],
                    ['g', '#38a800']
                ]
            },
            'T': {
                "property": this.type + this.timeMap[animation.hour],
                "type": "categorical",
                "stops": [
                    ['z', '#9c9c9c'],
                    ['g', '#38a800'],
                    ['y', '#ffcb0d'],
                    ['o', '#f07d02'],
                    ['r', '#e60000'],
                    ['k', '#730000']

                ]
            }
        };
        for (var k = 0; k < this.dirs.length; k++) {
            map.setPaintProperty('tp-' + this.dirs[k], 'line-color', style[this.type]);
        }

    },

    show: function() {
        truckPerformance.visible = true;
        legend.innerHTML = truckPerformance.htmlChunks[truckPerformance.type].legend;

    },

    hide: function() {
        if (truckPerformance.visible === true) {
            animation.togglePanel(-1);
            truckPerformance.visible = false;
        }
        this.exists ? this.toggleMap(0.0) : '';
    },

    toggleMap: function(opacity) {
        for (var k = 0; k < this.dirs.length; k++) {
            truckPerformance.color();
            map.setPaintProperty('tp-' + this.dirs[k], 'line-opacity', opacity);
        }
    },
    htmlChunks: {
      T: {
        legend: '<div class="hp_label three-quarter">Travel Time Index Value</div>' +
        '<div id="tti_legend"><div class="hp_legend hp_z">no data</div>' +
        '<div class="hp_legend hp_g">< 1.1</div>' +
        '<div class="hp_legend hp_a">1.1 - 1.5</div>' +
        '<div class="hp_legend hp_o">1.5 - 2.0</div>' +
        '<div class="hp_legend hp_r">2.0 - 3.0</div>' +
        '<div class="hp_legend hp_k">> 3.0</div></div>',
        title: 'Truck Travel Time Index'
      },
      S: {
        legend: '<div class="hp_label three-quarter">Average Speed (MPH)</div>' +
        '<div id="speed_legend"><div class="hp_legend hp_z">no data</div>' +
        '<div class="hp_legend hp_k">< 10</div>' +
        '<div class="hp_legend hp_r">10 - 20</div>' +
        '<div class="hp_legend hp_o">20 - 30</div>' +
        '<div class="hp_legend hp_a">30 - 40</div>' +
        '<div class="hp_legend hp_y">40 - 50</div>' +
        '<div class="hp_legend hp_c">50 - 60</div>' +
        '<div class="hp_legend hp_g">> 60</div></div>',
        title: 'Truck Average Speed'
      }
    }

}


//entry point
loadScript("https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js")
    .then(data => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibXJ1YW5lIiwiYSI6ImNpZ3dnaGF1bjBzNGZ3N201bTQwN3h6YngifQ.pw1khldm3UDHd56okxc5bQ';

        map = new mapboxgl.Map({
            container: 'hp-map-wrapper',
            center: [-75.14, 39.95],
            zoom: 12,
            style: 'lib/tools/assets/highway.json',
            hash: false,
        });

        // navigation control
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');
        map.on('load', function() {
            map.addSource("truck-pm", {
              "type": "vector",
              "url": "https://tiles.dvrpc.org/data/dvrpc-pff-truck.json",
              "attribution": "<b>Performance Measures</b>: DVRPC analysis of 2015 NPMRDS probe data" 
            });

            for (var i = 0; i < truckPerformance.dirs.length; i++) {
                var offset = (truckPerformance.dirs[i] === 'B') ? 1.3 : 0;

                map.addLayer({
                    "id": "tp-" + truckPerformance.dirs[i],
                    "source": "truck-pm",
                    "source-layer": "truck-pm",
                    "type": 'line',
                    "filter": [
                        "all",
                        [
                            "in",
                            "DIR_TYPE",
                            truckPerformance.dirs[i]
                        ]
                    ],
                    "layout": {
                        "line-join": "round"
                    },
                    "paint": {
                        "line-color": {
                            "property": "S00",
                            "type": "categorical",
                            "stops": [
                                ['z', '#9c9c9c'],
                                ['k', '#730000'],
                                ['r', '#e60000'],
                                ['o', '#f07d02'],
                                ['a', '#ffcb0d'],
                                ['y', '#FF0'],
                                ['c', '#AF0'],
                                ['g', '#38a800']
                            ]
                        },
                        'line-opacity': 1.0,
                        "line-width": {
                            "base": 1,
                            "stops": [
                                [
                                    14,
                                    1.5
                                ],
                                [
                                    15,
                                    3.5
                                ],
                                [
                                    16,
                                    5
                                ]
                            ]
                        },
                        "line-offset": offset
                    }
                }, 'interstate-motorway_shields')
            }
            truckPerformance.show()
        });
    })
    .catch(err => {
        console.error(err);
    });