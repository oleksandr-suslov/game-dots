import './sass/main.scss';
import * as PIXI from 'pixi.js';
import { getParseTreeNode } from 'typescript';
const generateUniqueId = require('generate-unique-id');

let isMouseButtonDown = false;

const colors = [0x00ffff, 0xff8000, 0x008000, 0x0000ff, 0x800080];
const circleRadius = 15;
let currentLine = {
  color: null,
  circleId: [],
  circlesOnLine: [],
  circleIndex: [],
};

function getRandomColor() {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

const app = new PIXI.Application({
  width: 500,
  height: 500,
  backgroundColor: 0x1099bb,
  antialias: true,
  resolution: 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);
var figure = []; //массив хранящий точки

// Create a 6x6 grid of bunnies
for (let i = 0; i < 36; i++) {
  let circle = new PIXI.Graphics();

  circle.lineStyle(2);
  circle.beginFill(getRandomColor(), 1);
  circle.x = (i % 6) * 25;
  circle.scale.x = circle.scale.y = 1;
  circle.y = Math.floor(i / 6) * 25;
  circle.drawCircle(circle.x, circle.y, circleRadius);
  circle.buttonMode = true;
  circle.interactive = true;
  circle.name = generateUniqueId();
  circle.index = i;

  function onEvent(e) {
    if (
      isMouseButtonDown &&
      // currentLine.circlesOnLine[currentLine.circlesOnLine.length-1]._fillStyle.color ===currentLine.color
      circle._fillStyle.color === currentLine.color
    ) {
      currentLine.circlesOnLine.push(circle);
      // currentLine.circlesOnLine.sort((a, b) => {(a.index > b.index) ? 1 : -1});
    }
    if (currentLine.circlesOnLine.length === 1) {
      currentLine.circlesOnLine = [];
      currentLine.color = null;
    }
  }

  [app.stage, circle].forEach(object => {
    object.on('pointerenter', onEvent);
    object.on('pointerleave', onEvent);
    object.on('pointerover', onEvent);
    object.on('pointerout', onEvent);
  });

  // Setup events for mouse + touch using the pointer events
  circle.once('mousedown', onClick);
  circle.once('mouseup', onClickUp);

  function onClick(e) {
    currentLine.color = circle._fillStyle.color;
    currentLine.circleId.push(circle.id);
    currentLine.circleIndex.push(circle.index);
    currentLine.circlesOnLine.push(circle);

  }
  // delete circle on line
  function onClickUp(e) {
    if (currentLine.circlesOnLine.length > 1) {
      currentLine.circlesOnLine.forEach(dot => {
        for (let i = 0; i < container.children.length; i++) {
          if (dot.name === container.children[i].name) {
            container.children[i].visible = false;

            // if (i <= 5){
            // // console.log('container1', container.children[i].getLocalBounds());
            // let newCircle = new PIXI.Graphics();
            // newCircle.lineStyle(2);
            // newCircle.x = container.children[i].x  ;
            // //  newCircle.scale.x = circle.scale.y = 1;
            // newCircle.y = container.children[i].y;
            // newCircle.drawCircle(circle.x, circle.y, circleRadius);

            // // newCircle._bounds=dot._bounds
            // newCircle.buttonMode = true;
            // newCircle.interactive = true;
            // newCircle.beginFill(getRandomColor(), 1);
            // newCircle.name = generateUniqueId();
            // newCircle.index = i;
            // newCircle.visible = true;
            // // container.removeChildAt(i)
            // // container.removeChild(container.children[i]);
            // container.addChildAt(newCircle, i);
            // // container.renderAdvanced(newCircle)
            // // app.render(container);
            // }
            // generateNewCircle(i, dot._bounds)
            // container.removeChildAt(container.children[i].index)
          }
        }
      });
    }
    function generateNewCircle(index, location) {
      if (index < 5 && container.children[index].visible === false) {
        // console.log('container2',container.children[index])

        let newCircle = circle.clone();
        // newCircle._bounds=location
        newCircle.lineStyle(2);

        newCircle.x = (index % 6) * 25;
        newCircle.scale.x = circle.scale.y = 1;
        newCircle.y = Math.floor(index / 6) * 25;
        newCircle.drawCircle(circle.x, circle.y, circleRadius);
        newCircle.buttonMode = true;
        newCircle.interactive = true;
        newCircle._fillStyle.color = getRandomColor();
        newCircle.name = generateUniqueId();
        newCircle.index = index;
        // newCircle._render()
        // console.log('container new circle', newCircle)
        container.removeChildAt(index);
        container.addChildAt(newCircle, index);
        // container.children.splice(index,1,newCircle)
        console.log('container new ', container);
        // container.updateTransform()
        // app.stage.addChild(container);
      }
    }
    // currentLine.circlesOnLine = [];
    currentLine.color = null;
    console.log('mouseup currentLine', currentLine)

  }
  container.addChild(circle);
}
console.log('app.view.x',app.view)
// app.view.clientLeft = 200;    
// app.view.clientTop = 100;

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center circle sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

const containers = document.getElementById('stage-container');
containers.appendChild(app.view);

var sprite = new PIXI.Graphics();
let initPointer = null;

const mouseposition = app.renderer.plugins.interaction.mouse.global;

const getMousePos = event => {
  const pos = { x: 0, y: 0 };
  if (containers) {
    // Get the position and size of the component on the page.
    const holderOffset = containers.getBoundingClientRect();
    pos.x = event.pageX - holderOffset.x;
    pos.y = event.pageY - holderOffset.y;
  }
  return pos;
};

const onMouseMove = e => {
  if (!isMouseButtonDown) return;
  if (initPointer == null) return;

  if (
    currentLine.circlesOnLine.length > 1 &&
    currentLine.circlesOnLine[currentLine.circlesOnLine.length - 1]._fillStyle.color ===
      currentLine.color
  ) {

    for (let i = 0; i < currentLine.circlesOnLine.length; i++) {
      sprite.lineStyle(10, currentLine.color, 1);

      if (currentLine.circlesOnLine.length > 1) {
        sprite.moveTo(
          currentLine.circlesOnLine[currentLine.circlesOnLine.length - 2]._bounds.minX +
            1 +
            circleRadius,
          currentLine.circlesOnLine[currentLine.circlesOnLine.length - 2]._bounds.minY +
            1 +
            circleRadius,
        );
        sprite.lineTo(
          currentLine.circlesOnLine[currentLine.circlesOnLine.length - 1]._bounds.minX +
            1 +
            circleRadius,
          currentLine.circlesOnLine[currentLine.circlesOnLine.length - 1]._bounds.minY +
            1 +
            circleRadius,
        );
      } else {
        sprite.moveTo(
          currentLine.circlesOnLine[i]._bounds.minX + 1 + circleRadius,
          currentLine.circlesOnLine[i]._bounds.minY + 1 + circleRadius,
        );

        sprite.lineTo(
          currentLine.circlesOnLine[currentLine.circlesOnLine.length - 1]._bounds.minX +
            1 +
            circleRadius,
          currentLine.circlesOnLine[currentLine.circlesOnLine.length - 1]._bounds.minY +
            1 +
            circleRadius,
        );
      }

    }
  }
};

const onMouseDown = e => {
  const mousePosRef = getMousePos(e);
  initPointer = mousePosRef;
  sprite = new PIXI.Graphics();
  sprite.lineStyle(10, currentLine.color, 1);
  sprite.moveTo(initPointer.x - 106, initPointer.y - 104);
  sprite.lineTo(mousePosRef.x - 106, mousePosRef.y - 104);
  container.addChild(sprite);
  isMouseButtonDown = true;
};
const onMouseUp = e => {
  isMouseButtonDown = false;
  currentLine = {
    color: null,
    circleId: [],
    circlesOnLine: [],
    circleIndex: [],
  };
  sprite.clear();
};

document.getElementById('stage-container').addEventListener('mousemove', onMouseMove, 0);

document.getElementById('stage-container').addEventListener('mousedown', onMouseDown, 0);

document.getElementById('stage-container').addEventListener('mouseup', onMouseUp, 0);
