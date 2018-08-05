// @flow
import React from 'react';
import { connect } from 'react-redux';
import './styles.css';

const ErrorPage = () => (
  <div className="error-page-wrapper">
    <div className="error-page-header container">
      <h1>Si &egrave; verificato un errore.</h1>
    </div>
    <div className="error-page-content container">
      Non è stato possibile connettersi al server.
      <br />
      Per favore riprova più tardi.
    </div>
  </div>
);

const actionMethods = {};

export default connect(() => ({}), actionMethods)(ErrorPage);
