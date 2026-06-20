import React, { useState, useEffect } from 'react';
import './Compass.scss';

interface Props {
  value?: number;
  moodRGBA?: string;
}

export default function Compass({ value = 0, moodRGBA = '' }: Props) {
  const [orientation, setOrientation] = useState(0);
  const platform = navigator.platform;

  useEffect(() => {
    if (!window.DeviceOrientationEvent) return;

    const handler = (event: DeviceOrientationEvent) => {
      const e = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (e.webkitCompassHeading && platform === 'iPhone') {
        setOrientation(parseFloat(e.webkitCompassHeading.toFixed(0)));
      }
    };

    window.addEventListener('deviceorientation', handler, false);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [platform]);

  const windFrom = -(orientation - value);
  const grid = -orientation;
  const legendStyle = { transform: `rotate(${orientation}deg)` };
  const lineStyle0 = { transform: `rotate(${-orientation}deg)` };
  const lineStyle90 = { transform: `rotate(${-orientation + 90}deg)` };

  return (
    <div className="air__compass">
      <div style={{ transform: `rotate(${windFrom}deg)` }} className="air__compass-wind">
        <svg className="air__compass-wind-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 512 512">
          <path fill={moodRGBA} d="M348.219,256l92.219,184.438L71.563,256 M512,0L0,256l512,256L384,256L512,0L512,0z" />
        </svg>
      </div>
      <div style={{ transform: `rotate(${grid}deg)` }} className="air__compass-grid">
        <div style={legendStyle} className="air__compass-grid-n">
          <div className="air__compass-grid-n-text">N</div>
          <div style={lineStyle0} className="air__compass-grid-n-line"></div>
        </div>
        <div style={legendStyle} className="air__compass-grid-o">
          <div className="air__compass-grid-o-text">O</div>
          <div style={lineStyle90} className="air__compass-grid-o-line"></div>
        </div>
        <div style={legendStyle} className="air__compass-grid-s">
          <div className="air__compass-grid-s-text">S</div>
          <div style={lineStyle0} className="air__compass-grid-s-line"></div>
        </div>
        <div style={legendStyle} className="air__compass-grid-w">
          <div className="air__compass-grid-w-text">W</div>
          <div style={lineStyle90} className="air__compass-grid-w-line"></div>
        </div>
      </div>
    </div>
  );
}
