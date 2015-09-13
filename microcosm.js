
function init_paticles() {
    particles = [ [], [], [] ];

    for(var i=0;i<NPARTICLES;i++) {
        var p = new Particle(
            new Vector(Math.random() * c.width + 1, Math.random() * c.height + 1),
            new Vector(Math.random() * 6 - 3, Math.random() * 6 - 3),
            new Vector(0, 0),
            Math.floor(Math.random() * 3)
        );

        particles[p.type].push(p);
    }
}
init_paticles();

function clear() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function queue() {
    if(running)
        setTimeout(loop, 10);
//    window.requestAnimationFrame(loop);
}

var ms_this_frame;
var last_frame_at;
function update() {
    var particles_new = [ [], [], [] ];

    $.each(particles, function(_, pt) {
        $.each(pt, function(_, p) {
            var pnew = p;
            p = {};

            if(use_kdtree) pnew.update_kdtree();
            else pnew.update();

            particles_new[pnew.type].push(pnew);
        });
    });

    particles = [ [], [], [] ];

    $.each(particles_new, function(i, pt) {
        $.each(pt, function(_, p) {
            particles[i].push(p);
        });
    });

    this_frame_at = new Date().getTime();
    ms_this_frame = this_frame_at - (last_frame_at || 0);
    last_frame_at = this_frame_at;

    requestData();
}

function draw() {
    var width = c.width;
    var height = c.height;

    ctx.clearRect(0, 0, width, height);
    if(allow_draw)
        $.each(particles, function(_, pt) {
            $.each(pt, function(_, p) {
                ctx.fillStyle=get_color(p.type);
                ctx.fillRect(p.x - SZPARTICLE/2.0,p.y - SZPARTICLE/2.0, SZPARTICLE, SZPARTICLE);
                ctx.fill();
            });
        });

    ctx.fillStyle = 'white';
    ctx.fillText("FPS : " + (1000/(ms_this_frame||1)).toFixed(1), 10, 10, 80);
}

function loop() {
    clear();
    update();
    draw();
    queue();
}

loop();
