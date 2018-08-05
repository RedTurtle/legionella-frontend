// @flow
import * as React from 'react';
import './styles.css';

const DashboardColumn = ({
  className,
  children,
}: {
  className?: string,
  children?: React.Node,
}) => (
  <div className={`dashboard-column${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

export default DashboardColumn;
