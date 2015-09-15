
var NPARTICLES = 1000;
var SZPARTICLE = 10;
var VISIBILITY = 10;

var particles = [ [], [], [] ];
var running = true;
var allow_draw = true;
var chart;

var use_kdtree = false, tree, tree_last_type;


function get_color(val) {
    switch(val) {
        case 0:
            return 'red';
        case 1:
            return 'green';
        case 2:
            return 'yellow';
    }
}

var t = 0;
function requestData() {
    if(typeof(chart) !== 'undefined') {
        // add the point
        $.each(particles, function (i, p) {
            y = (p.length / parseFloat(NPARTICLES)) * 100;
            chart.series[i].addPoint([t,y], true);//, chart.series[i].data.length > 1000);
        });

        t += 1;
    }
}

function distance(a, b) {
    var dx = a.x-b.x;
    var dy = a.y-b.y;
    return dx*dx + dy*dy;
}