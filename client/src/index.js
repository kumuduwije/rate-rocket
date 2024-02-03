import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ColorModeScript } from '@chakra-ui/react'

// import { chakraCustomTheme as theme } from "./contexts/chakra-ui.custom-theme";
import { chakraCustomTheme } from "./chakra-ui/chakra-ui.custom-theme";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>


<ColorModeScript initialColorMode={chakraCustomTheme.config.initialColorMode} />
    <App />


  </React.StrictMode>
);


