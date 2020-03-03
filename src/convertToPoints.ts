import { DataFrame } from '@grafana/data';
import { Point, Serie, XValue } from './types';

const getTime = (data: DataFrame, index: number): number => (
  data.fields[1].values.get(index)
);

const getValue = (data: DataFrame, index: number): number => (
  data.fields[0].values.get(index)
);

export default (
  dataX: DataFrame | undefined, yData: DataFrame[] | undefined, offset: number,
): { series: Serie[], xSerie: XValue[] } => {
  const series: Serie[] = [];
  const xSerie: XValue[] = [];

  if (!dataX || !yData || !dataX.length || !yData.length) {
    return { series, xSerie };
  }

  for (let j = 0; j < yData.length; j += 1) {
    const dataY = yData[j];
    if (!dataY.length) {
      continue;
    }

    const points: Point[] = [];
    let yIndex = 0;
    let previousXValue = 0;
    let total = 0;

    for (let i = 0; i < dataX.length; i += 1) {
      // Get value
      let xValue = getValue(dataX, i);

      // Get time for this value
      const xTime = getTime(dataX, i);

      // Get value with offset
      if (xValue - offset >= 0 || points.length < 1) {
        xValue -= offset;
      } else {
        let previousValue = -Infinity;
        for (let o = xSerie.length - 1; o >= 0; o -= 1) {
          if (xSerie[o].resets) {
            previousValue = xSerie[o].label;
            break;
          }
        }
        xValue = previousValue + xValue;
      }

      // If value is negative, skip the value
      if (xValue < 0) {
        continue;
      }

      for (; yIndex < dataY.length; yIndex += 1) {
        // Last item, don't compare anymore
        if (yIndex === dataY.length - 1) {
          break;
        }

        // Stop searching if next item is bigger
        const nextTime = getTime(dataY, yIndex + 1);
        if (nextTime > xTime) {
          break;
        }
      }

      const yValue = getValue(dataY, yIndex);

      // If this point is exactly the same as the previous one, we should not add it
      if (points.length > 0) {
        const previousY = points[points.length - 1][1];
        if (xValue === previousXValue && yValue === previousY) {
          continue;
        }
      }

      const resets = previousXValue > xValue;
      if (resets) {
        total += previousXValue - xValue;
      }

      if (resets) {
        points[points.length - 1][0].resets = true;
      }

      const value = resets ? total : total + xValue;

      points.push([{
        label: xValue,
        time: getTime(dataY, yIndex),
        value,
        resets,
      }, yValue]);

      xSerie.push({
        label: xValue, value, resets, time: xTime,
      });

      previousXValue = xValue;
    }

    series.push({ data: points });
  }

  xSerie.sort((a, b) => a.value - b.value);
  return { series, xSerie };
};
