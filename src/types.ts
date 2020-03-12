export interface SimpleOptions {
  xseries: string;
  accuracy: number;
}

export const defaults: SimpleOptions = {
  xseries: '',
  accuracy: 2,
};

export interface XValue {
  value: number;
  label: number;
  time: number;
  resets: boolean;
}

export type Point = [XValue, number];

export interface Serie {
  data: Point[];
}
