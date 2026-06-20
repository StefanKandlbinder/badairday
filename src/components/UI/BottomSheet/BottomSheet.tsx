import React from 'react';
import './BottomSheet.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const BottomSheet = React.forwardRef<HTMLDivElement, Props>(({ className, children, ...rest }, ref) => {
  return (
    <div ref={ref} className={`air__bottom-sheet ${className ?? ''}`} {...rest}>
      {children}
    </div>
  );
});
BottomSheet.displayName = 'BottomSheet';
export default BottomSheet;
