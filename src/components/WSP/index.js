// @flow
import './index.css';
import FaAccessTime from 'react-icons/lib/md/access-time';
import FaChat from 'react-icons/lib/md/chat';
import * as React from 'react';
import moment from 'moment';
import { compose, graphql } from 'react-apollo';
import { SettingsQuery } from '../../graphql/queries/settings';

type Props = {
  wsp: $FlowFixMe,
  changeMenuType: ({ menuType: string, entryId: string }) => void,
  loading: boolean,
  settings: $FlowFixMe,
};

const WSP = ({ wsp, changeMenuType, loading, settings }: Props) => {
  const alertLevel = wsp ? wsp.alertLevel : '';
  const riskLevel = wsp ? wsp.riskLevel : {};
  const wspSectors = wsp.sector ? wsp.sector.edges : [];
  const position = riskLevel && riskLevel.position ? riskLevel.position : 0;

  let wspLocations = '';
  if (wspSectors) {
    wspLocations = (
      <React.Fragment>
        <span className="ward-number">
          {wspSectors.map(({ node }) => node.label).join(', ')}
        </span>
        <span className="ward-title">
          {wspSectors.length === 1 && ` ${wspSectors[0].node.description}`}
        </span>
      </React.Fragment>
    );
  }

  const operative = wsp ? !!wsp.operativeStatus : false;
  const startDate = wsp && wsp.startDate && moment(wsp.startDate);
  const closedDate = wsp && wsp.obsolenceDate && moment(wsp.obsolenceDate);
  const showDate = (operative && startDate) || (!operative && closedDate);

  return (
    <div className="WSP">
      <div className="WSP-data-main">
        <div className="WSP-id">
          <div className="WSP-label">wsp</div>
          <div className="WSP-number">{wsp.code}</div>
        </div>
        <div className="WSP-risk-level">
          <div className="WSP-label">liv. rischio</div>
          <div className="risk-level">
            {!loading &&
              [...Array(settings.edges.length).keys()].map(num => (
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
          </div>
        </div>
        <div className="WSP-operative">
          <div className="WSP-label">Operativo</div>
          <div className="operative-status">
            <span>
              {wsp.operativeStatus ? 'Sì' : 'No'}
              {!!showDate ? `, dal ${showDate.format('DD/MM/YYYY')}` : ''}
            </span>
          </div>
        </div>
      </div>
      <div className="WSP-data">
        <div className="WSP-description">{wspLocations}</div>
        <div className="WSP-description">
          <span className="sink">{wsp.description}</span>
          <span className="building">
            P {wsp.floor.label} | E {wsp.building.label}
          </span>
        </div>
      </div>
      <div className="WSP-data">
        <div className="WSP-date">
          <FaAccessTime />
          <span
            className={
              // FIXME non è un approccio fantastico, possiamo migliorarlo? Come?
              // $FlowFixMe
              moment(`01/${wsp.nextReviewDate}`, 'DD/MM/YYYY') < moment()
                ? 'expired'
                : ''
            }
          >
            {wsp.nextReviewDate}
          </span>
        </div>
        <div className="state-circles">
          <span className={`state-circle ${alertLevel}`} />
        </div>
        <div className="WSP-history">
          <FaChat />
          <button
            type="button"
            onClick={() => {
              changeMenuType({ menuType: 'sampleDetail', entryId: wsp.id });
            }}
          >
            Stato e cronologia azioni
          </button>
        </div>
      </div>
    </div>
  );
};

export default compose(
  graphql(SettingsQuery, {
    options: () => ({
      variables: { settingType: 'risk_level', orderBy: 'position' },
    }),
    props: ({ data: { loading, settings } }) => ({
      loading,
      settings,
    }),
  }),
)(WSP);
