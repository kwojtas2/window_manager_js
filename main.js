let winManager;

function setup() {
  createCanvas(800, 800);

  winManager = new WindowManager();

}

function draw() {
  background(220);

  winManager.draw();
}

function mouseClicked() {
  winManager.checkClick();
}

function mouseReleased() {
  winManager.mouseReleased();
}
function mousePressed() {
  winManager.mousePressed();
}
