import { FinalPositionResults, performBasicDCA } from "./performBasicDCA";
import { Position } from "./Position";
import { spyPrices } from "../data/SPY_02-04-1993";

// Test Basic DCA ----------------------------------------------------------------------
const topTenResults: FinalPositionResults[] = [
    {
        value: 0,
        shares: 0,
        averagePrice: 0,
        freqDays: 0
    }
];

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
