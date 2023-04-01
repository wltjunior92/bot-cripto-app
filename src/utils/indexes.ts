import * as tecIndicators from 'technicalindicators'

export function RSI(closes: any, period = 14) {
  const result = tecIndicators.rsi({
    period: 14,
    values: closes,
  })
  return {
    current: parseFloat(`${result[result.length - 1]}`),
    previous: parseFloat(`${result[result.length - 2]}`),
  }
}

export function MACD(
  closes: any,
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
) {
  const result = tecIndicators.macd({
    values: closes,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
    fastPeriod,
    slowPeriod,
    signalPeriod,
  })
  return {
    current: parseFloat(`${result[result.length - 1]}`),
    previous: parseFloat(`${result[result.length - 2]}`),
  }
}
