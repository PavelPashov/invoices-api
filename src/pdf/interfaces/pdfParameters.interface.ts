import { Phone } from 'src/phone/phone.entity';

export enum TemplateNames {
  ALL_NUMBERS = 'allNumbers',
  SUMMED = 'summed',
  SUMMED_WITH_TOTAL = 'summedWithTotal',
}

export enum PdfReportTypes {
  GROUP = 'група',
  LOCATION = 'локация',
  LOCATION_GROUP = 'локация и група',
}

export type SummedEntity = {
  name: string;
  sum: number;
};

export type ByLocationAndTagEntity = {
  name: string;
  sums: SummedEntity[];
};

export interface PdfParamsAllNumbers {
  name: string;
  array: Phone[];
  sum: number;
  groupArray: SummedEntity[];
}

export interface PdfParamsSummed {
  name: string;
  array: SummedEntity[];
  type: PdfReportTypes;
}

export interface PdfParamsSummedWithTotal {
  name: string;
  array: SummedEntity[];
  type: PdfReportTypes;
  sumTotal: string;
}
