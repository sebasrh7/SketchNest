export const useStrokeSettings = (ctxRef, setThickness) => {
  const handleTransparency = (e) => {
    const value = e.target.value;
    ctxRef.current.globalAlpha = value;
  };

  const handleChangeStrokeWidth = (width) => {
    ctxRef.current.lineWidth = width;
    setThickness(width);
  };

  return { handleTransparency, handleChangeStrokeWidth };
};
