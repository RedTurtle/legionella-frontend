// @flow
import * as React from 'react';
import './index.css';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import type { ReduxState } from '../../reducers';
import { connect } from 'react-redux';
import { changeMenuType } from '../../actions/menu';
import filter from './filtro.svg';
import ValidationWorkflowButton from '../ValidationWorkflowButton';

type Props = {
  id: string,
  description: string,
  title: string,
  company: string,
  filterOn: boolean,
  finalBlock: boolean,
  managerBlock: boolean,
  tecnicoBlock: boolean,
  changeMenuType: typeof changeMenuType,
  userRoles: Array<string>,
  freezeDate: string,
};

class SampleRangeDetails extends React.Component<Props> {
  render() {
    const {
      id,
      description,
      title,
      filterOn,
      changeMenuType,
      finalBlock,
      managerBlock,
      tecnicoBlock,
      userRoles,
      freezeDate,
    } = this.props;

    const openFormMenu = () => {
      changeMenuType({
        menuType: 'sampleRangeForm',
        sampleRangeId: id,
        formMode: 'edit',
      });
    };
    let descriptionItem = '';

    if (description) {
      descriptionItem = (
        <div className="resampling">
          <span>{description}</span>
        </div>
      );
    }

    const handleFiles = e => {
      e.preventDefault();
      changeMenuType({
        menuType: 'sampleRangeFiles',
        entryId: id,
        formMode: 'edit',
      });
    };

    return (
      <div className="sample">
        <div className="sample-wrapper">
          <div className={`sample-content ${filterOn ? 'with-filter' : ''}`}>
            {!title && (
              <div>
                <span className="sample-title">CAMPIONAMENTO</span>
              </div>
            )}
            <div>{title}</div>
            {!finalBlock && !freezeDate ? (
              <div className="sample-edit">
                <button
                  className="edit"
                  type="button"
                  onClick={openFormMenu}
                  title="Modifica"
                >
                  <FaPencil />
                </button>
              </div>
            ) : null}
            {filterOn && (
              <div className="filter-on">
                <img src={filter} alt="Filtro attivo" />
              </div>
            )}
            {/* <div className="sample-display">
              <a href="/" title="Sample Display">
                <FaEyeSlash />
              </a>
            </div> */}
            {descriptionItem}
            <div className="sample-attachments">
              <a href="/" title="See attached files" onClick={handleFiles}>
                <FaFileTextO />
                <span> Gestione allegati</span>
              </a>
            </div>
            <ValidationWorkflowButton
              {...{
                filterOn,
                finalBlock,
                managerBlock,
                tecnicoBlock,
                userRoles,
                title,
                id,
                freezeDate,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): { userRoles: Array<string> } => ({
  userRoles: state.user.roles,
});

const actionMethods = {
  changeMenuType,
};

export default connect(mapStateToProps, actionMethods)(SampleRangeDetails);
