import ReactDOM from 'react-dom';
import React, { PureComponent } from 'react';
import { Popper } from 'react-popper';
import { LegendItem, SeriesIcon } from '@grafana/ui';

interface Props {
  accuracy: number;
  series?: any[];
  items?: LegendItem[];
  hoveredValue?: any;
  xSerie?: any[];
}

interface State {
  x: number;
  y: number;
}

export class Tooltip extends PureComponent<Props, State> {
  static virtualElement(x = 0, y = 0) {
    return ({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
      }),
      clientWidth: 0,
      clientHeight: 0,
    });
  }

  element: HTMLElement = document.createElement('div');

  constructor(props: Props) {
    super(props);
    this.state = { x: 0, y: 0 };
    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount() {
    document.body.appendChild(this.element);
    document.addEventListener('mousemove', this.updatePosition);
  }

  componentWillUnmount() {
    document.body.removeChild(this.element);
    document.removeEventListener('mousemove', this.updatePosition);
  }

  getTooltipValues(): any[] {
    const {
      accuracy, series, items, hoveredValue,
    } = this.props;
    if (!hoveredValue || !series?.length || !items?.length) {
      return [];
    }

    return items.map((item, idx) => {
      const value = series[idx].data.find((v: any) => v[0].value >= hoveredValue);
      return {
        color: item.color,
        label: item.label,
        value: value ? value[1].toFixed(accuracy) : '-',
      };
    });
  }

  getXValue() {
    const { hoveredValue, xSerie } = this.props;
    if (!hoveredValue || !xSerie) {
      return null;
    }
    const value = xSerie.find((x) => x.value >= hoveredValue);
    return value?.label;
  }

  updatePosition(event: any) {
    this.setState({ x: event.clientX, y: event.clientY });
  }

  render() {
    const { accuracy } = this.props;
    const { x, y } = this.state;
    const xValue = this.getXValue();
    const values = this.getTooltipValues();
    const virtualElement = Tooltip.virtualElement(x, y);
    if (!xValue) {
      return null;
    }

    return ReactDOM.createPortal(
      <Popper placement="right-start" referenceElement={virtualElement} modifiers={{ offset: { offset: '25,25' } }}>
        {({
          ref, style, placement, arrowProps,
        }) => (
          <div ref={ref} style={style} className="grafana-tooltip graph-tooltip" data-placement={placement}>
            <div className="graph-tooltip-time">
              {xValue.toFixed(accuracy)}
            </div>
            {values.map((value) => (
              <div className="graph-tooltip-list-item">
                <div className="graph-tooltip-series-name">
                  <SeriesIcon color={value.color} />
                </div>
                <div className="graph-tooltip-value">
                  {`${value.label}: ${value.value}`}
                </div>
              </div>
            ))}
            <div ref={arrowProps.ref} style={arrowProps.style} />
          </div>
        )}
      </Popper>, this.element,
    );
  }
}

export default Tooltip;
