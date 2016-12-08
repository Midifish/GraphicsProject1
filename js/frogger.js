var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//load textures
var backgroundTexture = new THREE.TextureLoader().load( 'images/froggerbackground.png' );
var frogTexture = new THREE.TextureLoader().load( 'images/frog_up.png' );
var car1Texture = new THREE.TextureLoader().load( 'images/car1.png' );
var car2Texture = new THREE.TextureLoader().load( 'images/car2.png' );
var car3Texture = new THREE.TextureLoader().load( 'images/car3.png' );
var car4Texture = new THREE.TextureLoader().load( 'images/car4.png' );
var car5Texture = new THREE.TextureLoader().load( 'images/car5.png' );
var log1Texture = new THREE.TextureLoader().load( 'images/log1.png' );
var padTexture = new THREE.TextureLoader().load( 'images/frogger_pad.png' );
var turtleTexture = new THREE.TextureLoader().load( 'images/turtle.png' );
var starTexture = new THREE.TextureLoader().load( 'images/star.png' );

//load geometries
var backgroundGeometry = new THREE.BoxGeometry(6, 7, 0.1);
var frogGeometry = new THREE.BoxGeometry( .25, .25, .1);
var cubeGeometry = new THREE.BoxGeometry( .5, .4, .25 );
var shortBoxGeometry = new THREE.BoxGeometry( .75, .4, .25);
var mediumBoxGeometry = new THREE.BoxGeometry( 1.5, .4, .25);
var longBoxGeometry = new THREE.BoxGeometry( 2, .5, .25);

//create materials
var backgroundMaterial = new THREE.MeshBasicMaterial( { map: backgroundTexture } )
var frogMaterial = new THREE.MeshBasicMaterial( { map: frogTexture } );
var car1Material = new THREE.MeshBasicMaterial( { map: car1Texture } );
var car2Material = new THREE.MeshBasicMaterial( { map: car2Texture } );
var car3Material = new THREE.MeshBasicMaterial( { map: car3Texture } );
var car4Material = new THREE.MeshBasicMaterial( { map: car4Texture } );
var car5Material = new THREE.MeshBasicMaterial( { map: car5Texture } );
var log1Material = new THREE.MeshBasicMaterial( { map: log1Texture } );
var padMaterial = new THREE.MeshBasicMaterial( { map: padTexture } );
var turtleMaterial = new THREE.MeshBasicMaterial( { map: turtleTexture} );
var starMaterial = new THREE.MeshBasicMaterial( {map: starTexture } );
//create objects
var gameObjects = [];
var origPos = [];
var objSpeeds = [];
var background = new THREE.Mesh( backgroundGeometry, backgroundMaterial)
var frog = new THREE.Mesh( frogGeometry, frogMaterial );
var car1a = new THREE.Mesh( cubeGeometry, car1Material );
var car1b = new THREE.Mesh( cubeGeometry, car1Material );
var car1c = new THREE.Mesh( cubeGeometry, car1Material );
var car2a = new THREE.Mesh( cubeGeometry, car2Material );
var car2b = new THREE.Mesh( cubeGeometry, car2Material );
var car2c = new THREE.Mesh( cubeGeometry, car2Material );
var car3a = new THREE.Mesh( shortBoxGeometry, car3Material );
var car3b = new THREE.Mesh( shortBoxGeometry, car3Material );
var car3c = new THREE.Mesh( shortBoxGeometry, car3Material );
var car4a = new THREE.Mesh( cubeGeometry, car4Material );
var car4b = new THREE.Mesh( cubeGeometry, car4Material );
var car4c = new THREE.Mesh( cubeGeometry, car4Material );
var car5a = new THREE.Mesh( mediumBoxGeometry, car5Material );
var car5b = new THREE.Mesh( mediumBoxGeometry, car5Material );
var log1a = new THREE.Mesh( longBoxGeometry, log1Material );
var log2a = new THREE.Mesh( mediumBoxGeometry, log1Material );
var log2b = new THREE.Mesh( mediumBoxGeometry, log1Material );
var log3a = new THREE.Mesh( mediumBoxGeometry, log1Material );
var log5a = new THREE.Mesh( longBoxGeometry, log1Material );
var pad1 = new THREE.Mesh( frogGeometry, padMaterial );
var pad2 = new THREE.Mesh( frogGeometry, padMaterial );
var pad3 = new THREE.Mesh( frogGeometry, padMaterial );
var pad4 = new THREE.Mesh( frogGeometry, padMaterial );
var pad5 = new THREE.Mesh( frogGeometry, padMaterial );
var turtle1 = new THREE.Mesh( cubeGeometry, turtleMaterial );
var turtle2 = new THREE.Mesh( cubeGeometry, turtleMaterial );
var turtle3 = new THREE.Mesh( cubeGeometry, turtleMaterial );
var star1 = new THREE.Mesh( frogGeometry, starMaterial );
var star2 = new THREE.Mesh( frogGeometry, starMaterial );
var star3 = new THREE.Mesh( frogGeometry, starMaterial );
var star4 = new THREE.Mesh( frogGeometry, starMaterial );
var star5 = new THREE.Mesh( frogGeometry, starMaterial );

