function drawPath(pointer) {
    if (this.dragging) {
      let row = Math.floor((pointer.y - config.boardOffset.y) / config.dotSize);
      let col = Math.floor((pointer.x - config.boardOffset.x) / config.dotSize);

      // console.log(pointer.x)

      // this.graphics.clear(this.ray);
      // this.ray.setTo(
      //   this.draw3.chain[this.draw3.chain.length - 1].x,
      //   this.draw3.chain[this.draw3.chain.length - 1].y,
      //   pointer.x,
      //   pointer.y,
      // );

      // this.graphics.lineStyle(10, this.draw3.chain[0].color);
      // this.graphics.strokeLineShape(this.ray);

      if (this.draw3.validPick(row, col)) {
        let distance = Phaser.Math.Distance.Between(
          pointer.x,
          pointer.y,
          this.draw3.customDataOf(row, col).x,
          this.draw3.customDataOf(row, col).y,
        );

        if (distance < config.dotSize * 0.4) {
          if (this.draw3.continuesChain(row, col)) {
            // this.draw3.customDataOf(row, col).alpha = 0.5;
            this.draw3.putInChain(row, col);

            //===============
            let chainLength = this.draw3.chain.length;
            let chain = this.draw3.chain;
            let x1 = chain[chainLength - 2].x,
                y1 = chain[chainLength - 2].y,
                x2 = chain[chainLength - 1].x,
                y2 = chain[chainLength - 1].y;

            if (chainLength > 0 && pointer.isDown) {

              // this.graphics.beginPath();

              for (let i = 0; i < chainLength; i++) {
                if (chainLength > 1) {
                  
                  this.graphics.lineBetween(x1, y1, x2, y2);
                } else {
                   
                  let x1 = chain[i-1].x,
                      y1 = chain[i-1].y;

                  this.graphics.lineBetween(x1, y1, x2, y2); 
                }
              }

              // this.graphics.closePath();
              this.graphics.lineStyle(10, chain[0].color);
                  this.graphics.strokeLineShape(this.line);
                  // this.graphics.strokePath();

              console.log(this.graphics)
              console.log(this.graphics.getPostPipeline())
            }
            // ===================
          } else {
            
            if (this.draw3.backtracksChain(row, col)) {
              let removedItem = this.draw3.removeLastChainItem();
             //   this.draw3.customDataOf(removedItem.row, removedItem.column).alpha = 1;
            }
          }
        }
      }
    }
}
//======================

// let config = {
//   type: Phaser.AUTO,
//   parent: 'phaser-example',
//   width: 400,
//   height: 200,
//   banner: false,
//   scene: { create }
// };

// let game = new Phaser.Game(config);

let isDragging =  false;
let lineStartPosition =  {x:0 , y:0};
let currentPath = [];
let currentColor;

let line;
let pathGraphics;

function create ()
{
  let cicles = []
  for(let rowIdx = 0; rowIdx < 4; rowIdx++ ){
      for(let colIdx = 0; colIdx < 2; colIdx++ ){
          let circle = this.add.circle(50 + 100 * rowIdx, 50 + 100 * colIdx, 25,  0x6666ff).setOrigin(.5);
          // Just to test a different color
          if(rowIdx + colIdx ==2){
            circle.fillColor = 0xff0000;
          }
          circle.setInteractive();
          cicles.push(circle);
      }        
  }

  line = this.add.line(0,0, 0,0, 100, 100,  0xffffff).setOrigin(0);
  line.setLineWidth(5);
  line.visible = false;
  
  pathGraphics = this.add.graphics();
  
  // adding the events to the scene
  this.input.on('pointerdown', dragStart);
  this.input.on('pointerup', dragEnd);
  this.input.on('pointermove', drag); 
}

