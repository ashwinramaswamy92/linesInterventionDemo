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
