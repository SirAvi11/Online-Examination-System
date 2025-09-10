// src/components/DashboardCalendar/DashboardCalendar.jsx
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DashboardCalendar = ({ events }) => {
  return (
    <div style={{ height: "400px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        views={["month", "week", "day"]}
        popup
      />
    </div>
  );
};

export default DashboardCalendar;
