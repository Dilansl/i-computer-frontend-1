export default function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = date.getDate();

  const daySuffix = (d) => {
    if (d > 3 && d < 21) return "th";

    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const month = date.toLocaleDateString("en-US", {
    month: "long",
  });

  const year = date.getFullYear();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}${daySuffix(day)} ${weekday}, ${month} ${year} @ ${time}`;
}