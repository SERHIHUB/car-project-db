const someDay =
  'Thu Sep 26 2024 23:41:55 GMT+0300 (за східноєвропейським літнім часом)';

export const abonementIsActive = ({ dayOfPaid, lastUpdateDate }) => {
  const nowPaidDate = new Date(dayOfPaid);
  let lastPaid = new Date(lastUpdateDate);
  // const datePaid = nowPaidDate.getDate();
  // console.log(myDate);

  // console.log();

  // якщо оплата здійснена в поточному місяці
  const now = new Date();
  // const year = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // const daysInMonth = new Date(year, currentMonth, 0).getDate();

  const monthOfPaid = nowPaidDate.getMonth() + 1;

  let currentPaidMonth;

  if (currentMonth === monthOfPaid) {
    lastPaid.setMonth(monthOfPaid);
    currentPaidMonth = lastPaid.getMonth() + 1;
  }

  if (currentMonth > monthOfPaid) {
    lastPaid.setMonth(currentMonth);
    currentPaidMonth = lastPaid.getMonth();
  }

  // console.log(`currentPaidMonth = ${currentPaidMonth}`);

  // const isPaid = datePaid < daysInMonth ? true : false;

  // console.log(currentPaidMonth);

  return currentPaidMonth;
};
