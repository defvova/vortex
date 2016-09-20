export function formatMilliseconds(milliseconds) {
  // const hours = Math.floor(milliseconds / 3600000)
  const toHours = milliseconds % 3600000,
        minutes = Math.floor(toHours / 60000),
        toMinutes = toHours % 60000,
        seconds = Math.floor(toMinutes / 1000)

  return `${(minutes < 10 ? '0' : '') + minutes}:${(seconds < 10 ? '0' : '') + seconds}`
}
