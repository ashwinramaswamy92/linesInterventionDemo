class Controller {
  constructor(positionX, positionY, sizeX, sizeY)
  {
    this.inactive = false;
    this.size = [sizeX, sizeY];
    this.position = [positionX, positionY];            //Top left pixel
    this.edgeWeight = 10;
    this.edgeColor = [0, 0, 0];
    this.faceColor = [255, 255, 255];
    this.centre = [this.position[0] + this.size[0]/2, this.position[1] + this.size[1]/2];
  }

  show() {
    stroke(this.edgeColor[0], this.edgeColor[1], this.edgeColor[2]);
    strokeWeight(this.edgeWeight);
    if (!this.inactive)    fill(this.faceColor[0], this.faceColor[1], this.faceColor[2]);
    else             fill(170);
    rect(this.position[0], this.position[1], this.size[0], 1.2*this.size[1], 10, 10, 10, 10);
  }

  activate() {
    this.inactive = false;
  }

  deactivate() {    
    this.inactive = true;
  }

  clickedOn() {
    //Returns true if you click within the controller boundaries
    var withinBoundsX = mouseX > this.position[0] && mouseX < (this.position[0] + this.size[0]);
    var withinBoundsY = mouseY > this.position[1] && mouseY < (this.position[1] + this.size[1]);

    if (mouseIsPressed && withinBoundsX && withinBoundsY) {
      return true;
    } else {
      return false;
    }
  }
}


class Knob extends Controller{
  constructor(positionX, positionY, sizeX, sizeY){
    
    super(positionX, positionY, sizeX, sizeY);

    this.currentTheta = 0;
    
    this.quantity = "θ";
    this.units = "degrees";
    this.knobScale = 0.5;          //Fraction of controller occupied by knob
    this.knobEdgeWeight = this.edgeWeight;
    this.knobEdgeColor = this.edgeColor;
    this.knobFaceColor = this.faceColor;
    this.toPrint = "";
    this.snapped = false;
    
    
    //for angle
    var x;
    var y;
    
    this.knobSize = this.knobScale*(this.size[0] + this.size[1])/2;
    var toPrint;
    }
    
    getTheta(){
      return this.currentTheta;
    }
    

    

    
    setKnobSize(knobSize_){
      this.knobSize = knobSize_;
    }
    setKnobEdgeWeight(knobEdgeWeight_){
      this.knobEdgeWeight = knobEdgeWeight_;
    }
    setKnobFaceColor(c1_, c2_, c3_){
      this.knobFaceColor[0] = c1_;
      this.knobFaceColor[1] = c2;
      this.knobFaceColor[2] = c3;
    }

    
    setKnobEdgeColor(c1, c2, c3){

        this.knobEdgeColor[0] = c1;
        this.knobEdgeColor[1] = c2;
        this.knobEdgeColor[2] = c3;

    }
    

    
    update(){
      if(!this.inactive && this.clickedOn()){
          this.currentTheta = (atan2((this.centre[1] - mouseY),( mouseX - this.centre[0])));

          if(this.units == "degrees" || this.units == "Degrees"){
              this.currentTheta = degrees(this.currentTheta);
          }
          this.snapToNearestHalfPi(0.95);
      }
    }
  
    show(){
      super.show();
      
      //Drawing the knob
      strokeWeight(this.knobEdgeWeight);
      stroke(this.knobEdgeColor[0], this.knobEdgeColor[1], this.knobEdgeColor[2]);
      fill(this.knobFaceColor[0], this.knobFaceColor[1], this.knobFaceColor[2]);
      ellipse(this.centre[0], this.centre[1], this.knobSize, this.knobSize);
      
      //Drawing marks around knob at half pi's
      strokeWeight(this.knobEdgeWeight);
      stroke(0);
      
      line(this.centre[0] + (this.knobSize/2)*cos(0), this.centre[1] - (this.knobSize/2)*sin(0),
      this.centre[0] + (this.knobSize/2)*cos(0) + 10, this.centre[1] - (this.knobSize/2)*sin(0));
      
      line(this.centre[0] + (this.knobSize/2)*cos(PI), this.centre[1] - (this.knobSize/2)*sin(PI),
      this.centre[0] + (this.knobSize/2)*cos(PI) - 10, this.centre[1] - (this.knobSize/2)*sin(PI));
      
      line(this.centre[0] + (this.knobSize/2)*cos(HALF_PI), this.centre[1] - (this.knobSize/2)*sin(HALF_PI),
      this.centre[0] + (this.knobSize/2)*cos(HALF_PI), this.centre[1] - (this.knobSize/2)*sin(HALF_PI) - 10);
      
      line(this.centre[0] + (this.knobSize/2)*cos(-HALF_PI), this.centre[1] - (this.knobSize/2)*sin(-HALF_PI),
      this.centre[0] + (this.knobSize/2)*cos(-HALF_PI), this.centre[1] - (this.knobSize/2)*sin(-HALF_PI) + 10);
      
      //Drawing angle marker
      strokeWeight(this.knobEdgeWeight);
      stroke(0);
      if(this.units == "degrees" || this.units == "Degrees"){
        this.x = this.centre[0] + (this.knobSize/2)*cos(radians(this.currentTheta));
        this.y =  this.centre[1] - (this.knobSize/2)*sin(radians(this.currentTheta));
      }
      else{
        this.x = this.centre[0] + (this.knobSize/2)*cos(this.currentTheta);
        this.y =  this.centre[1] - (this.knobSize/2)*sin(this.currentTheta);
      }
        
      line(this.centre[0], this.centre[1], this.x, this.y);
      
      //Displaying text
      strokeWeight(1);
      this.displayValue(this.position[0] + 15, this.position[1] + this.size[1] + 5, 0.15*(this.size[1] + this.size[0])/ 2);
    }
    
    
    
    

  
    
    
    