//game parameters
var objSpeed = 0.05;
var objStandingOnIdx = -1;
var lives = 3;
var livesElement;
var currMaxDist = -3.25;
var points = 0;
var level = 1;

//audio files
var jump = new Audio('sounds/sound-frogger-hop.wav');
var squash = new Audio('sounds/sound-frogger-squash.wav');
var coin = new Audio('sounds/sound-frogger-coin-in.wav');
var plunk = new Audio('sounds/sound-frogger-plunk.wav');
var theme = new Audio('sounds/sound-frogger-theme.wav');
var gameover = new Audio('sounds/sound-frogger-gameover.mp3');
var win = new Audio('sounds/sound-frogger-win.wav');

theme.loop = true;
theme.play();

init();
update();

function init()
{
	livesElement = document.getElementById("lives");
    livesElement.innerHTML = "Lives: " + lives;            
	pointsElement = document.getElementById("score");
    pointsElement.innerHTML = "Score: " + points; 
	levelElement = document.getElementById("level");
    levelElement.innerHTML = "Level: " + level; 
	scene.add(background);
	//camera.position.z = 5;
	camera.position.set(.24,6,1.5);
	camera.rotation.x = Math.PI/4;
	//add game objects to array
	gameObjects.push(car1a);
	gameObjects.push(car1b);
	gameObjects.push(car1c);
	gameObjects.push(car2a);
	gameObjects.push(car2b);
	gameObjects.push(car2c);
	gameObjects.push(car3a);
	gameObjects.push(car3b);
	gameObjects.push(car3c);
	gameObjects.push(car4a);
	gameObjects.push(car4b);
	gameObjects.push(car4c);
	gameObjects.push(car5a);
	gameObjects.push(car5b);
	gameObjects.push(log1a);
	gameObjects.push(log2a);
	gameObjects.push(log2b);
	gameObjects.push(turtle1);
	gameObjects.push(turtle2);
	gameObjects.push(turtle3);
	gameObjects.push(log3a);
	gameObjects.push(log5a);
	gameObjects.push(pad1);
	gameObjects.push(pad2);
	gameObjects.push(pad3);
	gameObjects.push(pad4);
	gameObjects.push(pad5);
	gameObjects.push(star1);
	gameObjects.push(star2);
	gameObjects.push(star3);
	gameObjects.push(star4);
	gameObjects.push(star5);

	//initialize player object
	frog.position.set(0.24, -3.25, frog.geometry.parameters.depth);
	var objOrigPosVec = new THREE.Vector2(frog.position.x, frog.position.y);
	origPos.push(objOrigPosVec);
	scene.add(frog);

	var row = -2.75 - 0.52;
	var columnOrig = -2.75;
	var column = columnOrig;
	var speed = objSpeed/15;
	//initialize cars
	for(var idx = 0; idx < 14; idx++)
	{
		//new row
		if(idx % 3 == 0)
		{
			row += 0.52;
			columnOrig *= -1;
			column = columnOrig;
			speed+= objSpeed/20 * speed/Math.abs(speed);
			speed*=-1;
			//save original positions
			objOrigPosVec = new THREE.Vector2(column + (gameObjects[idx].geometry.parameters.width/2 * columnOrig/Math.abs(columnOrig)), row);
			origPos.push(objOrigPosVec);
			origPos.push(objOrigPosVec);
			if(idx != 12)
				origPos.push(objOrigPosVec);
		}
		column += ((5.5) * ((idx % 3) + 1)/4 * -columnOrig/Math.abs(columnOrig));
		objSpeeds[idx] = speed;
		gameObjects[idx].position.set(column, row, gameObjects[idx].geometry.parameters.depth/2);
		scene.add(gameObjects[idx]);
	}
	row+=0.52;
	speed*=-1;
	columnOrig*=-1;
	//initialize logs & turtles
	for(var idx = 14; idx < (gameObjects.length - 10); idx++)
	{
		//new row
		if(idx == 14 || idx ==15 || idx == 17 || idx == 20 || idx == 21)
		{
			row += 0.52;
			columnOrig *= -1;
			column = columnOrig;
			speed+= objSpeed/20 * speed/Math.abs(speed);
			speed*=-1;
			//save original positions
			objOrigPosVec = new THREE.Vector2(column + (gameObjects[idx].geometry.parameters.width/2 * columnOrig/Math.abs(columnOrig)), row);
			if(idx == 14 || idx == 20 || idx == 21)
			{
				origPos.push(objOrigPosVec);
			}
			if(idx == 15)
			{
				origPos.push(objOrigPosVec);
				origPos.push(objOrigPosVec);				
			}
			//turtles
			if(idx == 17)
			{
				origPos.push(objOrigPosVec);
				origPos.push(objOrigPosVec);		
				origPos.push(objOrigPosVec);
			}
		}
		column += ((5.5) * ((idx % 3) + 1)/5 * -columnOrig/Math.abs(columnOrig));
		if(idx > 16 && idx < 20)
			objSpeeds[idx] = speed/4;
		else if(idx == 21)
			objSpeeds[idx] = speed/2;
		else
			objSpeeds[idx] = speed;
		gameObjects[idx].position.set(column,row,0);
		scene.add(gameObjects[idx]);
	}
	row+=.52;
	//initialize pads
	pad1.position.set(-2.55,row,0.05);
	pad2.position.set(-1.25,row,0.05);
	pad3.position.set(0,row,0.05);
	pad4.position.set(1.25,row,0.05);
	pad5.position.set(2.55,row,0.05);

	star1.position.set(-2.55,row,-1);
	star2.position.set(-1.25,row,-1);
	star3.position.set(0,row,-1);
	star4.position.set(1.25,row,-1);
	star5.position.set(2.55,row,-1);
	star1.rotation.x = Math.PI/2;
	star2.rotation.x = Math.PI/2;
	star3.rotation.x = Math.PI/2;
	star4.rotation.x = Math.PI/2;
	star5.rotation.x = Math.PI/2;

	scene.add(pad1);
	scene.add(pad2);
	scene.add(pad3);
	scene.add(pad4);
	scene.add(pad5);
	scene.add(star1);
	scene.add(star2);
	scene.add(star3);
	scene.add(star4);
	scene.add(star5);

}


