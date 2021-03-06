export interface Options {
  xseries: string;
  accuracy: number;
  offsets: { [key: string]: any };
}

export const defaults: Options = {
  xseries: '',
  accuracy: 2,
  offsets: {},
};

export interface XValue {
  value: number;
  label: number;
  time: number;
  isResetPoint: boolean;
}

export type Point = [XValue, number];

export interface Serie {
  data: Point[];
}