function dragStart(pointer, gameObjects){
  if(gameObjects.length == 0){
    return;
  }
  isDragging = true;
  
  // remember Starting Color
  currentColor = gameObjects[0].fillColor;
  
  // initialize Path
  currentPath = [gameObjects[0]];

  // draw/save last segment of the path
  lineStartPosition.x = gameObjects[0].x;
  lineStartPosition.y = gameObjects[0].y;
  
  line.x = gameObjects[0].x;
  line.y = gameObjects[0].y;
  line.setTo(0, 0, 0, 0);
  line.visible = true;

}

function drag(pointer, gameObjects ){
  if(isDragging == true){
      
      // Check If Circle is allowed to be added, to path
      // Here you would also check if the line is horizontal or vertical  (this part is currently not implemented)
      if(gameObjects[0] && currentPath.indexOf(gameObjects[0]) === -1 && currentColor == gameObjects[0].fillColor){
        currentPath.push(gameObjects[0]);
        
        line.x = gameObjects[0].x;
        line.y = gameObjects[0].y;
        
        lineStartPosition.x = gameObjects[0].x;
        lineStartPosition.y = gameObjects[0].y;

      }
      line.setTo(0, 0, pointer.x - lineStartPosition.x, pointer.y - lineStartPosition.y);
      
      drawPath();
  }
}

function drawPath(){
  pathGraphics.clear();
  if(currentPath.length > 0){
    pathGraphics.lineStyle(10, 0xffffff);
    let path = new Phaser.Curves.Path(currentPath[0].x, currentPath[0].y);
    
    for(let idx = 1; idx < currentPath.length; idx++){
      let point = currentPath[idx];
      path.lineTo(point.x, point.y);
    }

    path.draw(pathGraphics);
  }
  
  
  
}

function dragEnd(pointer, gameObjects){
  if(gameObjects.length == 0){
    return;
  }
  
  if(currentPath.length < 2) {
    console.info('No valid path');
    return
  } else { 
    console.info(`Valid Union path, length: ${currentPath.length}`);
  }

  line.visible = false;
  isDragging = false;
}
//===========================================================

import './sass/main.scss';
import 'phaser';

