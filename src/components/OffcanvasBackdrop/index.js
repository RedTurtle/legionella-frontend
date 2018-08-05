// @flow
import React from 'react';
import './styles.css';

const OffcanvasBackdrop = ({
  open,
  onCloseMenu,
}: {
  open: boolean,
  onCloseMenu: (SyntheticEvent<HTMLElement>) => void,
}) => (
  <div
    className={`offcanvas-backdrop${open ? ' open' : ''}`}
    onClick={onCloseMenu}
  />
);

OffcanvasBackdrop.defaultProps = {
  open: false,
};

export default OffcanvasBackdrop;
