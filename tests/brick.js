function Brick(colour, x, y, health) {
    this.colour = colour || {r: 255, g: 105, b: 180};
    this.health = isNaN(health) && health > 0 ? health : 1;

    this.x = x;
    this.y = y;
}

Brick.prototype.collide = function() {
    this.health--;
};
