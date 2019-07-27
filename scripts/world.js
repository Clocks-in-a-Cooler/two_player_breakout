var Misc_math = require(__dirname + "/misc_math.js");
var Colours   = require(__dirname + "/colours.js");
var Brick     = require(__dirname + "/brick.js");

var bricks = [];
var balls  = [];

var World = {
    width: null,
    height: null,
    
    init: function(width, height, thickness) {
        this.width  = width;
        this.height = height;
        
        bricks = new Array(width * height);
        
        var start_y = Math.floor((height - thickness) / 2);
        var end_y   = Math.ceil((height + thickness) / 2);
        
        for (var b = start_y; b <= end_y; b++) {
            for (var a = 0; a < width; a++) {
                bricks[b * width + a] = new Brick(Colours.random());
            }
        }
    },
    
    get_brick: function(x, y) {
        return bricks[y * this.width + x];
    },
};

module.exports = World;