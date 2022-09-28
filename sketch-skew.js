const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 2048, 2048 ],
  // animate: true,
};

const sketch = ({ context, width, height }) => {
  let degrees = 30;
  const numOfRects = 30;
  const bgColor = random.pick(risoColors).hex;
  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ]
  const rects = buildRects({ width, height, numOfRects, rectColors });

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);


    rects.forEach(({ x, y, w, h, fill, stroke, shadow }) => {
      context.save();

      context.translate(x, y);
      context.fillStyle = fill;
      context.strokeStyle = stroke;
      context.lineWidth = 10;

      drawSkewedRect({ context, w, h, degrees });

      context.shadowColor = shadow;
      context.shadowBlur = 20;
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.fill();
      context.stroke();

      context.restore();
    });

  };
};

function buildRects({ width, height, numOfRects, rectColors }) {
  let rects = [];
  for (let i = 0; i < numOfRects; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    rects.push({ x, y, w, h,
      fill: random.pick(rectColors).hex,
      stroke: random.pick(rectColors).hex,
      shadow: random.pick(rectColors).hex,
    });
  }

  return rects;
}

function drawSkewedRect({ context, w = 600, h = 400, degrees = -45 }) {
  const radians = math.degToRad(degrees);
  const rx = Math.cos(radians) * w;
  const ry = Math.sin(radians) * w;

  context.save();

  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  context.restore();
}

canvasSketch(sketch, settings);
