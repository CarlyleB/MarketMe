import React from 'react'
import ReactDOM from 'react-dom'

import { Canvas } from './main/canvas';
import './index.css'

ReactDOM.render(
    <div className="appContainer">
        <Canvas></Canvas>
    </div>,
    document.getElementById('app-root'),
);
