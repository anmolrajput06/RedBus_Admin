import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import { HashRouter } from 'react-router-dom'

import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>

        <HashRouter>
    <App />
    </HashRouter>
  </Provider>,
)
