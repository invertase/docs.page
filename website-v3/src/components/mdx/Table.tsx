const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = props => {
  return (
    <div className="[& img]:inline">
      <table {...props} className="table" />
    </div>
  );
};

export default Table;
