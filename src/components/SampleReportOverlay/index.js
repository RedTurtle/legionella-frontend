// @flow
import React, { Component } from 'react';
import ClickOutComponent from 'react-onclickout';
import MdClose from 'react-icons/lib/md/close';
import { HotKeys } from 'react-hotkeys';
import FocusTrap from 'focus-trap-react';
import './styles.css';

type OverlayData = {
  percentage: number,
  wspNum: number,
  rangeLevel: string[],
};

type OverlayDataObject = {
  perfect: OverlayData,
  good: OverlayData,
  bad: OverlayData,
  danger: OverlayData,
  critical: OverlayData,
};

export type RangeType = 'ufcl' | 'diox' | 'temp';

type Props = {
  onCloseClick: () => void,
  x: number,
  y: number,
  data: OverlayDataObject,
  overlayTitle: string,
  structureLabel: string,
  rangeType: RangeType,
};

class SampleReportOverlay extends Component<Props> {
  static defaultProps = {
    onCloseClick: () => {},
    x: 0,
    y: 0,
    data: {
      perfect: { rangeLevel: [] },
      good: { rangeLevel: [] },
      bad: { rangeLevel: [] },
      danger: { rangeLevel: [] },
      critical: { rangeLevel: [] },
    },
    structureLabel: '',
    rangeType: 'diox',
  };

  onClickOut = (event: SyntheticEvent<HTMLElement>): void =>
    this.props.onCloseClick();

  render() {
    const {
      onCloseClick,
      x,
      y,
      data,
      overlayTitle,
      structureLabel,
      rangeType,
    } = this.props;
    const levels: Array<$Keys<OverlayDataObject>> = [
      'perfect',
      'good',
      'bad',
      'danger',
      'critical',
    ];
    return (
      <div className="sample-report-overlay" style={{ left: x, top: y }}>
        <ClickOutComponent onClickOut={this.onClickOut}>
          <HotKeys
            handlers={{
              close: onCloseClick,
            }}
          >
            <FocusTrap
              focusTrapOptions={{
                clickOutsideDeactivates: true,
                escapeDeactivates: false,
              }}
            >
              <div className="overlay-content">
                <header>
                  <p className="overlay-title">{overlayTitle}</p>
                  <p className="overlay-structure">{structureLabel}</p>
                </header>
                <section>
                  {levels
                    .filter(level => data[level].rangeLevel.length > 0)
                    .map(level => (
                      <div className="row" key={`row-${level}`}>
                        <span className={`badge-${level}`} />
                        <span className="perc">{data[level].percentage}%</span>
                        <span className="exact-number">
                          ( {data[level].wspNum} WSP )
                        </span>
                        {rangeType !== 'diox' && (
                          <span className="range">
                            {data[level].rangeLevel}
                          </span>
                        )}
                      </div>
                    ))}
                </section>
                <button className="close" onClick={onCloseClick}>
                  <MdClose />
                </button>
              </div>
            </FocusTrap>
          </HotKeys>
        </ClickOutComponent>
      </div>
    );
  }
}

export default SampleReportOverlay;
