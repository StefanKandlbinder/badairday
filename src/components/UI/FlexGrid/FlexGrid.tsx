import React from 'react';
import './FlexGrid.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function FlexGrid({ className, children, ...rest }: Props) {
  return (
    <div className={className ?? ''} {...rest}>
      {children}
    </div>
  );
}
