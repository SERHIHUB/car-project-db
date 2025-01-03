import createHttpError from 'http-errors';

export const abonementIsActive = ({
  // lastDateOfPaid,
  carIsPaidMonth,
  paymentDate,
}) => {
  // lastDateOfPaid це: (lastPaidDate: Fri Sep 27 2024 17:42:48 GMT+0300 (за східноєвропейським літнім часом))
  // const lastPaidDate = new Date(lastDateOfPaid);
  // console.log(`lastPaidDate = ${lastPaidDate}`);

  // Поточний місяць
  const now = new Date();
  const currentDate = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // ourPaidMonth проплачений місяць = (9)
  const ourPaidMonth = carIsPaidMonth;
  // console.log(`ourPaidMonth = ${ourPaidMonth}`);

  const nextOurPaidDate = new Date(currentYear, ourPaidMonth, currentDate);
  // console.log(`nextOurPaidDate = ${nextOurPaidDate}`);

  // Наступний проплачений місяць
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // const nextOurPaidMonth = nextOurPaidDate.getMonth() + 1;
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  let nextOurPaidMonth;

  if (currentMonth == 12) {
    nextOurPaidMonth = 1;
  } else {
    nextOurPaidMonth = nextOurPaidDate.getMonth() + 1;
  }
  // console.log(`nextOurPaidMonth = ${nextOurPaidMonth}`);

  // Число оплати
  const dateOfPaid = paymentDate;
  // console.log(`dateOfPaid = ${dateOfPaid}`);

  //  Якщо оплата здійснюється в кінці місяця (проплаченого), nextPaidDate = + 2 місяці, інакше = + 1 місяць
  // ================================================
  // const nextPaidDate =
  //   currentMonth == ourPaidMonth
  //     ? new Date(currentYear, currentMonth + 2, dateOfPaid)
  //     : new Date(currentYear, currentMonth + 1, dateOfPaid);

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&-and-year
  let nextPaidDate;

  if (currentMonth == 12 && ourPaidMonth == 12) {
    nextPaidDate = new Date(currentYear + 1, 1, dateOfPaid);
  } else if (currentMonth == ourPaidMonth) {
    nextPaidDate = new Date(currentYear, currentMonth + 2, dateOfPaid);
  } else {
    nextPaidDate = new Date(currentYear, currentMonth + 1, dateOfPaid);
  }
  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  // console.log(`nextPaidDate = ${nextPaidDate}`);

  const nowTime = now.getTime();
  const nextPaidTime = nextPaidDate.getTime();
  // console.log(`nowTime = ${nowTime}`);
  // console.log(`nextPaidTime = ${nextPaidTime}`);

  // =========================================================
  const isCarPaid = nowTime <= nextPaidTime ? true : false;

  // Якщо намагаємося заплатити повторно
  if (currentMonth < ourPaidMonth) {
    // console.log('Current month is paid');
    throw createHttpError(409, 'Current month is paid.');
  }

  const paidObject = { isCarPaid, nextOurPaidMonth };

  return paidObject;
};
