import 'phaser';
import Draw3 from './grid';
import config from '../index';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.canPick = true;
    this.dragging = false;
    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.lineZIndex = 10;
    this.currentLineColor;

    this.draw3 = new Draw3({
      rows: 6,
      columns: 6,
    });

    this.scoreValue = 0;
    this.scoreOfDot = 1;

    this.timeOutScore = this.add.text(250, 30, ` `, {
      align: 'right',
      fontSize: '20px',
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
  update() {
    this.input.on('pointermove', this.drawLine, this);
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
        gem.on('pointerdown', this.eventClick.bind(this, gem));
      }
    }
  }
  eventClick(gem) {
    this.currentLineColor = gem.fillColor;
    let row = Math.floor((gem.y - config.boardOffset.y) / config.dotSize);
    let col = Math.floor((gem.x - config.boardOffset.x) / config.dotSize);

    this.canPick = false;
    this.draw3.putInChain(row, col);
    // this.draw3.customDataOf(row, col).alpha = 0.5;
    this.dragging = true;
  }
  drawLine(pointer) {
    let chainLength = this.draw3.getChainLength();
    let chain = this.draw3.chain;

    if (chainLength && this.dragging === true) {
      this.graphics.clear();
      this.graphics.lineStyle(10, chain[0].color);
      this.graphics.strokeLineShape(this.line);

      this.graphics.beginPath();
      let x = chain[0].x,
        y = chain[0].y;

      this.graphics.moveTo(x, y, x, y);

      if (chainLength > 0) {
        for (let i = 1; i < chainLength; i++) {
          let x2 = chain[i].x,
            y2 = chain[i].y;

          this.graphics.lineTo(x2, y2);
        }
      }
      this.graphics.strokePath();

      let x1 = chain[chainLength - 1].x,
        y1 = chain[chainLength - 1].y,
        x2 = pointer.x,
        y2 = pointer.y;

      this.graphics.lineBetween(x1, y1, x2, y2);
      this.graphics.setDepth(this.lineZIndex);
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
          } else {
            if (this.draw3.backtracksChain(row, col)) {
              this.draw3.removeLastChainItem();
            }
          }
        }
      }
    }
  }

  removeGems() {
    if (this.dragging) {
      this.graphics.clear();
      this.dragging = false;
      if (this.draw3.getChainLength() < 2) {
        this.draw3.emptyChain();
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
