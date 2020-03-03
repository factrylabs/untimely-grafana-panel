export interface SimpleOptions {
  title: string;
  xseries: string;
  offset: number;
}

export const defaults: SimpleOptions = {
  title: 'Factry Grafana panel',
  xseries: '',
  offset: 0,
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
