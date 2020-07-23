import { PanelPlugin } from '@grafana/data';
import { SimpleOptions, defaults } from './types';
import { Panel } from './Panel';
import { Editor } from './Editor';

export const plugin = new PanelPlugin<SimpleOptions>(Panel).setDefaults(defaults).setEditor(Editor);

export default plugin;
