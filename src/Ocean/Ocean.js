import { isContentEditable } from "@testing-library/user-event/dist/utils";

const wave1Color = '#245C81';
const wave2Color = '#338FB8';
const waveColor =  '#82DDF0';


const draw = (context, canvas) => {
    context.fillStyle = wave1Color;

    context.fillRect(10, 10, 50, 50);
  

    context.fillRect(513, 30, 50, 50);


    context.fillStyle = wave1Color;

    context.fillRect(513, 75, 50, 50);

    //context.fill();

    console.log("draw")
   // let ocean = new Ocean(context, canvas);
}; 
  
export default draw;



class Ocean {

    constructor(context, canvas) {
        this.context = context;
        this.canvas = canvas;
        this.wave = new Wave();
        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.oceanWidth = document.body.clientWidth;
        this.oceanHeight = document.body.clientHeight;
        this.canvas.width= this.oceanWidth * 2;
        this.canvas.height = this.oceanHeight * 2;
        this.context.scale(2, 2);
        this.wave.resize(this.oceanWidth, this.oceanHeight);
    }

    animate(t) {
        //this.context.clearRect(0, 0, this.oceanWidth, this.oceanHeight);
        this.wave.draw(this.context);
        requestAnimationFrame(this.animate.bind(this));
    }  
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.speed = 0.1;
        this.cur = 0;
        this.max = Math.random() * 100 + 150;
    }

    update() {
        this.cur += this.speed;
        this.y = this.fixedY + (Math.sin(this.cur) * this.max);
    }
}

class Wave {
    constructor() {
        this.resize();
    }

    resize() {
        this.oceanWidth = document.body.clientWidth;
        this.oceanHeight = document.body.clientHeight;
        this.centerX = this.oceanWidth / 2;
        this.centerY = this.oceanHeight / 2;
        console.log(" this.centerX ",  this.centerX );
        console.log(" this.centerY ",  this.centerY );
        
        this.init();
    }

    init() {
        this.point = new Point(this.centerX , this.centerY);
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = "#ff0000";
        this.point.update();

        context.arc(this.point.x, this.point.y, 20, 0, 2 * Math.PI);
        context.fill();
    }
}