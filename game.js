function startGame() {
    
    FPS = 60;
    
    // Store canvas element and whatever the hell ctx is
    game = document.getElementById("platformer");
    ctx = game.getContext("2d");
    
    // I don't need to explain this -- runs fram every 20 ms
    doFrame();
    
    // Declare bools.
    
    rightKeyDown = false;
    leftKeyDown = false;
    upKeyDown = false;
    touching = false;
    onGround = false;
    level = 1
    
    
    // Declare position variables.
    
    player1 = {x:50, y:602, width:18, height:18, xvel:0, yvel:0, upFrames:0};
    spawnx=10;
    spawny=592;
    
    // Create player 
    
    ctx.fillStyle = "red";
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    
    // Give focus to the canvas so inputs work.
    game.focus();
    
    // Get inputs for when a key is pressed and when it is let go.
    
    game.addEventListener("keydown", doKeyDown, true);
    game.addEventListener("keyup", doKeyUp, true);
    
    //start
    progress(0);
}

function doFrame(){
    setInterval(function(){
        
        ctx.clearRect(Math.round(player1.x), Math.round(player1.y), player1.width, player1.height); // Cleans previous player location.
        
        player1.x+=player1.xvel;
        player1.y-=player1.yvel;
        
        // Prevents falling speeds from exceeding 7.
        if (player1.yvel>-7){
            player1.yvel-=0.4;
        }
        
        // If up key is pressed, you have 6 frames to decide how long to jump for.
        if (upKeyDown & onGround){
            player1.upFrames = 8;
        }
        
        if (upKeyDown & player1.upFrames>0){
            player1.yvel+=1.7-(player1.upFrames*0.06 );
            player1.upFrames--;
        }
        
        if (testCollision()){
            if (player1.yvel<0){
                onGround=true;
            }
            player1.yvel=0;
        }
        else{
            onGround=false;
        }
    
        
        // Slowly decreases rightwards momentum.
        if (player1.xvel>0){
            player1.xvel-=0.75;
            if (player1.xvel<0){
                player1.xvel = 0
            }
        }
        
        // Slowly decreases leftwards momentum
        else if (player1.xvel<0){
            player1.xvel+=0.75;
            if (player1.xvel>0){
                player1.xvel = 0
            }
        }
        
        if (testCollision()){
                player1.xvel=0;
        }
        
        // Allows x inputs but only if not moving faster than 7 xvel.
        if (Math.abs(player1.xvel) < 7){
            
            // Move right
            if (rightKeyDown){
                player1.xvel+=1.1;
            }
            // Move left
            if (leftKeyDown){
                player1.xvel-=1.1;
            }
        }
        
        if (testCollision()){
                player1.xvel=0;
        }
        
        // Renders rectangle
        
        ctx.fillStyle = "red";
        ctx.fillRect(Math.round(player1.x), Math.round(player1.y), player1.width, player1.height);
        
        if (player1.y>720 || deathCollision()){
            die();
        }
        if (player1.x>1270){
            progress(1);
        }
        if (player1.x<10 && level>1){
            progress(-1);
        }
        
    },1000/FPS);
}

function die(){
    ctx.clearRect(Math.round(player1.x), Math.round(player1.y), player1.width, player1.height);
    player1.x=spawnx;
    player1.y=spawny-player1.height;
}

function progress(amount){
    level+=amount;
    if (amount>0) {
        player1.x=10;
        spawnx=50;
    }
    
    else if (amount === 0){
        player1.x=50;
        spawnx=50;
    }
    
    else {
        player1.x=1270;
        spawnx=1230;
    }
    ctx.clearRect(0, 0, game.width, game.height);
    player1.y -= 30;
    
    if (level==1){
        wall = [0, 620, 640, 100, 260, 580, 380, 60, 780, 500, 640, 100];
        death = [0,0,0,0];
        spawny=592;
    }
    if (level==2){
        wall = [0, 500, 640, 100, 640, 500, 640, 500];
        death = [500, 470, 15, 30, 440, 470, 15, 30, 500, 470, 15, 30, 560, 470, 15, 30, 620, 470, 15, 30, 680, 470, 15, 30, 740, 470, 15, 30 , 800, 470, 15, 30];
        spawny=400;
    }
    if (level==3){
        wall = [0, 500, 1280, 500, 250, 430, 40, 20, 670, 430, 40, 20, 1090, 430, 40, 20];
        death = [200, 490, 980, 20];
        spawny=400;
    }
    if (level==4){
        alert("you won, loser");
    }
    displayWalls();
}

function testCollision(){
    var newx = player1.x + player1.xvel;
    var newy = player1.y - player1.yvel;
    var tests = 0;
    
    for (var i=0; i < wall.length/4; i++){
        
        if (newx < wall[0+(i*4)] + wall[2+(i*4)] &&
        newx + player1.width > wall[0+(i*4)] &&
        newy < wall[1+(i*4)] + wall[3+(i*4)] &&
        newy + player1.height > wall[1+(i*4)]) {
            tests++;
        }
        
    }
    if (tests !== 0){
        return true;
    }
    else
        return false;
    }
    
function deathCollision(){
    var newx = player1.x + player1.xvel;
    var newy = player1.y - player1.yvel;
    var tests = 0;
    
    for (var i=0; i < death.length/4; i++){
        
        if (newx < death[0+(i*4)] + death[2+(i*4)] &&
        newx + player1.width > death[0+(i*4)] &&
        newy < death[1+(i*4)] + death[3+(i*4)] &&
        newy + player1.height > death[1+(i*4)]) {
            tests++;
        }
        
    }
    if (tests !== 0){
        return true;
    }
    else
        return false;
    }
    
function doKeyDown(e) {
    if (e.keyCode==37 ) {
        leftKeyDown = true;
    }
    if (e.keyCode==39 ) {
        rightKeyDown = true;
    }
    if (e.keyCode==38 ) {
        upKeyDown = true;
    }
}

function doKeyUp(e) {
    if (e.keyCode==37 ) {
        leftKeyDown = false
    }
    if (e.keyCode==39 ) {
        rightKeyDown = false
    }
    if (e.keyCode==38 ) {
        upKeyDown = false
    }
}
   

function displayWalls(){
    // Create walls
    ctx.fillStyle = "grey";
    for (var i=0; i < wall.length/4; i++){
        ctx.fillRect(wall[0+(4*i)],wall[1+(4*i)],wall[2+(4*i)],wall[3+(4*i)]);
    }
    ctx.fillStyle = "black";
    for (var i=0; i < death.length/4; i++){
        ctx.fillRect(death[0+(4*i)],death[1+(4*i)],death[2+(4*i)],death[3+(4*i)]);
    }
}