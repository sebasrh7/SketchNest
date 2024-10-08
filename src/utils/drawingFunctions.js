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

export const eraseFreehand = (
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

export const clear = (ctxRef) => {
  if (ctxRef.current) {
    ctxRef.current.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );
  }
};

export const fillDrawing = (x, y, fillColor, ctx) => {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const initialPixelIndex = pixelIndex(x, y, width);

  const targetColor = [
    data[initialPixelIndex],
    data[initialPixelIndex + 1],
    data[initialPixelIndex + 2],
    data[initialPixelIndex + 3],
  ];

  if (colorsMatch(targetColor, fillColor)) {
    return;
  }

  const visited = new Array(data.length).fill(false);
  const stack = [[x, y]];

  while (stack.length) {
    const [currentX, currentY] = stack.pop();
    const currentIndex = pixelIndex(currentX, currentY, width);

    if (
      currentX < 0 ||
      currentX >= width ||
      currentY < 0 ||
      currentY >= height ||
      visited[currentIndex] ||
      !colorsMatch(
        [
          data[currentIndex],
          data[currentIndex + 1],
          data[currentIndex + 2],
          data[currentIndex + 3],
        ],
        targetColor
      )
    ) {
      continue;
    }

    visited[currentIndex] = true;

    // Cambiar el color del pixel actual al color de relleno
    data[currentIndex] = fillColor[0];
    data[currentIndex + 1] = fillColor[1];
    data[currentIndex + 2] = fillColor[2];
    data[currentIndex + 3] = fillColor[3];

    // Agregar las coordenadas de los píxeles adyacentes a la pila para rellenarlos en la siguiente iteración
    stack.push([currentX + 1, currentY]);
    stack.push([currentX - 1, currentY]);
    stack.push([currentX, currentY + 1]);
    stack.push([currentX, currentY - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
};

const pixelIndex = (x, y, width) => (Math.floor(y) * width + Math.floor(x)) * 4;

const colorsMatch = (color1, color2) =>
  color1.every((value, i) => value === color2[i]);

export const getCoordinates = (e, ctx) => {
  const { canvas } = ctx;
  const { left, top } = canvas.getBoundingClientRect();

  if (e.touches && e.touches.length > 0) {
    const { clientX, clientY } = e.touches[0];
    return {
      offsetX: clientX - left,
      offsetY: clientY - top,
    };
  } else {
    // Evento de ratón u otro evento nativo
    const { offsetX, offsetY } = e.nativeEvent;
    return { offsetX, offsetY };
  }
};

export const hexToRgba = (hex, transparency) => {
  let r, g, b;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  const a = Math.round(transparency * 255); // Correct transparency to RGBA scale
  return [r, g, b, a];
};

