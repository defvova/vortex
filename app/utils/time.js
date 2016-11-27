export function formatTime(secs) {
  const minutes = Math.floor(secs / 60) || 0,
        seconds = (secs - minutes * 60) || 0

  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`
}

// https://learn.javascript.ru/intl
export function timeConverter(UNIXTimestamp) {
  const formatter = new Intl.DateTimeFormat('uk', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }),
        date = new Date(UNIXTimestamp * 1000)

  return formatter.format(date)
}
