
//------------------------------- AXES OBJECT -----------------------------------------//

class Axes {
  constructor() {
    this.origin = [];
    this.xBeginAndEndPixels = [];
    this.yBeginAndEndPixels = [];
    this.xValues = [];
    this.yValues = [];

    this.sizeInPixels = [300, 300];
    this.axesThickness = 3;
    this.tickIntervals = [1, 1];
    this.xLabel = "x-axis";
    this.yLabel = "y-axis";


    this.pixelsPerTick = [50, 50];
    this.setLocation(0, 0);
  }

  //-------------Setters----------------//

  setOrigin(originX, originY) {
    if (arguments.length == 0) {
      this.origin[0] = axes.xBeginAndEndPixels[0] + axes.sizeInPixels[0]/2;
      this.origin[1] = axes.yBeginAndEndPixels[0] + axes.sizeInPixels[1]/2;
    } else if (arguments.length == 1) {
      if (arguments[0] == 'CENTER' || arguments[0] == 'CENTRE') {
        this.origin[0] = axes.xBeginAndEndPixels[0] + axes.sizeInPixels[0]/2;
        this.origin[1] = axes.yBeginAndEndPixels[0] + axes.sizeInPixels[1]/2;
      } else if (arguments[0] == 'LEFT' || arguments[0] == 'BOTTOMLEFT' || arguments[0] == 'BOTTOM_LEFT') {  //IDK Why doesnt Work
        this.origin[0] = axes.xBeginAndEndPixels[0];
        this.origin[1] = axes.yBeginAndEndPixels[1];
      } else {

        this.origin[0] = axes.xBeginAndEndPixels[0] + axes.sizeInPixels[0]/2;
        this.origin[1] = axes.yBeginAndEndPixels[0] + axes.sizeInPixels[1]/2;
      }
    } else {


      try {

        if (originX < this.xBeginAndEndPixels[0] || originX > this.xBeginAndEndPixels[0] + this.sizeInPixels[0]) throw "Couldn't shift origin, X out of bounds";
        if (originY < this.yBeginAndEndPixels[0] || originY > this.yBeginAndEndPixels[0] + this.sizeInPixels[1]) throw "Couldn't shift origin, X out of bounds";

        this.origin[0] = originX;
        this.origin[1] = originY;
      }
      catch(err)
      {
        stroke(255);
        text("Goddammit " + err, 10, 10);
        text( "Origin reverted to: (" + this.origin[0] + ", " + this.origin[1] + ")", 30, 30);
      }
    }
  }



  setOriginCenter() {
    this.origin[0] = axes.xBeginAndEndPixels[0] + axes.sizeInPixels[0]/2;
    this.origin[1] = axes.yBeginAndEndPixels[0] + axes.sizeInPixels[1]/2;
  }


  setOriginLeft() {
    print("setting left");
    this.origin[0] = axes.xBeginAndEndPixels[0];
    this.origin[1] = axes.yBeginAndEndPixels[1];
  }

  setLocation(locationX, locationY) {
    this.xBeginAndEndPixels[0] = locationX;
    this.yBeginAndEndPixels[0] = locationY;

    this.xBeginAndEndPixels[1] = (this.xBeginAndEndPixels[0] + this.sizeInPixels[0]);
    this.yBeginAndEndPixels[1] = (this.yBeginAndEndPixels[0] + this.sizeInPixels[1]);

    this.setOrigin((this.xBeginAndEndPixels[1] + this.xBeginAndEndPixels[0])/2, (this.yBeginAndEndPixels[1] + this.yBeginAndEndPixels[0])/2);
  }

  setSize(sizeX, sizeY)
  {
    this.sizeInPixels[0] = sizeX;
    this.sizeInPixels[1] = sizeY;

    this.setLocation(this.xBeginAndEndPixels[0], this.yBeginAndEndPixels[0]);
  }


  setXLimits (xMin, xMax)
  {
    this.pixelsPerTick[0] = (this.xBeginAndEndPixels[1] - this.xBeginAndEndPixels[0])/(xMax - xMin);
  }

  setYLimits(yMin, yMax)
  {
    this.pixelsPerTick[1] = (this.yBeginAndEndPixels[1] - this.yBeginAndEndPixels[0])/(yMax - yMin);
  }

  setTickSizes(xTickSize, yTickSize)
  {
    this.tickIntervals[0] = xTickSize;
    this.tickIntervals[1] = yTickSize;
  }

  setAxesThickness(axesWeight) {
    this.axesThickness = axesWeight;
  }

  setXLabel(label) {
    this.xLabel = label;
  }

  setYLabel(label) {
    this.yLabel = label;
  }


