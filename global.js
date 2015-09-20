
var NPARTICLES = 1000;
var SZPARTICLE = 10;
var VISIBILITY = 10;
var behaviour = 'wrap';

var particles = [ [], [], [] ];
var running = true;
var allow_draw = true;
var chart;
var show_hc = false;

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
var chart_data = [];
var time_since_last_data = 0;
var this_request_at;
var last_request_at;
function requestData() {
    this_request_at = new Date().getTime();
    time_since_last_data += this_request_at - (last_request_at || 0);

    var tmp = [];
    $.each(particles, function (i, p) {
        y = (p.length / parseFloat(NPARTICLES)) * 100;
        tmp.push(y);
    });
    chart_data.push(tmp);

    if(show_hc && time_since_last_data > 100) {
        if(typeof(chart) !== 'undefined') {
            // add the points
            $.each(chart_data, function (_, pg) {
                $.each(pg, function (i, p) {
                    chart.series[i].addPoint([t,p]); //, null, chart.series[i].points.length > 300);
                });
                t += 1;
            });
            $.each(chart.series, function (_, serie) {
                serie.getAttribs();
            });
            chart.redraw();
        }
        chart_data = [];
        time_since_last_data = 0;
    } else if(!show_hc) {
        chart_data = [];
        time_since_last_data = 0;
    }

    last_request_at = this_request_at;
}

function distance(a, b) {
    var dx = a.x-b.x;
    var dy = a.y-b.y;
    return dx*dx + dy*dy;
}