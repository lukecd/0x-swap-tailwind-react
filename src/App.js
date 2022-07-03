import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Canvas from "./components/Canvas"; // Change the path according to the directory structure of your project
import draw from "./Ocean/Ocean.js";


function App() {
  return (
    <div>
     
      <Canvas className='flex flex-col w-full h-full z-0'
              draw={draw} height={window.height} width={window.width} />
      <div className='absolute w-full h-full z-1 top-0'>
        <Navbar className='x-2'/>
   
      </div>

    </div>
  );
}

export default App;
 

//      <Home className='x-1'/>     