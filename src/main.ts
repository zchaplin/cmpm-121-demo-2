import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
app.innerHTML = `
    <canvas id="canvas"></canvas>
        <div>
            <button id="clear" type="button">Clear</button>
            <button id="redo" type="button">Redo</button>
            <button id="undo" type="button">Undo</button>
            <button id="thick" type="button">Thick Line</button>
            <button id="thin" type="button">Thin Line</button>
            <button id="sticker1" type="button">🐱</button>
            <button id="sticker2" type="button">🪂</button>
            <button id="sticker3" type="button">🏂</button>
            <button id="customStick" type="button">Custom</button>
            <button id="save" type="button">Save Image</button>
            <div>
            <label for="redSlider">Red:</label>
            <input type="range" id="redSlider" min="0" max="255" value="0">
        </div>
        <div>
            <label for="greenSlider">Green:</label>
            <input type="range" id="greenSlider" min="0" max="255" value="0">
        </div>
        <div>
            <label for="blueSlider">Blue:</label>
            <input type="range" id="blueSlider" min="0" max="255" value="0">
        </div>
    </div>
`;
const gameName = "My glame";

document.title = gameName;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class StickerCommand {
  private x: number;
  private y: number;
  private stick: string;
  private status: boolean;
  constructor(x: number, y: number, stick: string, status: boolean) {
    this.x = x;
    this.y = y;
    this.stick = stick;
    this.status = status;
  }
  updatePos(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  execute(context: CanvasRenderingContext2D) {
    context.fillStyle = "black";
    if (this.status) {
      console.log(this.x, this.y);
      context.font = `${"40px"} ${"Arial"}`;
      context.fillText(this.stick, this.x, this.y);
    }
    context.fillStyle = "white";
  }
  turnOff() {
    this.stick = "";
    this.status = false;
  }
  turnOn(stick: string) {
    this.stick = stick;
    this.status = true;
  }
  placeSticker(): StickerCommand {
    const stick: StickerCommand = new StickerCommand(
      this.x,
      this.y,
      this.stick,
      true,
    );
    return stick;
  }
  isOn() {
    return this.status;
  }
}

class CursorCommand {
  private x: number;
  private y: number;

  private customCursor = document.createElement("div");

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.customCursor.style.position = "absolute";
    this.customCursor.style.width = "2px"; // Adjust the size as needed
    this.customCursor.style.height = "2px"; // Adjust the size as needed
    this.customCursor.style.border = "1px solid red"; // Adjust the color and border thickness
    this.customCursor.style.borderRadius = "50%"; // Make it circular
    this.customCursor.style.pointerEvents = "none";
  }
  updatePos(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  //Oooh Spookier Comment
  execute() {
    this.customCursor.style.left = this.x - 2 + "px";
    this.customCursor.style.top = this.y - 2 + "px";
    document.body.appendChild(this.customCursor);
  }
  turnOff() {
    this.customCursor.style.border = "";
  }
  turnOn() {
    this.customCursor.style.border = "2px solid black";
  }
  thin() {
    this.customCursor.style.width = "2px"; // Adjust the size as needed
    this.customCursor.style.height = "2px";
  }
  thick() {
    this.customCursor.style.width = "6px"; // Adjust the size as needed
    this.customCursor.style.height = "6px";
  }
}

const cursor: CursorCommand = new CursorCommand(0, 0);
window.addEventListener("tool", () => {
  cursor.execute();
});
window.addEventListener("stick", () => {
  sticker.execute(context);
});
const context = canvas.getContext("2d")!;

context.fillStyle = "white";

context.fillRect(0, 0, 300, 150);

const clearB = document.querySelector<HTMLButtonElement>("#clear");
const undoB = document.querySelector<HTMLButtonElement>("#undo");
const redoB = document.querySelector<HTMLButtonElement>("#redo");
const thickB = document.querySelector<HTMLButtonElement>("#thick");
const thinB = document.querySelector<HTMLButtonElement>("#thin");
const sticker1B = document.querySelector<HTMLButtonElement>("#sticker1");
const sticker2B = document.querySelector<HTMLButtonElement>("#sticker2");
const sticker3B = document.querySelector<HTMLButtonElement>("#sticker3");
const customStick = document.querySelector<HTMLButtonElement>("#customStick");
const saveB = document.querySelector<HTMLButtonElement>("#save");

const redSlider = document.getElementById("redSlider") as HTMLInputElement;
const greenSlider = document.getElementById("greenSlider") as HTMLInputElement;
const blueSlider = document.getElementById("blueSlider") as HTMLInputElement;

let redValue = redSlider.value;
let greenValue = greenSlider.value;
let blueValue = blueSlider.value;

const sticker: StickerCommand = new StickerCommand(0, 0, "", false);

saveB!.addEventListener("mousedown", () => {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width * 4;
  tmpCanvas.height = canvas.height * 4;
  const tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx!.scale(4, 4);
  drawStrokes(tmpCtx!);
  const anchor = document.createElement("a");
  anchor.href = tmpCanvas.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
});

customStick!.addEventListener("mousedown", () => {
  cursor.turnOff();
  sticker.turnOn(prompt("Enter The text you wish to use")!);
  isDrawing = false;
});

sticker1B!.addEventListener("mousedown", () => {
  cursor.turnOff();
  sticker.turnOn("🐱");
  isDrawing = false;
});
sticker2B!.addEventListener("mousedown", () => {
  cursor.turnOff();
  sticker.turnOn("🪂");
  isDrawing = false;
});
sticker3B!.addEventListener("mousedown", () => {
  sticker.turnOn("🏂");
  cursor.turnOff();
  isDrawing = false;
});

undoB!.addEventListener("mousedown", () => {
  if (allLines.length > 0) {
    reLines.push(allLines.pop()!);
    dispatchDrawEvent();
  }
});
redoB!.addEventListener("mousedown", () => {
  if (reLines.length > 0) {
    allLines.push(reLines.pop()!);
    dispatchDrawEvent();
  }
});

clearB!.addEventListener("mousedown", () => {
  allLines = [];
  context.fillRect(0, 0, 300, 150);
  reLines = [];
});

thickB!.addEventListener("mousedown", () => {
  lineWidth = 3;
  cursor.thick();
  sticker.turnOff();
});
thinB!.addEventListener("mousedown", () => {
  lineWidth = 1;
  cursor.thin();
  sticker.turnOff();
});
let isDrawing = false;
let x = 0;
let y = 0;
let lineWidth = 1;
let allLines: (LineCommand | StickerCommand)[] = [];
let reLines: (LineCommand | StickerCommand)[] = [];
let currentLineCommand: LineCommand | null;
canvas.addEventListener("mousedown", (e) => {
  if (!sticker.isOn()) {
    redValue = redSlider.value;
    greenValue = greenSlider.value;
    blueValue = blueSlider.value;
    currentLineCommand = new LineCommand(
      lineWidth,
      `rgb(${redValue},${greenValue},${blueValue})`,
    );
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
    reLines = [];
    cursor.turnOff();
    dispatchToolEvent();
  }
  dispatchStickEvent();
  if (sticker.isOn()) {
    placeSticker();
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    currentLineCommand!.addSegment(x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
    dispatchDrawEvent();
  } else {
    cursor.updatePos(e.pageX, e.pageY);
    sticker.updatePos(e.offsetX, e.offsetY);
    dispatchToolEvent();
    dispatchStickEvent();
  }
});
window.addEventListener("mouseup", () => {
  if (isDrawing) {
    //currentLineCommand!.addSegment(x, y, e.offsetX, e.offsetY);
    endStroke();
    dispatchDrawEvent();
    isDrawing = false;
    cursor.turnOn();
  }
});

function endStroke() {
  allLines.push(currentLineCommand!);
  currentLineCommand = null;
}

function placeSticker() {
  allLines.push(sticker.placeSticker());
}
function dispatchDrawEvent() {
  const drawEvent = new CustomEvent("draw");
  window.dispatchEvent(drawEvent);
}

function dispatchToolEvent() {
  const toolEvent = new CustomEvent("tool");
  window.dispatchEvent(toolEvent);
}

function dispatchStickEvent() {
  const toolEvent = new CustomEvent("stick");
  window.dispatchEvent(toolEvent);
}

window.addEventListener("draw", () => {
  drawStrokes();
});

window.addEventListener("tool", () => {
  drawStrokes();
});

function drawStrokes(ctx?: CanvasRenderingContext2D) {
  if (ctx) {
    context.fillRect(0, 0, 300, 150);
    allLines.forEach((line) => {
      line.execute(ctx);
    });
    if (currentLineCommand != null) {
      currentLineCommand.execute(ctx);
    }
  }
  context.fillRect(0, 0, 300, 150);
  allLines.forEach((line) => {
    line.execute(context);
  });
  if (currentLineCommand != null) {
    currentLineCommand.execute(context);
  }
}

class LineCommand {
  private color: string;
  private line: number[][];
  private width: number;
  constructor(width: number, color: string) {
    this.line = [];
    this.width = width;
    this.color = color;
  }
  execute(context: CanvasRenderingContext2D) {
    for (const segment of this.line) {
      context.beginPath();
      context.strokeStyle = this.color;
      context.lineWidth = this.width;
      context.moveTo(segment[0], segment[1]);
      context.lineTo(segment[2], segment[3]);
      context.stroke();
      context.closePath();
    }
  }
  addSegment(inX: number, inY: number, inOffsetX: number, inOffsetY: number) {
    {
      const segment: number[] = [inX, inY, inOffsetX, inOffsetY];
      //console.log(segment);
      this.line.push(segment);
    }
  }
}
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
