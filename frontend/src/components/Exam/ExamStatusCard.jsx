import './ExamStatusCard.css'; 

const ExamStatusCard = ({ 
  title = "Exam a1 - exam mode",
  dateRange ="Feb 5, 2025 - Feb 5, 2025",
  status = "In Progress",
  statusVariant = 'primary',
  maxWidth = '20rem',
  showChevron = true,
  onCardClick
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div 
        className="card shadow-sm status-card" 
        style={{ maxWidth, width: '100%' }}
        onClick={onCardClick}
        role={onCardClick ? 'button' : undefined}
      >
        <div className={`top-bar bg-${statusVariant}`}></div>
        <div className="card-body p-3">
          <h3 className="card-title fs-6 fw-semibold mb-1 text-dark title-ellipsis">
            {title}
          </h3>
          <p className="mb-1 text-secondary small">Test Date :</p>
          <p className="mb-3 text-dark small">{dateRange}</p>
          <div className="d-inline-flex align-items-center">
            <span className={`badge bg-${statusVariant}-subtle text-${statusVariant} status-badge`}>
              {status}
            </span>
            {showChevron && (
              <i className="fas fa-chevron-right ms-2 text-secondary"></i>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamStatusCard;
