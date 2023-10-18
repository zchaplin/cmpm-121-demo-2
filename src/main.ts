import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
app.innerHTML = `<canvas id="canvas"></canvas>`;
const gameName = "My glame";

document.title = gameName;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d");

ctx!.fillStyle = "green";

ctx!.fillRect(10, 10, 150, 100);

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
