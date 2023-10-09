const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const getLastDays = (startDate, endDate) => {
  const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  let arr = new Array(parseInt(diffDays)).fill(null);
  arr = arr.map((val, index) => {
    let d = new Date(endDate - (diffDays - index - 1) * 24 * 60 * 60 * 1000);
    return d.toDateString();
  });
  return arr;
};
export const last10Date = () => {
  let arr = new Array(11).fill("");

  const date = new Date();

  arr = arr.map((val, idx) => {
    let d = new Date(date.getTime() - (11 - idx) * 24 * 60 * 60 * 1000);
    return d.toDateString();
  });

  return arr;
};

export const checkDate = (someDateTimeStamp) => {
  var dt = new Date(someDateTimeStamp);
  var diff = new Date().getTime() - 10 * 24 * 60 * 60 * 1000;
  return dt.getTime() >= diff;
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
};
