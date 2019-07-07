// import 'normalize.css/normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from "./container/App/App";
import configureStore from "./redux/store";
import * as serviceWorker from './serviceWorker';

import './scss/variables/color.scss';
import './scss/variables/margin.scss';
import './scss/variables/padding.scss';
import './scss/variables/elevation.scss';
import './scss/variables/animation.scss';
import './scss/variables/look.scss';
import './scss/variables/sizes.scss';
import './scss/07-trumps/layout.scss';
import './index.scss';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
