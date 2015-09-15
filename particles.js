
function Vector(x, y) {
      this.x = x || 0;
      this.y = y || 0;
}

// Add a vector to another
Vector.prototype.add = function(vector) {
      this.x += vector.x;
      this.y += vector.y;
}
 
// Gets the length of the vector
Vector.prototype.getMagnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

// Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function () {
    return Math.atan2(this.y,this.x);
};
 
// Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function (angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

function Particle(point, velocity, acceleration, type) {
      this.x = point.x;
      this.y = point.y;
      this.velocity = velocity || new Vector(0, 0);
      this.acceleration = acceleration || new Vector(0, 0);
      this.type = type || 0;
}

Particle.prototype.update_kdtree = function () {
    var min_dist = c.width;

    check_list = particles[(this.type + 1) % 3];

    if(tree_last_type !== (this.type + 1) % 3) {
        tree = new kdTree(check_list, distance, ["x", "y"]);
        tree_last_type = (this.type + 1) % 3;
    }

    asd = tree.nearest(this, 1);

    if(asd.length !== 0) {
        var dist = asd[0][1];
        var p = asd[0][0];
        if(dist < (VISIBILITY*VISIBILITY) && dist < min_dist) {
            //When any red(0) agent detects a green(1) agent, it gets contagious and turns green(1). 
            //When any green(1) agent detects a blue(2) agent, it gets blue(2). 
            //And when any blue(2) agent detects a red(0) agent, it gets red(0)

            min_dist = dist;
            if(this.type === 0 && p.type === 1)
                this.type = 1;
            if(this.type === 1 && p.type === 2)
                this.type = 2;
            if(this.type === 2 && p.type === 0)
                this.type = 0;
        }
    }

    this.move();
}

Particle.prototype.update = function () {
    var min_dist = c.width;

    check_list = particles[(this.type + 1) % 3];

    for (var i = 0; i < check_list.length; i++) {
        var p = check_list[i];
        if(check_list[i] === this) continue;

        if(p.x - this.x > 10 || this.x - p.x > 10 ) continue;
        if(p.y - this.y > 10 || this.y - p.y > 10 ) continue;
        var dist = this.distanceTo(p);
        if(dist < VISIBILITY && dist < min_dist) {
            //When any red(0) agent detects a green(1) agent, it gets contagious and turns green(1). 
            //When any green(1) agent detects a blue(2) agent, it gets blue(2). 
            //And when any blue(2) agent detects a red(0) agent, it gets red(0)

            min_dist = dist;
            if(this.type === 0 && p.type === 1)
                this.type = 1;
            if(this.type === 1 && p.type === 2)
                this.type = 2;
            if(this.type === 2 && p.type === 0)
                this.type = 0;
        }
    }

    this.move();
}

Particle.prototype.move = function () {
    // Add our current acceleration to our current velocity
    this.velocity.add(this.acceleration);

    // Add our current velocity to our position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x <= 0) {
        this.x = -(this.x);
        this.velocity.x *= -1;
    }
    if (this.x >= c.width) {
        this.x = c.width - (this.x - c.width);
        this.velocity.x *= -1;
    }

    if (this.y <= 0) {
        this.y = -(this.y);
        this.velocity.y *= -1;
    }
    if (this.y >= c.height) {
        this.y = c.height - (this.y - c.height);
        this.velocity.y *= -1;
    }
};

Particle.prototype.distanceTo = function (p) {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2))
}
