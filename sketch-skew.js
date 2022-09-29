const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const seed = random.getRandomSeed();
// const seed = '10396'; // restore look from filename

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  name: seed,
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);

  let degrees = -40;
  const numOfRects = 40;
  const bgColor = random.pick(risoColors).hex;
  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
  ]
  const mask = {
    sides: 3,
    radius: width * 0.5,
    x: width * 0.50,
    y: height * 0.62,
  }
  const rects = buildRects({ width, height, numOfRects, rectColors });

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y);

    drawClippingMask({context, mask});

    drawRects({context, rects, degrees, offsetX: mask.x, offsetY: mask.y});
    context.restore();

    // Draw outline
    context.save();

    context.translate(mask.x, mask.y);
    context.lineWidth = 100;

    drawPolygon({
      context,
      sides: mask.sides,
      radius: mask.radius - context.lineWidth,
    });

    context.globalCompositeOperation = "color-burn"; // doesn't work in chrome, try firefox
    context.strokeStyle = rectColors[0].hex;

    context.translate(-mask.x, -mask.y);
    context.stroke();

    context.restore();
  };
};

function drawClippingMask({context, mask}) {
  drawPolygon({ context, sides: mask.sides, radius: mask.radius });

  // context.lineWidth = 10;
  // context.strokeStyle = "black";
  // context.stroke();
  context.clip();
}

function drawPolygon({ context, sides = 3, radius = 100 }) {
  const slice = (Math.PI * 2) / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = slice * i - Math.PI / 2;

    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);

    context.lineTo(x, y);
  }

  context.closePath();
}

function drawRects({rects, context, degrees, offsetX, offsetY}) {
  rects.forEach(({ x, y, w, h, blend, fill, stroke, shadow }) => {
    context.save();

    context.translate(-offsetX, -offsetY);
    context.translate(x, y);
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.globalCompositeOperation = blend;

    context.lineWidth = 10;

    drawSkewedRect({ context, w, h, degrees });

    context.shadowColor = shadow;
    context.shadowOffsetX = -10;
    context.shadowOffsetY = 20;
    context.fill();

    context.shadowColor = null;
    context.stroke();

    context.globalCompositeOperation = "source-over";

    context.lineWidth = 10;
    context.strokeStyle = "black";
    context.stroke();

    context.restore();
  });
}

function buildRects({ width, height, numOfRects, rectColors }) {
  let rects = [];
  for (let i = 0; i < numOfRects; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(600, width);
    h = random.range(40, 200);
    blend = random.pick(['source-over', 'overlay']);

    rects.push({ x, y, w, h, blend,
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
