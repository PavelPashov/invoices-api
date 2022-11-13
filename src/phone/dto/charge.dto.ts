export class Charge {
  msisdn: string;
  generalCharges: number;
  usageCount?: number;
  otherCharges?: number;
  usageDuration?: number;
  usageVolume?: number;
}

export class InvoiceCharge extends Charge {
  constructor(params: Charge) {
    super();
    this.msisdn = params.msisdn;
    this.generalCharges = params.generalCharges;
    this.usageCount = params?.usageCount ?? 0;
    this.otherCharges = params?.otherCharges ?? 0;
    this.usageDuration = params?.usageDuration ?? 0;
    this.usageVolume = params?.usageVolume ?? 0;
    this.price = Number(
      this.generalCharges +
        this.usageCount +
        this.otherCharges +
        this.usageDuration +
        this.usageVolume,
    ).toFixed(2);
  }

  price: string;
}
