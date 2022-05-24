import './sass/main.scss';
import * as PIXI from 'pixi.js';
import { getParseTreeNode } from 'typescript';

const colors = [0x00ffff, 0xff8000, 0x008000, 0x0000ff, 0x800080];

function getRandomColor() {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

const app = new PIXI.Application({ antialias: true, backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

app.loader
  .add('graphics', 'graphics')
  //     // .add('https://pixijs.io/examples/examples/assets/eggHead.png', 'https://pixijs.io/examples/examples/assets/eggHead.png')
  .load(onAssetsLoaded);

const REEL_WIDTH = 110;
const SYMBOL_SIZE = 90;

// onAssetsLoaded handler builds the example.
function onAssetsLoaded() {
  // Create different slot symbols.
//   const slotTextures = [
//     // PIXI.Texture.from(graphics),
//     // PIXI.Texture.from('https://pixijs.io/examples/examples/assets/eggHead.png'),
//     // PIXI.Texture.from('https://pixijs.io/examples/examples/assets/flowerTop.png'),
//     // PIXI.Texture.from('https://pixijs.io/examples/examples/assets/helmlok.png'),
//     // PIXI.Texture.from('https://pixijs.io/examples/examples/assets/skully.png'),
//   ];

  // Build the reels
  const reels = [];
  const reelContainer = new PIXI.Container();
  for (let i = 0; i < 6; i++) {
    const rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH/2;
    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter(),
    };

    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    const mouseposition = app.renderer.plugins.interaction.mouse.global;
    console.log(mouseposition)

    function handlerClick (e) {
        // if (targetClick) {
            console.log(e.currentTarget)
            // targetClick = false
        // }
        let line = new PIXI.Graphics();
        // ширина, цвет, альфа
        line.lineStyle(10, e.currentTarget._fillStyle.color, 1)
        
        line.position.x =  e.currentTarget._bounds.minX + 10;
        line.position.y = e.currentTarget._bounds.minY + 10;
    //    line.moveTo(15, 0)
        //===============================================================
        line.moveTo(mouseposition.x, mouseposition.y)

        // line.pivot.set(0,40);
        // line.rotation = 0
        
        // line.moveTo(15, 0)
        line.lineTo(line.position.x, line.position.y)
        
        app.stage.addChild(line)
        // // Update the mouse values to history
        // historyX.pop();
        // historyX.unshift(mouseposition.x);
        // historyY.pop();
        // historyY.unshift(mouseposition.y);

        // const apps = new PIXI.Application(500, 500, {
        //     transparent: true,
        //     resolution: 1,
        //     antialias: false
        //   });
          let reelContainer = new PIXI.Container();
        //   apps.stage.addChild(annoRef);
        //   const container = document.getElementById("stage-container");
          console.log(mouseposition)

//           container.appendChild(apps.view);
          
         
          
        //   document
        //     .getElementById("stage-container")
        //     .addEventListener("mousemove", onMouseMove, 0);
          
        //   document
        //     .getElementById("stage-container")
        //     .addEventListener("mousedown", onMouseDown, 0);
          
        //   document
        //     .getElementById("stage-container")
        //     .addEventListener("mouseup", onMouseUp, 0);
// //===========================================================================          

        // line.pivot.set(0,40);
        // line.rotation = 0
        
        // // line.moveTo(15, 0)
        // line.lineTo(15, 80)
        
        // app.stage.addChild(line)

    }
    var sprite = new PIXI.Graphics();
    let initPointer = null;
    
    let isMouseButtonDown = false;
    
    const getMousePos = (event) => {
      const pos = { x: 0, y: 0 };
      // // if (container) {
      //   // Get the position and size of the component on the page.
      //   const holderOffset = container.getBoundingClientRect();
      //   pos.x = event.pageX - holderOffset.x;
      //   pos.y = event.pageY - holderOffset.y;
      // // }
      return mouseposition;
    };
    
    const onMouseMove = (e) => {
      if (!isMouseButtonDown ) return;
      if (initPointer == null) return;
    
      sprite.clear();
      sprite.lineStyle(2, 0xff0000, 1);
      sprite.moveTo(initPointer.x, initPointer.y);
    
      const mousePosRef = getMousePos(e);
      sprite.lineTo(mousePosRef.x, mousePosRef.y);
    };
    const onMouseDown = (e) => {
      const mousePosRef = getMousePos(e);
      initPointer = mousePosRef;
    
      sprite = new PIXI.Graphics();
      sprite.lineStyle(2, 0xff0000, 1);
      sprite.moveTo(initPointer.x, initPointer.y);
      sprite.lineTo(mousePosRef.x, mousePosRef.y);
    
      reelContainer.addChild(sprite);
      
      isMouseButtonDown = true;
    };
    const onMouseUp = (e) => {
      isMouseButtonDown = false;
    };

    // Build the symbols
    for (let j = 0; j < 6; j++) {

      let circle = new PIXI.Graphics();

      circle.lineStyle(2);
      circle.beginFill(getRandomColor(), 1);
      circle.x = j % 6/2;
      circle.scale.x = circle.scale.y = 1;
      circle.y = Math.floor(j / 6);
      circle.drawCircle(circle.x, circle.y, 15);
      circle.buttonMode = true; 
      circle.interactive = true; 

    //   circle.on('mousedown', handlerClick);
   

      circle.on("mousemove", onMouseMove, 0);
      console.log("mousemove", circle);
      circle.on("mousedown", onMouseDown, 0);
      console.log("mousedown", circle); 
      circle.on("mouseup", onMouseUp, 0);
      console.log("mouseup", circle);


      reel.symbols.push(circle);
      rc.addChild(circle);
    }
    reels.push(reel);
   
  }
  app.stage.addChild(reelContainer);
//   reelContainer.on('mousedown', handlerClick);
  console.log(reelContainer);

  // Build top & bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 5) / 2;
  reelContainer.y = margin + 130;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
  const top = new PIXI.Graphics();
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin);
  const bottom = new PIXI.Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(0, SYMBOL_SIZE * 5 + margin, app.screen.width, margin);

  // Add play text
  const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });

