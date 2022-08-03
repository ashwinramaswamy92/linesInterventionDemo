var debug = true;

var clicked = false;
var cyclesSinceClick = 0;
var released = false;
var cyclesSinceRelease = 0;


var axes = new Axes();
var line1 = new Line(axes);
var slope;


var correctAnswer = [];
let correctPoints;
let failPoints;
let pointsPlotted = 0;

var failPoint = new Point(900000, 9000000, axes);    //A garbage initial value


//For level 9?
var correctlyClickedX = [];
var correctlyClickedY = [];            
var wronglyClickedX = [];
var wronglyClickedY = [];
var correctCounter = 0;
var wrongCounter = 0;
var repeatedPoint = false;
var lastPointWrong = false;


var segment1 = new Segment(0, 0, 0);
var segment2 = new Segment(0, 0, 0);
var segment3 = new Segment(0, 0, 0);
var segment4 = new Segment(0, 0, 0);


let s = new BinarySlider(510, 15, 100, 60);
let h = new hotButton(510, 105, 100, 60);
let downArrow = new DownwardsArrow(400, 300);
let slopeSlider = new NumberSlider(0, 0, 1);



///-------------------------------Initializing Mode Framework-----------------------------//
/*The idea behind this implementation is to enable insertions of a new mode/problem/level at some point in between.
 So you can add a level between levels 1 and 2 with a level 1.5 by just adding it to the levelList array.
 Basically to avoid having to make mass changes to the RHS of case == blahblah in the main code every time you want to insert.*/

var levelIndex = 0;
var toSetupLevel = true;
var levelList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var level = levelList[0];

var levelCompleted = false;


var problemsDone;              //Number of problems done in current level
var firstAttempt = true;       //Whether current problem solved on the first attempt. TRUE BY DEFAULT.
var attemptHistory = [];       //An array to store if the past n problems were solved on first attempt.
var problemDice;               //if a random problem has to have different setup parameters
var animationComplete = false;

var problemIndex = 0;
var toSetupProblem = true;
var problemList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var problem = problemList[0];

//var endProblem = false;


var modeIndex = 0;
var toSetupMode = true;
var modeList = [1, 2, 3, 4, 5, 6, 7];
var mode = modeList[0];
//var endMode = false;

//-------------------------------------------------------------------------------------------//


function setup() {
  initializeModeFramework();
  createCanvas(640, 480);
  
  if(debug){
    skipL = createButton("Skip Level");
    skipL.mousePressed(function(){ 
      nextLevel();
    });
  }
}


