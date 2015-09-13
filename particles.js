
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
      this.position = point || new Vector(0, 0);
      this.velocity = velocity || new Vector(0, 0);
      this.acceleration = acceleration || new Vector(0, 0);
      this.type = type || 0;
}

Particle.prototype.update = function () {
    var min_dist = c.width;

    check_list = particles[(this.type + 1) % 3];

    for (var i = 0; i < check_list.length; i++) {
        var p = check_list[i];
        if(check_list[i] === this) continue;

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
    this.position.add(this.velocity);

    if (this.position.x <= 0) {
        this.position.x = -(this.position.x);
        this.velocity.x *= -1;
    }
    if (this.position.x >= c.width) {
        this.position.x = c.width - (this.position.x - c.width);
        this.velocity.x *= -1;
    }

    if (this.position.y <= 0) {
        this.position.y = -(this.position.y);
        this.velocity.y *= -1;
    }
    if (this.position.y >= c.height) {
        this.position.y = c.height - (this.position.y - c.height);
        this.velocity.y *= -1;
    }
};

Particle.prototype.distanceTo = function (p) {
    return Math.sqrt(Math.pow(this.position.x - p.position.x, 2) + Math.pow(this.position.y - p.position.y, 2))
}