document.onkeydown = handleKeyDown; // call this when key pressed

// does stuff when keys are pressed
function handleKeyDown(event) {
	objStandingOnIdx = -1;
	if(lives != 0)
	{
		jump.pause();
		jump.currentTime = 0;
	    jump.play();
	    switch (event.code) {
	        // model transformation
	        case "KeyW": // translate left, rotate left with shift
	        		frog.rotation.z=0;
	        		frog.position.y+=.52;
	            break;
	        case "KeyA": // translate right, rotate right with shift
	        		frog.rotation.z=Math.PI/2;
	        		frog.position.x-=.5;
	            break;
	        case "KeyS": // translate up, rotate counterclockwise with shift 
	        		frog.rotation.z=Math.PI;
	        		frog.position.y-=.52;
	            break;
	        case "KeyD": // translate down, rotate clockwise with shift
	        		frog.rotation.z=-Math.PI/2;
	        		frog.position.x+=.5;
	    } // end switch
		if(frog.position.y > currMaxDist)
		{
			currMaxDist = frog.position.y;
			points += 100;
		}
		pointsElement.innerHTML = "Score: " + points;	
	}
} // end handleKeyDown

var bobVal = 0;

function moveSceneObjects()
{
	for(var objNum = 0; objNum < (gameObjects.length - 10); objNum++)
	{
		var currObj = gameObjects[objNum];
		if((currObj.position.x - currObj.geometry.parameters.width/2) > 2.75 || (currObj.position.x + currObj.geometry.parameters.width/2) < -2.75)
		{
			currObj.position.x = origPos[objNum+1].x;
		}
		else
			currObj.position.x+=objSpeeds[objNum];
		//turtles bobbing
		if(objNum > 16 && objNum < 20)
		{
			currObj.position.z = -currObj.geometry.parameters.depth/6 + currObj.geometry.parameters.depth/6 * Math.sin(bobVal);
			bobVal+=0.005;
		}
	}
	if(objStandingOnIdx != -1)
	{
		frog.position.x += objSpeeds[objStandingOnIdx];
	}
}

