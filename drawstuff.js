/* classes */ 

// Color constructor
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class

// Vector class
class Vector {
    //Point constructor
    constructor(x,y,z)
    {
        this.x = x; this.y = y; this.z = z;
    }

    // Point change method
    change(x,y,z)
    {
        this.x = x; this.y = y; this.z = z;
    }
} // end color class

function VectorMath()
{
}
 
VectorMath.subtract = function(v1, v2)
{
    return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

VectorMath.normalize = function(v)
{
    //find magnitude
    var mag = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
    //return normalized vector
    return new Vector(v.x / mag, v.y / mag, v.z / mag);
}

VectorMath.dot = function(v1, v2)
{
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

VectorMath.multiplyByScalar = function(v, s)
{
    return new Vector(v.x * s, v.y * s, v.z * s);
}

function getLightingIntensity(intersectionPoint, surfaceNormalUnit, lightLocation, inputObject)
{
    //NOTE: we assume light color is white for ambient, diffuse, and specular (1,1,1)
    //so I do not multiply by light color here, as the result would be itself times 1
    var intensity = new Vector(0,0,0);
    var surfaceToLightUnit = VectorMath.normalize(VectorMath.subtract(lightLocation, intersectionPoint));
    //lambert value is surface normal unit vector dot surface to light unit vector
    var lambertVal = VectorMath.dot(surfaceNormalUnit, surfaceToLightUnit);
    var mirrorReflectionUnit = VectorMath.normalize(VectorMath.subtract(VectorMath.multiplyByScalar(surfaceNormalUnit, 2 * lambertVal), surfaceToLightUnit));
    var surfaceToEyeUnit = VectorMath.normalize(new Vector(-intersectionPoint.x, -intersectionPoint.y, -intersectionPoint.z));
    //get Red intensity
    intensity.x = inputObject.ambient[0] + inputObject.diffuse[0] * lambertVal + inputObject.specular[0] * Math.pow(VectorMath.dot(mirrorReflectionUnit, surfaceToEyeUnit), 5);
    //get Green intensity
    intensity.y = inputObject.ambient[1] + inputObject.diffuse[1] * lambertVal + inputObject.specular[1] * Math.pow(VectorMath.dot(mirrorReflectionUnit, surfaceToEyeUnit), 5);
    //get Blue intensity
    intensity.z = inputObject.ambient[2] + inputObject.diffuse[2] * lambertVal + inputObject.specular[2] * Math.pow(VectorMath.dot(mirrorReflectionUnit, surfaceToEyeUnit), 5);
    Math.min(intensity.x, 1);
    Math.min(intensity.y, 1);
    Math.min(intensity.z, 1);
    return intensity;
}
/* utility functions */

// raycast from the eye, through the viewport to find intersections
function drawPixelsRaycast(context) {
    var inputSpheres = getInputSpheres();
    var inputTriangles = getInputTriangles();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    var verticalIncrementAmt = 1/(h-1);
    var horizontalIncrementAmt = 1/(w-1);
    var currentViewportPoint = new Vector(0,0,0);
    var eyePoint = new Vector(0.5,0.5,-0.5);
    var directionVector = new Vector(0,0,0);
    var lightLocation = new Vector(2,4,-0.5);
    var t = 0;
    if (inputSpheres != String.null) { 
        var numSpheres = inputSpheres.length;
        //loop through each verticle location
        for(var vt = 0; vt < 1; vt += verticalIncrementAmt)
        {
            //loop through each horizontal location
            for(var ht = 0; ht < 1; ht += horizontalIncrementAmt)
            {
                currentViewportPoint.x = ht;
                currentViewportPoint.y = vt;
                //find direction of raycast
                directionVector = VectorMath.subtract(currentViewportPoint, eyePoint);
                //check each sphere for an intersection
                for(var s = 0; s < numSpheres; s++)
                {
                    var sphereCenter = new Vector(inputSpheres[s].x, inputSpheres[s].y, inputSpheres[s].z);
                    var sphereRadius = inputSpheres[s].r;
                    var pixelColor = new Color(0,0,0,255);
                    var a = VectorMath.dot(directionVector, directionVector);
                    var b = 2 * VectorMath.dot(directionVector, VectorMath.subtract(eyePoint, sphereCenter));
                    var c = VectorMath.dot(VectorMath.subtract(eyePoint, sphereCenter), VectorMath.subtract(eyePoint, sphereCenter)) - (sphereRadius * sphereRadius);
                    //solve for the discriminant and t
                    var discriminant = Math.pow(b,2) - 4 * a * c;
                    if(discriminant >= 0)
                    {
                        t = Math.min((-b + Math.sqrt(discriminant))/(2*a), (-b - Math.sqrt(discriminant))/(2*a));
                        if(t > 1)
                        {
                            var intersectionPoint = new Vector(
                                eyePoint.x + t * directionVector.x,
                                eyePoint.y + t * directionVector.y,
                                eyePoint.z + t * directionVector.z);
                            //get surface normal unit vector for lighting calculation
                            var surfaceNormalUnit = VectorMath.normalize(VectorMath.subtract(intersectionPoint, sphereCenter));
                            //get intensity
                            var intensity = getLightingIntensity(intersectionPoint, surfaceNormalUnit, lightLocation, inputSpheres[s]);
                            //set pixel colors
                            pixelColor.r = intensity.x*255;
                            pixelColor.g = intensity.y*255;
                            pixelColor.b = intensity.z*255;
                            drawPixel(
                                    imagedata,
                                    Math.floor(ht / horizontalIncrementAmt),
                                    Math.floor(vt / verticalIncrementAmt),
                                    pixelColor);
                        }
                        break;
                    }
                }
                drawPixel(
                    imagedata,
                    Math.floor(ht / horizontalIncrementAmt),
                    Math.floor(vt / verticalIncrementAmt),
                    pixelColor);
            }
        }
         // end for spheres
        context.putImageData(imagedata, 0, 0);
    }
} // end draw raycast pixels

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    
// draw random pixels
function drawRandPixels(context) {
    var c = new Color(0,0,0,0); // the color at the pixel: black
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = 0.01;
    var numPixels = (w*h)*PIXEL_DENSITY; 
    
    // Loop over 1% of the pixels in the image
    for (var x=0; x<numPixels; x++) {
        c.change(Math.random()*255,Math.random()*255,
            Math.random()*255,255); // rand color
        drawPixel(imagedata,
            Math.floor(Math.random()*w),
            Math.floor(Math.random()*h),
                c);
    } // end for x
    context.putImageData(imagedata, 0, 0);
} // end draw random pixels

// get the input spheres from the standard class URL
function getInputSpheres() {
    const INPUT_SPHERES_URL = 
        "https://ncsucgclass.github.io/prog1/spheres.json";
        
    // load the spheres file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_SPHERES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input spheres file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input spheres

// get the input triangles from the standard class URL
function getInputTriangles() {
    const INPUT_TRIANGLES_URL = 
        "https://www.dropbox.com/s/0cz28voir5blemf/triangles.json?dl=0";
        
    // load the spheres file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_TRIANGLES_URL,false); // init the request
    httpReq.send(); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input triangles file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input triangles

// put random points in the spheres from the class github
function drawRandPixelsInInputSpheres(context) {
    var inputSpheres = getInputSpheres();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = .1;
    var numCanvasPixels = (w*h)*PIXEL_DENSITY; 
    
    if (inputSpheres != String.null) { 
        var x = 0; var y = 0; // pixel coord init
        var cx = 0; var cy = 0; // init center x and y coord
        var sphereRadius = 0; // init sphere radius
        var numSpherePixels = 0; // init num pixels in sphere
        var c = new Color(0,0,0,0); // init the sphere color
        var n = inputSpheres.length;
        //console.log("number of spheres: " + n);

        // Loop over the spheres, draw rand pixels in each
        for (var s=0; s<n; s++) {
            cx = w*inputSpheres[s].x; // sphere center x
            cy = h*inputSpheres[s].y; // sphere center y
            sphereRadius = Math.round(w*inputSpheres[s].r); // radius
            numSpherePixels = sphereRadius*4*Math.PI; // sphere area
            numSpherePixels *= PIXEL_DENSITY; // percentage of sphere on
            numSpherePixels = Math.round(numSpherePixels);
            //console.log("sphere radius: "+sphereRadius);
            //console.log("num sphere pixels: "+numSpherePixels);
            c.change(
                inputSpheres[s].diffuse[0]*255,
                inputSpheres[s].diffuse[1]*255,
                inputSpheres[s].diffuse[2]*255,
                255); // rand color
            for (var p=0; p<numSpherePixels; p++) {
                do {
                    x = Math.random()*2 - 1; // in unit square 
                    y = Math.random()*2 - 1; // in unit square
                } while (Math.sqrt(x*x + y*y) > 1)
                drawPixel(imagedata,
                    cx+Math.round(x*sphereRadius),
                    cy+Math.round(y*sphereRadius),c);
                //console.log("color: ("+c.r+","+c.g+","+c.b+")");
                //console.log("x: "+Math.round(w*inputSpheres[s].x));
                //console.log("y: "+Math.round(h*inputSpheres[s].y));
            } // end for pixels in sphere
        } // end for spheres
        context.putImageData(imagedata, 0, 0);
    } // end if spheres found
} // end draw rand pixels in input spheres


// draw 2d projections read from the JSON file at class github
function drawInputSpheresUsingArcs(context) {
    var inputSpheres = getInputSpheres();
    
    
    if (inputSpheres != String.null) { 
        var c = new Color(0,0,0,0); // the color at the pixel: black
        var w = context.canvas.width;
        var h = context.canvas.height;
        var n = inputSpheres.length; 
        //console.log("number of spheres: " + n);

        // Loop over the spheres, draw each in 2d
        for (var s=0; s<n; s++) {
            context.fillStyle = 
                "rgb(" + Math.floor(inputSpheres[s].diffuse[0]*255)
                +","+ Math.floor(inputSpheres[s].diffuse[1]*255)
                +","+ Math.floor(inputSpheres[s].diffuse[2]*255) +")"; // rand color
            context.beginPath();
            context.arc(
                Math.round(w*inputSpheres[s].x),
                Math.round(h*inputSpheres[s].y),
                Math.round(w*inputSpheres[s].r),
                0,2*Math.PI);
            context.fill();
            //console.log(context.fillStyle);
            //console.log("x: "+Math.round(w*inputSpheres[s].x));
            //console.log("y: "+Math.round(h*inputSpheres[s].y));
            //console.log("r: "+Math.round(w*inputSpheres[s].r));
        } // end for spheres
    } // end if spheres found
} // end draw input spheres


/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
 
    // Create the image
    //drawRandPixels(context);
      // shows how to draw pixels
    
    //drawRandPixelsInInputSpheres(context);
      // shows how to draw pixels and read input file
      
    //drawInputSpheresUsingArcs(context);
      // shows how to read input file, but not how to draw pixels

    //draw spheres using raycasting
    drawPixelsRaycast(context);
}