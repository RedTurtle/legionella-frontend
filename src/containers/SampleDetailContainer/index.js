import React, { Component } from 'react';
import './index.css';
// import FaPencil from 'react-icons/lib/fa/pencil';
import MdClose from 'react-icons/lib/md/close';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { openCloseMenu } from '../../actions/menu';
import WSPDetailsReportContainer from '../WSPDetailsReportContainer';
import { WspDetailsQuery } from '../../graphql/queries/wsp';
import Spinner from '../../components/Spinner';

class SampleDetailContainer extends Component {
  render() {
    const { loading, wsp, openCloseMenu } = this.props;
    if (loading) {
      return <Spinner />;
    }
    let reports = '';
    if (wsp.reportSet && wsp.reportSet.edges.length > 0) {
      reports = (
        <div className="DetailSampleTable">
          <div className="table-row header">
            <div className="table-cell state">Stato</div>
            <div className="table-cell sample-cell">Campionamento</div>
            <div className="table-cell value">f</div>
            <div className="table-cell value">f-s</div>
            <div className="table-cell value">c</div>
            <div className="table-cell value">c-s</div>
            <div className="table-cell actions">Azioni</div>
          </div>
          {wsp.reportSet.edges.map(({ node }) => (
            <WSPDetailsReportContainer key={node.id} report={node} />
          ))}
        </div>
      );
    }

    return (
      <div className="DetailSample">
        <div className="DetailSampleHeader">
          <h2 className="DetailSampleHeaderLabel">
            Dettaglio dei campionamenti per WSP {wsp.code}
          </h2>
          <button type="button" onClick={openCloseMenu}>
            <MdClose />
          </button>
        </div>
        <div className="DetailSampleContent">
          <div className="WSPHeader">
            <div className="WSP-info">
              <div className="WSP-data">
                <div className="WSP-id">
                  <div className="WSP-label">wsp</div>
                  <div className="WSP-number">{wsp.code}</div>
                </div>
              </div>
              <div className="WSP-data">
                <div className="WSP-description">
                  <span className="ward-number">
                    {wsp.sector.edges.map(({ node }) => node.label).join(', ')}
                  </span>
                  {wsp.sector.edges.length === 1 && (
                    <span className="ward-title">
                      {wsp.sector.edges[0].node.description}
                    </span>
                  )}
                </div>
                <div className="WSP-description">
                  <span className="sink">{wsp.description}</span>
                </div>
                {/* <div className="ModifyButton">
                  <button>
                    <FaPencil />
                    <span className="ButtonText">Modifica anagrafica</span>
                  </button>
                </div> */}
              </div>
              <div className="WSP-data">
                <div className="WSP-building">
                  <div>Piano {wsp.floor.label}</div>
                  <div>Edificio {wsp.building.label}</div>
                </div>
              </div>
            </div>
            <div className="WSP-details">
              <div className="WSP-risk-level">
                <span className="WSP-label">liv. rischio attuale</span>
                <span
                  className="risk-level"
                  style={{ color: wsp.riskLevel.description }}
                >
                  {wsp.riskLevel.value}
                </span>
              </div>
              {wsp.nextReviewDate &&
                wsp.nextReviewDate !== '-' && (
                  <div className="WSP-review-date">
                    <span>da rivedere il</span>
                    <span className="date">{wsp.nextReviewDate}</span>
                  </div>
                )}
            </div>
          </div>
          {reports}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): { entryId: string } => ({
  entryId: state.menu.entryId,
});

const actionMethods = {
  openCloseMenu,
};

export default connect(mapStateToProps, actionMethods)(
  graphql(WspDetailsQuery, {
    // $FlowFixMe
    options: ({ entryId }) => ({
      variables: { id: entryId },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data: { loading, wsp } }) => ({
      loading,
      wsp,
    }),
  })(SampleDetailContainer),
);