function checkCollisions()
{
	var collided = false;
	var playerWorldVerts = [];
	for(var vertNum = 0; vertNum < frog.geometry.vertices.length; vertNum++)
	{
		playerWorldVerts[vertNum] = frog.geometry.vertices[vertNum].clone();
		playerWorldVerts[vertNum].applyMatrix4(frog.matrixWorld);
	}
	for(var objNum = 0; objNum < gameObjects.length; objNum++)
	{
		var currObj = gameObjects[objNum];
		//check if player vertex is between corners of this object's box
		var objVertTopRightClosest = currObj.geometry.vertices[0].clone();
		objVertTopRightClosest.applyMatrix4(currObj.matrixWorld);
		var objVertBottomLeftFurthest = currObj.geometry.vertices[6].clone();
		objVertBottomLeftFurthest.applyMatrix4(currObj.matrixWorld);
		for(var currPlayerVert = 0; currPlayerVert < playerWorldVerts.length; currPlayerVert++)
		{
			//case player's vertex is within the bounding box of an object (collision occurs)
			if(playerWorldVerts[currPlayerVert].x < objVertTopRightClosest.x 
				&& playerWorldVerts[currPlayerVert].y < objVertTopRightClosest.y
				&& playerWorldVerts[currPlayerVert].z < objVertTopRightClosest.z
				&& playerWorldVerts[currPlayerVert].x > objVertBottomLeftFurthest.x 
				&& playerWorldVerts[currPlayerVert].y > objVertBottomLeftFurthest.y
				&& playerWorldVerts[currPlayerVert].z > objVertBottomLeftFurthest.z
				)
			{
				if(frog.position.y > 0)
					objStandingOnIdx = objNum;
				collided = true;
				break;
			}
		}
	}
	//conditions frog dies
	if(frog.position.y < 0 && collided || frog.position.y > 0 && !collided || frog.position.x < -3 || frog.position.x > 3
		|| frog.position.y < -3.25)
	{
		objStandingOnIdx = -1;
		if(lives > 0)
        {
        	frog.position.x = origPos[0].x;
			frog.position.y = origPos[0].y;
            lives--;
			if(frog.position.y < 0 && collided)
			{
	            squash.pause();
	            squash.currentTime = 0;
	            squash.play();
			}
			else
			{
				plunk.pause();
				plunk.currentTime = 0;
				plunk.play();
			}
            if(lives == 0)
            {
            	theme.pause();
            	gameover.pause();
            	gameover.currentTime = 0;
            	gameover.play();
            	livesElement.innerHTML = "Game Over!";
            	frog.position.z = -100;
            }
            else
            	livesElement.innerHTML = "Lives: " + lives;            
        }
	}
	//condition level complete (hopped onto pad)
	if(frog.position.y > 2.47 && collided)
	{
		//activate star
		switch(objStandingOnIdx)
		{
			case (gameObjects.length - 10):
				star1.position.z = 0.3;
				break;
			case (gameObjects.length - 9):
				star2.position.z = 0.3;
				break;
			case (gameObjects.length - 8):
				star3.position.z = 0.3;
				break;
			case (gameObjects.length - 7):
				star4.position.z = 0.3;
				break;
			case (gameObjects.length - 6):
				star5.position.z = 0.3;
		}
		coin.play();
		currMaxDist = -3.25;
		lives = 3;
		livesElement.innerHTML = "Lives: " + lives;            
		points+=1000;
		pointsElement.innerHTML = "Score: " + points;	
		frog.rotation.z = 0;
		frog.position.x = origPos[0].x;
		frog.position.y = origPos[0].y;
		objStandingOnIdx = -1;
		for(var objNum = 0; objNum < gameObjects.length - 10; objNum++)
		{
			objSpeeds[objNum] += 0.005 * objSpeeds[objNum]/Math.abs(objSpeeds[objNum]);
		}
		if(level == 5)
		{
			theme.pause();
			theme.currentTime = 0;
			win.play();
			levelElement.innerHTML = "You Win!";
		}
		else
		{
			level++;
			levelElement.innerHTML = "Level: " + level;
		}
	}
}

function smoothCameraFollow()
{
	camera.position.x += 0.05 * (frog.position.x - camera.position.x);
	camera.position.y += (-.05 + (0.05 * (frog.position.y - camera.position.y)));

}

function update()
{
	requestAnimationFrame( update );
	renderer.render(scene, camera);
	//game logic
	moveSceneObjects();
	checkCollisions();
	smoothCameraFollow();
}