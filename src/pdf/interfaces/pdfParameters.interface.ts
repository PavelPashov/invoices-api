import { Phone } from 'src/phone/phone.entity';

export enum TemplateNames {
  ALL_NUMBERS = 'allNumbers',
  SUMMED = 'summed',
}

type PdfPhone = {
  name: string;
  tag: string;
  price: string;
  location: string;
  number: string;
};

export interface PdfParamsAllNumbers {
  name: string;
  array: PdfPhone[];
  sum: number;
  groupArray: { name: string; sum: number }[];
}
