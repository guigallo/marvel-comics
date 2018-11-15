class DateHelper {
  static toStringDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  static todayToDate() {
    return this.toStringDate(new Date());
  }
}

export default DateHelper;