    snapToNearestHalfPi(snapRange){
      if(this.units == "degrees" || this.units == "Degrees")
      {
        let nearest90 = 0, i = 0; 
        while(abs(this.currentTheta - nearest90) > 45){
          if(this.currentTheta > 0)
            nearest90 = i*90;
          else
            nearest90 = -i*90;
        i++;
        }
        
        if(abs(this.currentTheta - nearest90) < snapRange)
        {
          this.currentTheta = nearest90;
          this.snapped = true;
        }
        else
          this.snapped = false;
      }
      else{
        let nearestHalfPi = 0, i = 0;
        while(abs(this.currentTheta - nearestHalfPi) > QUARTER_PI){
          if(this.currentTheta > 0)
            nearestHalfPi = i*HALF_PI;
          else
            nearestHalfPi = -i*HALF_PI;
        i++;
        }
        
        if(abs(this.currentTheta - nearestHalfPi) < snapRange)
        {
          this.currentTheta = nearestHalfPi;
          this.snapped = true;
        }
        else
          this.snapped = false;
      }
    }
    
    displayValue(tPositionX, tPositionY, tSize){
      textSize(tSize);
      fill(0);
      this.toPrint = "θ = " + int(this.currentTheta);
      text(this.toPrint, tPositionX, tPositionY);
    }
}





class BinarySlider extends Controller {
  constructor(positionX, positionY, sizeX, sizeY) {
    super(positionX, positionY, sizeX, sizeY);
    this.quantity = "";
    this.value = false;
    this.sliderColor = [255, 0, 0];
    this.grooveColor = [0, 0, 0];
  }

  show() {
    super.show();

    //The Groove
    strokeWeight(15);
    line(this.position[0] + 0.2*this.size[0], this.position[1] + 0.3*this.size[1], 
      this.position[0] + 0.2*this.size[0], this.position[1] + 0.9*this.size[1]);

    //The Slider
    stroke(255, 0, 0);
    strokeWeight(5);
    strokeCap(SQUARE);
    if (this.value == true) {
      line(this.position[0] + 0.10*this.size[0], this.position[1] + 0.35*this.size[1], this.position[0] + 0.30*this.size[0], 
        this.position[1] + 0.35*this.size[1])
    } else {
      line(this.position[0] + 0.10*this.size[0], this.position[1] + 0.85*this.size[1], this.position[0] + 0.30*this.size[0], 
        this.position[1] + 0.85*this.size[1])
    }
    strokeCap(ROUND);


    //The Text
    strokeWeight(1);
    textSize(20);
    stroke(200);
    if (this.value == true)      fill(0);
    else noFill();
    text("YES", this.position[0] + 0.35*this.size[0], this.position[1] + 0.45*this.size[1]);

    if (this.value == false)      fill(0);
    else noFill();
    text("NO", this.position[0] + 0.35*this.size[0], this.position[1] + 0.92*this.size[1]);
  }


  update() {
    if (this.clickedOn()) {
      if (mouseY < this.position[1] + this.size[1]/2) {
        this.value = true;
      } else {
        this.value = false;
      }
    }
  }
}

class hotButton extends Controller{
  constructor(positionX, positionY, sizeX, sizeY){
    super(positionX, positionY, sizeX, sizeY);
    
    this.buttonScale = 0.5;
    this.buttonEdgeWeight = this.edgeWeight/2;

    this.buttonOn = false;
    this.hasBeenPressed = false;
    this.centre[0] = this.position[0] + this.size[0]/2;
    this.centre[1] = this.position[1] + this.size[1]/2;
    this.buttonSize = this.buttonScale* this.size[0];
    this.theText = "SUBMIT";
  }
  
  setPosition(x, y){
    this.centre[0] = x;
    this.centre[1] = y;
    this.position = [this.centre[0] - this.size[0]/2, this.centre[1] - this.size[1]/2];
  }
  
