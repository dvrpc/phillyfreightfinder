const loadjs = (FILE_URL, async = true, type = "text/javascript") => {
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

let hpmap = {}

//set map height
const MAP_WRAPPER = document.getElementById('hp-map-wrapper');
let hp_map_height = window.innerHeight - 355;

MAP_WRAPPER.style.height = hp_map_height + 'px';


//register DOM elements
const legend = document.getElementById('hp_legend');
const icon = document.querySelectorAll('.icon');
const hp_title = document.getElementById('hp_title_metric');
const hp_next = document.getElementById('hp_next');
const hp_prev = document.getElementById('hp_prev');
const pm_toggle = document.querySelectorAll('.toggle-pm');
const play_btn = document.getElementById('hp_play');

const clearActive = (items) => {
  items.forEach(item => {
    item.classList.remove('active');
  })
}


pm_toggle.forEach(elem => {
    elem.addEventListener('click', function (e) {
        let pm = e.target.dataset.mode;
        truckPerformance.type = pm;
        truckPerformance.color();
        legend.innerHTML = truckPerformance.htmlChunks[truckPerformance.type].legend;
        hp_title.innerHTML = truckPerformance.htmlChunks[truckPerformance.type].title;
    })
})

play_btn.addEventListener('click', function (e) {
    slider.playHandler(play_btn);
})

hp_next.addEventListener('click', function (e) {
    clearInterval(slider.animate);
    slider.advanceStep();
})

hp_prev.addEventListener('click', function (e) {
    clearInterval(slider.animate);
    slider.previousStep();
})

const playBtn = '<i class="glyphicon glyphicon-play"></i>&nbsp;&nbsp;Play';
const pauseBtn = '<i class="glyphicon glyphicon-pause"></i>&nbsp;&nbsp;Pause';

const truckPerformance = {
    exists: false,
    visible: false,
    type: 'S',
    dirs: ['B', 'T', 'F'],
    
    //map 24 hr periods to bins create from analysis
    timeMap: {
        0: '00',
        5: '05',
        7: '07',
        9: '09',
        11: '11',
        13: '13',
        15: '15',
        17: '17',
        19: '19',
    },

    color: function(time) {
        var style = {
            'S': {
                "property": this.type + this.timeMap[slider.low],
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
                "property": this.type + this.timeMap[slider.low],
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
            hpmap.setPaintProperty('tp-' + this.dirs[k], 'line-color', style[this.type]);
        }

    }, 

    show: function() {
        truckPerformance.visible = true;
        legend.innerHTML = truckPerformance.htmlChunks[truckPerformance.type].legend;

    },

    htmlChunks: {
      T: {
        legend: '<div class="hp_label three-quarter">Truck Travel Time Index Value</div>' +
        '<div id="tti_legend"><div class="hp_legend hp_z">no data</div>' +
        '<div class="hp_legend hp_g">< 1.1</div>' +
        '<div class="hp_legend hp_a">1.1 - 1.5</div>' +
        '<div class="hp_legend hp_o">1.5 - 2.0</div>' +
        '<div class="hp_legend hp_r">2.0 - 3.0</div>' +
        '<div class="hp_legend hp_k">> 3.0</div></div>',
        title: 'Truck Travel Time Index'
      },
      S: {
        legend: '<div class="hp_label three-quarter">Average Truck Speed (MPH)</div>' +
        '<div id="speed_legend"><div class="hp_legend hp_z">no data</div>' +
        '<div class="hp_legend hp_k">< 10</div>' +
        '<div class="hp_legend hp_r">10 - 20</div>' +
        '<div class="hp_legend hp_o">20 - 30</div>' +
        '<div class="hp_legend hp_a">30 - 40</div>' +
        '<div class="hp_legend hp_y">40 - 50</div>' +
        '<div class="hp_legend hp_c">50 - 60</div>' +
        '<div class="hp_legend hp_g">> 60</div></div>',
        title: 'Average Truck Speed'
      }
    }

}

const slider = {
    elem: document.getElementById('hp_timing_slider'),
    title: {
        low: document.getElementById('hp-t1'),
        high: document.getElementById('hp-t2')
    },
    low: 0,
    high: 5,
    playing: false,
    animate: '',
    config: {
        start: [0, 5],
			connect: true,
			snap: true,
			behaviour: "tap",
			range: {
				'min': 0,
				'20%': 5,
				'28%': 7,
				'36%': 9,
				'44%': 11,
				'52%': 13,
				'60%': 15,
				'68%': 17,
				'76%': 19,
				'max': 24
			},
			pips: {
				mode: 'range',
				density: 4
			}
    },
    label: {
        5: '5 <span class="hp_tod">AM</span>',
        7: '7 <span class="hp_tod">AM</span>',
        9: '9 <span class="hp_tod">AM</span>',
        11: '11 <span class="hp_tod">AM</span>',
        13: '1 <span class="hp_tod">PM</span>',
        15: '3 <span class="hp_tod">PM</span>',
        17: '5 <span class="hp_tod">PM</span>',
        19: '7 <span class="hp_tod">PM</span>',
        0: '12 <span class="hp_tod">AM</span>', 
        24: '12 <span class="hp_tod">AM</span>',
    },

    formatLabels: function (ticks) {
        ticks.forEach(elem => {
            let val = elem.innerHTML;
            elem.innerHTML = slider.label[val]
        })
    },

    setRange: function (values) {
        let l = parseInt(values[0])
        let h = parseInt(values[1])
        slider.low = l;
        slider.high = h;
        slider.title.low.innerHTML = slider.label[l]
        slider.title.high.innerHTML = slider.label[h]

    },

    play: function(time) {
        this.animate = setInterval( function () {
            slider.advanceStep()
        }, 2000);
    },

    pause: function() {
        clearInterval(this.animate);
    },
    
    playHandler: function(btn) {
        if (this.playing) {
            this.playing = false;
            this.pause();
            btn.innerHTML = playBtn;
            
        } else {
            this.playing = true;
            this.play();
            btn.innerHTML = pauseBtn;  
        }
        // btn.classList.toggle('playing')
    },
    advanceStep: function () {
        let next = slider.high + 2;
        if (next <= 19) {
            slider.elem.noUiSlider.set([slider.high, next])
        } else if(next > 19 && next < 24){
            slider.elem.noUiSlider.set([19, 24]);
        } else {
            slider.elem.noUiSlider.set([0, 5]);
        }
    },
    previousStep: function () {
        let prev = slider.low - 2;
        if (prev <= 19 && slider.low > 5) {
            slider.elem.noUiSlider.set([prev, slider.low]);
        } else if (slider.low === 0) {
            slider.elem.noUiSlider.set([19, 24]);
        } else {
            slider.elem.noUiSlider.set([0, 5]);
        }
    }
}


// build noUIslider
loadjs('lib/tools/assets/nouislider.js')
    .then(d => {
        noUiSlider.create(slider.elem, slider.config);
        const ticks = document.querySelectorAll('.noUi-value.noUi-value-horizontal.noUi-value-large');
        slider.formatLabels(ticks);

        //slide events
        slider.elem.noUiSlider.on('slide', (values) => {
            let upper = parseInt(values[1])
            let lower = parseInt(values[0])
            
            // set time bins as fixed interval
            if (upper > slider.high || upper < slider.high) {
				if(upper <= 5){
					slider.elem.noUiSlider.set([0,5]);
				}else if(upper > 5 && upper <= 19){
					slider.elem.noUiSlider.set([(upper - 2),upper]);
				}else{
                    slider.elem.noUiSlider.set([19, 24]);
				}	
			}else if(lower < slider.low || lower > slider.low){
				if(lower < 5){
                    slider.elem.noUiSlider.set([0, 5]);
				}else if(lower >= 5 && lower < 19){
                    slider.elem.noUiSlider.set([lower, (lower + 2)]);
				}else{
					slider.elem.noUiSlider.set([19,24]);
				}	
			}
        })

        slider.elem.noUiSlider.on('set', (values) => {
            slider.setRange(values)
            truckPerformance.color()
        })
})
    

//entry point
loadjs("https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js")
    .then(data => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibXJ1YW5lIiwiYSI6ImNpZ3dnaGF1bjBzNGZ3N201bTQwN3h6YngifQ.pw1khldm3UDHd56okxc5bQ';

        hpmap = new mapboxgl.Map({
            container: 'hp-map-wrapper',
            center: [-75.14, 39.95],
            zoom: 12,
            style: 'lib/tools/assets/highway.json',
            hash: false,
        });

        // navigation control
        var nav = new mapboxgl.NavigationControl();
        hpmap.addControl(nav, 'top-left');

        // on map.load add truck pm source with attribution and render layers by direction attr
        hpmap.on('load', function() {
            hpmap.addSource("truck-pm", {
              "type": "vector",
              "url": "https://tiles.dvrpc.org/data/dvrpc-pff-truck.json",
              "attribution": "<b>Performance Measures</b>: DVRPC analysis of 2015 NPMRDS probe data" 
            });

            for (var i = 0; i < truckPerformance.dirs.length; i++) {
                var offset = (truckPerformance.dirs[i] === 'B') ? 1.3 : 0;

                hpmap.addLayer({
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