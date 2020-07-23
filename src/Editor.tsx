import React, { PureComponent } from 'react';
import {
  InfoBox, Field, Input, Select,
} from '@grafana/ui';
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

    const ySeries = data.series.filter((s) => !!xseries && s.name !== xseries);

    return (
      <>
        <Field
          label="Decimals after comma"
          description=""
        >
          <Input
            css=""
            onChange={({ currentTarget: { value } }) => (
              this.onChange('accuracy', value)
            )}
            type="number"
            value={accuracy}
          />
        </Field>
        <Field
          label="Reference series"
        >
          <Select
            placeholder="Choose..."
            options={selectSeriesOptions}
            value={selectedXSeries}
            onChange={({ value }) => this.onChange('xseries', value)}
          />
        </Field>
        {!!xseries && !ySeries.length && (
          <InfoBox
            title="Add more than one series"
          >
            <p>
              Please add more than one series to get started.
              <br />
              All series that are not the reference series will be used as Y-series.
            </p>
          </InfoBox>
        )}
        {ySeries.map((serie) => (
          <Field
            label={`Offset for ${serie.name || ''}`}
          >
            <Input
              css=""
              type="number"
              onChange={({ currentTarget: { value } }) => (
                this.onChangeOffset(serie.name as string, value)
              )}
              value={offsets[serie.name as string]}
            />
          </Field>
        ))}
      </>
    );
  }
}

export default Editor;
