import React from 'react';
import './Tabbar.scss';

interface Props { children: React.ReactNode }

export default function Tabbar({ children }: Props) {
  return <div className="air__tabbar">{children}</div>;
}