function draw() {


  background(200);  
  if (cyclesSinceClick > 0 && clicked) {
    clicked = false;
  }

  if (cyclesSinceRelease > 0 && released) {
    released = false;
  }

  switch(level) {

    //--------------------   LEVEL 1: Plotting points in Q1 with guidelines ---------------------//
  case 1:
    if (toSetupLevel) {
      print("Setting up Level 1");
      problemsDone = 0;
      attemptHistory = [];
      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10); 
      axes.setOrigin('LEFT');

      correctAnswer = [random(axes.getXValues(true)), random(axes.getYValues(true))];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:
      displayNewProblemScreen();
      break;

      //Start button
    case 2:
      displayStartButton();
      break;


    case 3:
      if (toSetupMode) {
        toSetupMode = false;
      }

      [currentX, currentY] = previewPoint(axes, true, true, true);

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(30);
      text("Plot the point (", 80, 50);


      //stroke(255, 162, 0);
      //fill(255, 162, 0);

      stroke(0);
      fill(229, 122, 0);

      textSize(30);
      text(correctAnswer[0], 275, 50);

      stroke(0);
      fill(0);
      textSize(30);
      text(", ", 310, 50);

      stroke(0);
      fill(0, 0, 255);
      textSize(30);
      text(correctAnswer[1], 330, 50);


      textSize(30);
      stroke(0);
      fill(0);
      text(")", 365, 50);


      if (clicked) {
        if (currentX == correctAnswer[0] && currentY == correctAnswer[1]) {

          //END DATA RECORDING, AND WRITE IT TO DATABASE HERE..

          problemsDone = problemsDone + 1;
          attemptHistory[problemsDone - 1] = firstAttempt;
          nextMode();
        } else {
          firstAttempt = false;
          failPoint.setXY(currentX, currentY);
        }
      }

      failPoint.showX();

      break;


    case 4:
      if (toSetupMode) {
        toSetupMode = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      ellipse(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[1]), 10, 10);

      textSize(30);

      text("CORRECT! Click anywhere to continue.", 80, 460);

      //Now, checking if level is completed.
      if (attemptHistory.length > 2) {        
        if (attemptHistory[attemptHistory.length - 1] == true && attemptHistory[attemptHistory.length - 2] == true) {
          levelCompleted = true;
        } else levelCompleted = false;
      } else levelComplted = false;



      if (clicked) {
        if (levelCompleted) {
          nextMode();
        } else {
          nextProblem();
        }
      }

      break;

    case 5:
      background(200);
      textSize(40);
      text("LEVEL COMPLETE!", 150, 200);

      textSize(30);
      text("Click anywhere to continue...", 150, 240);

      if (clicked)  nextLevel();
      break;
    }
    break;


    //--------------------    LEVEL 2: Plotting points in Q1 without guidelines -----------------//
  case 2:
    if (toSetupLevel) {
      print("Setting up Level " + level);
      problemsDone = 0;
      attemptHistory = [];
      levelCompleted = false;

      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10); 
      axes.setOrigin('LEFT');

      correctAnswer = [random(axes.getXValues(true)), random(axes.getYValues(true))];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:
      displayNewProblemScreen();
      break;

      //Start button
    case 2:
      displayStartButton()
      break;


    case 3:
      if (toSetupMode) {
        toSetupMode = false;
      }

      [currentX, currentY] = previewPoint(axes, false, true);

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(30);
      text("Plot the point (" + correctAnswer[0] + ", " + correctAnswer[1] + ")", 80, 50);

      if (clicked) {
        if (currentX == correctAnswer[0] && currentY == correctAnswer[1]) {

          //END DATA RECORDING, AND WRITE IT TO DATABASE HERE..

          problemsDone = problemsDone + 1;
          attemptHistory[problemsDone - 1] = firstAttempt;
          nextMode();
        } else {
          firstAttempt = false;
          failPoint.setXY(currentX, currentY);
        }
      }

      failPoint.showX();

      break;


    case 4:
      if (toSetupMode) {
        toSetupMode = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      ellipse(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[1]), 10, 10);

      textSize(30);

      text("CORRECT! Click anywhere to continue.", 80, 460);

      //Now, checking if level is completed.
      if (attemptHistory.length > 2) {        
        if (attemptHistory[attemptHistory.length - 1] == true && attemptHistory[attemptHistory.length - 2] == true) {
          levelCompleted = true;
        } else levelCompleted = false;
      } else levelCompleted = false;



      if (clicked) {
        if (levelCompleted) {
          nextMode();
        } else {
          nextProblem();
        }
      }

      break;

    case 5:
      background(200);
      textSize(40);
      text("LEVEL COMPLETE!", 150, 200);

      textSize(30);
      text("Click anywhere to continue...", 150, 240);

      if (clicked)  nextLevel();
    }    
    break;


    //--------------------    LEVEL 3 : Plotting y = x    ------------------------------------//
  case 3:
    if (toSetupLevel) {
      print("Setting up Level " + level);
      problemsDone = 0;
      attemptHistory = [];
      levelCompleted = false;

      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10);
      axes.setOrigin('LEFT');
      correctAnswer[0] = random(axes.getXValues(true));
      correctAnswer[1] = correctAnswer[0];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:

      displayNewProblemScreen();
      break;

      //Start button
    case 2:
      displayStartButton()
      break;


    case 3:
      if (toSetupMode) {
        toSetupMode = false;
      }

      [currentX, currentY] = previewPoint(axes, false, true);

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(30);
      text("Plot the point (x = " + correctAnswer[0] + ", y = x)", 80, 50);

      if (clicked) {
        if (currentX == correctAnswer[0] && currentY == correctAnswer[1]) {

          //END DATA RECORDING, AND WRITE IT TO DATABASE HERE..

          problemsDone = problemsDone + 1;
          attemptHistory[problemsDone - 1] = firstAttempt;
          nextMode();
          print(toSetupMode);
        } else {
          firstAttempt = false;
          failPoint.setXY(currentX, currentY);
        }
      }

      failPoint.showX();

      break;


    case 4:
      if (toSetupMode) {
        animationComplete = false;
        time = millis();
        segment1.midpointX = axes.XAxesToPixels(correctAnswer[0]/2);
        segment1.midpointY = axes.YAxesToPixels(0);
        segment1.len = axes.XAxesToPixels(correctAnswer[0]) - axes.XAxesToPixels(0);
        segment1.initialize();

        segment2.midpointX = segment1.midpointX;
        segment2.midpointY = segment1.midpointY;
        segment2.len = segment1.len;
        segment2.initialize();

        toSetupMode = false;
      }


      //Animating!!

      stroke(0, 0, 255);
      segment1.show();

      if (millis()> time + 1000) {
        segment2.show();
        if (!segment2.moved) segment2.move(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]/2));
        else segment2.spin(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]/2), HALF_PI);

        if (segment2.spun) animationComplete = true;
      }


      //Now, checking if level is completed.
      if (attemptHistory.length > 2) {        
        if (attemptHistory[attemptHistory.length - 1] == true && attemptHistory[attemptHistory.length - 2] == true) {
          levelCompleted = true;
        } else levelCompleted = false;
      } else levelCompleted = false;


      if (animationComplete) {
        stroke(0);
        strokeWeight(3);
        fill(0, 200, 0);
        ellipse(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[1]), 10, 10);

        textSize(30);
        stroke(0);
        fill(0, 200, 0);
        text("CORRECT!", 80, 460);
        stroke(0);
        fill(0, 200, 0);
        strokeWeight(2);
        text("Click Anywhere to Continue", 250, 460);
        if (clicked) {
          if (levelCompleted) {
            nextLevel();
          } else {
            nextProblem();
          }
        }
      }
    }
    break;


    //--------------------    LEVEL 4 : Plotting y = 3x    ------------------------------------//
  case 4:
    if (toSetupLevel) {
      print("Setting up Level " + level);
      problemsDone = 0;
      attemptHistory = [];
      levelCompleted = false;

      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10);
      axes.setOrigin('LEFT');
      correctAnswer[0] = random([1, 2, 3]);
      correctAnswer[1] = 3*correctAnswer[0];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:
      displayNewProblemScreen();
      break;

      //Start button
    case 2:
      displayStartButton()
      break;


    case 3:
      if (toSetupMode) {
        toSetupMode = false;
      }

      [currentX, currentY] = previewPoint(axes, false, true);

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(30);
      text("Plot the point (x = " + correctAnswer[0] + ", y = 3x)", 80, 50);

      if (clicked) {
        if (currentX == correctAnswer[0] && currentY == correctAnswer[1]) {

          //END DATA RECORDING, AND WRITE IT TO DATABASE HERE..

          problemsDone = problemsDone + 1;
          attemptHistory[problemsDone - 1] = firstAttempt;
          nextMode();
          print(toSetupMode);
        } else {
          firstAttempt = false;
          failPoint.setXY(currentX, currentY);
        }
      }

      failPoint.showX();

      break;


    case 4:
      if (toSetupMode) {
        animationComplete = false;
        time = millis();
        segment1.midpointX = axes.XAxesToPixels(correctAnswer[0]/2);
        segment1.midpointY = axes.YAxesToPixels(0);
        segment1.len = axes.XAxesToPixels(correctAnswer[0]) - axes.XAxesToPixels(0);
        segment1.initialize();

        segment2.midpointX = segment1.midpointX;
        segment2.midpointY = segment1.midpointY;
        segment2.len = segment1.len;
        segment2.initialize();



        segment3.midpointX = segment1.midpointX;
        segment3.midpointY = segment1.midpointY;
        segment3.len = segment1.len;
        segment3.initialize();


        segment4.midpointX = segment1.midpointX;
        segment4.midpointY = segment1.midpointY;
        segment4.len = segment1.len;
        segment4.initialize();



        toSetupMode = false;
      }


      //Animating!!

      stroke(0, 0, 255);
      segment1.show();

      if (millis()> time + 1000) {
        segment2.show();
        segment3.show();
        segment4.show();
        if (!segment2.moved) segment2.move(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]*(1/2)));
        if (!segment3.moved) segment3.move(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]*(1 + 1/2)));
        if (!segment4.moved) segment4.move(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]*(2 + 1/2)));

        if (segment2.moved && segment3.moved && segment4.moved) {
          segment2.spin(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]*(1/2)), HALF_PI);
          segment3.spin(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]*(1 + 1/2)), HALF_PI);
          segment4.spin(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[0]*(2 + 1/2)), HALF_PI);
        }

        if (segment2.spun && segment3.spun &&segment4.spun) animationComplete = true;
      }


      //Now, checking if level is completed.
      if (attemptHistory.length > 2) {        
        if (attemptHistory[attemptHistory.length - 1] == true && attemptHistory[attemptHistory.length - 2] == true) {
          levelCompleted = true;
        } else levelCompleted = false;
      } else levelCompleted = false;


      if (animationComplete) {
        stroke(0);
        strokeWeight(3);
        fill(0, 200, 0);
        ellipse(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[1]), 10, 10);

        textSize(30);
        stroke(0);
        fill(0, 200, 0);
        text("CORRECT!", 80, 460);
        stroke(0);
        fill(0, 200, 0);
        strokeWeight(2);
        text("Click Anywhere to Continue", 250, 460);
        if (clicked) {
          if (levelCompleted) {
            print(level);
            nextLevel();
            print(level);
          } else {
            nextProblem();
          }
        }
      }
    }
    break;


    //--------------------    LEVEL 5: Points lying on a line demo    ---------------------//
  case 5:
    var foundRepeat = false;
    if (toSetupLevel) {
      print("Setting up Level " + level);
      correctPoints = [];
      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10); 
      axes.setOrigin('LEFT');

      //correctAnswer = [random(axes.getXValues(true)), random(axes.getYValues(true))];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:
      displayNewProblemScreen();
      break;


    case 2:
      if (toSetupMode) {
        toSetupMode = false;
      }

      [currentX, currentY] = previewPoint(axes, false, true, false);

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(30);
      text("Plot the points (0,0), (2,2), (5,5), and (10, 10)", 20, 50);



      if (clicked) {
        if (currentX == 0 && currentY == 0 || currentX == 2 && currentY == 2 ||
          currentX == 5 && currentY == 5 || currentX == 10 && currentY == 10) {
          for (let points of correctPoints) {
            if (currentX == points.x && currentY == points.y) {
              foundRepeat = true;
              break;
            }
          }
          if (foundRepeat == false) {                                     //To prevent adding repetitions to the array
            correctPoints[correctPoints.length] = new Point(currentX, currentY, axes);
          }
          foundRepeat = false;

          //END DATA RECORDING, AND WRITE IT TO DATABASE HERE..
        } else {
          failPoint.setXY(currentX, currentY);
        }


        //print("Points length" + correctPoints.length);
        if (correctPoints.length == 4) {
          nextMode();
        }
      }
      //Drawing the points 

      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0, 100);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points.x), axes.YAxesToPixels(points.y), 10, 10);
      }
      failPoint.showX();

      break;


    case 3:
      //let yesButton = createButton("Yes");
      //let noButton = createButton("No");


      if (toSetupMode) {
        toSetupMode = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points.x), axes.YAxesToPixels(points.y), 10, 10);
      }
      textSize(25);
      stroke(120);
      fill(0);

      text("Think: Do these points lie on a single line?", 20, 50);

      h.show();
      s.show();
      s.update();


      if (h.isBeingPressed()) {
        if (s.value == true) {
          nextMode();
        }
      }

      break;
    case 4:

      if (toSetupMode) {
        toSetupMode = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points.x), axes.YAxesToPixels(points.y), 10, 10);
      }
      textSize(25);
      stroke(120);
      fill(0);

      stroke(0);
      strokeWeight(2);
      line(axes.XAxesToPixels(0), axes.YAxesToPixels(0), axes.XAxesToPixels(10), axes.YAxesToPixels(10));

      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      textSize(30);
      text("CORRECT! Click anywhere to continue.", 80, 460);


      if (clicked)  nextLevel();
      break;
    }


    break;
  

    //--------------------    LEVEL 6: Points not lying on a line demo  ---------------------//
  case 6:
    var foundRepeat = false;
    if (toSetupLevel) {
      print("Setting up Level " + level);
      correctPoints = [];
      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10); 
      axes.setOrigin('LEFT');

      //correctAnswer = [random(axes.getXValues(true)), random(axes.getYValues(true))];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:
      displayNewProblemScreen();
      break;


    case 2:
      if (toSetupMode) {
        toSetupMode = false;
      }

      [currentX, currentY] = previewPoint(axes, false, true, false);

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(30);
      text("Plot the points (0,0), (3,4), (2,0), and (8, 1)", 20, 50);    //NEEDS TO BE RANDOMISED



      if (clicked) {
        if (currentX == 0 && currentY == 0 || currentX == 3 && currentY == 4 ||
          currentX == 2 && currentY == 0 || currentX == 8 && currentY == 1) {
          for (let points of correctPoints) {
            if (currentX == points.x && currentY == points.y) {
              foundRepeat = true;
              break;
            }
          }
          if (foundRepeat == false) {                                     //To prevent adding repetitions to the array
            correctPoints[correctPoints.length] = new Point(currentX, currentY, axes);
          }
          foundRepeat = false;

          //END DATA RECORDING, AND WRITE IT TO DATABASE HERE..
        } else {
          failPoint.setXY(currentX, currentY);
        }


        //print("Points length" + correctPoints.length);
        if (correctPoints.length == 4) {
          nextMode();
        }
      }
      //Drawing the points 

      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0, 100);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points.x), axes.YAxesToPixels(points.y), 10, 10);
      }
      failPoint.showX();

      break;


    case 3:


      if (toSetupMode) {
        toSetupMode = false;
        s.value = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points.x), axes.YAxesToPixels(points.y), 10, 10);
      }
      textSize(25);
      stroke(120);
      fill(0);

      text("Think: Do these points lie on a single line?", 20, 50);

      h.show();
      s.show();
      s.update();


      if (h.isBeingPressed()) {
        if (s.value == false) {
          nextMode();
        }
      }

      break;
    case 4:

      if (toSetupMode) {
        toSetupMode = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points.x), axes.YAxesToPixels(points.y), 10, 10);
      }
      textSize(25);
      stroke(120);
      fill(0);

      stroke(0);
      strokeWeight(2);

      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      textSize(30);
      text("CORRECT! Click anywhere to continue.", 80, 460);


      if (clicked)  nextLevel();
      break;
    }


    break;
    
    
    //----------------------   LEVEL 7: When y = x we have a line  -----------------------//
  case 7:
    if (toSetupLevel) {
      print("Setting up Level " + level);
      correctPoints = [];
      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10); 
      axes.setOrigin('LEFT');

      //correctAnswer = [random(axes.getXValues(true)), random(axes.getYValues(true))];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:
      displayNewProblemScreen();
      break;


    case 2:
      if (toSetupMode) {
        correctAnswer = random(axes.getXValues(false));
        correctAnswer = [correctAnswer, correctAnswer];
        toSetupMode = false;
      }

      [currentX, currentY] = previewPoint(axes, false, false, false);

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(30);
      text("Plot the point (" + nf(correctAnswer[0], 0, 2) + ", " + nf(correctAnswer[1], 0, 2) + ")", 20, 50);


      if (clicked) {
        if (dist(currentX, currentY, correctAnswer[0], correctAnswer[1]) < 1) {

          //END DATA RECORDING, AND WRITE IT TO DATABASE HERE..
          correctPoints[correctPoints.length] = [correctAnswer[0], correctAnswer[1]];
          toSetupMode = true;
        } else {
          failPoint.setXY(currentX, currentY);
        }
      }
      // print(correctPoints);
      h.setPosition(540, 400);
      h.setSize(100, 100);
      h.theText = "AutoFill";
      downArrow.setPosition(540, 350);
      downArrow.bob();

      //print("Points length" + correctPoints.length);
      if (correctPoints.length > 10) {
        h.show();
        downArrow.show();
        if (h.isBeingPressed() && millis()%100 < 20) {
          let rand = random(axes.getXValues(false));
          correctPoints[correctPoints.length] = [rand, rand];
        }
      }
      //printOnScreen(correctPoints.length);
      if (correctPoints.length > 70) {
        nextMode();
      }

      //Drawing the points 

      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0, 100);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points[0]), axes.YAxesToPixels(points[1]), 10, 10);
      }
      failPoint.showX();

      break;


    case 3:


      if (toSetupMode) {
        toSetupMode = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points[0]), axes.YAxesToPixels(points[1]), 10, 10);
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      textSize(30);
      text("CORRECT! Click anywhere to continue.", 80, 460);


      if (clicked)  nextLevel();
      break;
    }
    break;


    //----------------------   LEVEL 8: Every line has a slope  -------------------------//
  case 8:
    if (toSetupLevel) {
      print("Setting up Level " + level);
      correctPoints = [];
      toSetupLevel = false;
    }
    if (toSetupProblem) {
      print("Setting up Level " + level + " problem "+ problem);

      axes.setSize(300, 300);
      axes.setLocation(175, 75);
      axes.setXLimits(0, 10);
      axes.setYLimits(0, 10); 
      axes.setOrigin('LEFT');

      //correctAnswer = [random(axes.getXValues(true)), random(axes.getYValues(true))];

      failPoint.setXY(900000, 900000);              //Garbage values
      firstAttempt = true;

      toSetupProblem = false;
    }

    axes.show();
    axes.showTicks();
    axes.showGrid();

    switch(mode) {

      //First Screen
    case 1:
      displayNewProblemScreen();
      break;


    case 2:
      if (toSetupMode) {
        slope = 1;
        toSetupMode = false;
      }


      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(20);
      text("Every Line Has a Slope!", 20, 50);

      text("y = ", 270, 440);
      slopeSlider.setPosition(300, 440);
      slopeSlider.show();
      slopeSlider.update();

      strokeWeight(1);
      stroke(0);
      fill(0);
      textSize(20);
      text("x", 320, 440);

      strokeWeight(1);
      line1.show(0, 10);
      line1.setSlope(slopeSlider.sliderValue);


      downArrow.setPosition(300, 410);

      downArrow.bob();
      downArrow.show();





      //Drawing the points 

      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0, 100);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points[0]), axes.YAxesToPixels(points[1]), 10, 10);
      }
      failPoint.showX();

      break;


    case 3:


      if (toSetupMode) {
        toSetupMode = false;
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      for (let points of correctPoints) {
        ellipse(axes.XAxesToPixels(points[0]), axes.YAxesToPixels(points[1]), 10, 10);
      }
      stroke(0);
      strokeWeight(3);
      fill(0, 200, 0);
      textSize(30);
      text("CORRECT! Click anywhere to continue.", 80, 460);


      if (clicked)  nextLevel();
      break;
    }
    break;
  

    //----------------------   LEVEL 9: Testing y = kx  -------------------------//
  case 9:
    if (toSetupLevel) {
      print("Setting up Level " + level);
      correctPoints = [];
      failPoints = [];
      toSetupLevel = false;
    }
    switch(problem){
      //NOTE: This switch-case can be made faaaaar less clumsy by simply writing a loop with a single variable (slope) since 
      //      nothing else changes.

      case 1:
        if (toSetupProblem) {
          print("Setting up Level " + level + " problem "+ problem);

          axes.setSize(300, 300);
          axes.setLocation(175, 75);
          axes.setXLimits(0, 10);
          axes.setYLimits(0, 10); 
          axes.setOrigin('LEFT');
          
          correctlyClickedX = [];
          correctlyClickedY = [];            
          wronglyClickedX = [];
          wronglyClickedY = [];
          correctCounter = 0;
          wrongCounter = 0;
          repeatedPoint = false;
          lastPointWrong = false;

          firstAttempt = true;
          toSetupProblem = false;

                  
        }

        axes.show();
        axes.showTicks();
        axes.showGrid();
        switch(mode){
          case 1:
            displayNewProblemScreen();
            break;
          case 2:
          // main level comes here
          //First define a 2D array of possible solutions. Then check if clicked values 
          //match any solution. For multiple possible hits to a click, find a way to choose.
          //Add these correct answers to an array. Add wrong answers to a wrong array.
          //When correct answers exceed a threshold, show submit button. Allow submission.
          //Consider getting rid of problem switch-case. 
          
      
          // Defining solution
            // var solutionX = [];  //x values for correct answers
            // var solutionY = [];  //y values cor correct answers
            // solutionX[0] = 0;
            // solutionY[0] = 0;


            //For storing user clicks after checking correctness

            
            if (toSetupMode){
              // for(let i = 1; i < 100; i++){
              //   solutionX[i] = solutionX[i - 1] + 0.1*i;
              //   solutionY[i] = solutionX;
              // }
              toSetupMode = false;
            }

            [currentX, currentY] = previewPoint(axes, false, false, false);

            //Prompt
            strokeWeight(1);
            stroke(0);
            fill(0);
            textSize(30);
            text("Plot any point with y = x", 20, 50);

            //Checking if a given solution is correct
            if (clicked) {
              //First check if the currently clicked point is already registered! Prompt to choose new if so
              repeatedPoint = false;
              lastPointWrong = false;
              for(let i = 0; i < correctlyClickedX.length; i++){
                if(dist(currentX, currentY, correctlyClickedX[i], correctlyClickedY[i]) < (0.1*1.414)){
                  //TODO: Print on-screen "Select a new point!"!
                  repeatedPoint = true;
                  break;
                }
              }

              //
              if((currentY - currentX)**2 < (0.1/1.414)**2) {
                if(!repeatedPoint){
                  correctlyClickedX[correctCounter] = currentX;
                  correctlyClickedY[correctCounter] = currentX;
                  correctCounter +=1;
                }
              } else{
                wronglyClickedX[wrongCounter] = currentX;
                wronglyClickedY[wrongCounter] = currentY;
                wrongCounter +=1;
                lastPointWrong = true;
              }
            }


            if(lastPointWrong){
              stroke(0);
              strokeWeight(1);
              fill(255, 0, 0);              
              text("Whoops - you need to be really accurate!", 80, 460);
            } else{
              if(repeatedPoint){
                stroke(0);
                strokeWeight(1);
                fill(255, 0, 0);              
                text("Please select a new Point!", 80, 460);
              } else{  
                if(correctCounter > 0){     
                  stroke(0);
                  strokeWeight(1);
                  fill(0, 200, 0);              
                  text("Good! This point was (" + nf(correctlyClickedX[correctCounter - 1], 0, 1) + ", " + 
                  nf(correctlyClickedY[correctCounter - 1], 0, 1) + ")" , 80, 460);
                }
              } 
            }


            stroke(0);
            strokeWeight(3);
            fill(0, 200, 0, 100);
            for (let i = 0; i < correctlyClickedX.length; i++) {
              ellipse(axes.XAxesToPixels(correctlyClickedX[i]), 
              axes.YAxesToPixels(correctlyClickedY[i]), 10, 10);
            }
            
            
            stroke(0);
            strokeWeight(1);
            fill(140, 0, 0);
            for (let i = 0; i < wronglyClickedX.length; i++) {
              ellipse(axes.XAxesToPixels(wronglyClickedX[i]), 
              axes.YAxesToPixels(wronglyClickedY[i]), 6, 6);
            }
            print(correctCounter)
            if(correctCounter > 10){
              h.setPosition(580, 400);
              h.setSize(100, 100);
              h.theText = "Submit";
              downArrow.setPosition(580, 350);
              downArrow.bob();
              h.show();
              downArrow.show();
              if (h.isBeingPressed()) nextMode();        
            }
            break;
          case 3:
          // click anywhere to continue etc.
          if (toSetupMode) {
            toSetupMode = false;
          }
          stroke(0);
          strokeWeight(3);
          fill(0, 200, 0, 100);
          for (let i = 0; i < correctlyClickedX.length; i++) {
            ellipse(axes.XAxesToPixels(correctlyClickedX[i]), 
            axes.YAxesToPixels(correctlyClickedY[i]), 10, 10);
          }
          
          
          stroke(0);
          strokeWeight(1);
          fill(140, 0, 0);
          for (let i = 0; i < wronglyClickedX.length; i++) {
            ellipse(axes.XAxesToPixels(wronglyClickedX[i]), 
            axes.YAxesToPixels(wronglyClickedY[i]), 6, 6);
          }

              
          strokeWeight(1);
          line1.show(0, 10);
          line1.setSlope(1);

          stroke(0);
          strokeWeight(3);
          fill(0, 200, 0);
          textSize(30);
          text("CORRECT! Click anywhere to continue.", 80, 460);
    
    
          if (clicked)  nextProblem();
          break;
        }
        break;

        // y = 2x
      case 2:
        
        if (toSetupProblem) {
          print("Setting up Level " + level + " problem "+ problem);

          axes.setSize(300, 300);
          axes.setLocation(175, 75);
          axes.setXLimits(0, 10);
          axes.setYLimits(0, 10); 
          axes.setOrigin('LEFT');
          
                  
          correctlyClickedX = [];
          correctlyClickedY = [];            
          wronglyClickedX = [];
          wronglyClickedY = [];
          correctCounter = 0;
          wrongCounter = 0;
          repeatedPoint = false;
          lastPointWrong = false;

          firstAttempt = true;
          toSetupProblem = false;
          
        }

        axes.show();
        axes.showTicks();
        axes.showGrid();
        switch(mode){
          case 1:
            displayNewProblemScreen();
            break;

          case 2:
            
            if (toSetupMode){
              toSetupMode = false;
            }

            [currentX, currentY] = previewPoint(axes, false, false, false);

            //Prompt
            strokeWeight(1);
            stroke(0);
            fill(0);
            textSize(30);
            text("Plot any point with y = 2x", 20, 50);

            //Checking if a given solution is correct
            if (clicked) {
              //First check if the currently clicked point is already registered! Prompt to choose new if so
              repeatedPoint = false;
              lastPointWrong = false;
              for(let i = 0; i < correctlyClickedX.length; i++){
                if(dist(currentX, currentY, correctlyClickedX[i], correctlyClickedY[i]) < (0.1*1.414)){
                  repeatedPoint = true;
                  break;
                }
              }

              //
              if((currentY - 2*currentX)**2 < (0.1/1.414)**2) {
                if(!repeatedPoint){
                  correctlyClickedX[correctCounter] = currentX;
                  correctlyClickedY[correctCounter] = 2*currentX;
                  correctCounter +=1;
                }
              } else{
                wronglyClickedX[wrongCounter] = currentX;
                wronglyClickedY[wrongCounter] = currentY;
                wrongCounter +=1;
                lastPointWrong = true;
              }
            }


            if(lastPointWrong){
              stroke(0);
              strokeWeight(1);
              fill(255, 0, 0);              
              text("Whoops - you need to be really accurate!", 80, 460);
            } else{
              if(repeatedPoint){
                stroke(0);
                strokeWeight(1);
                fill(255, 0, 0);              
                text("Please select a new Point!", 80, 460);
              } else{  
                if(correctCounter > 0){     
                  stroke(0);
                  strokeWeight(1);
                  fill(0, 200, 0);              
                  text("Good! This point was (" + nf(correctlyClickedX[correctCounter - 1], 0, 1) + ", " + 
                  nf(correctlyClickedY[correctCounter - 1], 0, 1) + ")" , 80, 460);
                }
              } 
            }


            stroke(0);
            strokeWeight(3);
            fill(0, 200, 0, 100);
            for (let i = 0; i < correctlyClickedX.length; i++) {
              ellipse(axes.XAxesToPixels(correctlyClickedX[i]), 
              axes.YAxesToPixels(correctlyClickedY[i]), 10, 10);
            }
            
            
            stroke(0);
            strokeWeight(1);
            fill(140, 0, 0);
            for (let i = 0; i < wronglyClickedX.length; i++) {
              ellipse(axes.XAxesToPixels(wronglyClickedX[i]), 
              axes.YAxesToPixels(wronglyClickedY[i]), 6, 6);
            }
            print(correctCounter)
            if(correctCounter > 10){
              h.setPosition(580, 400);
              h.setSize(100, 100);
              h.theText = "Submit";
              downArrow.setPosition(580, 350);
              downArrow.bob();
              h.show();
              downArrow.show();
              if (h.isBeingPressed()) nextMode();        
            }
            break;
          case 3:
          // click anywhere to continue etc.
          if (toSetupMode) {
            toSetupMode = false;
          }
          stroke(0);
          strokeWeight(3);
          fill(0, 200, 0, 100);
          for (let i = 0; i < correctlyClickedX.length; i++) {
            ellipse(axes.XAxesToPixels(correctlyClickedX[i]), 
            axes.YAxesToPixels(correctlyClickedY[i]), 10, 10);
          }
          
          
          stroke(0);
          strokeWeight(1);
          fill(140, 0, 0);
          for (let i = 0; i < wronglyClickedX.length; i++) {
            ellipse(axes.XAxesToPixels(wronglyClickedX[i]), 
            axes.YAxesToPixels(wronglyClickedY[i]), 6, 6);
          }

              
          strokeWeight(1);
          line1.show(0, 5);
          line1.setSlope(2);

          stroke(0);
          strokeWeight(3);
          fill(0, 200, 0);
          textSize(30);
          text("CORRECT! Click anywhere to continue.", 80, 460);
    
    
          if (clicked)  nextProblem();
          break;
        }
        break;


        // y = 3x
      case 3:
         
        if (toSetupProblem) {
          print("Setting up Level " + level + " problem "+ problem);

          axes.setSize(300, 300);
          axes.setLocation(175, 75);
          axes.setXLimits(0, 10);
          axes.setYLimits(0, 10); 
          axes.setOrigin('LEFT');

          correctlyClickedX = [];
          correctlyClickedY = [];            
          wronglyClickedX = [];
          wronglyClickedY = [];
          correctCounter = 0;
          wrongCounter = 0;
          repeatedPoint = false;
          lastPointWrong = false;

          firstAttempt = true;
          toSetupProblem = false;
        }

        axes.show();
        axes.showTicks();
        axes.showGrid();
        switch(mode){
          case 1:
            displayNewProblemScreen();
            break;

          case 2:
            
            if (toSetupMode){
              toSetupMode = false;
            }

            [currentX, currentY] = previewPoint(axes, false, false, false);

            //Prompt
            strokeWeight(1);
            stroke(0);
            fill(0);
            textSize(30);
            text("Plot any point with y = 3x", 20, 50);

            //Checking if a given solution is correct
            if (clicked) {
              //First check if the currently clicked point is already registered! Prompt to choose new if so
              repeatedPoint = false;
              lastPointWrong = false;
              for(let i = 0; i < correctlyClickedX.length; i++){
                if(dist(currentX, currentY, correctlyClickedX[i], correctlyClickedY[i]) < (0.1*1.414)){
                  repeatedPoint = true;
                  break;
                }
              }

              //
              if((currentY - 3*currentX)**2 < (0.1/1.414)**2) {
                if(!repeatedPoint){
                  correctlyClickedX[correctCounter] = currentX;
                  correctlyClickedY[correctCounter] = 3*currentX;
                  correctCounter +=1;
                }
              } else{
                wronglyClickedX[wrongCounter] = currentX;
                wronglyClickedY[wrongCounter] = currentY;
                wrongCounter +=1;
                lastPointWrong = true;
              }
            }


            if(lastPointWrong){
              stroke(0);
              strokeWeight(1);
              fill(255, 0, 0);              
              text("Whoops - you need to be really accurate!", 80, 460);
            } else{
              if(repeatedPoint){
                stroke(0);
                strokeWeight(1);
                fill(255, 0, 0);              
                text("Please select a new Point!", 80, 460);
              } else{  
                if(correctCounter > 0){     
                  stroke(0);
                  strokeWeight(1);
                  fill(0, 200, 0);              
                  text("Good! This point was (" + nf(correctlyClickedX[correctCounter - 1], 0, 1) + ", " + 
                  nf(correctlyClickedY[correctCounter - 1], 0, 1) + ")" , 80, 460);
                }
              } 
            }


            stroke(0);
            strokeWeight(3);
            fill(0, 200, 0, 100);
            for (let i = 0; i < correctlyClickedX.length; i++) {
              ellipse(axes.XAxesToPixels(correctlyClickedX[i]), 
              axes.YAxesToPixels(correctlyClickedY[i]), 10, 10);
            }
            
            
            stroke(0);
            strokeWeight(1);
            fill(140, 0, 0);
            for (let i = 0; i < wronglyClickedX.length; i++) {
              ellipse(axes.XAxesToPixels(wronglyClickedX[i]), 
              axes.YAxesToPixels(wronglyClickedY[i]), 6, 6);
            }
            print(correctCounter)
            if(correctCounter > 10){
              h.setPosition(580, 400);
              h.setSize(100, 100);
              h.theText = "Submit";
              downArrow.setPosition(580, 350);
              downArrow.bob();
              h.show();
              downArrow.show();
              if (h.isBeingPressed()) nextMode();        
            }
            break;
          case 3:
          // click anywhere to continue etc.
          if (toSetupMode) {
            toSetupMode = false;
          }
          stroke(0);
          strokeWeight(3);
          fill(0, 200, 0, 100);
          for (let i = 0; i < correctlyClickedX.length; i++) {
            ellipse(axes.XAxesToPixels(correctlyClickedX[i]), 
            axes.YAxesToPixels(correctlyClickedY[i]), 10, 10);
          }
          
          
          stroke(0);
          strokeWeight(1);
          fill(140, 0, 0);
          for (let i = 0; i < wronglyClickedX.length; i++) {
            ellipse(axes.XAxesToPixels(wronglyClickedX[i]), 
            axes.YAxesToPixels(wronglyClickedY[i]), 6, 6);
          }

              
          strokeWeight(1);
          line1.show(0, 3.33);
          line1.setSlope(3);

          stroke(0);
          strokeWeight(3);
          fill(0, 200, 0);
          textSize(30);
          text("CORRECT! Click anywhere to continue.", 80, 460);
    
    
          if (clicked)  nextProblem();
          break;
        }
        break;




      

    }

  }

  cyclesSinceClick = cyclesSinceClick + 1;
}







