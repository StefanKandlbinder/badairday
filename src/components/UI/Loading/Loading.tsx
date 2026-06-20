import React from 'react';
import './Loading.scss';

interface Props { children?: React.ReactNode }

export default function Loading({ children }: Props) {
  return <div className="air__loading">{children}</div>;
}
