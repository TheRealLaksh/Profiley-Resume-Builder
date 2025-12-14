const RightPanel = ({ children }) => {
  return (
    <div className="flex-1 bg-gray-200 h-screen overflow-y-auto p-6">
      <div className="bg-white w-[21cm] min-h-[29.7cm] mx-auto shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default RightPanel;
