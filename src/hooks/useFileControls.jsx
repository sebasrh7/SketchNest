import {useDrawing} from "@/hooks/useDrawing";
export const useFileControls = (ctxRef) => {
  const { saveCanvasState } = useDrawing(ctxRef);

  const uploadImageToCanvas = (imageSrc) => {
    const img = new Image();
    img.onload = () => {
      const canvas = ctxRef.current.canvas;
      const ctx = ctxRef.current;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgWidth = img.width;
      const imgHeight = img.height;

      const imageAspectRatio = imgWidth / imgHeight;
      const canvasAspectRatio = canvasWidth / canvasHeight;

      let renderableHeight, renderableWidth, xStart, yStart;

      if (imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvasHeight;
        renderableWidth = imgWidth * (renderableHeight / imgHeight);
        xStart = (canvasWidth - renderableWidth) / 2;
        yStart = 0;
      } else if (imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvasWidth;
        renderableHeight = imgHeight * (renderableWidth / imgWidth);
        xStart = 0;
        yStart = (canvasHeight - renderableHeight) / 2;
      } else {
        renderableHeight = canvasHeight;
        renderableWidth = canvasWidth;
        xStart = 0;
        yStart = 0;
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);

      saveCanvasState(canvas.toDataURL());
    };
    img.src = imageSrc;
  };

  const downloadDrawing = () => {
    const canvas = ctxRef.current.canvas;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `sketch-${new Date().toISOString()}.png`;
    link.click();
  };

  return { uploadImageToCanvas, downloadDrawing };
};
