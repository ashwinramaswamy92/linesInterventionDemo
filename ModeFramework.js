function initializeModeFramework(){
  


}



function nextMode(){
  toSetupMode = true;
  modeIndex = modeIndex + 1;
  mode = modeList[modeIndex];
}


function nextProblem(){
  toSetupProblem = true;
  toSetupMode = true;
  
  problemIndex = problemIndex + 1;
  problem = problemList[problemIndex];
  
  modeIndex = 0;
  mode = modeList[modeIndex];  
}

function nextLevel(){
  endLevel = false;
  
  toSetupLevel = true;
  toSetupProblem = true;
  toSetupMode = true;
  
  levelIndex = levelIndex + 1;
  level = levelList[levelIndex];
  
  problemIndex = 0;
  problem = problemList[problemIndex];
  
  modeIndex = 0;
  mode = modeList[modeIndex]; 
}

//function finishAll(){
  
  
  
//}



/* TEMPLATE:: This is how to use the mode framework in the draw() function"




*/
