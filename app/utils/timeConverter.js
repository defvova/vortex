// https://learn.javascript.ru/intl
const timeConverter = (UNIXTimestamp) => {
  const formatter = new Intl.DateTimeFormat('uk', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }),
        date = new Date(UNIXTimestamp * 1000)

  return formatter.format(date)
}

export default timeConverter
