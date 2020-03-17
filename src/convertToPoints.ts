import { DataFrame } from '@grafana/data';
import { Point, Serie, XValue } from './types';

const getTime = (data: DataFrame, index: number): number => (
  data.fields[1].values.get(index)
);

const getValue = (data: DataFrame, index: number): number => (
  data.fields[0].values.get(index)
);

export default (
  xDataFrame: DataFrame | undefined,
  yDataFrames: DataFrame[] | undefined,
  offsets: { [key: string]: any},
): { series: Serie[], xSerie: XValue[] } => {
  const series: Serie[] = [];
  const xSerie: XValue[] = [];

  if (!xDataFrame || !yDataFrames || !xDataFrame.length || !yDataFrames.length) {
    return { series, xSerie };
  }

  for (let j = 0; j < yDataFrames.length; j += 1) {
    const dataY = yDataFrames[j];
    const offset = dataY.name && offsets[dataY.name] ? parseFloat(offsets[dataY.name]) : 0;

    if (!dataY.length) {
      continue;
    }

    const points: Point[] = [];
    let yIndex = 0;
    let previousXValue = 0;
    let offsetResetPoint = 0;
    let total = 0;

    for (let i = 0; i < xDataFrame.length; i += 1) {
      // Get value and time for this value
      let xValue = getValue(xDataFrame, i);
      if (xValue === null || xValue === undefined) {
        continue;
      }
      const xTime = getTime(xDataFrame, i);

      // Look for a y value that matches the x value in time
      for (; yIndex < dataY.length; yIndex += 1) {
        // Last item, don't search any further
        if (yIndex === dataY.length - 1) {
          break;
        }

        // Match the y value that does not have a bigger time
        const nextTime = getTime(dataY, yIndex + 1);
        if (nextTime > xTime) {
          break;
        }
      }

      const yValue = getValue(dataY, yIndex);

      if (offset && offset > 0) {
        // Offset the x value if needed
        if (xValue >= offset || points.length === 0) {
          xValue -= offset;
          offsetResetPoint = xValue;
        } else {
          xValue += offsetResetPoint;
        }
      }

      // Skip the value if it's invalid
      if (xValue < 0) {
        continue;
      }

      // If resets, add the reset point (peek) to the total
      const isResetPoint = previousXValue > xValue;
      if (isResetPoint) {
        total += previousXValue;
        points[points.length - 1][0].isResetPoint = true;
      }

      // If the value resets, add it up to the previous value
      const value = total + xValue;

      points.push([{
        label: xValue,
        time: getTime(dataY, yIndex),
        value,
        isResetPoint: false,
      }, yValue]);

      xSerie.push({
        label: xValue, value, isResetPoint, time: xTime,
      });

      previousXValue = xValue;
    }

    series.push({ data: points });
  }

  xSerie.sort((a, b) => a.value - b.value);
  series.forEach((serie) => serie.data.sort((a, b) => a[0].value - b[0].value));
  return { series, xSerie };
};
