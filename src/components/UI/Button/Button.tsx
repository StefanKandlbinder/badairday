import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  clicked?: () => void;
}

export default function Button({ className, children, clicked, ...rest }: ButtonProps) {
  return (
    <button className={className} onClick={clicked} {...rest}>
      {children}
    </button>
  );
}
