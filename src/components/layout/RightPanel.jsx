const RightPanel = ({ children }) => {
  return (
    <div className="flex-1 bg-gray-200 flex justify-center p-8">
      <div className="bg-white w-[21cm] min-h-[29.7cm] shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default RightPanel;
