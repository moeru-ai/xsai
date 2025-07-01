export const sleep = async (delay: number) => delay === 0
  ? Promise.resolve()
  // eslint-disable-next-line @masknet/prefer-timer-id
  : new Promise(resolve => setTimeout(resolve, delay))
