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

//game data stuff
var player = null;
var cursor = (canvas.width / scale) / 2;

//animation and timing
var last_time = null, lapse = 0;
function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = last_time - time;
    }

    World.update(lapse);
    player.x = cursor;
    draw_screen();
    requestAnimationFrame(animate);
}

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

    if (player != null) {
        context.fillStyle = "aliceblue";
        context.fillRect(player.x - player.width, player.y, 2 * player.width, player.height);
    }

    balls.forEach((b) => {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(b.x, b.y, 0.3, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
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

function touchmove(e) {
    e.preventDefault();
    cursor = e.touches[0].offsetX / scale;
}

canvas.addEventListener("mousemove", mousemove);
canvas.addEventListener("touchmove", touchmove);

World.init(15, 24, 2);

if (player == null) {
    player = new Player(15, 24, "bottom");
}

World.add_ball(new Ball(player.x, player.y - player.width, {x: 0, y: -1}));

//at the very end, we KicKSTART!
requestAnimationFrame(animate);
