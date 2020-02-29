var tankHealth = 3; //how many lives the tank has


//var timeTaken;
//var cashCollected;

var gameCrates = [];	//to store crates
var gameWalls = [];	//to store walls

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500; //setting dimensions of canvas
        this.canvas.height = 900;
        this.context = this.canvas.getContext("2d"); 
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0; //creating frame property
        this.interval = setInterval(gameUpdate, 20);
		
        window.addEventListener('keydown', function (keyPress) { //listens to keys input by user
            keyPress.preventDefault(); 
            gameArea.keys = (gameArea.keys || []); //adds key press to array
            gameArea.keys[keyPress.keyCode] = (keyPress.type == "keydown"); 
        })
        window.addEventListener('keyup', function (keyPress) {
            gameArea.keys[keyPress.keyCode] = (keyPress.type == "keydown");
        })
    },
	//STOP GAMEc
    stop : function() {
        clearInterval(this.interval); //stop interval
    },
	//CLEAR GAME
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
	
}
//function finishGame(){
//	gameArea.stop();
//	gameArea.clear();
//}
	

function gameOver(){
	gameArea.stop();
	gameArea.clear();
	console.log("gamed ended");
	var gameOverImage = new Image();
	gameOverImage.onload = function() {
		ctx.drawImage(gameOverImage,0 ,0);
	}
	gameOverImage.src = "gameover.png";
}