  //----------------------Getters---------------------------------//


  getXValues(gridOn) {
    if (arguments.length == 0) gridOn = false;
    var numberOfValues;

    if (gridOn) {
      numberOfValues = floor((axes.XPixelsToAxes(this.xBeginAndEndPixels[1]) - axes.XPixelsToAxes(this.xBeginAndEndPixels[0]))/this.tickIntervals[0]);
      for (var i = 0; i <= numberOfValues; i++) {
        this.xValues[i] = axes.XPixelsToAxes(this.xBeginAndEndPixels[0]) + this.tickIntervals[0]*i;
      }
    } else {
      for (var i = this.xBeginAndEndPixels[0]; i <= this.xBeginAndEndPixels[1]; i++) {
        this.xValues[i - this.xBeginAndEndPixels[0]] = axes.XPixelsToAxes(i);
      }
    }
    return this.xValues;
  }


  getYValues(gridOn) {
    if (arguments.length == 0) gridOn = false;
    var numberOfValues;

    if (gridOn) {
      numberOfValues = floor((axes.YPixelsToAxes(this.yBeginAndEndPixels[0]) - axes.YPixelsToAxes(this.yBeginAndEndPixels[1]))/this.tickIntervals[1]);
      for (var i = 0; i <= numberOfValues; i++) {
        this.yValues[i] = axes.YPixelsToAxes(this.yBeginAndEndPixels[1]) + this.tickIntervals[1]*i;
      }
    } else {
      for (var i = this.yBeginAndEndPixels[0]; i <= this.yBeginAndEndPixels[1]; i++) {
        this.yValues[i - this.yBeginAndEndPixels[0]] = axes.YPixelsToAxes(i);
        if (this.yValues[i - this.yBeginAndEndPixels[0]] == -0) {
          this.yValues[i - this.yBeginAndEndPixels[0]] = 0;        //Getting rid of the minus 0 which is fcking dumb.
        }
      }

      this.yValues = this.yValues.reverse();
    }
    return this.yValues;
  }

  //------------------------Conversions: ----------------------------//


  //--------------------------Going from Screen to Axes ------------------------------------//

  PixelsToAxes(screenXYInPixels)
  {
    var axisXYInPixels;
    var xy;
    for (var i=0; i<2; i++)
    {
      axisXYInPixels[i] = screenXYInPixels[i] - this.origin[i];
      xy[i] = axisXYInPixels[i]/this.pixelsPerTick[i];
    }
    xy[1] = -xy[1];    //Flipping point about y axis

    return xy;
  }

  XPixelsToAxes(screenX)
  {
    var axisXInPixels, x;
    axisXInPixels = screenX - this.origin[0];
    x = axisXInPixels/this.pixelsPerTick[0];

    return x;
  }

  YPixelsToAxes(screenY)
  {
    var axisYInPixels, y;
    axisYInPixels = screenY - this.origin[1];
    y = -axisYInPixels/this.pixelsPerTick[1];      //Flipping because y

    return y;
  }




  //--------------------------Going from Axes to Screen------------------------------------//
  AxesToPixels(axesXY)
  {
    var axisXYInPixels;
    for (var i = 0; i < 2; i++)
    {
      axisXYInPixels[i] = axesXY[i] * this.pixelsPerTick[i];
    }
    var screenXYInPixels = [axisXYInPixels[0] + this.origin[0], -axisXYInPixels[1] + this.origin[1]];  //Unflipping about Y-axis

    return screenXYInPixels;
  }

  XAxesToPixels(x_)
  {
    var axisXInPixels;
    axisXInPixels = x_ * this.pixelsPerTick[0];
    var screenX = axisXInPixels + this.origin[0];

    return screenX;
  }

  YAxesToPixels(y_)
  {
    var axisYInPixels;
    axisYInPixels = y_ * this.pixelsPerTick[1];
    var screenY = -axisYInPixels + this.origin[1];  //Unflipping about Y-axis

    return screenY;
  }






  //--------------------------display------------------------------//
  show() {
    stroke(0);
    fill(0);
    strokeWeight(this.axesThickness);
    line(this.xBeginAndEndPixels[0], this.origin[1], this.xBeginAndEndPixels[1], this.origin[1]);    //Draw  x-Axis
    line(this.origin[0], this.yBeginAndEndPixels[0], this.origin[0], this.yBeginAndEndPixels[1]);    //Draw  y-Axis
  }

