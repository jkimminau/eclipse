import React, { Component } from 'react';

let ctx;

class App extends Component {
  t = 1
  points = []
  circlePoints = []
  canvas = undefined
  angle = 0

  async componentDidMount() {
    this.canvas = document.getElementById("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    ctx = this.canvas.getContext("2d");

    await this.generateCircle();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  async generateCircle() {
    // let points = []

    const NUMBER_OF_SPEED_SAMPLES = 1000;
    // affects the width of the line drawn
    const MAX_SPEED = 50
    let speeds = []
    for(let i = 0; i < NUMBER_OF_SPEED_SAMPLES; i++){
      speeds.push(this.getRandomInt(MAX_SPEED))
    }

    const radius = this.canvas.height / 4;
    // the higher number, the better looking the circle, the slower the draw
    const NUMBER_OF_CIRCLE_SAMPLES = 1000;

    for(let i = 0; i < NUMBER_OF_CIRCLE_SAMPLES; i++) {
      const theta = (i / NUMBER_OF_CIRCLE_SAMPLES) * 180;
      const speedIndex = (i / NUMBER_OF_CIRCLE_SAMPLES) * (speeds.length - 1);
      const speedIndexComplex = 
        [
            (speedIndex > 0) ? Math.floor(speedIndex) : Math.ceil(speedIndex),
            speedIndex % 1
        ];
      let speedAtI;
      if(speedIndexComplex[1] !== 0){
        speedAtI = speeds[speedIndexComplex[0]] + ((speeds[speedIndexComplex[0] + 1] - speeds[speedIndexComplex[0]]) * speedIndexComplex[1])
      } else {
        speedAtI = speeds[speedIndexComplex[0]];
      }

      const hypotenuse = radius + speedAtI;

      const x = Math.sin(theta * (Math.PI / 90)) * hypotenuse;
      const y = Math.cos(theta * (Math.PI / 90)) * hypotenuse;

      const cx = Math.sin(theta * (Math.PI / 90)) * radius;
      const cy = Math.cos(theta * (Math.PI / 90)) * radius;

      this.points.push({x: x + (this.canvas.width / 2), y})
      this.circlePoints.push({x: cx  + (this.canvas.width / 2), y: cy})
    }
    this.animate()
  }

  async generatePoints() {
      let speeds = []
      for(let i = 0; i < 1000; i++){
        speeds.push(this.getRandomInt(100))
      }
      // 100 / 2000 = x / 4

    for(let i = 0; i < this.canvas.width; i++){
      var x = (i / this.canvas.width) * (speeds.length - 1);
      var trueX =
        [
            (x > 0) ? Math.floor(x) : Math.ceil(x),
            x % 1
        ];
      if(trueX[1] !== 0){
        this.points.push({x: i, y: speeds[trueX[0]] + ((speeds[trueX[0] + 1] - speeds[trueX[0]]) * trueX[1])})
      } else {
        this.points.push({x: i, y: speeds[trueX[0]]});
      }
    }
    this.animate();
  }

  animate = () => {
     requestAnimationFrame(this.animate); 
     if (this.t < this.points.length - 1) {
      // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // draw a line segment from the last waypoint
      // to the current waypoint
      ctx.beginPath();
      // console.log(this.t)
      ctx.moveTo(this.points[this.t-1].x,this.canvas.height / 2 - this.points[this.t-1].y);
      ctx.lineTo(this.points[this.t].x,this.canvas.height /2  - this.points[this.t].y);
      ctx.strokeStyle = `rgba(100, 180, 135, ${Math.random()})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.circlePoints[this.t-1].x,this.canvas.height / 2 - this.circlePoints[this.t-1].y);
      ctx.lineTo(this.circlePoints[this.t].x,this.canvas.height /2  - this.circlePoints[this.t].y);
      ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
      ctx.stroke();

      // increment "t" to get the next waypoint
      this.t++;
     } else {
       ctx.save()
      ctx.rotate(this.angle * Math.PI / 180)
      this.angle = this.angle > 359 ? 0 : this.angle + 1;
     }
    }

  render() {
    return (
      <html>
        <body style={{backgroundColor: 'black'}}>
          <canvas id="canvas"></canvas>
        </body>
      </html>
    );
  }
}

// function animation(timestamp) {
//   // window.requestAnimationFrame(animation);

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // NOTE+ Left down
//   const rightBottomOption = {
//     sx: 0,
//     sy: window.innerHeight - window.innerHeight / 2,
//     width: window.innerWidth,
//     getY(i) {
//       return (
//         this.sy +
//         Math.sin(i * wave.length * 2 + theta) *
//           4 *
//           Math.sin(i * wave.length + theta) *
//           40
//       );
//     },
//   };
//   plotSine(0, rightBottomOption);

//   theta += wave.speed;
// }

// function animate(t){
//   if(t<points.length-1){ requestAnimationFrame(animate); }
//   // draw a line segment from the last waypoint
//   // to the current waypoint
//   ctx.beginPath();
//   ctx.moveTo(points[t-1].x,points[t-1].y);
//   ctx.lineTo(points[t].x,points[t].y);
//   ctx.stroke();
//   // increment "t" to get the next waypoint
//   t++;
// }

// function plotSine(yOffset, opt) {
//   ctx.beginPath();
//   ctx.moveTo(opt.sx + yOffset, opt.sy);
//   const alpha = map(yOffset, 0, 24, 1, 0);
//   ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
//   ctx.lineWidth = 1;

//   // NOTE: Left waves
//   for (let i = opt.sx; i < opt.width; i++) {
//     ctx.lineTo(i + yOffset, opt.getY(i));
//   }

//   ctx.stroke();
// }

// function map(value, low1, high1, low2, high2) {
//   return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
// }

export default App;