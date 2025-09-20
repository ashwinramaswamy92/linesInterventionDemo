var debug = false;

var clicked = false;
var cyclesSinceClick = 0;
var released = false;
var cyclesSinceRelease = 0;


var axes = new Axes();
var line1 = new Line(axes);
var slope;


var correctAnswer = [];
let correctPoints;
let failPoints;
let pointsPlotted = 0;

var failPoint = new Point(900000, 9000000, axes);    //A garbage initial value

let xColorArr = [229, 122, 0];
let yColorArr = [0, 0, 255];

//For level 9?
var correctlyClickedX = [];
var correctlyClickedY = [];
var wronglyClickedX = [];
var wronglyClickedY = [];
var correctCounter = 0;
var wrongCounter = 0;
var repeatedPoint = false;
var lastPointWrong = false;


var segment1 = new Segment(0, 0, 0, xColorArr);
var segment2 = new Segment(0, 0, 0, yColorArr);
var segment3 = new Segment(0, 0, 0, yColorArr);
var segment4 = new Segment(0, 0, 0, yColorArr);

let s = new BinarySlider(510, 15, 100, 60);
let h = new hotButton(510, 105, 100, 60);
let downArrow = new DownwardsArrow(400, 300);
let slopeSlider = new NumberSlider(0, 0, 1);




///-------------------------------Initializing Mode Framework-----------------------------//
/*The idea behind this implementation is to enable insertions of a new mode/problem/level at some point in between.
 So you can add a level between levels 1 and 2 with a level 1.5 by just adding it to the levelList array.
 Basically to avoid having to make mass changes to the RHS of case == blahblah in the main code every time you want to insert.*/

var levelIndex = 0;
var toSetupLevel = true;
var levelList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var level = levelList[0];

var levelCompleted = false;


var problemsDone;              //Number of problems done in current level
var firstAttempt = true;       //Whether current problem solved on the first attempt. TRUE BY DEFAULT.
var attemptHistory = [];       //An array to store if the past n problems were solved on first attempt.
var problemDice;               //if a random problem has to have different setup parameters
var animationComplete = false;

var problemIndex = 0;
var toSetupProblem = true;
var problemList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var problem = problemList[0];

//var endProblem = false;


var modeIndex = 0;
var toSetupMode = true;
var modeList = [1, 2, 3, 4, 5, 6, 7];
var mode = modeList[0];
//var endMode = false;

let cuteFont; //For rewarding the students
let normalFont = "Calibri"  //For readability
let backgroundColor = [255, 255, 255] // Set color here