export const useFileControls = (ctxRef) => {
  const uploadImageToCanvas = (imageSrc) => {
    const img = new Image();
    img.onload = () => {
      ctxRef.current.drawImage(
        img,
        0,
        0,
        ctxRef.current.canvas.width,
        ctxRef.current.canvas.height
      );
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
