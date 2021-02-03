  function previewPoint(theAxes, guideLinesOn, gridOn, showCoords){
    axes = theAxes;
    var xPixels = 0, yPixels = 0, tempX = 0, tempY = 0;
    
    // ------ Setting Border conditions (If cursor goes out of bounds of axes)  ---//
    if(mouseX < axes.xBeginAndEndPixels[0]){
        tempX = axes.xBeginAndEndPixels[0];
      }
      else if(mouseX >  axes.xBeginAndEndPixels[1]){
        tempX = axes.xBeginAndEndPixels[1];
      }
      else{
        tempX = mouseX;
      }
      
      if(mouseY < axes.yBeginAndEndPixels[0]){
        tempY = axes.yBeginAndEndPixels[0];
      }
      else if(mouseY >  axes.yBeginAndEndPixels[1]){
        tempY = axes.yBeginAndEndPixels[1];
      }
      else{
        tempY = mouseY;
      }
      
      //--- Snapping to Grid if necessary---- //
    if(!gridOn)
    {
      xPixels = tempX;
      yPixels = tempY;
    }
    else
    {
      tempX = axes.XPixelsToAxes(tempX);
      tempY = axes.YPixelsToAxes(tempY);
      [tempX, tempY] = snapToGrid(tempX, tempY, axes);
      xPixels = axes.XAxesToPixels(tempX);
      yPixels = axes.YAxesToPixels(tempY);
    }
    
    // DRAWING GUIDE LINES
    if(guideLinesOn)
    {
      //x-axis
      stroke(229, 122, 0);
      fill(229, 122, 0);
      strokeWeight(1);
      line(xPixels, yPixels, axes.origin[0], yPixels);                    // guiding line along point
  
      strokeWeight(axes.axesThickness);  
      line(axes.origin[0], axes.origin[1], xPixels, axes.origin[1]);    // guiding line along x-axis
  
  
  
      //y-axis  
      stroke(0, 0, 255);
      fill(0, 0, 255);
  
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
      if(showCoords){
        var currentPoint = new Point(axes.XPixelsToAxes(xPixels), axes.YPixelsToAxes(yPixels), axes);
        currentPoint.setLabelDecimals(0);
        currentPoint.showData();
      }
      
      
    return([axes.XPixelsToAxes(xPixels), axes.YPixelsToAxes(yPixels)]);
    
    
  }
  

  
  function setPoint(xIn, yIn, theAxes, gridOn){
    var thePoint;
    axes = theAxes;
    if(gridOn){
      [x, y] = snapToGrid(xIn, yIn, theAxes);
    }
    else{
      [x, y] = [xIn, yIn];
    }
    thePoint = new Point(x, y, axes);
    return thePoint;
  }
  
  
  function mouseWithinAxes(theAxes){
    axes = theAxes;
    if(mouseX > axes.xBeginAndEndPixels[0] && mouseX < axes.xBeginAndEndPixels[1]){
      if(mouseY > axes.yBeginAndEndPixels[0] && mouseY < axes.yBeginAndEndPixels[1]){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
    
  
  
  function snapToGrid(xIn, yIn, theAxes)
  {
    axes = theAxes;
    x = roundToNearest((xIn), axes.tickIntervals[0]);
    y = roundToNearest((yIn), axes.tickIntervals[1]);
    return [x, y];
  }
  
  function roundToNearest(number, multipleOf){
    var i = 0, num1 = 0, num2 = 0;
    if (number >= 0){
      while(number >= num2){
        i++;
        num2 = i*multipleOf;
        num1 = (i-1)*multipleOf;
      }
    }

    else{
      while(number <= num2){
        i--;
        num2 = i*multipleOf;
        num1 = (i+1)*multipleOf;
      }
    }
    if(abs(number - num2) <= abs(number - num1)){
      return num2;
    }
    else {
      return num1;
    }
  }
