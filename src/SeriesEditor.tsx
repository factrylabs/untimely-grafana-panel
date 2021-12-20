import React, { PureComponent } from 'react';
import { Alert, Select } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';

export class SeriesEditor extends PureComponent<StandardEditorProps> {
  render() {
    const { context: { data, options: { xseries } }, onChange } = this.props;

    const series = data || [];

    const selectSeriesOptions = series.map((serie) => (
      { label: `${serie.name || serie.refId}`, value: serie.refId }
    ));

    const selectedXSeries = selectSeriesOptions.find((serie) => serie.value === xseries);

    return (
      <>
        {!series.length && (
          <Alert title="Queries should have data" severity="info">
            Make sure that all queries return data, otherwise an error might occur
          </Alert>
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
