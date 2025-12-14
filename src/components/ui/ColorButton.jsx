const ColorButton = ({ theme, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      title={theme.name}
      className={`w-8 h-8 rounded-full ${theme.hex} shadow-sm transition-transform hover:scale-110 ${
        selected ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
      }`}
    />
  );
};

export default ColorButton;
