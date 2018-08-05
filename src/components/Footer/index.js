import React from 'react';
import './styles.css';
import logo from './logocesenatrasparentebianco.png';

const Footer = props => (
  <div className="footer-wrapper">
    <div className="container">
      <div className="left-block">
        <img src={logo} alt="Servizio Sanitario Regionale Emilia Romagna" />
      </div>
      <div className="right-block">
        <p className="primary">
          Azienda Ospedaliero-Universitaria S.Anna di Ferrara
        </p>
        <p>Struttura Dipartimentale di Igiene Ospedaliera</p>
      </div>
    </div>
  </div>
);

export default Footer;
