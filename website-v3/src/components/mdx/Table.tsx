const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = props => {
  return (
    <div className="[& img]:inline overflow-scroll sm:overflow-visible">
      <table {...props} />
    </div>
  );
};

export default Table;
