//set up canvas and its context
var canvas  = document.querySelector("canvas");
var context = canvas.getContext("2d");

var aspect_ratio = window.innerHeight / window.innerWidth;

if (aspect_ratio <= 1.6) {
    canvas.height = window.innerHeight - 2;
    canvas.width  = window.innerHeight / 1.6;
    
    canvas.style.top  = "0px";
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + "px";
} else {
    canvas.width  = window.innerWidth - 2;
    canvas.height = window.innerWidth * 1.6;
    
    canvas.style.left = "0px";
    canvas.style.top  = ((window.innerHeight - canvas.height) / 2) + "px";
}

var scale = canvas.width / 15;

context.scale(scale, scale);

//sockets, to connect with the server
var socket = io();

var last_update = 0;
socket.on("server update", function(data) {
    if (data.time > last_update) {
        bricks  = data.bricks;
        balls   = data.balls;
        players = data.players;
    }
});

socket.on("notification", function(text) {
    console.log("notification from server: " + text);
});

//game data stuff
var bricks  = [];
var balls   = [];
var players = [];
var cursor  = (canvas.width / scale) / 2;

//animation and sending updates to the server. yeah, I know, weird.
var last_time = null, lapse = 0, need_update = true;
function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    last_time = time;
    
    if (need_update)  {
        socket.emit("client update", {
            //data to send:
            //[x] player's cursor position (X only)
            //[x] the time
            x: cursor,
            time: new Date().getTime(),
        });
    }
    
    need_update = !need_update;
    
    draw_screen();
    
    requestAnimationFrame(animate);
}

//draws what the player sees
function draw_screen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var y = 0; y < 24; y++) {
        for (var x = 0; x < 15; x++) {
            var b = bricks[y * 15 + x];
            
            if (b == undefined) {
                continue;
            }
            
            context.fillStyle = get_colour(b);
            context.fillRect(x, y, 1, 1);
        }
    }
    
    players.forEach((p) => {
        if (p != null) {
            context.fillStyle = "aliceblue";
            context.fillRect(p.x - p.width, p.y, 2 * p.width, p.height);
        }
    });
}

//helper function
function get_colour(c) {
    if (c == undefined) {
        return "rgba(0, 0, 0, 1)";
    }
    
    if (c.alpha != undefined) {
        return "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.alpha + ")";
    } else {
        return "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
    }
}

//event handlers. and don't forget to add them to the canvas
function mousemove(e) {
    e.preventDefault();
    
    cursor = e.offsetX / scale;
}

canvas.addEventListener("mousemove", mousemove);

//add in mobile support later

//at the very end, we KicKSTART!
requestAnimationFrame(animate);