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

module.exports = Player;