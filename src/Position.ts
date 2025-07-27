type PositionConstructor = { initialCash: number };
type Purchase = { shares: number; dayPrice: number };
type GetPurchaseTypeParams = { spend: number; dayPrice: number };
type CurrentValue = { value: number; shares: number; averagePrice: number };

export type PurchaseType = "high" | "low" | null;

export class Position {
    public cash = 0;

    public totalSpend = 0;

    public shares = 0;

    public purchaseCount = 0;

    public lastPurchasePrice = 0;

    public averagePrice = 0;

    public constructor({ initialCash }: PositionConstructor) {
        this.cash = initialCash;
    }

    public purchase({ shares, dayPrice }: Purchase): PurchaseType {
        const spend = shares * dayPrice;
        const purchaseType = this.getPurchaseType({ spend, dayPrice });

        if (purchaseType) {
            this.cash -= spend;
            this.totalSpend += spend;
            this.shares += shares;
            this.purchaseCount += 1;
            this.lastPurchasePrice = dayPrice;
            this.averagePrice = this.totalSpend / this.shares;
        }

        return purchaseType;
    }

    private getPurchaseType({ spend, dayPrice }: GetPurchaseTypeParams): PurchaseType {
        if (spend > this.cash) {
            return null;
        }

        return dayPrice >= this.lastPurchasePrice ? "high" : "low";
    }

    public getCurrentValue(prices: readonly number[]): CurrentValue {
        const currentPrice = prices[prices.length - 1] ?? 0;

        return {
            value: currentPrice * this.shares + this.cash,
            shares: this.shares,
            averagePrice: this.averagePrice
        };
    }
}

// const blah = new Position({ cash: 100 });

// console.log(blah.purchase(5, 5)); // $25
// console.log(blah.purchase(7, 7)); // $49
// console.log(blah.purchase(5, 10)); // $50

// console.log(blah);
// console.log(blah.value(10));