  setSize(sX, sY){
    this.size = [sX, sY];
    this.centre = [this.position[0] + this.size[0]/2, this.position[1] + this.size[1]/2];
    
  }

  show() {
    super.show();
    
    if(this.isBeingPressed())  stroke(0, 255, 255);
    else                       stroke(0);
    fill(255);
    strokeWeight(this.buttonEdgeWeight);
    rectMode(CENTER);
    rect(this.centre[0], this.centre[1], this.buttonSize, this.buttonSize, 10, 10, 10, 10);
    rectMode(CORNER);
    
    textSize(20);
    text(this.theText, this.centre[0] - 40, this.centre[1] + 40);
    
    
  }
  
  mouseIsOnButton(){
      var withinBoundsX = mouseX > this.position[0] && mouseX < (this.position[0] + this.size[0]);
      var withinBoundsY = mouseY > this.position[1] && mouseY < (this.position[1] + this.size[1]);   
      if(withinBoundsX && withinBoundsY) return true;
      else      return false;
  }
  
  hasBeenPressed(){
    if(this.mouseIsOnButton() && mouseIsPressed){
      this.hasBeenPressed = true;
    }
    return this.hasBeenPressed;
  }
  
  isBeingPressed(){
    if(this.mouseIsOnButton() && mouseIsPressed){
      return true;
    }
    else{
      return false;
    }
    
    
  }
}

class NumberSlider {      //09/2/21 THIS CLASS IS IN DIRE NEED OF REFACTORING. MORE THAN ANYTHING ELSE AND THATS SAYING A LOT.
  constructor(positionX, positionY, startNumber) {
    this.position = [positionX, positionY];
    this.speed = 0.1;
    this.textSize = 20; 
    this.sliderValue = startNumber;
    this.trueValue = startNumber;
    this.topLeft = [this.position[0] - 13, this.position[1] - 42];
    this.fullSize = [40, 70];
    this.upPressed = false;
    this.downPressed = false;
    this.numWidth = 0
    
    this.minValue = 0;
    this.maxValue = 100;
  }
  
  
  setPosition(x, y){
    this.position = [x, y];
    this.topLeft = [this.position[0] - 13, this.position[1] - 42];
  }

  show() {

    noFill();
    stroke(0);
    //rect(this.position[0] - 20, this.position[1] - 15, 40, 30);
    //rect(this.position[0] - 13, this.position[1] - 22, 40, 30);


    //Main number
    textSize(this.textSize);
    //text(this.sliderValue, this.position[0] - 7, this.position[1] + 7);  
    text(this.sliderValue, this.position[0], this.position[1]);
    this.numWidth = textWidth(this.sliderValue)  


    //Top Arrow
    if(this.upPressed)  fill(0, 0, 255)
    else fill(0);
    //rect(this.position[0] - 13, this.position[1] - 42, 40, 20);
    triangle(this.position[0] - 13 + 20 - 4, this.position[1] - 35, this.position[0] - 13 + 20 + 4, 
      this.position[1] - 35, this.position[0] - 13 + 20, this.position[1] - 35 - 6);


    //Bot Arrow
    if(this.downPressed)  fill(0, 0, 255)
    else fill(0);
    //rect(this.position[0] - 13, this.position[1] + 8, 40, 20);
    triangle(this.position[0] - 13 + 20 - 4, this.position[1] + 15 + 6, this.position[0] - 13 + 20 + 4, 
      this.position[1] + 15 + 6, this.position[0] - 13 + 20, this.position[1] + 15 + 12);
    //DON'T ASK HOW I GOT THOSE NUMBERS - JUST FIGURE IT OUT AND HOPEFULLY REWRITE IT IN A BETTER WAY.

  }


  clickedOn() {
    //Returns true if you click within the controller boundaries
    var withinBoundsX = mouseX > this.topLeft[0] && mouseX < (this.topLeft[0] + this.fullSize[0]);
    var withinBoundsY = mouseY > this.topLeft[1] && mouseY < (this.topLeft[1] + this.fullSize[1]);

    if (mouseIsPressed && withinBoundsX && withinBoundsY) {
      return true;
    } else {
      return false;
    }
  }
  
  
  update() {
    if(this.clickedOn() && mouseY > this.topLeft[1] + this.fullSize[1]/2){
     this.downPressed = true; 
    }  else{
     this.downPressed = false;
    }
    if(this.clickedOn() && mouseY < this.topLeft[1] + this.fullSize[1]/2){
     this.upPressed = true; 
    }  else{
     this.upPressed = false;
    }
    
    if(this.upPressed && this.trueValue < this.maxValue) this.trueValue = this.trueValue + this.speed;
    if(this.downPressed && this.trueValue > this.minValue) this.trueValue = this.trueValue - this.speed;
    
    this.sliderValue = round(this.trueValue);
    
  }


  snap() {
  }
}
