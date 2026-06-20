import React from 'react';
import './Sidebar.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

const Sidebar = React.forwardRef<HTMLDivElement, Props>(({ children, ...rest }, ref) => {
  return <div ref={ref} className="air__sidebar" {...rest}>{children}</div>;
});
Sidebar.displayName = 'Sidebar';
export default Sidebar;
