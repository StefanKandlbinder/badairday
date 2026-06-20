import React from 'react';
import './Divider.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Divider({ className, children, ...rest }: Props) {
  return (
    <div className={className ?? ''} {...rest}>
      {children}
    </div>
  );
}