const colors = [0xff0000, 0xffff00, 0x008000, 0x0000ff, 0x800080]; // hex
// const colors = ['#ffe811', '#1159ff', '#11ff49', '#ff3911', '#97169b']; // rgb

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  //   preload() {
  //     this.load.image('img', '/assets/1.png');
  //
  //     this.load.spritesheet('line', 'sprites/line.png', {
  //       frameWidth: config.dotSize * 3,
  //       frameHeight: config.dotSize * 3,
  //     });
  //   }

  create() {
    this.canPick = true;
    this.dragging = false;
    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.group;
    this.invaders;
    // path = new Phaser.Curves.Path(0, 0);
    this.linePath;
    // this.ray = new Phaser.Geom.Line();
    this.draw3 = new Draw3({
      rows: 6,
      columns: 6,
      items: 5,
    });

    this.scoreValue = 0;
    this.scoreOfDot = 1;

    this.timeOutScore = this.add.text(330, 20, ` `, {
      align: 'right',
      fontSize: '26px',
      fontFamily: 'Arial',
      color: '#2a9c24',
    });

    this.score();
    this.draw3.generateField();
    this.drawField();
    // this.drawLine()
    this.input.on('pointerdown', this.gemSelect, this);
    this.input.on('pointermove', this.drawPath, this);
    this.input.on('pointerup', this.removeGems, this);
  }
  update() {
    // this.graphics.clear();
    // if (this.draw3.chain.length>0){
    //   this.graphics.clear();
    //   this.graphics.lineStyle(5, this.draw3.chain[0].color, 1);
    //   console.log('this.path', this.linePath)
    //   console.log('this.graphics', this.graphics)
    //   this.linePath.draw(this.graphics);
    // }
    // //=============
    // // this.graphics.clear();
    //  let chainLength = this.draw3.chain.length;
    //     let chain = this.draw3.chain;
    //     if (chainLength > 0) {
    //       for (let i = 0; i < chainLength; i++) {
    //         let x2 = chain[chainLength - 1].x,
    //           y2 = chain[chainLength - 1].y;
    //         if (chainLength > 1) {
    //           let x1 = chain[chainLength - 2].x,
    //             y1 = chain[chainLength - 2].y;
    //           this.graphics.lineBetween(x1, y1, x2, y2);
    //         } else {
    //           this.graphics.clear();
    //         }
    //         this.graphics.lineStyle(10, chain[0].color);
    //         this.graphics.strokeLineShape(this.line);
    //       }
    //       }
  }

  score() {
    this.timeOutScore.setText(`SCORE: ${this.scoreValue}`);
  }

  drawField() {
    let colors = this.draw3.getColors(); // array counts
    let counter = 0;

    for (let i = 0; i < this.draw3.getRows(); i++) {
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        let posX = config.boardOffset.x + config.dotSize * j + config.dotSize / 2;
        let posY =
          config.boardOffset.y - config.boardOffset.y * 5 + config.dotSize * i + config.dotSize / 2;
        let gem = this.add.circle(posX, posY, config.radiusDots, colors[counter]);
        gem.setInteractive();

        this.draw3.setCustomData(i, j, gem);
        counter += 1;

        var tween = this.tweens.add({
          targets: gem,
          y: gem.y + config.boardOffset.y * 5,
          duration: 1000,
          onComplete: function () {
            tween.remove();
          },
        });
        // this.drawLine()
      }
    }
  }

  gemSelect(pointer) {
    if (this.canPick) {
      let row = Math.floor((pointer.y - config.boardOffset.y) / config.dotSize);
      let col = Math.floor((pointer.x - config.boardOffset.x) / config.dotSize);

      if (this.draw3.validPick(row, col)) {
        this.canPick = false;
        this.draw3.putInChain(row, col);
        // this.draw3.customDataOf(row, col).alpha = 0.5;
        this.dragging = true;

        // // this work ok

        this.linePath = new Phaser.Curves.Path(this.draw3.chain[0].x, this.draw3.chain[0].y);

        //  Create some invaders
        this.group = this.add.group({ key: 'invader', frame: 0 });
        this.invaders = this.group.getChildren();

        Phaser.Actions.GridAlign(this.group.getChildren(), this.line);

        // this.drawLine()
        // this.line.setTo(
        //   this.draw3.chain[0].x,
        //   this.draw3.chain[0].y,
        //   this.draw3.chain[0].x,
        //   this.draw3.chain[0].y,
        // );
        // // this.graphics.clear();
        // this.graphics.lineStyle(10, this.draw3.chain[0].color);
        // this.graphics.strokeLineShape(this.line);
      }
    }
  }
  drawPath(pointer) {
    if (this.dragging) {
      let row = Math.floor((pointer.y - config.boardOffset.y) / config.dotSize);
      let col = Math.floor((pointer.x - config.boardOffset.x) / config.dotSize);

      if (this.draw3.validPick(row, col)) {
        let distance = Phaser.Math.Distance.Between(
          pointer.x,
          pointer.y,
          this.draw3.customDataOf(row, col).x,
          this.draw3.customDataOf(row, col).y,
        );

        if (distance < config.dotSize * 0.4) {
          if (this.draw3.continuesChain(row, col)) {
            // this.draw3.customDataOf(row, col).alpha = 0.5;
            this.draw3.putInChain(row, col);

            let chainLength = this.draw3.chain.length;
            let chain = this.draw3.chain;
            if (chainLength > 0) {
              for (let i = 0; i < chainLength; i++) {
                let x2 = chain[chainLength - 1].x,
                  y2 = chain[chainLength - 1].y;

                this.linePath.lineTo(x2, y2);
                this.graphics.lineStyle(10, chain[0].color);
              }
            }

            this.linePath.draw(this.graphics);
          } else {
            if (this.draw3.backtracksChain(row, col)) {
              let removedItem = this.draw3.removeLastChainItem();

              let chainLength = this.draw3.chain.length;
              let chain = this.draw3.chain;
              if (chainLength > 1) {
                // this.graphics.clear();
                // console.log('before', this.linePath.curves )
                // console.log('group', this.group);
                console.log('group children', this.group.getChildren());
                var invader = Phaser.Utils.Array.GetRandom(this.invaders);
                console.log('invader', invader);
                // if (invader)
                // {
                //     //  Then destroy it. This will fire a 'destroy' event that the Group will hear
                //     //  and then it'll automatically remove itself from the Group.
                //     invader.destroy();
                // }
                // this.linePath.draw(this.graphics);
              }
            }
          }
        }
      }
    }
  }

  removeGems() {
    if (this.dragging) {
      this.graphics.clear();
      this.linePath.destroy();

      this.dragging = false;
      if (this.draw3.getChainLength() < 2) {
        // let chain = this.draw3.emptyChain();
        // chain.forEach(
        //   function (item) {
        //     // this.draw3.customDataOf(item.row, item.column).alpha = 1; // возможно сюда добавить удаление линии
        //   }.bind(this),
        // );
        this.canPick = true;
      } else {
        let gemsToRemove = this.draw3.destroyChain();
        let destroyed = 0;
        gemsToRemove.forEach(
          function (gem) {
            this.scoreValue = this.scoreValue + this.scoreOfDot;
            destroyed++;
            this.tweens.add({
              targets: this.draw3.customDataOf(gem.row, gem.column),
              alpha: 0,
              duration: config.destroySpeed,
              callbackScope: this,
              onComplete: function (event, sprite) {
                destroyed--;
                if (destroyed == 0) {
                  this.makeGemsFall();
                }
              },
            });
          }.bind(this),
        );
        this.score();
      }
    }
  }
  // drawLine() {
  //   let chainLength = this.draw3.chain.length;
  //   let chain = this.draw3.chain;
  //   if (chainLength > 0) {
  //     for (let i = 0; i < chainLength; i++) {

  //       let x2 = chain[chainLength - 1].x,
  //         y2 = chain[chainLength - 1].y;
  //       // if (chainLength > 1) {
  //         let x1 = chain[chainLength - 2].x,
  //           y1 = chain[chainLength - 2].y;
  //           this.linePath.lineTo(chain[chainLength - 1].x, chain[chainLength - 1].y)
  //           this.graphics.lineStyle(5, chain[0].color);
  //         // this.graphics.lineBetween(x1, y1, x2, y2);

  //         // console.log('line', this.linePath)
  //         // console.log('lineBetween', this.graphics.lineBetween(x1, y1, x2, y2))
  //       // } else {

  //         // this.graphics.clear();
  //       // }
  //       // this.graphics.lineStyle(10, chain[0].color);
  //       // this.graphics.strokeLineShape(this.line);
  //       // this.graphics.clear();
  //       console.log('color', this.draw3.chain[0].color)
  // console.log('this.path', this.linePath)
  // console.log('this.graphics', this.graphics)
  // console.log('this.graphics', this.line)
  // // this.linePath.draw(this.graphics);
  //     }
  //     }
  // }
  makeGemsFall() {
    let moved = 0;
    let fallingMovements = this.draw3.arrangeBoardAfterChain();
    fallingMovements.forEach(
      function (movement) {
        moved++;
        this.tweens.add({
          targets: this.draw3.customDataOf(movement.row, movement.column),
          y:
            this.draw3.customDataOf(movement.row, movement.column).y +
            movement.deltaRow * config.dotSize,
          duration: config.fallSpeed * Math.abs(movement.deltaRow),
          callbackScope: this,
          onComplete: function () {
            moved--;
            if (moved == 0) {
              this.canPick = true;
            }
          },
        });
      }.bind(this),
    );
    let replenishMovements = this.draw3.replenishBoard();
    replenishMovements.forEach(
      function (movement) {
        moved++;
        let newGem = this.add.circle(0, 0, 15, this.draw3.getRandomColor());

        newGem.alpha = 1;
        newGem.y =
          config.boardOffset.y +
          config.dotSize * (movement.row - movement.deltaRow + 1) -
          config.dotSize / 2;
        newGem.x = config.boardOffset.x + config.dotSize * movement.column + config.dotSize / 2;

        this.draw3.setCustomData(movement.row, movement.column, newGem);
        this.draw3.setColorNewField(movement.row, movement.column, newGem.fillColor);
        this.tweens.add({
          targets: newGem,
          y: config.boardOffset.y + config.dotSize * movement.row + config.dotSize / 2,
          duration: config.fallSpeed * movement.deltaRow,
          callbackScope: this,
          onComplete: function () {
            moved--;
            if (moved == 0) {
              this.canPick = true;
            }
          },
        });
      }.bind(this),
    );
  }
}

