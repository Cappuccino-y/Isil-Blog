import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import moonTheme from './theme/theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={moonTheme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>
)
