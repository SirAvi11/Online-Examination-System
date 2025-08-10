const MainContent = ({ children }) => {
  return (
    <main className="flex-grow-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 55px)' }}>
      {children}
    </main>
  );
};

export default MainContent;