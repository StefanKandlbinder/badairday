import React from 'react';
import './Sidebar.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Sidebar({ children, ...rest }: Props) {
  return <div className="air__sidebar" {...rest}>{children}</div>;
}
