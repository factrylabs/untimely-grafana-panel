import React, { PureComponent } from 'react';
import { InfoBox, Select } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';

export class SeriesEditor extends PureComponent<StandardEditorProps> {
  render() {
    const { context: { data, options: { xseries } }, onChange } = this.props;

    const series = data || [];

    const selectSeriesOptions = series.map((serie) => (
      { label: `${serie.refId} - ${serie.name}`, value: serie.refId }
    ));

    const selectedXSeries = selectSeriesOptions.find((serie) => serie.value === xseries);

    return (
      <>
        {!series.length && (
          <InfoBox>
            Make sure that all queries have data
          </InfoBox>
        )}
        <Select
          options={selectSeriesOptions}
          value={selectedXSeries}
          onChange={({ value }) => onChange(value)}
        />
      </>
    );
  }
}

export default SeriesEditor;
