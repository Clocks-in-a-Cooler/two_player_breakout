function Player(world_width, world_height, position) {
    //i can afford to do this since there are only going to be two players
    this.width  = 1.5;
    this.height = 0.5;

    if (position == "top") {
        this.y = 0;
    } else if (position == "bottom") {
        this.y = world_height - this.height;
    }

    this.x = world_width / 2;
}

Player.prototype.get_hit_angle = function(ball) {
    var other_point = {};

    other_point.x = this.x;

    if (this.position == "top") {
        other_point.y = this.y - this.width;
    } else if (this.position == "bottom") {
        other_point.y = this.y + this.width;
    }

    return Misc_math.get_angle(other_point, ball);
};
