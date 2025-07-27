import { inspect } from "node:util";

import { Position, PurchaseType } from "./Position";
import { toPrecision } from "./utils";

type LogPurchaseParams = {
    day: number;
    totalDays: number;
    spend: number;
    dayPrice: number;
    purchaseType: PurchaseType;
    position: Position;
};

export function logPurchase({ day, totalDays, spend, dayPrice, purchaseType, position }: LogPurchaseParams): void {
    const message = {
        when: `Day ${day + 1} of ${totalDays}`,
        spend: toPrecision(spend, 2),
        price: toPrecision(dayPrice, 2),
        type: purchaseType,
        position: {
            cash: toPrecision(position.cash, 2),
            totalSpend: toPrecision(position.totalSpend, 2),
            shares: toPrecision(position.shares, 2),
            count: toPrecision(position.purchaseCount, 0),
            lastPrice: toPrecision(position.lastPurchasePrice, 2)
        }
    };

    const options = {
        breakLength: Infinity,
        colors: true
    };

    console.log(inspect(message, options));
}

type FinalPositionResults = {
    value: number;
    shares: number;
    averagePrice: number;
    freqDays: number;
};

export function logFinalPositionResults({ value, shares, averagePrice, freqDays }: FinalPositionResults): void {
    console.log("\nFinal position:");
    console.log("  - Value:     ", toPrecision(value, 2));
    console.log("  - Shares:    ", toPrecision(shares, 2));
    console.log("  - Ave Price: ", toPrecision(averagePrice, 2));
    console.log("  - Freq Days: ", toPrecision(freqDays, 2));
}
