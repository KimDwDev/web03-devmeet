export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};
