import './DashboardCard.css'

const DashboardCard = ({
  title = 'Average Scores',
  value = '64.3 %',
  subtitle = '20% of total',
  icon = 'fa-users',
  titleClassName = 'text-secondary fw-semibold text-xs',
  valueClassName = 'fw-bold fs-2 mb-1 text-dark float-start',
  subtitleClassName = 'text-secondary text-xs float-start',
  containerClassName = 'container-center',
  cardClassName = 'card-custom',
}) => {
  return (
    <div className={containerClassName}>
      <div className={cardClassName}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className={titleClassName}>{title}</span>
          {icon && <i className={`fas ${icon}`}></i>}
        </div>
        <div className={valueClassName}>{value}</div>
        <div className={subtitleClassName}>{subtitle}</div>
      </div>
    </div>
  );
};

export default DashboardCard;