var Misc_math = require(__dirname + "/misc_math.js");
var Colours   = require(__dirname + "/colours.js");
var Brick     = require(__dirname + "/brick.js");
var log       = require(__dirname + "/logging.js");

var bricks  = [];
var balls   = [];

var last_update = null, lapse = 0;
function update() {
    var time = new Date().getTime();
    if (last_update == null) {
        lapse = 0;
    } else {
        lapse = time - last_update;
    }
    last_update = time;
    
    if (lapse > 100) {
        log("lapse too large! (" + lapse + "ms). Setting lapse to 100.", "warning");
        lapse = 100;
    }
    
    for (var c = 0; c < bricks.length; c++) {
        if (bricks[c] == null) {
            continue;
        }
        
        if (bricks[c].health <= 0) {
            bricks[c] = null;
        }
    }
    
    balls = balls.filter((b) => { return b.active; });
    balls.forEach((b) => { b.update(lapse); });
    
    setImmediate(update);
}

var World = {
    width: null,
    height: null,
    
    init: function(width, height, thickness) {
        this.width  = width;
        this.height = height;
        
        bricks = new Array(width * height).fill(null);
        
        var start_y = Math.floor((height - thickness) / 2);
        var end_y   = Math.ceil((height + thickness) / 2);
        
        for (var b = start_y; b <= end_y; b++) {
            for (var a = 0; a < width; a++) {
                bricks[b * width + a] = new Brick(Colours.random());
            }
        }
        
        setImmediate(update);
    },
    
    generate_new_wall: function(thickness) {
        bricks = new Array(width * height).fill(null);
        
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
    
    get all_bricks() {
        //surprise! only returns their colours
        return bricks.map((b) => {
            if (b != null) {
                return b.colour;
            } else {
                return {r: 0, g: 0, b: 0};
            }
        });
    },
    
    get all_balls() {
        return balls.map((b) => {
            return {x: b.x, y: b.y};
        });
    },
    
    start_level: function(b) {
        balls = b;
    },
    
    add_ball: function(ball) {
        debugger;
        balls.push(ball);
    },
};

module.exports = World;