//   const playText = new PIXI.Text('Spin the wheels!', style);
//   playText.x = Math.round((bottom.width - playText.width) / 2);
//   playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
//   bottom.addChild(playText);

  // Add header text
  const headerText = new PIXI.Text('GAME DOTS!', style);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);

//   // Set the interactivity.
//   bottom.interactive = true;
//   bottom.buttonMode = true;
//   bottom.addListener('pointerdown', () => {
//     startPlay();
//   });

//   let running = false;
//   // let running = true;

//   // Function to start playing.
//   function startPlay() {
//     if (running) return;
//     running = true;

//     for (let i = 0; i < reels.length; i++) {
//       const r = reels[i];
//       const extra = Math.floor(Math.random() * 5);
//       const target = r.position + 10 + i * 5 + extra;
//       const time = 2500 + i * 600 + extra * 600;
//       tweenTo(
//         r,
//         'position',
//         target,
//         time,
//         backout(0.5),
//         null,
//         i === reels.length - 1 ? reelsComplete : null,
//       );
//     }
//     console.log(reels);
//   }

//   // Reels done handler.
//   function reelsComplete() {
//     running = false;
//   }

  // Listen for animate update.
  app.ticker.add(delta => {
    // Update the slots.
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update blur filter y amount based on speed.
      // This would be better if calculated with time in mind also. Now blur depends on frame rate.
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      // Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          // Detect going over and swap a texture.
          // This should in proper product be determined from some logical reel.
          s.texture = colors[Math.floor(Math.random() * colors.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height,
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });
}

// let line = new PIXI.Graphics();
// // ширина, цвет, альфа
// line.lineStyle(10, 0x00ffff, 1)

// line.position.x = 100;
// line.position.y = 200;

// line.pivot.set(0,140);
// line.rotation = 0.185398

// line.moveTo(15, 0)
// line.lineTo(15, 280)

// app.stage.addChild(line)

// // Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
// const tweening = [];
// function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
//   const tween = {
//     object,
//     property,
//     propertyBeginValue: object[property],
//     target,
//     easing,
//     time,
//     change: onchange,
//     complete: oncomplete,
//     start: Date.now(),
//   };

//   tweening.push(tween);
//   return tween;
// }
// // Listen for animate update.
// app.ticker.add(delta => {
//   const now = Date.now();
//   const remove = [];
//   for (let i = 0; i < tweening.length; i++) {
//     const t = tweening[i];
//     const phase = Math.min(1, (now - t.start) / t.time);

//     t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
//     if (t.change) t.change(t);
//     if (phase === 1) {
//       t.object[t.property] = t.target;
//       if (t.complete) t.complete(t);
//       remove.push(t);
//     }
//   }
//   for (let i = 0; i < remove.length; i++) {
//     tweening.splice(tweening.indexOf(remove[i]), 1);
//   }
// });

// // Basic lerp funtion.
// function lerp(a1, a2, t) {
//   return a1 * (1 - t) + a2 * t;
// }

// // Backout function from tweenjs.
// // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
// function backout(amount) {
//   return t => --t * t * ((amount + 1) * t + amount) + 1;
// }

//=====================================================================

// const startBtn = document.querySelector('.start')
// const screens = document.querySelectorAll('.screen')
// const timeList = document.querySelector('.time-list')
// const timeEl = document.querySelector('#time')
// const board = document.querySelector('#board')
// const colors = ['#ffff00', '#33ccff', '#33cc33', '#ff0000', '#993399']
// let time = 0
// let score = 0

// startBtn.addEventListener('click', (event) => {
//     event.preventDefault()
//     screens[0].classList.add('up')
// })

// timeList.addEventListener('click', (event) => {
//     if (event.target.classList.contains('time-btn')) {
//         time = parseInt(event.target.getAttribute('data-time'))
//         screens[1].classList.add('up')
//         startGame()
//     }
// })

// board.addEventListener('click', event => {
//     if (event.target.classList.contains('circle')) {
//         score++
//         event.target.remove()
//         createRamdomCircle()

//     }
// })

// function startGame() {
//     setInterval(decreaseTime, 1000);
//     createRamdomCircle()
//     setTime(time)
// }

// function decreaseTime() {
//     if (time === 0) {
//         finishGame()
//     } else {
//         let current = --time
//         if (current < 10) {
//             current = `0${current}`
//         }
//         setTime(current)
//     }
// }

// function setTime(value) {
//     timeEl.innerHTML = `00:${value}`
// }

// function finishGame() {
//     timeEl.parentNode.classList.add('hide')
// board.innerHTML = `<h1>Ваш счет: <span class="primary">${score}</span></h1`
// }

// function createRamdomCircle() {
//     const circle = document.createElement('div')
//     const size = '60';
//     // const size = getRandomNumber(10, 60)

//     // const { width, height} = board.getBoundingClientRect()
//     // const x = getRandomNumber(0, 160 - size)
//     // const y = getRandomNumber(0, 160 - size)

//     circle.classList.add('circle')
//     circle.style.width = `${size}px`
//     circle.style.height = `${size}px`
//     // circle.style.top = `${y}px`
//     // circle.style.left = `${x}px`
//     setColor(circle)

//     // board.append(circle)
// }

// // function getRandomNumber(min, max) {
// //     return Math.round(Math.random() * (max - min) + min)
// // }

// function setColor(element) {
//     const color = getRandomColor()
//     element.style.background = color

// }

// function getRandomColor() {
//     const index = Math.floor(Math.random() * colors.length)
//     return colors[index]
// }
