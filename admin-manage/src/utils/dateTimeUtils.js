/**
 * 时间日期工具类
 */
import moment from 'moment'

export default {
  /**
   * 根据当前时间来返回不同的问候语
   * @return {string}
   */
  greetBasedOnTime() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
  },
  /**
   * 获取本周周一和周日日期
   */
  getCurrentWeek() {
    const start = moment().isoWeekday(1).format('YYYY-MM-DD'); //本周一
    const end = moment().isoWeekday(7).format('YYYY-MM-DD'); //本周日
    return [start, end]
  },

  /**
   * 获取前 i 周的周一和周日日期，并以数组的方式返回。
   * 当 i=1，获取的是上周一和上周日的日期；
   * 当 i=2，获取的是上上周一和上上周日的日期
   * ...以此类推
   * @param i
   */
  getLastWeek(i) {
    let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
    let last_monday = moment().subtract(weekOfDay + 7 * i - 1, 'days').format('YYYY-MM-DD');//周一日期
    let last_sunday = moment().subtract(weekOfDay + 7 * (i - 1), 'days').format('YYYY-MM-DD');//周日日期
    return [last_monday, last_sunday]
  },

  /**
   * 获取后 i 周的周一和周日日期，并以数组的方式返回。
   * 当 i=1，获取的是下周一和下周日的日期；
   * 当 i=2，获取的是下下周一和下下周日的日期
   * ...以此类推
   * @param i
   */
  getNextWeek(i) {
    let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
    let next_monday = moment().add((7 - weekOfDay) + 7 * (i - 1) + 1, 'days').format('YYYY-MM-DD');//周一日期
    let next_sunday = moment().add((7 - weekOfDay) + 7 * i, 'days').format('YYYY-MM-DD');//周日日期
    return [next_monday, next_sunday]
  },
  /**
   * 根据日期获取月份的第一天
   * @param date
   * @return {string}
   */
  getMonthStart(date) {
    return moment(date).startOf("month").format("YYYY-MM-DD");
  },
  /**
   * 根据日期获取月份的最后一天
   * @param date
   * @return {string}
   */
  getMonthEnd(date) {
    return moment(date).endOf("month").format("YYYY-MM-DD");
  },
  /**
   * 根据日期获取月份的第一天与最后一天
   * @param date
   * @return {string[]}
   */
  getMonthRange(date) {
    return [this.getMonthStart(date), this.getMonthEnd(date)]
  }
}
