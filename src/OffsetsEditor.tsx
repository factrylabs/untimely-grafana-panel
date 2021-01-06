import React, { PureComponent } from 'react';
import { Field, Input, InfoBox } from '@grafana/ui';
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
          <InfoBox>
            Please add more than one series to get started.
            <br />
            All series that are not the reference series will be used as Y-series.
          </InfoBox>
        )}
        {ySeries.map((serie) => (
          <Field
            label={`Offset for ${serie.refId} - ${serie.name || '-'}`}
          >
            <Input
              css=""
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
