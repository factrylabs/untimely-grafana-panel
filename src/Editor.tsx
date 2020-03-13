import React, { PureComponent } from 'react';
import { FormField, Select } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { SimpleOptions } from './types';

export class Editor extends PureComponent<PanelEditorProps<SimpleOptions>> {
  onChange = (option: string, value: any) => {
    const { options, onOptionsChange } = this.props;

    onOptionsChange({
      ...options,
      [option]: value,
    });
  };

  onChangeOffset = (serie: string, value: any) => {
    const { options, onOptionsChange } = this.props;

    onOptionsChange({
      ...options,
      offsets: { ...options.offsets, [serie]: value },
    });
  }

  render() {
    const { data, options: { xseries, accuracy, offsets } } = this.props;

    const selectSeriesOptions = data.series.map((serie) => (
      { label: serie.name, value: serie.name }
    ));

    const selectedXSeries = selectSeriesOptions.find((serie) => serie.value === xseries);

    return (
      <>
        <div className="gf-form-group">
          <h5 className="section-heading">Formatting options</h5>
          <FormField
            label="Decimals after comma"
            labelWidth={20}
            inputWidth={20}
            type="number"
            value={accuracy}
            onChange={({ target: { value } }) => this.onChange('accuracy', value)}
          />
        </div>
        <div className="gf-form-group">
          <h5 className="section-heading">X-Axis series</h5>
          <Select
            placeholder="Choose..."
            options={selectSeriesOptions}
            value={selectedXSeries}
            onChange={({ value }) => this.onChange('xseries', value)}
          />
        </div>
        {!!xseries && (
          <div className="gf-form-group">
            <h1 className="section-heading">Y-series offsets</h1>
            {data.series.filter((serie) => serie.name !== xseries).map((serie) => (
              <FormField
                label={serie.name || ''}
                labelWidth={20}
                inputWidth={20}
                type="number"
                value={offsets[serie.name as string]}
                onChange={({ target: { value } }) => (
                  this.onChangeOffset(serie.name as string, value)
                )}
              />
            ))}
          </div>
        )}
      </>
    );
  }
}

export default Editor;
