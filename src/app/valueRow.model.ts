export class ValueRow {
    partNumber: string;
    quantity: number;
    manufacturer: string;
    digikey: {
        price: string,
        availableQuantity: string,
        leadTime: string,
        priceBreakUp: any[]
    };
    mouser: {
        price: string,
        availableQuantity: string,
        leadTime: string,
        priceBreakUp: any[]
    };
}
