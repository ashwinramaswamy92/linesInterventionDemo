var clicked = false;
var cyclesSinceClick = 0;
var axes = new Axes();


var correctAnswer = [];
var failPoint = new Point(900000, 9000000, axes);    //A garbage initial value


var segment1 = new Segment(0, 0, 0);
var segment2 = new Segment(0, 0, 0);
var segment3 = new Segment(0, 0, 0);
var segment4 = new Segment(0, 0, 0);



///-------------------------------Initializing Mode Framework-----------------------------//
/*The idea behind this implementation is to enable insertions of a new mode/problem/level at some point in between.
 So you can add a level between levels 1 and 2 with a level 1.5 by just adding it to the levelList array.
 Basically to avoid having to make mass changes to the RHS of case == blahblah in the main code every time you want to insert.*/

var level = 1;
var levelIndex = 0;
var toSetupLevel = true;
var levelList = [1, 2, 3, 4, 5];
var levelCompleted = false;


var problemsDone;              //Number of problems done in current level
var firstAttempt = true;       //Whether current problem solved on the first attempt. TRUE BY DEFAULT.
var attemptHistory = [];       //An array to store if the past n problems were solved on first attempt.
var problemDice;               //if a random problem has to have different setup parameters
var animationComplete = false;

var problem = 1;
var problemIndex = 0;
var toSetupProblem = true;
var problemList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//var endProblem = false;


var mode = 1;
var modeIndex = 0;
var toSetupMode = true;
var modeList = [1, 2, 3, 4, 5, 6, 7];
//var endMode = false;

//-------------------------------------------------------------------------------------------//


function setup() {
  initializeModeFramework();
  createCanvas(640, 480);
}


function draw() {
  background(200);  
  if (cyclesSinceClick > 0 && clicked) {
    clicked = false;
  }

  //----------------------- LEVEL 1 --------------------------------//
  switch(level) {
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
      if (toSetupMode) {
        time = millis();
        toSetupMode = false;
      }
      background(255);
      stroke(0);
      fill(0);
      textSize(25);
      text("New problem!", 50, 50);

      if (millis() > time + 1000) {
        nextMode();
      }
      break;

      //Start button
    case 2:
      if (toSetupMode) {
        toSetupMode = false;
      }

      var startSizeInit = 10;
      var startSize = startSizeInit*sin(millis()/500) + 20;
      var mouseOnStart = false;
      //axes.show();
      //axes.showTicks();
      //axes.showGrid();
      if (dist(mouseX, mouseY, axes.XAxesToPixels(0), axes.YAxesToPixels(0)) < startSizeInit)
      {
        mouseOnStart = true;
      } else
      {
        mouseOnStart = false;
      }

      if (mouseOnStart) {
        fill(0, 150, 0);
        strokeWeight(2);
        stroke(0);
        ellipse(axes.XAxesToPixels(0), axes.YAxesToPixels(0), 2*startSizeInit, 2*startSizeInit);
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





    //----------------------LEVEL 2---------------------------------//
  case 2:
    if (toSetupLevel) {
      print("Setting up Level" + level);
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
      if (toSetupMode) {
        time = millis();
        toSetupMode = false;
      }
      background(255);
      stroke(0);
      fill(0);
      textSize(25);
      text("New problem!", 50, 50);

      if (millis() > time + 1000) {
        nextMode();
      }
      break;

      //Start button
    case 2:
      if (toSetupMode) {
        toSetupMode = false;
      }

      var startSizeInit = 10;
      var startSize = startSizeInit*sin(millis()/500) + 20;
      var mouseOnStart = false;
      //axes.show();
      //axes.showTicks();
      //axes.showGrid();
      if (dist(mouseX, mouseY, axes.XAxesToPixels(0), axes.YAxesToPixels(0)) < startSizeInit)
      {
        mouseOnStart = true;
      } else
      {
        mouseOnStart = false;
      }

      if (mouseOnStart) {
        fill(0, 150, 0);
        strokeWeight(2);
        stroke(0);
        ellipse(axes.XAxesToPixels(0), axes.YAxesToPixels(0), 2*startSizeInit, 2*startSizeInit);
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
    }    
    break;


    //--------------------    LEVEL 3 : y = x    ------------------------------------//

  case 3:
    if (toSetupLevel) {
      print("Setting up Level" + level);
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
      if (toSetupMode) {
        time = millis();
        toSetupMode = false;
      }
      background(255);
      stroke(0);
      fill(0);
      textSize(25);
      text("New problem!", 50, 50);

      if (millis() > time + 1000) {
        nextMode();
      }
      break;

      //Start button
    case 2:
      if (toSetupMode) {
        toSetupMode = false;
      }

      var startSizeInit = 10;
      var startSize = startSizeInit*sin(millis()/500) + 20;
      var mouseOnStart = false;
      //axes.show();
      //axes.showTicks();
      //axes.showGrid();
      if (dist(mouseX, mouseY, axes.XAxesToPixels(0), axes.YAxesToPixels(0)) < startSizeInit)
      {
        mouseOnStart = true;
      } else
      {
        mouseOnStart = false;
      }

      if (mouseOnStart) {
        fill(0, 150, 0);
        strokeWeight(2);
        stroke(0);
        ellipse(axes.XAxesToPixels(0), axes.YAxesToPixels(0), 2*startSizeInit, 2*startSizeInit);
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

      //--------------------    LEVEL 4 : y = 3x    ------------------------------------//

    case 4:
      if (toSetupLevel) {
        print("Setting up Level" + level);
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
        if (toSetupMode) {
          time = millis();
          toSetupMode = false;
        }
        background(255);
        stroke(0);
        fill(0);
        textSize(25);
        text("New problem!", 50, 50);

        if (millis() > time + 1000) {
          nextMode();
        }
        break;

        //Start button
      case 2:
        if (toSetupMode) {
          toSetupMode = false;
        }

        var startSizeInit = 10;
        var startSize = startSizeInit*sin(millis()/500) + 20;
        var mouseOnStart = false;
        //axes.show();
        //axes.showTicks();
        //axes.showGrid();
        if (dist(mouseX, mouseY, axes.XAxesToPixels(0), axes.YAxesToPixels(0)) < startSizeInit)
        {
          mouseOnStart = true;
        } else
        {
          mouseOnStart = false;
        }

        if (mouseOnStart) {
          fill(0, 150, 0);
          strokeWeight(2);
          stroke(0);
          ellipse(axes.XAxesToPixels(0), axes.YAxesToPixels(0), 2*startSizeInit, 2*startSizeInit);
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
              nextMode();
            } else {
              nextProblem();
            }
          }
        }
      }
        break;

        //--------------------------------------------------------------------//

    

  case 4:
    text("LEVEL" + level - 1 +" done", 50, 50);
    break;
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
