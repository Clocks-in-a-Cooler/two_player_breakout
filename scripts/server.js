//handles server stuff

//load some external modules
var express = require("express");
var app     = express();
var server  = require("http").createServer(app);

//load modules from the scripts folder
var log    = require(__dirname + "/logging.js");
var World  = require(__dirname + "/world.js");
var Player = require(__dirname + "/player.js");
var Ball   = require(__dirname + "/ball.js");

World.init(15, 24, 10);

//the goal: set up a bare bones framework, then build on it.

//set up express resources
app.use(express.static("./webpage"));

//when a client first connects
app.get("/", function(req, res) {
    log("incoming connection from: " + (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress), "notification");
    res.sendFile("./webpage/index.html");
})

//the socket part
var io      = require("socket.io").listen(server);
var player1 = null;
var player2 = null;

io.on("connection", function(socket) {
    var last_update = null;
    var player      = null;
    
    socket.on("client update", function(data) {
        if (player == null) {
            //assign player one or two
            if (player1 == null) {
                //assign player one
                socket.emit("notification", "you are player one.");
                player = player1 = new Player(World.width, World.height, "top");
                World.add_ball(new Ball(player.x, player.width, {x: 0, y: 1}));
            } else if (player1 != null && player2 == null) {
                //assign player two
                socket.emit("notification", "you are player two.");
                player = player2 = new Player(World.width, World.height, "bottom");
                World.add_ball(new Ball(player.x, World.height - player.width, {x: 0, y: -1}));
            } else if (player1 != null && player2 != null) {
                //server has problems
            } else {
                //server *really* has problems
                throw new Error("this block is not supposed to be reached.");
            }
        }
        
        player.x = data.x;
        
        socket.emit("server update", {
            bricks: World.all_bricks,
            balls: World.all_balls,
            players: [player1, player2],
            time: new Date().getTime(),
        });
    });
    
    socket.on("disconnect", function() {
        if (player == player1) {
            player1 = null;
            log("player 1 disconnected.", "notification");
        }
        
        if (player == player2) {
            player2 = null;
            log("player 2 disconnected.", "notification");
        }
    });
});

//for game events
var Events = require("events");

var Game_events = new Events.EventEmitter();

var default_port = 3000;
module.exports   = function(port) {
    if (isNaN(port)) {
        port = default_port;
    }
    
    server.listen(port, function() {
        log("== NEW SERVER SESSION ==", "notification");
        log("http server listening on port " + port + ".", "notification");
    });
}