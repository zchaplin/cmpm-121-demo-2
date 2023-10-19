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
  if (lines.length > 0) {
    reLines.push(lines.pop()!);
    dispatchDrawEvent();
  }
});
redoB!.addEventListener("mousedown", () => {
  if (reLines.length > 0) {
    lines.push(reLines.pop()!);
    dispatchDrawEvent();
  }
});

clearB!.addEventListener("mousedown", () => {
  lines = [];
  context.fillRect(0, 0, 300, 150);
  reLines = [];
});

let isDrawing = false;
let x = 0;
let y = 0;
interface Stroke {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}
let lines: Stroke[] = [];
let reLines: Stroke[] = [];

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
    x = 0;
    y = 0;
    dispatchDrawEvent();
    isDrawing = false;
  }
});

function createStroke(
  inX: number,
  inY: number,
  inOffsetX: number,
  inOffsetY: number,
) {
  const line: Stroke = {
    x: inX,
    y: inY,
    offsetX: inOffsetX,
    offsetY: inOffsetY,
  };
  lines.push(line);
}
function dispatchDrawEvent() {
  const drawEvent = new CustomEvent("draw");
  window.dispatchEvent(drawEvent);
}

window.addEventListener("draw", () => {
  drawStrokes(lines);
});

function drawStrokes(toDraw: Stroke[]) {
  context.fillRect(0, 0, 300, 150);
  toDraw.forEach((line) => {
    drawLine(context, line.x, line.y, line.offsetX, line.offsetY);
  });
}
function drawLine(
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
