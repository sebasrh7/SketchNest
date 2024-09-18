

export const useStrokeSettings = (ctxRef, setThickness, setTransparency) => {
  const handleTransparency = (e) => {
    const value = parseFloat(e.target.value);
    setTransparency(value);
  };

  const handleChangeStrokeWidth = (width) => {
    ctxRef.current.lineWidth = width;
    setThickness(width);
  };

  const drawWithTransparency = (drawFunction, transparency) => {
    const { globalAlpha } = ctxRef.current;
    ctxRef.current.globalAlpha = transparency;
    drawFunction();
    ctxRef.current.globalAlpha = globalAlpha;
  };

  return {
    handleChangeStrokeWidth,
    handleTransparency,
    drawWithTransparency,
  };
};
