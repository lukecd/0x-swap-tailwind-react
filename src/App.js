import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Canvas from "./components/Canvas"; // Change the path according to the directory structure of your project
import React, { createContext, useState } from 'react'

function App() {
  // ok, don't hate on this.
  // I needed an easy way for the swap child component to modify the speed of the canvas parent component.
  // When I passed in useState props, the value was correctly propigated, but it always caused
  // a re-render of the background, which meant the sine waves went back to their initial position.
  // Since my sine waves are always re-rendering, what I needed was a way to just modify their
  // speed and have that value used on the next render. All my attempts at doing things 
  // the "react way" caused the re-render. 
  // So yeah, using a global variable like this is kinda ugly and not very OOP. Perhaps
  // someone smarter than I am will let me know a prettier way to do this.
  window.$wave_speed = 0.0004;

  return (
    <div>
      <Canvas className='flex flex-col w-full h-full z-0'
              height={window.innerHeight} width={window.innerWidth} />
      <div className='absolute w-full h-full z-1 top-0'>
        <Navbar />
        <Home  /> 
      </div>

    </div>
  );
}

export default App;
