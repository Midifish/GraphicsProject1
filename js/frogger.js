

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/*// instantiate a loader
var loader = new THREE.ImageLoader();
loader.setCrossOrigin("anonymous");
// load a image resource
loader.load(
	// resource URL
	'midifish.github.io/images/froggerbackground.png',
	// Function when resource is loaded
	function ( image ) {
		// do something with it

		// like drawing a part of it on a canvas
		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );
		context.drawImage( image, 1000, 1000 );
	},
	// Function called when download progresses
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	// Function called when download errors
	function ( xhr ) {
		console.log( 'An error happened' );
	}
);*/

//load textures
var backgroundTexture = new THREE.TextureLoader().load( 'images/froggerbackground.png' );
var frogTexture = new THREE.TextureLoader().load( 'images/frog_up.png' );
var car1Texture = new THREE.TextureLoader().load( 'images/car1.png' );
var car2Texture = new THREE.TextureLoader().load( 'images/car2.png' );
var car3Texture = new THREE.TextureLoader().load( 'images/car3.png' );
var car4Texture = new THREE.TextureLoader().load( 'images/car4.png' );
var car5Texture = new THREE.TextureLoader().load( 'images/car5.png' );
var log1Texture = new THREE.TextureLoader().load( 'images/log1.png' );

//load geometries
var backgroundGeometry = new THREE.BoxGeometry(6, 7, 0.1);
var frogGeometry = new THREE.BoxGeometry( .25, .25, .15);
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
var log4a = new THREE.Mesh( shortBoxGeometry, log1Material );
var log4b = new THREE.Mesh( shortBoxGeometry, log1Material );
var log4c = new THREE.Mesh( shortBoxGeometry, log1Material );
var log5a = new THREE.Mesh( mediumBoxGeometry, log1Material );

//game parameters
var objSpeed = 0.05;
var objStandingOnIdx = -1;
var lives = 3;
var livesElement;

//audio files
var jump = new Audio('sounds/sound-frogger-hop.wav');
var squash = new Audio('sounds/sound-frogger-squash.wav');

init();
update();

function init()
{
	livesElement = document.getElementById("lives");
    livesElement.innerHTML = "Lives: " + lives;            

	scene.add(background);
	camera.position.x = .24;
	camera.position.z = 1.5;
	camera.position.y = -4;
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
	gameObjects.push(log3a);
	gameObjects.push(log4a);
	gameObjects.push(log4b);
	gameObjects.push(log4c);
	gameObjects.push(log5a);

	//initialize player object
	frog.position.x = 0.24;
	frog.position.y = -3.25;
	frog.position.z = frog.geometry.parameters.depth/2;
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
			speed+= objSpeed/15 * speed/Math.abs(speed);
			speed*=-1;
			//save original positions
			objOrigPosVec = new THREE.Vector2(column, row);
			origPos.push(objOrigPosVec);
			origPos.push(objOrigPosVec);
			if(idx != 12)
				origPos.push(objOrigPosVec);
		}
		column += ((5.5) * ((idx % 3) + 1)/4 * -columnOrig/Math.abs(columnOrig));
		objSpeeds[idx] = speed;
		gameObjects[idx].position.x = column;
		gameObjects[idx].position.y = row;
		gameObjects[idx].position.z = gameObjects[idx].geometry.parameters.depth/2;
		scene.add(gameObjects[idx]);
	}
	row+=0.52;
	speed*=-1;
	columnOrig*=-1;
	//initialize logs
	for(var idx = 14; idx < gameObjects.length; idx++)
	{
		//new row
		if(idx == 14 || idx ==15 || idx == 17 || idx == 18 || idx == 21)
		{
			row += 0.52;
			columnOrig *= -1;
			column = columnOrig;
			speed+= objSpeed/15 * speed/Math.abs(speed);
			speed*=-1;
			//save original positions
			objOrigPosVec = new THREE.Vector2(column, row);
			if(idx == 14 || idx == 17 || idx == 21)
			{
				origPos.push(objOrigPosVec);
			}
			if(idx == 15)
			{
				origPos.push(objOrigPosVec);
				origPos.push(objOrigPosVec);				
			}
			if(idx == 18)
			{
				origPos.push(objOrigPosVec);
				origPos.push(objOrigPosVec);		
				origPos.push(objOrigPosVec);						
			}
		}
		column += ((5.5) * ((idx % 3) + 1)/4 * -columnOrig/Math.abs(columnOrig));
		objSpeeds[idx] = speed;
		gameObjects[idx].position.x = column;
		gameObjects[idx].position.y = row;
		scene.add(gameObjects[idx]);
	}
}


document.onkeydown = handleKeyDown; // call this when key pressed

// does stuff when keys are pressed
function handleKeyDown(event) {
	objStandingOnIdx = -1;
	if(lives != 0)
	{
	    jump.play();
	    switch (event.code) {
	        // model transformation
	        case "KeyW": // translate left, rotate left with shift
	        		frog.position.y+=.52;
	            break;
	        case "KeyA": // translate right, rotate right with shift
	        		frog.position.x-=.5;
	            break;
	        case "KeyS": // translate up, rotate counterclockwise with shift 
	        		frog.position.y-=.52;
	            break;
	        case "KeyD": // translate down, rotate clockwise with shift
	        		frog.position.x+=.5;
	    } // end switch		
	}
} // end handleKeyDown

function moveSceneObjects()
{
	for(var objNum = 0; objNum < gameObjects.length; objNum++)
	{
		var currObj = gameObjects[objNum];
		if((currObj.position.x - currObj.geometry.parameters.width/2) > 2.75 || (currObj.position.x + currObj.geometry.parameters.width/2) < -2.75)
		{
			currObj.position.x = origPos[objNum+1].x;
		}
		else
			currObj.position.x+=objSpeeds[objNum];
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
			if(playerWorldVerts[currPlayerVert].x < objVertTopRightClosest.x && playerWorldVerts[currPlayerVert].y < objVertTopRightClosest.y
				&& playerWorldVerts[currPlayerVert].x > objVertBottomLeftFurthest.x && playerWorldVerts[currPlayerVert].y > objVertBottomLeftFurthest.y)
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
            squash.play();
            if(lives == 0)
            {
            	livesElement.innerHTML = "Game Over!";
            	frog.position.z = -100;
            }
            else
            	livesElement.innerHTML = "Lives: " + lives;            
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