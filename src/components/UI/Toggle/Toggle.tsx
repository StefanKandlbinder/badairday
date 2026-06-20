import React from 'react';
import './Toggle.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  clicked?: () => void;
}

export default function Toggle({ className, clicked, children, ...rest }: Props) {
  return (
    <div className={className} onClick={clicked} {...rest}>
      <label className="air__toggle-label">{children}</label>
      <div className="air__toggle-knob-wrapper">
        <div className="air__toggle-knob"></div>
      </div>
    </div>
  );
}
