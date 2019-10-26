import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<CookiesProvider><App /></CookiesProvider>, document.getElementById('root'));

serviceWorker.unregister();
