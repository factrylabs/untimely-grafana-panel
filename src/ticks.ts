import { Serie, XValue } from './types';

export function generateTicks(series: Serie[], xSerie: XValue[], width: number): number[] {
  const ticks: number[] = [];
  if (!series.length || !xSerie.length) {
    return ticks;
  }

  // A tick needs 65 px width
  const nbTicks = width / 65;

  const minValue = xSerie[0].value;
  const maxValue = xSerie[xSerie.length - 1].value;
  const tickDistance = (maxValue - minValue) / nbTicks;

  // Find all the ticks that signal a reset
  series.forEach((serie) => {
    const resets = serie.data
      .filter((d) => d[0].isResetPoint)
      .map((d) => d[0].value);

    for (let i = 0; i < resets.length; i += 1) {
      const duplicateTick = ticks.find((t) => (
        t === resets[i] || Math.abs(resets[i] - t) < tickDistance
      ));
      if (duplicateTick) {
        continue;
      }
      ticks.push(resets[i]);
    }
  });

  // Add extra ticks if they are far enough from the reset ticks
  for (let i = 0; i < nbTicks; i += 1) {
    const searchValue = minValue + tickDistance * i;
    if (!ticks.find((t) => Math.abs(t - searchValue) < 0.85 * tickDistance)) {
      const tickValue = xSerie.find((s) => s.value >= searchValue);
      if (tickValue) {
        ticks.push(tickValue.value);
      }
    }
  }

  return ticks.sort((a, b) => a - b);
}

export default generateTicks;
