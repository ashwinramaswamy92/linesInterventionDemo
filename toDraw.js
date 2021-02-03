function setupLevel(level)
{
  switch(level) {
  case 1:

    print("Setting up level 1");
    break;

  case 2:
    print("Setting up level 2");
    break;
  }

  toSetupLevel = false;
}


function drawLevel(level)
{
  switch(level) {
  case 1:
    textSize(45);
    text("Level 1", 100, 100);
    break;

  case 2:
    textSize(45);
    text("Level 2", 100, 100);
    break;
  }

  //if(clicked){
  //  endLevel = true;
  //}
}


function setupProblem(problem)
{
  switch(problem) {
  case 1:
    print("Setting up problem 1");
    break;

  case 2:
    print("Setting up problem 2");
    break;
  }

  toSetupProblem = false;
}


function drawProblem(problem)
{
  switch(problem) {
  case 1:
    textSize(15);
    text("Problem 1", 50, 50);
    break;

  case 2:
    textSize(15);
    text("Problem 2", 50, 50);
    break;
  }

  //if(clicked){
  //  endProblem = true;
  //}
}


function setupMode(mode)
{
  switch(level) {
  case 1:

    switch(mode) {
    case 1:
      print("Setting up mode 1");
      fill(0);
      break;

    case 2:
      print("Setting up mode 2");
      fill(255);
      break;
    }
    break;
  }

  toSetupMode = false;
}


function drawMode(mode)
{
  switch(level) {
  case 1:
    switch(mode) {
    case 1:
      ellipse(width/2, height/2, 40, 40);
      if (clicked) {
        nextMode();
        clicked = false;
      }
      break;

    case 2:
      ellipse(width/2, height/2, 40, 40); 
      if (clicked) {
        nextProblem();
        clicked = false;
      }
      break;
    }
    break;
  }
  //if(clicked){
  //  endMode = true;
  //}
}
