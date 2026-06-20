import React from 'react';
import './List.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function List({ className, children, ...rest }: Props) {
  return <div className={className} {...rest}>{children}</div>;
}
