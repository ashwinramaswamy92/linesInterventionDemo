function previewPoint(theAxes, guideLinesOn, gridOn, showCoords) {
  axes = theAxes;
  var xPixels = 0, yPixels = 0, tempX = 0, tempY = 0;

  // ------ Setting Border conditions (If cursor goes out of bounds of axes)  ---//
  if (mouseX < axes.xBeginAndEndPixels[0]) {
    tempX = axes.xBeginAndEndPixels[0];
  }
  else if (mouseX > axes.xBeginAndEndPixels[1]) {
    tempX = axes.xBeginAndEndPixels[1];
  }
  else {
    tempX = mouseX;
  }

  if (mouseY < axes.yBeginAndEndPixels[0]) {
    tempY = axes.yBeginAndEndPixels[0];
  }
  else if (mouseY > axes.yBeginAndEndPixels[1]) {
    tempY = axes.yBeginAndEndPixels[1];
  }
  else {
    tempY = mouseY;
  }

  //--- Snapping to Grid if necessary---- //
  if (!gridOn) {
    xPixels = tempX;
    yPixels = tempY;
  }
  else {
    tempX = axes.XPixelsToAxes(tempX);
    tempY = axes.YPixelsToAxes(tempY);
    [tempX, tempY] = snapToGrid(tempX, tempY, axes);
    xPixels = axes.XAxesToPixels(tempX);
    yPixels = axes.YAxesToPixels(tempY);
  }

  // DRAWING GUIDE LINES
  if (guideLinesOn) {
    //x-axis
    stroke(xColorArr[0], xColorArr[1], xColorArr[2]);
    fill(xColorArr[0], xColorArr[1], xColorArr[2]);
    strokeWeight(1);
    line(xPixels, yPixels, axes.origin[0], yPixels);                    // guiding line along point

    strokeWeight(axes.axesThickness);
    line(axes.origin[0], axes.origin[1], xPixels, axes.origin[1]);    // guiding line along x-axis



    //y-axis  
    stroke(yColorArr[0], yColorArr[1], yColorArr[2]);
    fill(yColorArr[0], yColorArr[1], yColorArr[2]);
    strokeWeight(1);
    line(xPixels, yPixels, xPixels, axes.origin[1]);                    // guiding line along point

    strokeWeight(axes.axesThickness);
    line(axes.origin[0], axes.origin[1], axes.origin[0], yPixels);    // guiding line along y-axis



  }



  //GHOST POINT
  strokeWeight(1);
  stroke(0, 0, 0, 100);
  fill(255, 255, 255, 255);
  ellipse(xPixels, yPixels, 10, 10);
  //Adding Point coordinates
  if (showCoords) {
    var currentPoint = new Point(axes.XPixelsToAxes(xPixels), axes.YPixelsToAxes(yPixels), axes);
    currentPoint.setLabelDecimals(0);
    currentPoint.showData();
  }


  return ([axes.XPixelsToAxes(xPixels), axes.YPixelsToAxes(yPixels)]);


}



function setPoint(xIn, yIn, theAxes, gridOn) {
  var thePoint;
  axes = theAxes;
  if (gridOn) {
    [x, y] = snapToGrid(xIn, yIn, theAxes);
  }
  else {
    [x, y] = [xIn, yIn];
  }
  thePoint = new Point(x, y, axes);
  return thePoint;
}


function mouseWithinAxes(theAxes) {
  axes = theAxes;
  if (mouseX > axes.xBeginAndEndPixels[0] && mouseX < axes.xBeginAndEndPixels[1]) {
    if (mouseY > axes.yBeginAndEndPixels[0] && mouseY < axes.yBeginAndEndPixels[1]) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}



function snapToGrid(xIn, yIn, theAxes) {
  axes = theAxes;
  x = roundToNearest((xIn), axes.tickIntervals[0]);
  y = roundToNearest((yIn), axes.tickIntervals[1]);
  return [x, y];
}

function roundToNearest(number, multipleOf) {
  var i = 0, num1 = 0, num2 = 0;
  if (number >= 0) {
    while (number >= num2) {
      i++;
      num2 = i * multipleOf;
      num1 = (i - 1) * multipleOf;
    }
  }

  else {
    while (number <= num2) {
      i--;
      num2 = i * multipleOf;
      num1 = (i + 1) * multipleOf;
    }
  }
  if (abs(number - num2) <= abs(number - num1)) {
    return num2;
  }
  else {
    return num1;
  }
}



function refreshBackground() {
  background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
}

function showCorrectAndContinueFeedback() {
  stroke(0);
  strokeWeight(3);
  fill(0, 200, 0);
  ellipse(axes.XAxesToPixels(correctAnswer[0]), axes.YAxesToPixels(correctAnswer[1]), 10, 10);

  let feedbackTextSize = 30
  textSize(feedbackTextSize);
  textFont(cuteFont) //setting font
  // textAlign(CENTER)
  let feedbackX = 250
  let feedbackY = 440
  let continueX = 150
  let feedbackText = "CORRECT!"


  text(feedbackText, feedbackX, feedbackY);
  let feedbackHeight = feedbackTextSize

  // textAlign(LEFT)


  textFont(normalFont)
  stroke(0);
  strokeWeight(3);
  fill(0);
  let continuePromptText = "Click anywhere to continue!"
  text(continuePromptText, continueX, feedbackY + feedbackHeight);

}

function showLevelProgressionFeedback() {
  refreshBackground();
  stroke(0);
  strokeWeight(3);
  fill(0, 200, 0);
  textSize(40);
  textFont(cuteFont)
  text("LEVEL COMPLETE!", 150, 200);

  textFont(normalFont)
  textSize(30);

  stroke(0);
  strokeWeight(3);
  fill(0);
  text("Click anywhere to continue...", 150, 240);

}


function showNewProblemText() {

  refreshBackground();
  textFont(cuteFont);

  stroke(0);
  fill(0);
  textSize(45);
  text("New problem!", 150, 200);
  textFont(normalFont)

}


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


function displayNewProblemScreen() {
  if (toSetupMode) {
    time = millis();
    toSetupMode = false;
  }

  showNewProblemText();

  if (millis() > time + 1000) {
    nextMode();
  }
}

function displayStartButton() {

  if (toSetupMode) {
    toSetupMode = false;
  }

  var startSizeInit = 10;
  var startSize = startSizeInit * sin(millis() / 500) + 20;
  var mouseOnStart = false;

  if (dist(mouseX, mouseY, axes.XAxesToPixels(0), axes.YAxesToPixels(0)) < startSizeInit) {
    mouseOnStart = true;
  } else {
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