import { HISTORICAL_SELIC_MONTHLY_RATES, STOCK_HISTORICAL_DATA } from '../data/stocks';

export async function fetchSelicMonthlyRates(monthsNeeded: number): Promise<number[]> {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - monthsNeeded - 2);

    const formatDate = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados?dataInicial=${formatDate(startDate)}&dataFinal=${formatDate(endDate)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data: { data: string; valor: string }[] = await response.json();
      if (Array.isArray(data) && data.length >= monthsNeeded) {
        const rates = data.slice(-monthsNeeded).map(item => parseFloat(item.valor));
        if (rates.every(r => !isNaN(r))) {
          return rates;
        }
      }
    }
  } catch {
    // Graceful fallback
  }

  return HISTORICAL_SELIC_MONTHLY_RATES.slice(-monthsNeeded);
}

export async function fetchSingleStockFactors(ticker: string, monthsNeeded: number): Promise<number[]> {
  const cleanTicker = ticker.toUpperCase().trim();
  const cachedFactors = STOCK_HISTORICAL_DATA[cleanTicker];

  if (cachedFactors && cachedFactors.length >= monthsNeeded) {
    return cachedFactors.slice(-monthsNeeded);
  }

  const hash = cleanTicker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const trend = 0.01 + ((hash % 10) / 1000);
  const vol = 0.04 + ((hash % 7) / 100);
  
  const factors: number[] = [];
  let currentSeed = hash;
  for (let i = 0; i < monthsNeeded; i++) {
    const x = Math.sin(currentSeed++) * 10000;
    const rnd = x - Math.floor(x);
    factors.push(trend + (rnd - 0.5) * vol * 2);
  }
  return factors;
}

export async function fetchMultiStockFactors(
  tickers: string[],
  monthsNeeded: number
): Promise<Record<string, number[]>> {
  const results: Record<string, number[]> = {};
  await Promise.all(
    tickers.map(async (ticker) => {
      results[ticker] = await fetchSingleStockFactors(ticker, monthsNeeded);
    })
  );
  return results;
}
