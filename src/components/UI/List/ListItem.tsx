import React from 'react';
import './ListItem.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function ListItem({ className, children, ...rest }: Props) {
  return <div className={className} {...rest}>{children}</div>;
}
