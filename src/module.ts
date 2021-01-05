import { PanelPlugin } from '@grafana/data';
import { OffsetsEditor } from './OffsetsEditor';
import { SeriesEditor } from './SeriesEditor';
import { Options } from './types';
import { Panel } from './Panel';

export const plugin = new PanelPlugin<Options>(Panel).setPanelOptions((builder) => {
  builder
    .addNumberInput({
      path: 'accuracy',
      name: 'Accuracy',
      description: 'Decimals after comma',
      defaultValue: 2,
    })
    .addCustomEditor({
      id: 'xseries',
      path: 'xseries',
      name: 'References series',
      description: 'X-axis series',
      editor: SeriesEditor,
    })
    .addCustomEditor({
      id: 'offsets',
      path: 'offsets',
      name: 'Y-series offsets',
      description: 'Offets for each Y-series',
      editor: OffsetsEditor,
      showIf: (options) => !!options.xseries,
      defaultValue: {},
    });
});

export default plugin;
