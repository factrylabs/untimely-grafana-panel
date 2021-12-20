import React, { PureComponent } from 'react';
import { Alert, Field, Input } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';

export class OffsetsEditor extends PureComponent<StandardEditorProps> {
  onChangeOffset = (serie: string, value: any) => {
    const { context: { options: { offsets } }, onChange } = this.props;

    onChange({ ...offsets, [serie]: value });
  }

  render() {
    const { context: { data, options: { offsets, xseries } } } = this.props;

    const series = data || [];

    const ySeries = series.filter((s) => !!xseries && s.refId !== xseries);

    return (
      <>
        {!ySeries.length && (
          <Alert title="Add more than one series" severity="warning">
            Please add more than one series to get started.
            <br />
            All series that are not the reference series will be used as Y-series.
          </Alert>
        )}
        {ySeries.map((serie) => (
          <Field
            label={`Offset for ${serie.name || serie.refId || '-'}`}
          >
            <Input
              type="number"
              onChange={({ currentTarget: { value } }) => (
                this.onChangeOffset(serie.refId as string, value)
              )}
              value={offsets[serie.refId as string]}
            />
          </Field>
        ))}
      </>
    );
  }
}

export default OffsetsEditor;
