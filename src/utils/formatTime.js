const formatTime = (secs) => {
  const minutes = Math.floor(secs / 60) || 0,
        seconds = (secs - minutes * 60) || 0

  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`
}

export default formatTime
