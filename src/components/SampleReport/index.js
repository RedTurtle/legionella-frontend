import React from 'react';
import './styles.css';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaSearchPlus from 'react-icons/lib/fa/search-plus';
import TempIcon from '../icons/TempIcon';
import MoleculeIcon from '../icons/MoleculeIcon';
import BacteriaIcon from '../icons/BacteriaIcon';
import ActionsIcon from '../icons/ActionsIcon';
import { changeMenuType } from '../../actions/menu';
import { connect } from 'react-redux';
import moment from 'moment';
import { compose, graphql } from 'react-apollo';
import { SettingsQuery } from '../../graphql/queries/settings';

const SampleReport = ({
  report,
  handleOpenForm,
  changeMenuType,
  buttonMode,
  loading,
  settings,
}) => {
  const coldUfclValue = report.coldUfcl
    ? report.coldUfcl
    : report.coldUfclSamplingSelection
      ? report.coldUfclSamplingSelection.value
      : null;
  const coldFlowUfclValue = report.coldFlowUfcl
    ? report.coldFlowUfcl
    : report.coldFlowUfclSamplingSelection
      ? report.coldFlowUfclSamplingSelection.value
      : null;
  const hotUfclValue = report.hotUfcl
    ? report.hotUfcl
    : report.hotUfclSamplingSelection
      ? report.hotUfclSamplingSelection.value
      : null;
  const hotFlowUfclValue = report.hotFlowUfcl
    ? report.hotFlowUfcl
    : report.hotFlowUfclSamplingSelection
      ? report.hotFlowUfclSamplingSelection.value
      : null;
  const riskLevel = report ? report.riskLevel : {};
  const position = riskLevel && riskLevel.position ? riskLevel.position : 0;

  return (
    <div className="sample-report">
      <div className="sample-report-content">
        <div className="split-measures">
          <div className="labels-row">
            <div className="value-wrapper">
              <span className="cold">F</span>
            </div>
            <div className="value-wrapper">
              <span className="cold">F-S</span>
            </div>
            <div className="value-wrapper">
              <span className="warm">C</span>
            </div>
            <div className="value-wrapper">
              <span className="warm">C-S</span>
            </div>
          </div>
          <div className="temp-row">
            <figure>
              <TempIcon />
            </figure>
            <div className="values">
              <div className="value-wrapper">
                {report.coldTemperature != null && (
                  <span
                    className={`value ${report.coldTemperatureAlertLevel ||
                      'normal'}`}
                  >
                    {report.coldTemperature} C°
                  </span>
                )}
              </div>
              <div className="value-wrapper">
                {report.coldFlowTemperature != null && (
                  <span
                    className={`value ${report.coldFlowTemperatureAlertLevel ||
                      'normal'}`}
                  >
                    {report.coldFlowTemperature} C°
                  </span>
                )}
              </div>
              <div className="value-wrapper">
                {report.hotTemperature != null && (
                  <span
                    className={`value ${report.hotTemperatureAlertLevel ||
                      'normal'}`}
                  >
                    {report.hotTemperature} C°
                  </span>
                )}
              </div>
              <div className="value-wrapper">
                {report.hotFlowTemperature != null && (
                  <span
                    className={`value ${report.hotFlowTemperatureAlertLevel ||
                      'normal'}`}
                  >
                    {report.hotFlowTemperature} C°
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="legio-row">
            <figure>
              <BacteriaIcon />
            </figure>
            <div className="values">
              <div className="value-wrapper">
                {coldUfclValue != null && (
                  <span
                    className={`value ${report.coldUfclAlertLevel || 'normal'}`}
                  >
                    {coldUfclValue} <span className="mu">UFC/L</span>
                  </span>
                )}
              </div>
              <div className="value-wrapper">
                {coldFlowUfclValue != null && (
                  <span
                    className={`value ${report.coldFlowUfclAlertLevel ||
                      'normal'}`}
                  >
                    {coldFlowUfclValue} <span className="mu">UFC/L</span>
                  </span>
                )}
              </div>
              <div className="value-wrapper">
                {hotUfclValue != null && (
                  <span
                    className={`value ${report.hotUfclAlertLevel || 'normal'}`}
                  >
                    {hotUfclValue} <span className="mu">UFC/L</span>
                  </span>
                )}
              </div>
              <div className="value-wrapper">
                {hotFlowUfclValue != null && (
                  <span
                    className={`value ${report.hotFlowUfclAlertLevel ||
                      'normal'}`}
                  >
                    {hotFlowUfclValue} <span className="mu">UFC/L</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="biox-row">
          <figure>
            <MoleculeIcon />
          </figure>
          <div className="values">
            <div className="value-wrapper">
              {report.coldChlorineDioxide != null && (
                <span
                  className={`value ${report.coldChlorineDioxideAlertLevel ||
                    'normal'}`}
                >
                  {report.coldChlorineDioxide} <span className="mu">mg/L</span>
                </span>
              )}
            </div>
            <div className="value-wrapper">
              {report.coldFlowChlorineDioxide != null && (
                <span
                  className={`value ${report.coldFlowChlorineDioxideAlertLevel ||
                    'normal'}`}
                >
                  {report.coldFlowChlorineDioxide}{' '}
                  <span className="mu">mg/L</span>
                </span>
              )}
            </div>
            <div className="value-wrapper">
              {report.hotChlorineDioxide != null && (
                <span
                  className={`value ${report.hotChlorineDioxideAlertLevel ||
                    'normal'}`}
                >
                  {report.hotChlorineDioxide} <span className="mu">mg/L</span>
                </span>
              )}
            </div>
            <div className="value-wrapper">
              {report.hotFlowChlorineDioxide != null && (
                <span
                  className={`value ${report.hotFlowChlorineDioxideAlertLevel ||
                    'normal'}`}
                >
                  {report.hotFlowChlorineDioxide}{' '}
                  <span className="mu">mg/L</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="actions-row">
          <div className="risk-level">
            <span>
              {/* TODO fix risk level class and text */}
              {riskLevel &&
                !loading && (
                  <React.Fragment>
                    Liv. rischio{' '}
                    <span className="text">
                      {[...Array(settings.edges.length).keys()].map(num => (
                        <span
                          key={`risk-level-${num}`}
                          style={
                            num <= position
                              ? {
                                  backgroundColor: riskLevel.description,
                                }
                              : {}
                          }
                          title={riskLevel.value}
                        />
                      ))}
                    </span>
                  </React.Fragment>
                )}
            </span>
          </div>
          {/* BBB: #freezehack il report freezato non ha wsp.id perché è il codice graphql. */}
          {report.wsp.id ? (
            <button
              type="button"
              className="actions"
              onClick={() => {
                changeMenuType({
                  menuType: 'sampleDetail',
                  entryId: report.wsp.id,
                });
              }}
            >
              <figure>
                <ActionsIcon />
              </figure>
              <span>Azioni</span>
            </button>
          ) : (
            <div className="empty-actions" />
          )}
          <span className="sampling-date">
            {report.samplingDate
              ? moment(report.samplingDate).format('DD-MM-YYYY')
              : ''}
          </span>
          <button className={buttonMode} type="button" onClick={handleOpenForm}>
            <figure>
              {buttonMode === 'edit' ? <FaPencil /> : <FaSearchPlus />}
            </figure>
            <span>{buttonMode === 'edit' ? 'Modifica' : 'Dettaglio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ReduxState): { menuIsOpen: boolean } => ({});

const actionMethods = { changeMenuType };

export default connect(mapStateToProps, actionMethods)(
  compose(
    graphql(SettingsQuery, {
      options: () => ({
        variables: { settingType: 'risk_level', orderBy: 'position' },
      }),
      props: ({ data: { loading, settings } }) => ({
        loading,
        settings,
      }),
    }),
  )(SampleReport),
);
