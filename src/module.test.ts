import { ArrayVector, FieldType } from '@grafana/data';
import convertToPoints from './convertToPoints';

const getFrame = (values: number[], times: number[], name = '') => ({
  name,
  fields: [{
    name: '',
    type: FieldType.number,
    config: {},
    values: new ArrayVector(values),
  },
  {
    name: '',
    type: FieldType.time,
    config: {},
    values: new ArrayVector(times),
  }],
  length: values.length,
});

describe('convertToPoints', () => {
  describe('without any data', () => {
    it('returns empty series', () => {
      const { series, xSerie } = convertToPoints(getFrame([], []), [getFrame([], [])], {});
      expect(series.length).toEqual(0);
      expect(xSerie.length).toEqual(0);
    });
  });

  describe('without reset and matching times', () => {
    const xDataFrame = getFrame(
      [10, 20, 30, 40, 50, 60, 70, 80],
      [0, 100, 200, 300, 400, 500, 600, 700],
      'x',
    );
    const yDataFrame = getFrame(
      [10, 15, 12, 7, 20, 18, 17, 14],
      [0, 100, 200, 300, 400, 500, 600, 700],
      'y',
    );

    it('returns results with the right dimensions', () => {
      const { series, xSerie } = convertToPoints(xDataFrame, [yDataFrame], {});
      expect(xSerie.length).toEqual(8);
      expect(series.length).toEqual(1);
    });

    it('maps the x to the y values', () => {
      const { series } = convertToPoints(xDataFrame, [yDataFrame], {});
      const xValues = series[0].data.map((p) => p[0].value);
      expect(xValues).toEqual([10, 20, 30, 40, 50, 60, 70, 80]);

      const yValues = series[0].data.map((p) => p[1]);
      expect(yValues).toEqual([10, 15, 12, 7, 20, 18, 17, 14]);

      const times = series[0].data.map((p) => p[0].time);
      expect(times).toEqual([0, 100, 200, 300, 400, 500, 600, 700]);
    });

    it('does not find any reset values', () => {
      const { series } = convertToPoints(xDataFrame, [yDataFrame], {});
      const resetPoint = series[0].data.find((d) => d[0].isResetPoint);
      expect(resetPoint).toBeUndefined();
    });

    it('subtracts the offset', () => {
      const { series } = convertToPoints(xDataFrame, [yDataFrame], { y: 10 });
      const xValues = series[0].data.map((p) => p[0].value);
      expect(xValues).toEqual([0, 10, 20, 30, 40, 50, 60, 70]);
    });

    it('does not add values for which offset can not be calculated', () => {
      const { series } = convertToPoints(xDataFrame, [yDataFrame], { y: 20 });
      expect(series[0].data.length).toEqual(7);
      const xValues = series[0].data.map((p) => p[0].value);
      expect(xValues).toEqual([0, 10, 20, 30, 40, 50, 60]);
    });
  });

  describe('with resets and matching times', () => {
    const xDataFrame = getFrame(
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 5, 15, 25, 35, 45, 55],
      [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
      'x',
    );
    const yDataFrame = getFrame(
      [11, 25, 5, 17, 6, 19, 16, 16, 21, 15, 9, 24, 11, 15, 18],
      [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
      'y',
    );

    it('maps the x to y values', () => {
      const { series } = convertToPoints(xDataFrame, [yDataFrame], {});
      const labels = series[0].data.map((p) => p[0].label);
      expect(labels).toEqual(
        [10, 20, 30, 40, 50, 60, 70, 80, 90, 5, 15, 25, 35, 45, 55],
      );

      const xValues = series[0].data.map((p) => p[0].value);
      expect(xValues).toEqual(
        [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 105, 115, 125, 135, 145],
      );

      const yValues = series[0].data.map((p) => p[1]);
      expect(yValues).toEqual([11, 25, 5, 17, 6, 19, 16, 16, 21, 15, 9, 24, 11, 15, 18]);

      const times = series[0].data.map((p) => p[0].time);
      expect(times).toEqual(
        [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
      );
    });

    it('subtracts the offset', () => {
      const { series } = convertToPoints(xDataFrame, [yDataFrame], { y: 20 });
      const labels = series[0].data.map((p) => p[0].label);
      expect(labels).toEqual(
        [0, 10, 20, 30, 40, 50, 60, 70, 75, 85, 5, 15, 25, 35],
      );

      const xValues = series[0].data.map((p) => p[0].value);
      expect(xValues).toEqual(
        [0, 10, 20, 30, 40, 50, 60, 70, 75, 85, 90, 100, 110, 120],
      );
    });
  });
});
