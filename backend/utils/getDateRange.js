export const getDateRange = (range) => {
  const now = new Date();
  let startDate = null;
  let endDate = null;

  switch (range) {
    case "today":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "yesterday":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "this_week":
      const dayOfWeek = now.getDay(); // 0 = Sunday
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "this_month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of month
      endDate.setHours(23, 59, 59, 999);
      break;

    case "quarterly":
      const currentMonth = now.getMonth(); // 0-11
      const quarterStartMonth = currentMonth - (currentMonth % 3);
      const quarterEndMonth = quarterStartMonth + 2; // end month of the quarter
      startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
      endDate = new Date(now.getFullYear(), quarterEndMonth + 1, 0); // last day of quarter
      endDate.setHours(23, 59, 59, 999);
      break;

    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1); // Jan 1st
      endDate = new Date(now.getFullYear(), 11, 31); // Dec 31st
      endDate.setHours(23, 59, 59, 999);
      break;

    case "custom":
      startDate = null;
      endDate = null;
      break;

    case "":
    default:
      startDate = null;
      endDate = null;
      break;
  }

  return { startDate, endDate };
};