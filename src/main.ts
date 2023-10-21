import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
app.innerHTML = `
    <canvas id="canvas"></canvas>
        <div>
            <button id="clear" type="button">Clear</button>
            <button id="redo" type="button">Redo</button>
            <button id="undo" type="button">Undo</button>
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

let isDrawing = false;
let x = 0;
let y = 0;

let allLines: number[][][] = [];
let currentLine: number[][] = [];
let reLines: number[][][] = [];

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
  reLines = [];
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    createStroke(x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
    dispatchDrawEvent();
  }
});
window.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    createStroke(x, y, e.offsetX, e.offsetY);
    endStroke();
    dispatchDrawEvent();
    isDrawing = false;
  }
});
function endStroke() {
  allLines.push(currentLine);
  currentLine = [];
}
function createStroke(
  inX: number,
  inY: number,
  inOffsetX: number,
  inOffsetY: number,
) {
  let segment: number[] = [inX, inY, inOffsetX, inOffsetY];
  //console.log(segment);
  currentLine.push(segment);
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
    drawLine(context, line);
  });
  drawLine(context, currentLine);
}
function drawLine(context: CanvasRenderingContext2D, line: number[][]) {
  line.forEach((segment) => {
    drawSegment(context, segment[0], segment[1], segment[2], segment[3]);
  });
}
function drawSegment(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
