var World = require(__dirname + "/world.js");

function Ball(x, y, v, colour) {
    this.x = x;
    this.y = y;
    this.v = v;
    
    this.colour = colour || {r: 255, g: 255, b: 255};
    
    this.active = true;
}

Ball.prototype.radius = 0.3;

Ball.prototype.update = function(lapse) {
    this.x += this.v.x * (lapse / 1000);
    this.y += this.v.y * (lapse / 1000);
    
    //check for collision
    // guide:
    // 0 2
    // 1 3
    
    var colliding_bricks = this.get_overlapping_bricks();
    var upper_limit = this.y - this.radius;
    var lower_limit = this.y + this.radius;
    var left_limit  = this.x - this.radius;
    var right_limit = this.x + this.radius;
    
    if (colliding_bricks[0] != null || colliding_bricks[1] != null || colliding_bricks[2] != null || colliding_bricks[3] != null) {
        debugger;
    }
    
    //for brick in position 0
    if (colliding_bricks[0] != null) {
        //check for x
        if (left_limit < colliding_bricks[0].x && this.v.x < 0) {
            colliding_bricks[0].collide();
            this.v.x *= -1;
        }
        
        //check for y
        if (upper_limit < colliding_bricks[0].y && this.v.y < 0) {
            colliding_bricks[0].collide();
            this.v.y *= -1;
        }
    }
    
    //and so on...
    if (colliding_bricks[1] != null) {
        //check for x
        if (left_limit < colliding_bricks[1].x && this.v.x < 0) {
            colliding_bricks[1].collide();
            this.v.x *= -1;
        }
        
        //check for y
        if (lower_limit > colliding_bricks[1].y && this.v.y > 0) {
            colliding_bricks[1].collide();
            this.v.y *= -1;
        }
    }
    
    if (colliding_bricks[2] != null) {
        //check for x
        if (right_limit > colliding_bricks[2].x && this.v.x > 0) {
            colliding_bricks[2].collide();
            this.v.x *= -1;
        }
        
        //check for y
        if (upper_limit < colliding_bricks[2].y && this.v.y < 0) {
            colliding_bricks[2].collide();
            this.v.y *= -1;
        }
    }
    
    if (colliding_bricks[3] != null) {
        //check for x
        if (right_limit > colliding_bricks[3].x && this.v.x > 0) {
            colliding_bricks[3].collide();
            this.v.x *= -1;
        }
        
        //check for y
        if (lower_limit > colliding_bricks[3].y && this.v.y > 0) {
            colliding_bricks[3].collide();
            this.v.y *= -1;
        }
    }
    
    if (right_limit > World.width || left_limit < 0) {
        this.v.x *= -1;
    }
    
    //for now
    if (lower_limit > World.height || upper_limit < 0) {
        this.v.y *= -1;
    }
};

Ball.prototype.get_overlapping_bricks = function() {
    var start_x = Math.floor(this.x);
    var start_y = Math.floor(this.y);
    var end_x   = Math.ceil(this.x);
    var end_y   = Math.ceil(this.y);
    
    if (start_x == end_x) {
        if (this.v.x <= 0 || this.x > World.width) {
            start_x--;
        } else if (this.v.x > 0 || this.x < 0) {
            end_x++;
        }
    }
    
    if (start_y == end_y) {
        if (this.v.y <= 0 || this.y > World.height) {
            start_y--;
        } else if (this.v.y > 0 || this.y < 0) {
            end_y++;
        }
    }
    
    return [
        World.get_brick(start_x, start_y),
        World.get_brick(start_x, end_y),
        World.get_brick(end_x, start_y),
        World.get_brick(end_x, end_y),
    ];
};

module.exports = Ball;