import './DashboardCard.css'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const DashboardCard = ({
  title = 'Average Scores',
  value = '64.3 %',
  subtitle = '20% of total',
  icon = 'fa-users',
  tooltip = 'Tooltip test', // 👈 new prop for tooltip text
  titleClassName = 'text-secondary fw-semibold text-xs',
  valueClassName = 'fw-bold fs-2 mb-1 text-dark float-start',
  subtitleClassName = 'text-secondary text-xs float-start',
  containerClassName = 'container-center',
  cardClassName = 'card-custom',
}) => {
  const cardContent = (
    <div className={cardClassName}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        {icon && <i className={`fa ${icon} fa-lg`}></i>}
        <span className={titleClassName}>{title}</span>
      </div>
      <div className={valueClassName}>{value}</div>
      <div className={subtitleClassName}>{subtitle}</div>
    </div>
  );

  return (
    <div className={containerClassName}>
      {tooltip ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${title}`}>{tooltip}</Tooltip>}
        >
          <div>{cardContent}</div>
        </OverlayTrigger>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default DashboardCard;