//if(toSetupLevel){
//  setupLevel(level);
//}
//drawLevel(level);

//if(toSetupProblem){
//  setupProblem(problem);
//}
//drawProblem(problem);

//if(toSetupMode){
//  toSetupMode(mode);
//}
//drawMode(mode);


function mousePressed() {

  if (mouseButton == LEFT) {
    clicked = true;
    cyclesSinceClick = 0;
  }
}

function mouseReleased() {

  released = true;
  cyclesSinceRelease = 0;
}

function printOnScreen(toPrint) {
  textSize(30);
  if (arguments.length == 0) {
    text("HERE", 20, 20);
  } else {
    text(toPrint, 20, 20);
  }
}


function displayNewProblemScreen(){
  if (toSetupMode) {
    time = millis();
    toSetupMode = false;
  }
  background(200);
  stroke(0);
  fill(0);
  textSize(45);
  text("New problem!", 150, 200);

  if (millis() > time + 1000) {
    nextMode();
  }
}

function displayStartButton(){

  if (toSetupMode) {
    toSetupMode = false;
  }

  var startSizeInit = 10;
  var startSize = startSizeInit*sin(millis()/500) + 20;
  var mouseOnStart = false;

  if (dist(mouseX, mouseY, axes.XAxesToPixels(0), axes.YAxesToPixels(0)) < startSizeInit)
  {
    mouseOnStart = true;
  } else
  {
    mouseOnStart = false;
  }

  if (mouseOnStart) {
    // startSize = startSize - 1;
    // if (startSize < startSizeInit/10) startSize = startSizeInit/10;
    fill(0, 150, 0);
    strokeWeight(2);
    stroke(0);
    ellipse(axes.XAxesToPixels(0), axes.YAxesToPixels(0), startSizeInit, startSizeInit);
  } else {
    fill(255, 0, 0);
    stroke(0);
    ellipse(axes.XAxesToPixels(0), axes.YAxesToPixels(0), startSize, startSize);
  }

  if (mouseOnStart && clicked) {

    //BEGIN RECORDING DATA HERE...
    nextMode();
    clicked = false;
  }


}