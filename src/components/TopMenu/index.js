// @flow
import './styles.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import TopMenuDropdownVoice from '../TopMenuDropdownVoice';

type Props = {};

const TopMenu = (props: Props) => (
  <div className="menu-wrapper" key="menu-wrapper">
    <div className="container">
      <div className="menu-collapse">
        {/*<a className="toggleMenu" href="#" />*/}
        <ul className="menu">
          <li className="menu-item">
            <NavLink
              to="/"
              activeClassName="active"
              isActive={(match, location) => {
                return match ? match.isExact : false;
              }}
            >
              Registro campionamenti
            </NavLink>
          </li>
          <TopMenuDropdownVoice
            label="Impostazioni"
            voices={[
              {
                id: 'ditta',
                label: 'Ditta',
                path: '/settings/ditta',
                settingType: 'company',
              },
              {
                id: 'ceppi-legionella',
                label: 'Ceppi legionella',
                path: '/settings/ceppi-legionella',
                settingType: 'legionella',
              },
              {
                id: 'range',
                label: 'Range',
                path: '/settings/range',
              },
              {
                id: 'livelli-rischio',
                label: 'Livelli di rischio',
                path: '/settings/livelli-rischio',
                settingType: 'risk_level',
              },
              {
                id: 'azioni',
                label: 'Azioni di base',
                path: '/settings/azioni',
              },
            ]}
          />
          {/* <li className="menu-item">
            <a href="/">
              <span>Legenda</span>
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  </div>
);

export default TopMenu;
