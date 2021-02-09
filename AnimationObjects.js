class Segment {
  constructor(midX, midY, Length) {
    this.midpointX = midX;
    this.midpointY = midY;
    this.velX = 0;
    this.velY = 0;
    this.len = Length;
    this.speed = 0.05;
    
    this.startX = this.midpointX - this.len/2;
    this.endX = this.midpointX + this.len/2;
    this.startY = this.midpointY;
    this.endY = this.midpointY;
    
    this.theta = 0;
    this.dtheta = 0;
    this.thetaSpeed = 0.2;
    
    this.moved = false;
    this.spun = false;
  }

  show() {
    strokeWeight(2);
    line(this.startX, this.startY, this.endX, this.endY, 150);
    //ellipse(this.midpointX, this.midpointY, 3, 3);
  }

  initialize(){
    this.velX = 0;
    this.velY = 0;
    this.speed = 0.05;
    
    this.startX = this.midpointX - this.len/2;
    this.endX = this.midpointX + this.len/2;
    this.startY = this.midpointY;
    this.endY = this.midpointY;
    
    this.theta = 0;
    this.dtheta = 0;
    this.thetaSpeed = 0.2;
    
    this.moved = false;
    this.spun = false;
  }
  move(dX, dY) {
    if (dist(this.midpointX, this.midpointY, dX, dY) > 1) {
      this.velX = this.speed*(dX - this.midpointX);
      this.velY = this.speed*(dY - this.midpointY);
      
      
    } else {
      this.velX = 0;
      this.velY = 0;
      this.moved = true;
    }
    this.midpointX = this.midpointX + this.velX;
    this.midpointY = this.midpointY + this.velY;
    
    this.startX = this.midpointX - this.len/2;
    this.endX = this.midpointX + this.len/2;
    this.startY = this.midpointY;
    this.endY = this.midpointY;
  }
  
  spin(cX, cY, finalTheta){
    //Updating theta (easy part, i think)
    if(abs(this.theta - finalTheta) < radians(1))
    {
      this.theta = finalTheta;
      this.spun = true;
      this.dtheta = 0;
    }
    else{
      this.dtheta = this.thetaSpeed*abs(finalTheta - this.theta);
    }
    this.theta = this.theta + this.dtheta;
    
    //Updating x's and y's which is going to be a bitch
    this.startX = cX + this.len/2*cos(this.theta);
    this.startY = cY - this.len/2*sin(this.theta);
    
    this.endX = cX - this.len/2*cos(this.theta);
    this.endY = cY + this.len/2*sin(this.theta);
    
  }



  multiplyAndMove(endX, endY) {
    var newSegment = new Segment();
  }
}



//-----------------------Arrows---------------------------//

class UpwardsArrow {
  constructor(pointX, pointY) {
    this.tipX = pointX;                //Varies with arrow animation
    this.tipY = pointY;
    this.pointingAtX = pointX;          //Constant
    this.pointingAtY = pointY;
  }

  show() {
    stroke(255, 0, 0);
    fill(255, 0, 0);
    triangle(this.tipX, this.tipY, this.tipX - 15, this.tipY + 20, this.tipX + 15, this.tipY + 20);
    rect(this.tipX - 10, this.tipY + 20, 20, 50);
  }

  bob() {
    this.tipY = (this.pointingAtY + 15) + 15 * sin(millis()/200);
  }
}



class DownwardsArrow {
  constructor(pointX, pointY) {
    this.tipX = pointX;                //Varies with arrow animation
    this.tipY = pointY;
    this.pointingAtX = pointX;          //Constant
    this.pointingAtY = pointY;
  }

  setPosition(x, y){
    this.tipX = x;
    this.tipY = y;
    this.pointingAtX = x;
    this.pointingAtY = y;
    
    
  }
  show() {
    stroke(255, 0, 0);
    fill(255, 0, 0);
    triangle(this.tipX, this.tipY, this.tipX - 15, this.tipY - 20, this.tipX + 15, this.tipY - 20);
    rect(this.tipX - 10, this.tipY - 70, 20, 50);
  }

  bob() {
    this.tipY = (this.pointingAtY - 15) + 15 * sin(millis()/200);
  }
}
