export const drawFreehand = (
  ctx,
  lastX,
  lastY,
  offsetX,
  offsetY,
  setLastX,
  setLastY
) => {
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();

  setLastX(offsetX);
  setLastY(offsetY);
};

export const drawRectangle = (
  ctx,
  startX,
  startY,
  offsetX,
  offsetY,
  isShiftPressed,
  imageData
) => {
  ctx.putImageData(imageData, 0, 0);
  let width = offsetX - startX;
  let height = offsetY - startY;

  if (isShiftPressed) {
    const sideLength = Math.min(Math.abs(width), Math.abs(height));
    width = width > 0 ? sideLength : -sideLength;
    height = height > 0 ? sideLength : -sideLength;
  }

  ctx.beginPath();
  ctx.rect(startX, startY, width, height);
  ctx.stroke();
};

export const drawCircle = (
  ctx,
  startX,
  startY,
  offsetX,
  offsetY,
  isShiftPressed,
  imageData
) => {
  ctx.putImageData(imageData, 0, 0);
  let radiusX = (offsetX - startX) / 2;
  let radiusY = (offsetY - startY) / 2;

  if (isShiftPressed) {
    const radius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
    radiusX = radiusX > 0 ? radius : -radius;
    radiusY = radiusY > 0 ? radius : -radius;
  }

  const centerX = startX + radiusX;
  const centerY = startY + radiusY;

  ctx.beginPath();
  ctx.ellipse(
    centerX,
    centerY,
    Math.abs(radiusX),
    Math.abs(radiusY),
    0,
    0,
    2 * Math.PI
  );
  ctx.stroke();
};

export const drawLine = (
  ctx,
  startX,
  startY,
  offsetX,
  offsetY,
  isShiftPressed,
  imageData
) => {
  ctx.putImageData(imageData, 0, 0);
  if (isShiftPressed) {
    const dx = offsetX - startX;
    const dy = offsetY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(offsetX, startY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX, offsetY);
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }
};

export const fillDrawing = (x, y, fillColor, ctx) => {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  const targetColor = [
    data[(y * width + x) * 4],
    data[(y * width + x) * 4 + 1],
    data[(y * width + x) * 4 + 2],
    data[(y * width + x) * 4 + 3],
  ];

  if (colorsMatch(targetColor, fillColor)) {
    return;
  }

  const stack = [[x, y]];

  while (stack.length) {
    const [currentX, currentY] = stack.pop();
    const pixelIndex = (currentY * width + currentX) * 4;

    if (
      currentX < 0 ||
      currentX >= width ||
      currentY < 0 ||
      currentY >= height ||
      !colorsMatch(
        [
          data[pixelIndex],
          data[pixelIndex + 1],
          data[pixelIndex + 2],
          data[pixelIndex + 3],
        ],
        targetColor
      )
    ) {
      continue;
    }

    // Cambiar el color del pixel actual al color de relleno
    data[pixelIndex] = fillColor[0];
    data[pixelIndex + 1] = fillColor[1];
    data[pixelIndex + 2] = fillColor[2];
    data[pixelIndex + 3] = fillColor[3];

    // Agregar las coordenadas de los píxeles adyacentes a la pila para rellenarlos en la siguiente iteración
    stack.push([currentX + 1, currentY]);
    stack.push([currentX - 1, currentY]);
    stack.push([currentX, currentY + 1]);
    stack.push([currentX, currentY - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
};

const colorsMatch = (color1, color2) =>
  color1.every((value, i) => value === color2[i]);

export const getCoordinates = (e, ctx) => {
  if (e.touches) {
    const rect = ctx.canvas.getBoundingClientRect();
    return {
      offsetX: e.touches[0].clientX - rect.left,
      offsetY: e.touches[0].clientY - rect.top,
    };
  } else {
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
    };
  }
};

export const hexToRgba = (hex, ctx) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = ctx.globalAlpha * 255;
  return [r, g, b, a];
};