//====================================

let scene = new GameScene('Game');

let config = {
  type: Phaser.AUTO,
  width: 500,
  height: 500,
  scene: scene,
  radiusDots: 15,
  fallSpeed: 100,
  destroySpeed: 200,
  dotSize: 55,
  boardOffset: {
    x: 90,
    y: 90,
  },
};
window.focus();
let game = new Phaser.Game(config);

//===============================================

class Draw3 {
  // constructor, simply turns obj information into class properties and creates
  // an array called "chain" which will contain chain information
  constructor(obj) {
    this.rows = obj.rows;
    this.columns = obj.columns;
    this.items = obj.items;
    this.chain = [];
    this.color = [];
  }

  // returns the number of rows in board
  getRows() {
    return this.rows;
  }

  // returns the number of columns in board
  getColumns() {
    return this.columns;
  }

  getColors() {
    return this.color;
  }

  // generates the game field
  generateField() {
    this.gameArray = [];
    for (let i = 0; i < this.getRows(); i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < this.getColumns(); j++) {
        let randomColor = this.getRandomColor();

        this.color.push(randomColor);
        this.gameArray[i][j] = {
          color: randomColor,
          isEmpty: false,
          row: i,
          column: j,
        };
      }
    }

    // return this.getColors(this.color);
  }

  //generates random color
  getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }

  // set new value of color
  setColorNewField(row, column, color) {
    this.gameArray[row][column].color = color;
  }

  // returns true if the item at (row, column) is a valid pick
  validPick(row, column) {
    return (
      row >= 0 &&
      row < this.getRows() &&
      column >= 0 &&
      column < this.getColumns() &&
      this.gameArray[row] != undefined &&
      this.gameArray[row][column] != undefined
    );
  }

  // returns the value of the item at (row, column), or false if it's not a valid pick
  valueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].color;
  }

  // sets a custom data of the item at (row, column)
  setCustomData(row, column, customData) {
    this.gameArray[row][column].customData = customData;
  }

  // returns the custom data of the item at (row, column)
  customDataOf(row, column) {
    return this.gameArray[row][column].customData;
  }

  // returns true if the item at (row, column) continues the chain
  continuesChain(row, column) {
    return (
      this.getChainValue() == this.valueAt(row, column) &&
      !this.isInChain(row, column) &&
      this.areNext(row, column, this.getLastChainItem().row, this.getLastChainItem().column)
    );
  }

  // returns true if the item at (row, column) backtracks the chain
  backtracksChain(row, column) {
    return (
      this.getChainLength() > 1 &&
      this.areTheSame(
        row,
        column,
        this.getNthChainItem(this.getChainLength() - 2).row,
        this.getNthChainItem(this.getChainLength() - 2).column,
      )
    );
  }

  // returns the n-th chain item
  getNthChainItem(n) {
    return {
      row: this.chain[n].row,
      column: this.chain[n].column,
    };
  }

  // returns the last chain item
  getLastChainItem() {
    return this.getNthChainItem(this.getChainLength() - 1);
  }

  // returns chain length
  getChainLength() {
    return this.chain.length;
  }

  // returns true if the item at (row, column) is in the chain
  isInChain(row, column) {
    for (let i = 0; i < this.getChainLength(); i++) {
      let item = this.getNthChainItem(i);
      if (this.areTheSame(row, column, item.row, item.column)) {
        return true;
      }
    }
    return false;
  }

  // returns the value of items in the chain
  getChainValue() {
    return this.valueAt(this.getNthChainItem(0).row, this.getNthChainItem(0).column);
  }

  // puts the item at (row, column) in the chain
  putInChain(row, col) {
    this.chain.push({
      row: row,
      column: col,
      x: this.customDataOf(row, col).x,
      y: this.customDataOf(row, col).y,
      color: this.customDataOf(row, col).fillColor,
    });
  }

  // removes the last chain item and returns it
  removeLastChainItem() {
    return this.chain.pop();
  }

  // clears the chain and returns the items
  emptyChain() {
    let result = [];
    this.chain.forEach(function (item) {
      result.push(item);
    });
    this.chain = [];
    this.chain.length = 0;
    return result;
  }

  // clears the chain, set items as empty and returns the items
  destroyChain() {
    let result = [];
    this.chain.forEach(
      function (item) {
        result.push(item);
        this.setEmpty(item.row, item.column);
      }.bind(this),
    );
    this.chain = [];
    this.chain.length = 0;
    return result;
  }

  // checks if the items at (row, column) and (row2, column2) are the same
  areTheSame(row, column, row2, column2) {
    return row == row2 && column == column2;
  }

  // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally, vertically or diagonally
  areNext(row, column, row2, column2) {
    return Math.abs(row - row2) + Math.abs(column - column2) == 1;
  }

  // swap the items at (row, column) and (row2, column2) and returns an object with movement information
  swapItems(row, column, row2, column2) {
    let tempObject = Object.assign(this.gameArray[row][column]);
    this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
    this.gameArray[row2][column2] = Object.assign(tempObject);
    return [
      {
        row: row,
        column: column,
        deltaRow: row - row2,
        deltaColumn: column - column2,
      },
      {
        row: row2,
        column: column2,
        deltaRow: row2 - row,
        deltaColumn: column2 - column,
      },
    ];
  }

  // set the item at (row, column) as empty
  setEmpty(row, column) {
    this.gameArray[row][column].isEmpty = true;
  }

  // returns true if the item at (row, column) is empty
  isEmpty(row, column) {
    return this.gameArray[row][column].isEmpty;
  }

  // returns the amount of empty spaces below the item at (row, column)
  emptySpacesBelow(row, column) {
    let result = 0;
    if (row != this.getRows()) {
      for (let i = row + 1; i < this.getRows(); i++) {
        if (this.isEmpty(i, column)) {
          result++;
        }
      }
    }
    return result;
  }

  // arranges the board after a chain, making items fall down. Returns an object with movement information
  arrangeBoardAfterChain() {
    let result = [];
    for (let i = this.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.getColumns(); j++) {
        let emptySpaces = this.emptySpacesBelow(i, j);
        if (!this.isEmpty(i, j) && emptySpaces > 0) {
          this.swapItems(i, j, i + emptySpaces, j);
          result.push({
            row: i + emptySpaces,
            column: j,
            deltaRow: emptySpaces,
            deltaColumn: 0,
          });
        }
      }
    }
    return result;
  }

  // replenishes the board and returns an object with movement information
  replenishBoard() {
    let result = [];
    for (let i = 0; i < this.getColumns(); i++) {
      if (this.isEmpty(0, i)) {
        let emptySpaces = this.emptySpacesBelow(0, i) + 1;
        for (let j = 0; j < emptySpaces; j++) {
          result.push({
            row: j,
            column: i,
            deltaRow: emptySpaces,
            deltaColumn: 0,
          });
          this.gameArray[j][i].color = this.getRandomColor();
          this.gameArray[j][i].isEmpty = false;
        }
      }
    }
    return result;
  }
}
Draw3.RIGHT = 1;
Draw3.DOWN = 2;
Draw3.LEFT = 4;
Draw3.UP = 8;
