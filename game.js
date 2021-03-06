let myGamePiece;
let myObstacles = [];
let myScore;
let obstaclesCleared = 0;
let finalScore;
const interval = 10;
const keys = {};
      keys.UP = 87;
      keys.DOWN = 83;
let gameOver = false;
const obstacleWidth = 30;

function resetGame() {
    myGameArea.clear();
    clearInterval(myGameArea.interval);
    startGame();
 }

function startGame() {
    myGamePiece = new component(40, 40, 50, 120, undefined, "player");
    myScore = new component("30px", "Consolas", 280, 40, "black", "text");
    myGameArea.start();
    obstaclesCleared = 0;
    myObstacles = [];
    gameOver = false;
}

var myGameArea = {
    canvas : document.getElementById("game"),
    img : new Image(),
    start : function() {
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, interval);
        this.img.src = "http://pixelnest.io/tutorials/2d-game-unity/player-and-enemies/-img/player.png";
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, x, y, color, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        var ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.beginPath();
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
            ctx.closePath();
        } else if(this.type == "player") {
                ctx.beginPath();    
                ctx.drawImage(myGameArea.img, this.x, this.y,this.width, this.height);
                ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.closePath();
        }
    };
    this.newPos = function(key) {
        if(key == keys.UP) {
             this.y -= 5;
        }
         else if(key == keys.DOWN) {
             this.y += 5;
        }
        this.hitBottom();
    }
    this.hitBottom = function() {
        var minPOS = myGameArea.canvas.height - this.height;
        if (this.y > minPOS) {
            this.y = minPOS;
        }
        if(this.y < 0) {
            this.y = 0;   
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (var i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            gameOver = true;
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(250)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 185;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 60;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(obstacleWidth, height, x, 0, "#8f7e8f"));
        myObstacles.push(new component(obstacleWidth, x - height - gap, x, height + gap, "#8f7e8f"));
    }
    for (var i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    
    myGamePiece.update();
            if(myObstacles[0].x < -obstacleWidth) {
                myObstacles.shift();
                myObstacles.shift();
                obstaclesCleared++;
            }
    myScore.text="SCORE: " + obstaclesCleared;
    myScore.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function move(e) {
    var kc = e.keyCode || e.which;
    keys[kc] = e.type == 'keydown';
      
    if(keys[kc] && gameOver == false){
        myGamePiece.newPos(kc);
    }
}

document.addEventListener("keyup", move);
document.addEventListener("keydown", move);
startGame();