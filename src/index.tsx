import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './container/App/App';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import buildStore from './redux/store';
import 'leaflet/dist/leaflet.css';

import './scss/variables/color.scss';
import './scss/variables/margin.scss';
import './scss/variables/padding.scss';
import './scss/variables/elevation.scss';
import './scss/variables/animation.scss';
import './scss/variables/look.scss';
import './scss/variables/sizes.scss';
import './scss/07-trumps/layout.scss';
import './index.scss';

const store = buildStore();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);
