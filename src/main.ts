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
`;
const gameName = "My glame";

document.title = gameName;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const context = canvas.getContext("2d")!;

context.fillStyle = "green";

context.fillRect(0, 0, 300, 150);

const clearB = document.querySelector<HTMLButtonElement>("#clear");
const undoB = document.querySelector<HTMLButtonElement>("#undo");
const redoB = document.querySelector<HTMLButtonElement>("#redo");
const thickB = document.querySelector<HTMLButtonElement>("#thick");
const thinB = document.querySelector<HTMLButtonElement>("#thin");

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
});
thinB!.addEventListener("mousedown", () => {
  lineWidth = 1;
});
let isDrawing = false;
let x = 0;
let y = 0;
let lineWidth = 1;
let allLines: LineCommand[] = [];
let reLines: LineCommand[] = [];
let currentLineCommand: LineCommand | null;
canvas.addEventListener("mousedown", (e) => {
  currentLineCommand = new LineCommand(lineWidth);
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
  reLines = [];
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    currentLineCommand!.addSegment(x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
    dispatchDrawEvent();
  }
});
window.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    currentLineCommand!.addSegment(x, y, e.offsetX, e.offsetY);
    endStroke();
    dispatchDrawEvent();
    isDrawing = false;
  }
});
function endStroke() {
  allLines.push(currentLineCommand!);
  currentLineCommand = null;
}

function dispatchDrawEvent() {
  const drawEvent = new CustomEvent("draw");
  window.dispatchEvent(drawEvent);
}

window.addEventListener("draw", () => {
  drawStrokes();
});

function drawStrokes() {
  context.fillRect(0, 0, 300, 150);
  allLines.forEach((line) => {
    line.execute(context);
  });
  if (currentLineCommand != null) {
    currentLineCommand.execute(context);
  }
}

class LineCommand {
  private line: number[][];
  private width: number;
  constructor(width: number) {
    this.line = [];
    this.width = width;
  }
  execute(context: CanvasRenderingContext2D) {
    for (const segment of this.line) {
      context.beginPath();
      context.strokeStyle = "black";
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
