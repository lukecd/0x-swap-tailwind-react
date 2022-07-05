/**
 * Ok, honestly this seem a bit kludgy to have this one draw method 
 * here that then instantiates the objects needed for my design.
 * But seems like this is how to integrate Canvas stuff into
 * React? I need to study up on this some more. 
 * 
 * @param {*} context A reference to the site's context
 * @param {*} canvas A reference to the site's canvas
 */

const draw = (context, canvas) => {

    console.log('created new ocean')
    new Ocean(context, canvas);
}
export default draw;


/**
 * When I was thinking about the UI for this, I thought it would be pretty to have some 
 * soft waves undulating in the background. I imagined a DEX with an ocean-like design
 * that would imply "everyone can be a whale"
 * 
 * I just finished two projects that used p5.js to do some animation, and then right 
 * as I finished them, I read that working directly with the HTML Canvas can be more
 * efficient. So I googled "how to draw sine curves in HMTL Canvas"
 * and found this very very helpful tuorial.
 * https://www.youtube.com/watch?v=LLfhY4eVwDY&t=399s
 */
class Ocean {

    constructor(context, canvas) {
        this.context = context;
        this.canvas = canvas;
        this.waveGroup = new WaveGroup();
        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.oceanWidth =  window.innerWidth;
        this.oceanHeight =  window.innerHeight;
        this.waveGroup.resize(this.oceanWidth, this.oceanHeight);
    }

    animate(t) {
        this.context.clearRect(0, 0, this.oceanWidth, this.oceanHeight);
        this.waveGroup.draw(this.context);
        requestAnimationFrame(this.animate.bind(this));
    }
}

/**
 * A single point along with math to modulate its y position
 */
class Point {
    constructor(index, x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.speed = 0.005;
        this.cur = index;
        this.max = Math.random() * 100 + 550;
    }

    update() {
        this.cur += window.$wave_speed;

        // move y up and down along a sin curve
        this.y = this.fixedY + (Math.sin(this.cur) * this.max);  
    }
}

/**
 * A wave is a grouping of n points connected using quadraticCurveTo
 */
class Wave {
    constructor(index, totalPoints, color) {
        this.index = index;
        this.totalPoints = totalPoints;
        this.color = color;
        this.points = [];
    }

    resize(width, height) {
        this.oceanWidth = width;
        this.oceanHeight = height;
        this.centerX = width / 2;
        this.centerY = height / 2;
        // how much to space out points along the sine durve  
        this.pointGap = this.oceanWidth / (this.totalPoints - 1);
        
        this.init();
    }

    init() {
        this.points = [];

        for(let i=0; i<this.totalPoints; i++) {

            const point = new Point(this.index+i, this.pointGap * i, this.centerY); 
            this.points[i] = point;
        }
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        let prevX = this.points[0].x;
        let prevY = this.points[0].y;
        
        // START i=1 so we don't update the first point
        for(let i=1; i<this.totalPoints; i++) {
            // don't update the last point
            if(i < this.totalPoints-1) this.points[i].update();

            const cx = (prevX + this.points[i].x) / 2;
            const cy = (prevY + this.points[i].y) / 2;

            context.quadraticCurveTo(prevX, prevY, cx, cy);

            prevX = this.points[i].x;
            prevY = this.points[i].y;

        }

        context.lineTo(prevX, prevY);
        context.lineTo(this.oceanWidth, this.oceanHeight);
        context.lineTo(this.points[0].x, this.oceanHeight);
        context.fill();
        context.closePath();
        }
     
}

/**
 * Used to group n waves into one class. 
 * Right now it's hard-coded to 3, but that could be changed easily.
 */
class WaveGroup {
    constructor() {
        this.totalWaves = 3;
        this.totalPoints = 6;
        
        // wave1: '#245C81', rgba(36, 92, 129, 0.4)
        // wave2: '#338FB8', rgba(51, 143, 184, 0.4)
        // wave3: '#82DDF0', rgba(130, 221, 240, 0.4)

        this.colors = ['rgba(36, 92, 129, 0.4)', 'rgba(51, 143, 184, 0.4)', 'rgba(130, 221, 240, 0.4)'];
        this.waves = [];

        // create our waves and add to the wave group class
        for(let i=0; i<this.totalWaves; i++) {
            const wave = new Wave (i, this.totalPoints, this.colors[i]);
            this.waves[i] = wave;
        }
    }

    resize(oceanWidth, oceanHeight) {
        for(let i=0; i<this.totalWaves; i++) {
            const wave = this.waves[i];
            wave.resize(oceanWidth, oceanHeight);
        }
    }

    draw(context) {
        for(let i=0; i<this.totalWaves; i++) {
            const wave = this.waves[i];
            wave.draw(context);
        }     
    }
    
}