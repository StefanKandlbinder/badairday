import React from 'react';
import './ListHeader.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function ListHeader({ className, children, ...rest }: Props) {
  return <div className={className} {...rest}>{children}</div>;
}
