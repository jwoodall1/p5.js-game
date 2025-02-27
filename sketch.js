let roomImage;
let dogImage;
let ballImage;

let zones = [];
let message = "";
let score = 0; // "Oopsies" counter
let gameOver = false;
let win = false;

let ballX, ballY;
let ballSize = 40;  // Tennis ball dimensions

let gameState = "start"; // "start", "game", "over"

// Start button dimensions
let startButtonX, startButtonY, startButtonW = 200, startButtonH = 50;

// Restart button dimensions (will be positioned on the game-over screen)
let restartButtonX, restartButtonY, restartButtonW = 200, restartButtonH = 50;

// Global constants for dog image and margin
const DOG_SIZE = 80;
const MARGIN = 10;

function preload() {
  // Replace these with the actual file paths or URLs to your images
  roomImage = loadImage("room.jpg");  
  dogImage = loadImage("dog.jpg");   // The dog image you provided
  
  // Load the tennis ball image
  ballImage = loadImage("tennisball.png");
}

function setup() {
  createCanvas(1000, 1000);
  
  // Calculate start button position (centered horizontally and near bottom)
  startButtonX = width / 2 - startButtonW / 2;
  startButtonY = height * 0.75;

  // Define interactive zones (x, y, w, h, label)
  zones = [
    { x: 0,  y: 500, w: 400, h: 275, label: "Left Sofa" },
    { x: 400, y: 300, w: 260, h: 180, label: "TV" },
    { x: 770, y: 650, w: 230, h: 400, label: "Right Sofa" },
    { x: 360, y: 650, w: 400, h: 200, label: "Coffee Table" },
    { x: 860, y: 320, w: 140,  h: 250, label: "Lamp" },
    { x: 0,  y: 170,  w: 120, h: 300, label: "Window" }
  ];

  // Place the ball in a valid position that doesn't overlap any zone.
  placeBall();
}

function draw() {
  if (gameState === "start") {
    displayStartScreen();
    return;
  }
  
  // If game is over, display the game-over screen.
  if (gameOver) {
    displayGameOverScreen();
    return;
  }
  
  // Main game drawing
  image(roomImage, 0, 0, width, height);

  // Highlight zones on mouse hover
  for (let i = 0; i < zones.length; i++) {
    let zone = zones[i];
    if (
      mouseX >= zone.x && mouseX <= zone.x + zone.w &&
      mouseY >= zone.y && mouseY <= zone.y + zone.h
    ) {
      noStroke();
      fill(255, 255, 0, 100);
      rect(zone.x, zone.y, zone.w, zone.h);
    }
  }

  // Display the message in the top left
  fill(0);
  textSize(18);
  textAlign(LEFT, TOP);
  text(message, 20, 30);

  // Display the score ("Oopsies") in the top right
  textAlign(RIGHT, TOP);
  text("Oopsies: " + score, width - 20, 20);

  // Draw the hidden tennis ball
  image(ballImage, ballX, ballY, ballSize, ballSize);

  // Draw the dog image in a small box at the bottom-left corner
  fill(255);
  stroke(0);
  rect(MARGIN, height - DOG_SIZE - MARGIN, DOG_SIZE, DOG_SIZE);
  image(dogImage, MARGIN, height - DOG_SIZE - MARGIN, DOG_SIZE, DOG_SIZE);
  
  // Display the mouse coordinates in a box beside the dog image
  displayCoordinates();
}