  showTicks()
  {
    //Ticks on x-axis
    var xIntervalInPixels = this.tickIntervals[0]*this.pixelsPerTick[0];

    textSize(15);
    strokeWeight(this.axesThickness/2);

    var i = 0;
    while (this.origin[0] + i*xIntervalInPixels <= this.xBeginAndEndPixels[1]) {
      line(this.origin[0] + i*xIntervalInPixels, this.origin[1] - 10, this.origin[0] + i*xIntervalInPixels, this.origin[1] + 10);
      if (i != 0) {
        text(nf(this.tickIntervals[0] * i, 0, 0), this.origin[0] + i*xIntervalInPixels - 10, this.origin[1] + 30);
      }
      i++;
    }
    i = 0;
    while (this.origin[0] - i*xIntervalInPixels >= this.xBeginAndEndPixels[0]) {
      line(this.origin[0] - i*xIntervalInPixels, this.origin[1] - 10, this.origin[0] - i*xIntervalInPixels, this.origin[1] + 10);
      if (i != 0) {
        text(nf(this.tickIntervals[0] * -i, 0, 0), this.origin[0] - i*xIntervalInPixels - 15, this.origin[1] + 30);
      }
      i++;
    }

    //Ticks on y-axis
    var yIntervalInPixels = this.tickIntervals[1]*this.pixelsPerTick[1];

    textSize(15);
    strokeWeight(this.axesThickness/2);

    i = 0;
    while (this.origin[1] + i*yIntervalInPixels <= this.yBeginAndEndPixels[1]) {
      line(this.origin[0] - 10, this.origin[1] + i*yIntervalInPixels, this.origin[0] + 10, this.origin[1] + i*yIntervalInPixels);
      if (i != 0) {
        text(nf(this.tickIntervals[1] * -i, 0, 0), this.origin[0] - 50, this.origin[1] + i*yIntervalInPixels + 5);
      }
      i++;
    }

    i = 0;
    while (this.origin[1] - i*yIntervalInPixels >= this.yBeginAndEndPixels[0]) {
      line(this.origin[0] - 10, this.origin[1] - i*yIntervalInPixels, this.origin[0] + 10, this.origin[1] - i*yIntervalInPixels);
      if (i != 0) {
        text(nf(this.tickIntervals[1] * i, 0, 0), this.origin[0] - 40, this.origin[1] - i*yIntervalInPixels + 5);
      }
      i++;
    }
  }



  showGrid() {
    //x-axis
    var xIntervalInPixels = this.tickIntervals[0]*this.pixelsPerTick[0];
    strokeWeight(this.axesThickness/8);
    stroke(150);

    var i = 0;
    while (this.origin[0] + i*xIntervalInPixels <= this.xBeginAndEndPixels[1]) {
      line(this.origin[0] + i*xIntervalInPixels, this.yBeginAndEndPixels[0], this.origin[0] + i*xIntervalInPixels, this.yBeginAndEndPixels[1]);
      i++;
    }

    i = 0;
    while (this.origin[0] - i*xIntervalInPixels >= this.xBeginAndEndPixels[0]) {
      line(this.origin[0] - i*xIntervalInPixels, this.yBeginAndEndPixels[0], this.origin[0] - i*xIntervalInPixels, this.yBeginAndEndPixels[1]);
      i++;
    }
    //y-axis
    var yIntervalInPixels = this.tickIntervals[1]*this.pixelsPerTick[1];

    strokeWeight(this.axesThickness/8);
    stroke(150);

    //Drawing gridlines above origin
    i = 0;
    while (this.origin[1] + i * yIntervalInPixels <= this.yBeginAndEndPixels[1]) {
      line(this.xBeginAndEndPixels[0], this.origin[1] + i*yIntervalInPixels, this.xBeginAndEndPixels[1], this.origin[1] + i*yIntervalInPixels);
      i++;
    }

    //Drawing gridlines below origin
    i = 0;
    while (this.origin[1] - i * yIntervalInPixels >= this.yBeginAndEndPixels[0]) {
      line(this.xBeginAndEndPixels[0], this.origin[1] - i*yIntervalInPixels, this.xBeginAndEndPixels[1], this.origin[1] - i*yIntervalInPixels);
      i++;
    }
  }
}

//-----------------------------------------------------------------------------------------------//





//------------------------------- LINE OBJECT -----------------------------------------//
class Line {
  constructor(theAxes) {

    this.axes = theAxes;

    this.slope = 0;
    this.yIntercept = 0;
    this.computeXIntercept();
    this.formEquation();   

    this.lineWeight = 4;
    this.lineColor = [0, 0, 0];
  }





  setSlope(slope_) {
    this.slope = slope_;
    if (this.slope == null) {
      this.yIntercept = null;
    }
    this.formEquation();
  }

  setYIntercept(yIntercept_) {
    this.yIntercept = yIntercept_;
    if (this.yIntercept == null) {
      this.slope = null;
    }
    this.formEquation();
  }

