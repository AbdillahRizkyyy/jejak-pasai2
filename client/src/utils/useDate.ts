import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('id')
dayjs.extend(relativeTime)

export function useDate() {
  const format = (date: string | Date, formatStr: string = 'DD MMMM YYYY HH:mm:ss') => {
    return dayjs(date).format(formatStr)
  }

  const fromNow = (date: string | Date) => {
    return dayjs(date).fromNow()
  }

  return {
    dayjs,
    format,
    fromNow,
  }
}