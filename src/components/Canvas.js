import React from "react";
import PropTypes from "prop-types";
import draw from "../Ocean/Ocean.js";

/**
 * 
 * 
 * How to use Canvas in React https://medium.com/web-dev-survey-from-kyoto/how-to-use-html-canvas-with-react-hooks-web-dev-survey-from-kyoto-e633812023b1
 */
 let counter = 0;
const Canvas = (props) => {
  const canvas = React.useRef();
  let context = null;


  React.useEffect(() => {
      console.log("usedEffect called", counter);
      counter++
      context = canvas.current.getContext("2d");
      draw(context, canvas);
  }, []);

  

  return <canvas ref={canvas} height={props.height} width={props.width} />;
};

Canvas.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Canvas;