  setXIntercept(xIntercept_) {
    this.yIntercept = null;
    this.slope = null;
    this.xIntercept = xIntercept_;
    this.formEquation();
  }

  setLineWeight(weight) {
    lineWeight = weight;
  }

  getEquation() {
    return this.equation;
  }

  getY(x) {
    return (this.slope*x + this.yIntercept);
  }

  getX(y) {
    return (y/this.slope - this.yIntercept/this.slope);
  }

  computeXIntercept() {
    if (this.slope != 0)
    {
      this.xIntercept = -this.yIntercept/this.slope;
    } else
    {
      this.xIntercept = null;
    }
  }

  formEquation() {
    if (this.slope != null && this.yIntercept != null)
    {
      if (this.slope != 0) {
        this.equation = "y = " + this.slope + "x + " + this.yIntercept;
        //lineType = 0;
      } else {
        this.equation = "y = " + this.yIntercept;
        //lineType = 1;
      }
    } else {
      this.equation = "x = " + this.xIntercept;
    }
  }


  show(x1, x2) {
    var x1Pixels;
    var x2Pixels;
    var y1Pixels;
    var y2Pixels;
    var y1, y2;

    stroke(this.lineColor[0], this.lineColor[1], this.lineColor[2]);
    strokeWeight(this.lineWeight);
    if (this.slope != null && this.yIntercept != null)
    {
      x1Pixels = this.axes.XAxesToPixels(x1);
      x2Pixels = this.axes.XAxesToPixels(x2);
      y1Pixels = this.axes.YAxesToPixels(this.getY(x1));
      y2Pixels = this.axes.YAxesToPixels(this.getY(x2));
      //if(x1Pixels < this.axes.xBeginAndEndPixels[0]) x1Pixels = this.axes.xBeginAndEndPixels[0];
      //if(x2Pixels > this.axes.xBeginAndEndPixels[1]) x2Pixels = this.axes.xBeginAndEndPixels[1];
      //if(y1Pixels < this.axes.yBeginAndEndPixels[0]) y1Pixels = this.axes.yBeginAndEndPixels[0];
      //if(y2Pixels > this.axes.yBeginAndEndPixels[1]) y2Pixels = this.axes.yBeginAndEndPixels[1];
      line(x1Pixels, y1Pixels, x2Pixels, y2Pixels);
    } else
    {
      //treat the two arguments as y1, y2.
      y1 = x1;
      y2 = x2;
      x1Pixels = this.axes.XAxesToPixels(this.xIntercept);
      x2Pixels = this.axes.XAxesToPixels(this.xIntercept);
      y1Pixels = this.axes.YAxesToPixels(y1);
      y2Pixels = this.axes.YAxesToPixels(y2);

      line(x1Pixels, y1Pixels, x2Pixels, y2Pixels);
    }
  }
}



//-----------------------------------------------------------------------------------------------//





//------------------------------- POINT OBJECT -----------------------------------------//


class Point
{
  constructor(x_, y_, theAxes) {
    this.x = x_;
    this.y = y_;
    this.axes = theAxes;
    this.px = axes.XAxesToPixels(this.x);
    this.py = axes.YAxesToPixels(this.y);
    this.Size = 5;
    this.pointStroke = [0, 0, 0];
    this.pointFill = [0, 0, 0];
    this.pointLabel = "(" + this.x + ", " + this.y + ")";
  }


  setXY(x_, y_)
  {
    this.x = x_;
    this.y = y_;
    this.px = this.axes.XAxesToPixels(this.x);
    this.py = this.axes.YAxesToPixels(this.y);
  }

  setLabelDecimals(decimals)
  {
    this.pointLabel = "(" + nf(this.x, 0, decimals) + ", " + nf(this.y, 0, decimals) + ")";
  }


  getXY()
  {
    return [this.x, this.y];
  }

  getX()
  {
    return this.x;
  }

  getY()
  {
    return this.y;
  }



  show()
  {
    this.px = axes.XAxesToPixels(this.x);
    this.py = axes.YAxesToPixels(this.y);
    //ellipseMode(RADIUS);
    stroke(this.pointStroke[0], this.pointStroke[1], this.pointStroke[2]);
    fill(this.pointFill[0], this.pointFill[1], this.pointFill[2]);
    ellipse(this.px, this.py, this.Size, this.Size);
  }

  showX()
  {
    fill(255, 0, 0);
    textSize(25);
    text("x", this.px - 8, this.py + 8);
  }

  showData()
  {
    textSize(18);
    fill(0);
    strokeWeight(1);
    text(this.pointLabel, this.px + 20, this.py + 20);
  }
}
