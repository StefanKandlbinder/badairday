import React from 'react';
import './Spacer.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Spacer({ className, ...rest }: Props) {
  return <div className={`air__spacer ${className ?? ''}`} {...rest} />;
}