function mousePressed() {
  if (gameState === "start") {
    // Check if the start button was clicked
    if (
      mouseX >= startButtonX && mouseX <= startButtonX + startButtonW &&
      mouseY >= startButtonY && mouseY <= startButtonY + startButtonH
    ) {
      gameState = "game";
    }
    return;
  }
  
  // If the game is over, check if the restart button was clicked
  if (gameOver) {
    if (
      mouseX >= restartButtonX && mouseX <= restartButtonX + restartButtonW &&
      mouseY >= restartButtonY && mouseY <= restartButtonY + restartButtonH
    ) {
      restartGame();
    }
    return;
  }
  
  // Check if the ball was clicked
  if (
    mouseX >= ballX && mouseX <= ballX + ballSize &&
    mouseY >= ballY && mouseY <= ballY + ballSize
  ) {
    if (score < 5) {
      message = "Good boy, you found the ball with minimum damage!";
      win = true;
    } else {
      message = "Bad Dog! You have destroyed everything!";
      win = false;
    }
    gameOver = true;
    return;
  }
  
  // Check if any interactive zone was clicked
  for (let i = 0; i < zones.length; i++) {
    let zone = zones[i];
    if (
      mouseX >= zone.x && mouseX <= zone.x + zone.w &&
      mouseY >= zone.y && mouseY <= zone.y + zone.h
    ) {
      score++; // Increment "Oopsies" score
      
      if (zone.label.toLowerCase().includes("sofa")) {
        message = "You peed on the sofa!";
      } else {
        message = "You broke the " + zone.label + "!";
      }
      
      if (score > 5) {
        message = "Bad Dog! You have destroyed everything!";
        gameOver = true;
      }
      return;
    }
  }
  
  // Clear the message if nothing relevant was clicked
  message = "";
}

// Function to reset game variables and restart the game
function restartGame() {
  score = 0;
  message = "";
  gameOver = false;
  win = false;
  placeBall();
  // Optionally, reset other elements if needed
  gameState = "game";
}

// Function to place the ball in a valid position not overlapping zones
function placeBall() {
  let validPosition = false;
  while (!validPosition) {
    ballX = random(200, 1000);
    ballY = random(1000, 500);
    validPosition = true;
    for (let i = 0; i < zones.length; i++) {
      let zone = zones[i];
      if (rectsOverlap(ballX, ballY, ballSize, ballSize, zone.x, zone.y, zone.w, zone.h)) {
        validPosition = false;
        break;
      }
    }
  }
}

// Helper function to check if two rectangles overlap
function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2);
}

// Display the info start screen with game rules and a start button
function displayStartScreen() {
  background(220);
  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Welcome to the Dog Game!", width / 2, 50);
  
  textSize(16);
  textAlign(CENTER, TOP);
  let rules = "Rules:\n" + "- Find your ball, but don't break anything mom will be mad. \n" +
              "- More than 5 Oopsies and you go to the pound.\n" +
              "\nGood luck!";
  text(rules, width / 2, 100);
  
  // Draw the start button
  fill(100, 200, 100);
  rect(startButtonX, startButtonY, startButtonW, startButtonH, 10);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Start", startButtonX + startButtonW / 2, startButtonY + startButtonH / 2);
}

// Display the game over screen with the result and a restart button
function displayGameOverScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  
  if (win) {
    text("You Win!\n" + message, width / 2, height / 2 - 100);
  } else {
    text("Bad Dog!\n" + message, width / 2, height / 2 - 100);
  }
  
  // Set restart button position (centered horizontally below the message)
  restartButtonX = width / 2 - restartButtonW / 2;
  restartButtonY = height / 2 + 50;
  fill(100, 200, 100);
  rect(restartButtonX, restartButtonY, restartButtonW, restartButtonH, 10);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Restart", restartButtonX + restartButtonW / 2, restartButtonY + restartButtonH / 2);
}

// Display the current mouse coordinates in a box beside the dog image
function displayCoordinates() {
  let coordsText = "x: " + mouseX + ", y: " + mouseY;
  textSize(16);
  let padding = 5;
  let textW = textWidth(coordsText);
  
  // Determine the box's position relative to the dog image
  let boxX = MARGIN + DOG_SIZE + 10;
  let boxY = height - DOG_SIZE - MARGIN + DOG_SIZE / 2 - 10;
  
  // Draw the white background box with a black border
  fill(255);
  stroke(0);
  rect(boxX - padding, boxY - padding, textW + 2 * padding, 20 + 2 * padding);
  
  // Draw the coordinates text
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  text(coordsText, boxX, boxY + 10);
}