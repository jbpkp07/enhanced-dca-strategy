import { logFinalPositionResults, logPurchase } from "./loggers";
import { Position } from "./Position";
import { spyPrices } from "../data/SPY_02-04-1993";

type BasicDCAParams = {
    prices: readonly number[];
    position: Position;
    freqDays: number;
    silent?: boolean;
};

export type FinalPositionResults = {
    value: number;
    shares: number;
    averagePrice: number;
    freqDays: number;
};

const ROUNDING_ERROR_ADUSTMENT = 10 ** -10;

export function performBasicDCA({ prices, position, freqDays, silent }: BasicDCAParams): FinalPositionResults {
    const totalDays = prices.length;
    const purchaseCount = Math.ceil(totalDays / freqDays);
    const spend = position.cash / purchaseCount - ROUNDING_ERROR_ADUSTMENT;

    for (let day = 0; day < totalDays; day += freqDays) {
        const dayPrice = prices[day];

        if (dayPrice) {
            const shares = spend / dayPrice;

            const purchaseType = position.purchase({ shares, dayPrice });

            if (!silent) logPurchase({ day, totalDays, spend, dayPrice, purchaseType, position });
        } else {
            throw new Error("price out-of-range");
        }
    }

    const results = { ...position.getCurrentValue(prices), freqDays };

    if (!silent) logFinalPositionResults(results);

    return results;
}

// Test Basic DCA ----------------------------------------------------------------------
const topTenResults: FinalPositionResults[] = [];

for (let freqDays = 1; freqDays <= 31; freqDays++) {
    const results = performBasicDCA({
        prices: spyPrices,
        position: new Position({ initialCash: 10000 }),
        freqDays,
        silent: true
    });

    if (topTenResults.length < 10) {
        topTenResults.push(results);
    } else {
        for (let i = 0; i < topTenResults.length; i++) {
            const bestValue = topTenResults[i]?.value ?? 0;

            if (bestValue < results.value) {
                topTenResults[i] = results;
                break;
            }
        }
    }
}

topTenResults.sort((a, b) => (a.value < b.value ? 1 : -1));

console.log("\n\ntopTenResults :>> ", topTenResults);
