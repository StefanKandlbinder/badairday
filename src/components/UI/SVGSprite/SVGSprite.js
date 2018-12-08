import React from 'react';

import './SVGSprite.scss';

export default () => {
    return (
        <div style={{ height: "0" }}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="12" y1="3.0012" x2="12" y2="20.9988">
                        <stop offset="0" stopColor="#dd1800"/>
                        <stop offset=".5143" stopColor="#eeb600"/>
                        <stop offset="1" stopColor="#00796b"/>
                    </linearGradient>
                </defs>
                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGLogo">
                    <path d="M12 4.2c.2 0 .3.1.4.3l7.3 14.6c.2.3-.1.7-.4.7-.1 0-.1 0-.2-.1l-6.9-3.4h-.4l-6.9 3.4c-.1 0-.1.1-.2.1-.3 0-.6-.3-.4-.7l7.3-14.6c.1-.2.2-.3.4-.3M7 17.4c.1 0 .1 0 .2-.1l4.5-2.2c.2-.1.3-.2.3-.4V7.9c0-.3-.2-.5-.5-.5-.2 0-.3.1-.4.3l-4.5 9c-.1.3.1.7.4.7M12 3c-.6 0-1.2.4-1.5.9L3.2 18.5c-.3.5-.2 1.1.1 1.6.3.6.8.9 1.4.9.3 0 .5-.1.8-.2l6.5-3.3 6.5 3.3c.2.1.5.2.8.2.6 0 1.1-.3 1.4-.8.3-.5.3-1.1.1-1.6L13.5 3.9c-.3-.5-.9-.9-1.5-.9zM8.8 15.2l2-4v3l-2 1z" fill="url(#logoGradient)"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGAdd">
                    <path fill="none" d="M0 0h24v24H0V0z" /><path fill="noe" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGFavorize">
                    <path d="M295.99 6.05l80.79 163.7a10 10 0 0 0 7.53 5.47l180.68 26.24a10 10 0 0 1 5.54 17.06L439.75 345.96a10 10 0 0 0-2.87 8.85l30.86 179.93a10 10 0 0 1-14.51 10.54l-161.59-85a9.94 9.94 0 0 0-9.3 0l-161.59 85a10 10 0 0 1-14.51-10.54l30.86-179.93a10 10 0 0 0-2.87-8.85L3.5 218.53a10 10 0 0 1 5.54-17.07l180.66-26.25a10 10 0 0 0 7.53-5.47L277.99 6.05a10 10 0 0 1 18 0z"
                        fill="none"
                        stroke="rgba(255,255,255,0.9)"
                        strokeMiterlimit="10"
                        strokeWidth="24" />
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGLocation">
                    <path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V2c0-.55-.45-1-1-1s-1 .45-1 1v1.06C6.83 3.52 3.52 6.83 3.06 11H2c-.55 0-1 .45-1 1s.45 1 1 1h1.06c.46 4.17 3.77 7.48 7.94 7.94V22c0 .55.45 1 1 1s1-.45 1-1v-1.06c4.17-.46 7.48-3.77 7.94-7.94H22c.55 0 1-.45 1-1s-.45-1-1-1h-1.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGMap">
                    <path fill="none" d="M0 0h24v24H0V0z"/><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGMenu">
                    <path fill="none" d="M0 0h24v24H0V0z"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGMoreVert">
                    <path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGOrderedList">
                    <path fill="none" d="M0 0h24v24H0V0z"/><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGFavList">
                    <path d="M0 0h24v24H0V0z" fill="none" /><path d="M3 8.4h14.3v2.4H3V8.4zm0-4.7h14.3v2.4H3V3.7zm0 9.5h9.5v2.4H3v-2.4zM17.4 12.1l1.1 2.1.1.1 2.4.3c.1 0 .1.1.1.1v.1l-1.7 1.7v.1l.4 2.3c0 .1 0 .1-.1.2h-.1L17.3 18h-.1l-2.1 1.1c-.1 0-.1 0-.2-.1v-.1l.4-2.3v-.1l-1.7-1.7c-.1-.1-.1-.1 0-.2h.1l2.4-.3s.1 0 .1-.1l1.1-2.1c-.1-.1 0-.1.1 0-.1-.1 0-.1 0 0zM3 17.9h10.9v2.4H3z" />
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGRefresh">
                    <path fill="none" d="M0 0h24v24H0V0z"/><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGRemove">
                    <path fill="none" d="M0 0h24v24H0V0z"/><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGRestore">
                    <path fill="none" d="M0 0h24v24H0V0z"/><path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>
                </symbol>

                <symbol width="24" height="24" viewBox="0 0 24 24" id="airSVGUpdate">
                    <defs><path id="a" d="M0 0h24v24H0z"/></defs><clipPath><use xlinkHref="#a" overflow="visible"/></clipPath><path d="M11 8v5l4.25 2.52.77-1.28-3.52-2.09V8zm10 2V3l-2.64 2.64C16.74 4.01 14.49 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9h-2c0 3.86-3.14 7-7 7s-7-3.14-7-7 3.14-7 7-7c1.93 0 3.68.79 4.95 2.05L14 10h7z"/>
                </symbol>
            </svg>
        </div>
    );
}