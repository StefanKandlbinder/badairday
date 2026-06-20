import React from 'react';
import './SVGSprite.scss';

export default function SVGSprite() {
  return (
    <div style={{ height: '0', visibility: 'hidden' }}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="12" y1="3.0012" x2="12" y2="20.9988">
            <stop offset="0" stopColor="#dd1800" />
            <stop offset=".5143" stopColor="#eeb600" />
            <stop offset="1" stopColor="#00796b" />
          </linearGradient>
        </defs>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGLogoCool">
          <circle className="air__color-primary" cx="12" cy="12" r="11.8" />
          <path className="air__color-text--full" d="M12 .9c6.1 0 11.1 5 11.1 11.1s-5 11.1-11.1 11.1S.9 18.1.9 12 5.9.9 12 .9m0-.9C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z" />
          <path fill="#6AB789" d="M14.9 17.6c-.4.1-.8 0-1.1-.3-.1-.1-.2-.3-.3-.5l-1.6-4.8-4.8-1.6c-.2-.1-.3-.2-.5-.3-.2-.2-.3-.6-.2-1 0-.1.1-.3.2-.4l-5.4 5.4C2 18.5 5.5 22 9.9 22.9l5.4-5.4c-.1.1-.2.1-.4.1z" />
          <polygon fill="white" points="10.9,13.9 10.2,13.7 10,13.1 10.4,12.6 11.1,12.7 11.4,13.3" />
          <polygon fill="white" points="5.3,19.5 4.9,19.5 4.7,19.1 5,18.7 5.4,18.8 5.6,19.2" />
          <polygon fill="white" points="8.1,18.9 7.2,19 6.7,18.3 7,17.5 7.8,17.4 8.4,18" />
          <polygon fill="white" points="11.6,16.9 11.6,17.9 10.8,18.3 10,17.8 10,16.9 10.8,16.4" />
          <polygon fill="white" points="6.6,14.6 6.6,15.3 6,15.7 5.3,15.3 5.3,14.6 6,14.2" />
          <circle fill="white" cx="8.8" cy="15.3" r="0.7" />
          <circle fill="white" cx="7.5" cy="12.5" r="1" />
          <circle fill="white" cx="12.2" cy="15.7" r="0.4" />
          <circle fill="white" cx="5" cy="17.3" r="0.5" />
          <path className="air__color-primary--mono" d="M18.1 5.5L7.4 9.1c-.2 0-.3.3-.1.5l.1.1 5 1.7s.1 0 .1.1l.1.1 1.7 5c0 .1 0 .1.1.1.2.2.4.1.5-.1l3.6-10.7c0-.1 0-.2-.1-.3 0-.1-.2-.2-.3-.1z" />
          <path className="air__color-text--full" d="M18.2 5.5c.1 0 .2 0 .2.1.1.1.1.2.1.3l-3.6 10.7c0 .1-.2.2-.3.2-.1 0-.2 0-.2-.1l-.1-.1-1.7-5s0-.1-.1-.1l-.1-.1-5-1.7c-.1 0-.1 0-.1-.1-.2-.2-.1-.5.1-.5l10.7-3.6h.1m0-.9c-.1 0-.3 0-.4.1L7.1 8.2c-.4.2-.7.5-.8.9-.1.4 0 .8.3 1.1.1.1.3.2.5.3l4.8 1.6 1.6 4.8c.1.2.2.3.3.5.2.2.5.3.8.3.5 0 1-.3 1.1-.8l3.6-10.7c.1-.4 0-.9-.3-1.2-.2-.3-.5-.4-.8-.4z" />
          <path fill="white" d="M16.6 7.4l-3.3 3.3c-.1.1-.2.1-.3.1L9.7 9.6c-.1 0-.1 0-.1-.1-.2-.1-.1-.4.1-.5l6.6-2.2c.1 0 .2 0 .3.1.1.1.2.3 0 .5z" />
        </symbol>
        <symbol id="airSVGLogoCoolSimple" width="24" height="24" viewBox="0 0 24 24">
          <path className="air__svg-logo-cool-simple-bkg" d="M12 23.5C5.6 23.5.5 18.4.5 12S5.6.5 12 .5 23.5 5.6 23.5 12 18.4 23.5 12 23.5z"/>
          <path fill="white" d="M12 .9c6.1 0 11.1 5 11.1 11.1s-5 11.1-11.1 11.1S.9 18.1.9 12 5.9.9 12 .9m0-.9C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z" />
          <path className="air__svg-logo-cool-simple-arrow" d="M17.5 6.1c.1 0 .2 0 .3.1.1.1.1.2.1.4l-4.4 13.1c-.1.2-.2.3-.4.3-.1 0-.2 0-.3-.1 0 0-.1-.1-.1-.2l-2.1-6.2c0-.1-.1-.1-.1-.2 0 0-.1-.1-.2-.1l-6.2-2.1c-.1 0-.1-.1-.2-.1.1-.1.1-.5.4-.5L17.5 6.1m0-1.1c-.2 0-.3 0-.5.1L4 9.4c-.5.2-.8.6-1 1-.1.5 0 1 .4 1.4.2.2.4.3.6.4l5.8 1.9 1.9 5.8c.1.2.2.4.4.6.3.3.6.4 1 .4.6 0 1.2-.4 1.4-1l4.4-13.1c.2-.5 0-1.1-.4-1.5-.2-.1-.6-.3-1-.3z"/>
          <path fill="white" d="M15.6 8.4l-4 4c-.1.1-.3.1-.4.1l-4-1.3c-.1 0-.1-.1-.2-.1-.2-.2-.1-.5.2-.6l8-2.7c.2-.1.3 0 .4.1.1.1.2.3 0 .5z" />
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 573.99 546.92" id="airSVGFavorize">
          <path d="M295.99 6.05l80.79 163.7a10 10 0 0 0 7.53 5.47l180.68 26.24a10 10 0 0 1 5.54 17.06L439.75 345.96a10 10 0 0 0-2.87 8.85l30.86 179.93a10 10 0 0 1-14.51 10.54l-161.59-85a9.94 9.94 0 0 0-9.3 0l-161.59 85a10 10 0 0 1-14.51-10.54l30.86-179.93a10 10 0 0 0-2.87-8.85L3.5 218.53a10 10 0 0 1 5.54-17.07l180.66-26.25a10 10 0 0 0 7.53-5.47L277.99 6.05a10 10 0 0 1 18 0z" />
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGMap">
          <path fill="none" d="M0 0h24v24H0V0z" /><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" />
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGMoreVert">
          <path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGFavList">
          <path d="M0 0h24v24H0V0z" fill="none" /><path d="M3 8.4h14.3v2.4H3V8.4zm0-4.7h14.3v2.4H3V3.7zm0 9.5h9.5v2.4H3v-2.4zM17.4 12.1l1.1 2.1.1.1 2.4.3c.1 0 .1.1.1.1v.1l-1.7 1.7v.1l.4 2.3c0 .1 0 .1-.1.2h-.1L17.3 18h-.1l-2.1 1.1c-.1 0-.1 0-.2-.1v-.1l.4-2.3v-.1l-1.7-1.7c-.1-.1-.1-.1 0-.2h.1l2.4-.3s.1 0 .1-.1l1.1-2.1c-.1-.1 0-.1.1 0-.1-.1 0-.1 0 0zM3 17.9h10.9v2.4H3z" />
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGNotify">
          <path d="M18,16v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-0.8-0.7-1.5-1.5-1.5S10.5,3.2,10.5,4v0.7C7.6,5.4,6,7.9,6,11v5l-2,2v1h16v-1L18,16z M12,22c1.1,0,2-0.9,2-2h-4C10,21.1,10.9,22,12,22z"/>
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGRefresh">
          <path fill="none" d="M0 0h24v24H0V0z" /><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGRestore">
          <path fill="none" d="M0 0h24v24H0V0z" /><path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" />
        </symbol>
        <symbol width="24" height="12" viewBox="0 0 24 12" id="airSVGOfficialAustria">
          <rect fill="#ed2939" width="24" height="12"/>
          <rect fill="#fff" y="4" width="24" height="4"/>
        </symbol>
        <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGBack">
          <path opacity=".87" fill="none" d="M0 0h24v24H0V0z"/>
          <path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"/>
        </symbol>
      </svg>
    </div>
  );
}
