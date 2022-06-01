import './sass/main.scss';
import 'phaser';
import Draw3 from './js/grid';



class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.canPick = true;
    this.dragging = false;
    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.currentLineColor;
    this.group;
    this.invaders;
    // path = new Phaser.Curves.Path(0, 0);
    this.linePath;
    // this.ray = new Phaser.Geom.Line();
    this.draw3 = new Draw3({
      rows: 6,
      columns: 6,
      // items: 5,
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

    this.input.on('pointerdown', this.gemSelect, this);
    this.input.on('pointermove', this.drawPath, this);
    this.input.on('pointerup', this.removeGems, this);
  }

  score() {
    this.timeOutScore.setText(`SCORE: ${this.scoreValue}`);
  }

  drawField() {
    let colors = this.draw3.getColors(); // array counts
    let counter = 0;
    console.log(this.draw3);
    for (let i = 0; i < this.draw3.getRows(); i++) {
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        let posX = config.boardOffset.x + config.dotSize * j + config.dotSize / 2;
        let posY = config.boardOffset.y - config.boardOffset.y * 5 + config.dotSize * i + config.dotSize / 2;
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
        gem.on('pointerdown', this.eventClick.bind(this, gem));
      }
    }
  }
  eventClick(gem) {
    this.currentLineColor = gem.fillColor;
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

        // this.linePath = new Phaser.Curves.Path(this.draw3.chain[0].x, this.draw3.chain[0].y);

        this.line.setTo(
          this.draw3.chain[0].x,
          this.draw3.chain[0].y,
          this.draw3.chain[0].x,
          this.draw3.chain[0].y,
        );
        // // this.graphics.clear();
        this.graphics.lineStyle(10, this.draw3.chain[0].color);
        this.graphics.strokeLineShape(this.line);

        //  Create some invaders
        this.group = this.add.group({ key: 'invader', frame: 0 });
        this.invaders = this.group.getChildren();

        //  Phaser.Actions.GridAlign(this.group.getChildren(), this.line);
      }
    }
  }
  drawPath(pointer) {
    if (this.dragging) {
      let row = Math.floor((pointer.y - config.boardOffset.y) / config.dotSize);
      let col = Math.floor((pointer.x - config.boardOffset.x) / config.dotSize);

      if (this.draw3.validPick(row, col)) {
        // if(this.currentLineColor === this.draw3.chain[0].color){
        // this.graphics.lineStyle(10, this.draw3.chain[0].color);
        // this.graphics.strokeLineShape(this.ray);

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
                if (chainLength > 1) {
                  let x1 = chain[chainLength - 2].x,
                    y1 = chain[chainLength - 2].y;
                  this.graphics.lineBetween(x1, y1, x2, y2);
                } else {
                  this.graphics.clear();
                }
                this.graphics.lineStyle(10, chain[0].color);
                this.graphics.strokeLineShape(this.line);
              }
            }
            //==============================================
            // let chainLength = this.draw3.chain.length;
            // let chain = this.draw3.chain;
            // if (chainLength > 0) {
            //   for (let i = 0; i < chainLength; i++) {
            //     let x2 = chain[chainLength - 1].x,
            //       y2 = chain[chainLength - 1].y;

            //     this.linePath.lineTo(x2, y2);
            //     this.graphics.lineStyle(10, chain[0].color);
            //   }
            // }

            // this.linePath.draw(this.graphics);
          } else {
            if (this.draw3.backtracksChain(row, col)) {
              let removedItem = this.draw3.removeLastChainItem();

              let chainLength = this.draw3.chain.length;
              let chain = this.draw3.chain;
              // if (chainLength > 1) {
              this.graphics.clear();
              // console.log('line', this.line )
              // console.log('graphics', this.graphics )
              // console.log('group', this.group);
              // console.log('group children', this.group.getChildren());
              var invader = Phaser.Utils.Array.GetRandom(this.invaders);
              console.log('invader', invader);
              // if (invader)
              // {
              //     //  Then destroy it. This will fire a 'destroy' event that the Group will hear
              //     //  and then it'll automatically remove itself from the Group.
              //     invader.destroy();
              // }
              // this.linePath.draw(this.graphics);
              // }
            }
          }
          // }
        }
      }
    }
  }

  removeGems() {
    if (this.dragging) {
      this.graphics.clear();
      this.currentLineColor = null;

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
