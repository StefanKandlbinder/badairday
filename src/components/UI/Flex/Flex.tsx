import React from 'react';
import './Flex.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Flex({ className, children, ...rest }: Props) {
  return (
    <div className={className ?? ''} {...rest}>
      {children}
    </div>
  );
}
