class WindowManager {
  constructor() {
    this.windows = [];
    this.minimalizedWindows = [];

    this.movedWindow = null;

    this.prevMouseX = 0;
    this.prevMouseY = 0;

    this.windows.push(new Window("Window 1", 50, 50, 200, 200));
  }

  draw() {
    if(this.movedWindow != null) {
      this.movedWindow.x += mouseX - this.prevMouseX;
      this.movedWindow.y += mouseY - this.prevMouseY;
    }

    for(let win of this.windows) win.draw();

    fill(64);
    rect(0, height - Window.barHeight, width, Window.barHeight);

    fill(255);
    textSize(Window.barHeight - 4);
    textAlign(CENTER, CENTER);
    text("Add", 0, height - Window.barHeight, 40, Window.barHeight);

    for(let i = 0; i < this.minimalizedWindows.length; i++) {
      text(this.minimalizedWindows[i].name, 42 + i * 82, height - Window.barHeight, 80, Window.barHeight);
    }

    let today = new Date();
    let time = "";
    if(today.getSeconds() % 2 == 0) time = today.getHours() + ":" + today.getMinutes();
    else                            time = today.getHours() + " " + today.getMinutes();

    textAlign(RIGHT, CENTER);
    text(time, width - 84, height - Window.barHeight, 80, Window.barHeight);

    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
  }
  mouseReleased() {
    this.movedWindow = null;
  }
  mousePressed() {
    for(let win of this.windows) {
      if(this.rectClicked(win.x, win.y, win.width, Window.barHeight)) {
        this.movedWindow = win;
        break;
      }
    }
  }
  checkClick() {
    // add button
    if(this.rectClicked(0, height - Window.barHeight, 40, Window.barHeight)) {
      this.windows.push(new Window("Window " + (this.windows.length + 1), 50, 50, 200, 200));
    }
    // minimalizedWindows
    for(let i = 0; i < this.minimalizedWindows.length; i++) {
      if(this.rectClicked(42 + i * 82, height - Window.barHeight, 80, Window.barHeight)) {
        this.minimalizedWindows[i].minimalized = false;
        this.minimalizedWindows.splice(i, 1);
      }
    }


    for(let win of this.windows) {
      let clickedCaption = win.checkIfClicked(mouseX, mouseY);
      let actionTaken = false;
      switch (clickedCaption) {
        case "X": actionTaken = true; this.windows.splice(this.windows.indexOf(win), 1); break;
        case "□": actionTaken = true; console.log("maximize window"); break;
        case "-": actionTaken = true; win.minimalized = true; this.minimalizedWindows.push(win); break;
      }
      if(actionTaken) break;
    }
  }
  rectClicked(x0, y0, width, height) {
    return mouseX > x0 && mouseX < x0 + width && mouseY > y0 && mouseY < y0 + height;
  }
}

class Window {
  static barHeight = 20;

  constructor(name, x, y, width, height) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.mainButtons = [];

    this.zIndex = 0;
    this.minimalized = false;

    this.mainButtons.push(new WindowButton(width - Window.barHeight * 1, 0, Window.barHeight, Window.barHeight, "X"));
    this.mainButtons.push(new WindowButton(width - Window.barHeight * 2, 0, Window.barHeight, Window.barHeight, "□"));
    this.mainButtons.push(new WindowButton(width - Window.barHeight * 3, 0, Window.barHeight, Window.barHeight, "-"));
  }

  draw() {
    if(!this.minimalized) {
      fill(64);
      rect(this.x, this.y, this.width, Window.barHeight);
      fill(255);
      textSize(Window.barHeight - 4);
      textAlign(LEFT, CENTER);
      text(this.name, this.x + 4, this.y, this.width, Window.barHeight);

      strokeWeight(1);
      fill(255);
      rect(this.x, this.y + Window.barHeight, this.width, this.height - Window.barHeight);

      for(let button of this.mainButtons) button.draw(this);
    }
  }

  checkIfClicked(mx, my) {
    // if(mx > this.x && mx < this.x + this.width && my > this.y && my < this.y + this.height) {
    //   // clicked inside
    // }
    if(!this.minimalized) {
      for(let button of this.mainButtons) if(button.checkIfClicked(mx, my, this)) return button.caption;
    }
    return null;
  }
}

class WindowButton {
  constructor(x, y, width, height, caption) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.caption = caption;
  }

  draw(window) {
    fill(200);
    rect(this.x + window.x, this.y + window.y, this.width, this.height);
    textAlign(CENTER, CENTER);
    textSize(Window.barHeight - 4);
    strokeWeight(1);
    fill(1);
    text(this.caption, this.x + window.x, this.y + window.y, this.width, this.height);
  }

  checkIfClicked(mx, my, window) {
    return (mx > this.x + window.x && mx < this.x + window.x + this.width && my > this.y + window.y && my < this.y + window.y + this.height);
  }
}
