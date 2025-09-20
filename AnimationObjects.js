class Segment {
  constructor(midX, midY, Length, colorArr = [0, 0, 0], premoveOffset = 5) {
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
    this.premoved = false;
    
    // New properties for smooth animation
    this.animating = false;
    this.animationStartTime = 0;
    this.moveDuration = 1000; // ms for move animation
    this.spinDuration = 800;  // ms for spin animation
    this.premoveDuration = 500; // ms for premove animation
    this.originX = midX;      // Original position
    this.originY = midY;
    this.targetX = midX;      // Target position
    this.targetY = midY;
    this.rotationCenterX = 0; // Center of rotation
    this.rotationCenterY = 0;
    this.targetTheta = 0;     // Target angle
    this.easing = 0.1;        // Easing factor for smooth movement
    this.overshoot = 1.2;     // For slight overshoot and settle effect
    
    // Color property
    this.colorArr = colorArr;
    
    // Premove properties
    this.premoveOffset = premoveOffset;  // How far to move up during premove
    this.premoveComplete = false;
  }

  show() {
    strokeWeight(5);
    stroke(this.colorArr[0], this.colorArr[1], this.colorArr[2]);
    fill(this.colorArr[0], this.colorArr[1], this.colorArr[2]);
    line(this.startX, this.startY, this.endX, this.endY);
    // Optional: uncomment to see midpoint
    // ellipse(this.midpointX, this.midpointY, 3, 3);
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
    this.premoved = false;
    this.animating = false;
    this.premoveComplete = false;
  }
  
  // Smooth easing functions
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  
  easeOutElastic(t) {
    return pow(2, -10 * t) * sin((t - 0.075) * (2 * PI) / 0.3) + 1;
  }
  
  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);
  }

  // New method for the premove animation
  premove() {
    if (!this.premoved) {
      // Initialize animation on first call
      if (!this.animating) {
        this.animating = true;
        this.animationStartTime = millis();
        this.originX = this.midpointX;
        this.originY = this.midpointY;
        this.targetX = this.midpointX; // Same X position
        this.targetY = this.midpointY - this.premoveOffset; // Move up
      }
      
      // Calculate progress (0 to 1)
      let progress = (millis() - this.animationStartTime) / this.premoveDuration;
      progress = min(progress, 1);
      
      // Apply easing with slight overshoot
      let easedProgress = this.easeOutBack(progress);
      
      // Update position
      this.midpointX = lerp(this.originX, this.targetX, easedProgress);
      this.midpointY = lerp(this.originY, this.targetY, easedProgress);
      
      // Update endpoints
      this.startX = this.midpointX - this.len/2;
      this.endX = this.midpointX + this.len/2;
      this.startY = this.midpointY;
      this.endY = this.midpointY;
      
      // Check if animation is complete
      if (progress >= 1) {
        this.premoved = true;
        this.premoveComplete = true;
        this.animating = false;
      }
      
      return this.premoved;
    }
    return true;
  }

  move(dX, dY) {
    if (!this.moved) {
      // If we haven't done the premove yet, do it first
      if (!this.premoved) {
        this.premove();
        return;
      }
      
      // Initialize animation on first call after premove
      if (!this.animating) {
        this.animating = true;
        this.animationStartTime = millis();
        this.originX = this.midpointX;
        this.originY = this.midpointY;
        this.targetX = dX;
        this.targetY = dY;
      }
      
      // Calculate progress (0 to 1)
      let progress = (millis() - this.animationStartTime) / this.moveDuration;
      progress = min(progress, 1);
      
      // Apply easing
      let easedProgress = this.easeInOutQuad(progress);
      
      // Calculate current position with slight overshoot and settle
      let overshootProgress = min(progress * this.overshoot, 1);
      let settledProgress = this.easeInOutQuad(progress);
      
      // Use overshoot for most of the animation, then settle to final position
      let currentProgress = progress < 0.8 ? overshootProgress : settledProgress;
      
      this.midpointX = lerp(this.originX, this.targetX, currentProgress);
      this.midpointY = lerp(this.originY, this.targetY, currentProgress);
      
      // Update endpoints
      this.startX = this.midpointX - this.len/2;
      this.endX = this.midpointX + this.len/2;
      this.startY = this.midpointY;
      this.endY = this.midpointY;
      
      // Check if animation is complete
      if (progress >= 1) {
        this.moved = true;
        this.animating = false;
        
        // Ensure final position is exact
        this.midpointX = this.targetX;
        this.midpointY = this.targetY;
        
        this.startX = this.midpointX - this.len/2;
        this.endX = this.midpointX + this.len/2;
        this.startY = this.midpointY;
        this.endY = this.midpointY;
      }
    }
  }
  
  spin(cX, cY, finalTheta) {
    if (!this.spun) {
      // Initialize animation on first call
      if (!this.animating) {
        this.animating = true;
        this.animationStartTime = millis();
        this.rotationCenterX = cX;
        this.rotationCenterY = cY;
        this.targetTheta = finalTheta;
      }
      
      // Calculate progress (0 to 1)
      let progress = (millis() - this.animationStartTime) / this.spinDuration;
      progress = min(progress, 1);
      
      // Apply elastic easing for more natural rotation
      let easedProgress = this.easeOutElastic(progress);
      
      // Update angle
      this.theta = lerp(0, this.targetTheta, easedProgress);
      
      // Update endpoints around the center of rotation
      this.startX = cX + this.len/2 * cos(this.theta);
      this.startY = cY - this.len/2 * sin(this.theta);
      
      this.endX = cX - this.len/2 * cos(this.theta);
      this.endY = cY + this.len/2 * sin(this.theta);
      
      // Update midpoint
      this.midpointX = (this.startX + this.endX) / 2;
      this.midpointY = (this.startY + this.endY) / 2;
      
      // Check if animation is complete
      if (progress >= 1) {
        this.spun = true;
        this.animating = false;
        
        // Ensure final angle is exact
        this.theta = this.targetTheta;
        
        // Update endpoints with exact final values
        this.startX = cX + this.len/2 * cos(this.theta);
        this.startY = cY - this.len/2 * sin(this.theta);
        
        this.endX = cX - this.len/2 * cos(this.theta);
        this.endY = cY + this.len/2 * sin(this.theta);
        
        this.midpointX = (this.startX + this.endX) / 2;
        this.midpointY = (this.startY + this.endY) / 2;
      }
    }
  }

  multiplyAndMove(endX, endY) {
    // This method remains as in your original code
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