function everyinterval(n) {
  if ((gameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}


function Component(width, height, color, x, y, type, state) {

	//Properties
    this.type = type;
	if (type == "tank" || type == "image" || type == "backgroud") {
		this.image = new Image();
		this.image.src = color;
	}
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
	this.color = color;
	this.state = state;


    //Update Function
    this.update = function() {
        ctx = gameArea.context;
		//Image type Component
		if (type == "tank") {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			//ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			ctx.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
			ctx.restore(); 
		}
		else if (type == "image") {
			ctx.save();
			//ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			//ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			ctx.drawImage(this.image, this.x, this.y);
			ctx.restore(); 
		}

		//No type assigned
		else {
			ctx = gameArea.context;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
    }
	//FUNCTION TO CALCULATE NEW POSITION OF TANK USING ANGLES
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
	//FIXING POSITION OF TURRET TO TANK
	this.turretFixed = function() {
		this.x = playerTank.x; //Fixes the x coordinate of the turret object to the x coordinate of the tank body object
		this.y = playerTank.y -15; //Fixes the y coordinate of the turret object to the y coordinate of the tank body object -15 to centre it. 
	}
	//FIXING POSITION OF SQUARE HITBOX TO CENTRE OF TANK
	this.detectionBoxFixed = function() {
		this.x = playerTank.x -15 ; //Fixes the x coordinate of the turret object to the x coordinate of the tank body object
		this.y = playerTank.y -20;
	}
	
	//COLLISION DETECTION
	this.crashWith = function(checkObject) {
		this.collidedWith = checkObject; //records the object that it was last checked against
		//player tank
		var tankLeft = this.x;
		var tankRight = this.x + (this.width);
		var tankTop = this.y;
		var tankBottom = this.y + (this.height);
		//object being checked for collision
		var checkObjLeft = checkObject.x;
		var checkObjRight = checkObject.x + (checkObject.width);
		var checkObjTop = checkObject.y;
		var checkObjBottom = checkObject.y + (checkObject.height);
		var hasCollided = true; //set to true by default
		if ((tankBottom < checkObjTop) || (tankTop > checkObjBottom) ||(tankRight < checkObjLeft) || (tankLeft > checkObjRight)) {
			hasCollided = false; //is changed to false if no collision is detected
		}
		return hasCollided; //returns true/false to function
	}
	
	
	this.crateChange = function(checkObject){
		//checkObject.state = "off";
		checkObject.image.src = "crate80broken.png";
	}
	/* this.tankDestroyed = function(){
		this.image.src = "tankdestroyed.png"; */
	//}
	this.healthUpdate = function(){
		switch (tankHealth) {
			case 0:
			healthBar.image.src = "healthbar0.png"; // SKULL
			//this.tankDestroyed();
			break;
			case 1:
			healthBar.image.src = "healthbar1.png"; //1 HEART
			break;
			case 2:
			healthBar.image.src = "healthbar2.png"; //2 HEARTS
			break;
			case 3:
			healthBar.image.src = "healthbar3.png"; //3 HEARTS
			break;
		}
		
	}
			
}

function startGame() {
	document.getElementById("btnstart").disabled = true;
	document.getElementById("btnrestart").disabled = false;
	turret = new Component(22, 55, "tankturret.png", 400, 400, "tank", "active");
	playerTank = new Component(40, 68, "tankbody.png", 250, 800, "tank", "active");
	//background = new Component(500, 1000, "BACK.png", 0, -500, "image", "active");
	finishBar = new Component(500, 40, "finish.png", 0, 0, "image", "active");
	healthBar = new Component(500, 40, "healthbar3.png", 0, 860, "image", "active");
	detectionBox = new Component(30 ,30, "transparent", 250, 400, "detection", "active");
	//gameOverScreen = new Component(500, 900, "gameover.png", 0 , 0, "image", "active");
    gameArea.start();
}
//CHECKING FOR COLLISIONS BETWEEN CRATES AND TANK
function gameUpdate() {
	for (i = 0; i < gameCrates.length; i += 1) {
		if (detectionBox.crashWith(gameCrates[i])) { //If it collides with crates or wals
			var collision = detectionBox.collidedWith; //Stores object that the dectection box collides with
			//console.log("The collision was with",detectionBox,"and",collision);
			detectionBox.crateChange(collision); //uses the object that the tank collided with and uses it in the function to change img src of crate
			break;
		} 
	}
	//CHECKING FOR COLLISIONS BETWEEN WALLS AND TANK
	for (i = 0; i < gameWalls.length; i += 1) {
		if (detectionBox.crashWith(gameWalls[i])) { //checks if player tank collides with walls			
			var collision = detectionBox.collidedWith;
			tankHealth += -1; //REDUCES TANK HEALTH BY 1
			playerTank.healthUpdate(tankHealth); //updates the switch that changes the lives bar at the bottom of the screen
			for (i = 0; i < gameWalls.length; i += 1) { //Loop through all walls using the length as the upper limit
				if (gameWalls[i].y >= 600){ //checks to see if there are walls below y=600
					gameWalls[i].state = "off"; //turns their state to off
					gameWalls[i].x = 500; //moves them off canvas
				}
			}
			for (i = 0; i < gameCrates.length; i += 1) {	//Loop through all crates using the length as the upper limit
				if (gameCrates[i].y >= 600){ //checks if there are crates below y=600
					gameCrates[i].state = "off"; //changes their status to off
					gameCrates[i].x = 500; //moves them off canvas
				}
			}
			playerTank.x = 250; //moves player's tank back to centre x
			playerTank.y = 800; //moves player's tank to bottom of canvas
			//tankHealth += -1; //removes 1 from the tank's health
		} 
	}
	
	
	
	
	//REACH THE finishBar LINE
	if (detectionBox.crashWith(finishBar)) {
		gameArea.stop();
		gameArea.clear();
		console.log("gamed ended");
		var gameFinishedImage = new Image();
		gameFinishedImage.onload = function() {
			ctx.drawImage(gameFinishedImage,0 ,0);
		}
		gameFinishedImage.src = "gamefinished.png";
	}
		
	
	
	//GENERATING NEW OBSTACLES USING INTERVAL AND RANDOM SELECTOR
	gameArea.clear();
	gameArea.frameNo += 1;
	var min = 0
	var max = 3
	var random = Math.floor(Math.random()*(max - min)) + min;
	//console.log(random);
	if ( gameArea.frameNo == 1 ||  everyinterval(400)) {
		//x = gameArea.canvas.width;
		//y = gameArea.canvas.height;
		switch (random) {
			case 0:
				gameWalls.push(new Component(300, 40, "wall300.png", 0, -40, "image", "active"));
				gameWalls.push(new Component(100, 40, "wall100.png", 400, -40, "image", "active"));
				gameCrates.push(new Component(80, 40, "crate80.png", 310, -40, "image", "active"));
				//gameCrates.push(new Component(40, 40, "crate.png", 353, -45, "image", "active"));
				break;
			case 1: 
				gameWalls.push(new Component(100, 40, "wall100.png", 0, -40, "image", "active"));
				gameWalls.push(new Component(300, 40, "wall300.png", 200, -40, "image", "active"));
				gameCrates.push(new Component(80, 40, "crate80.png", 110, -40, "image", "active"));
				//gameCrates.push(new Component(40, 40, "crate.png", 153, -45, "image", "active"));
				break;
			case 2:
				gameWalls.push(new Component(200, 40, "wall200.png", 0, -40, "image", "active"));
				gameWalls.push(new Component(200, 40, "wall200.png", 300, -40, "image", "active"));
				gameCrates.push(new Component(80, 40, "crate80.png", 210, -40, "image", "active"));
				//gameCrates.push(new Component(40, 40, "crate.png", 253, -45, "image", "active"));
				break;
		}
	}
	//UPDATES EACH OBSTACLE AND MOVES INCREASES Y EACH TIME TO MOVE DOWN THE SCREEN
	for (i = 0; i < gameWalls.length; i += 1) {
		if (gameWalls[i].state == "active"){
			gameWalls[i].y += 0.5;
			gameWalls[i].update();
		}
	}
	for (i = 0; i < gameCrates.length; i += 1) {	
		if (gameCrates[i].state == "active"){
			gameCrates[i].y += 0.5;
			gameCrates[i].update();
		}
	}
	
	//PREVENTS THE TANK FROM CONSTANTLY TURNING / MOVING FORWARD
    playerTank.moveAngle = 0;
    playerTank.speed = 0;

	//EVENT LISTENER FOR KEY PRESSES
	
    if (gameArea.keys && gameArea.keys[37]) {playerTank.moveAngle = -1; }
    if (gameArea.keys && gameArea.keys[39]) {playerTank.moveAngle = 1; }
    if (gameArea.keys && gameArea.keys[38]) {playerTank.speed= 1; }
    if (gameArea.keys && gameArea.keys[40]) {playerTank.speed= -1; }
    
	//REDRAWS THE COMPONENTS
	//ctx.font = "30px Arial";
	//ctx.fillText("Hello World", 10, 50);
	
	playerTank.newPos();
    playerTank.update();
	
	turret.turretFixed();
	turret.update();
	
	finishBar.newPos();
	finishBar.update()
	
	healthBar.newPos();
	healthBar.update();
	
	detectionBox.detectionBoxFixed();
	detectionBox.update();
	if (tankHealth <= 0){
		gameOver();
	}
}