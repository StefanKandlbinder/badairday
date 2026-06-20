import React from 'react';
import './BottomSheet.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function BottomSheet({ className, children, ...rest }: Props) {
  return (
    <div className={`air__bottom-sheet ${className ?? ''}`} {...rest}>
      {children}
    </div>
  );
}
