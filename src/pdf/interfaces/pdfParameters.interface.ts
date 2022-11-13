import { Phone } from 'src/phone/phone.entity';

export enum TemplateNames {
  ALL_NUMBERS = 'allNumbers',
  SUMMED = 'summed',
}

export enum PdfReportTypes {
  GROUP = 'група',
  LOCATION = 'локация',
}

export type SummedEntity = {
  name: string;
  sum: number;
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
