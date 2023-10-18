import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
app.innerHTML = `
    <canvas id="canvas"></canvas>
        <div>
            <button id="clear" type="button">Clear</button>
`;
const gameName = "My glame";

document.title = gameName;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const context = canvas.getContext("2d")!;

context!.fillStyle = "green";

context!.fillRect(0, 0, 300, 150);

let clearB = document.querySelector<HTMLButtonElement>("#clear");

clearB!.addEventListener("mousedown", () => {
  context!.fillRect(0, 0, 300, 150);
});

let isDrawing = false;
let x = 0;
let y = 0;

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});
window.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});
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
