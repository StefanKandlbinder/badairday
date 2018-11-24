// import 'normalize.css/normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from "./container/App/App";
import configureStore from "./redux/store";
import * as serviceWorker from './serviceWorker';

import './css/variables/color.css';
import './css/variables/margin.css';
import './css/variables/elevation.css';
import './css/variables/animation.css';
import './css/variables/look.css';
import './css/variables/sizes.css';
import './index.css';

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
