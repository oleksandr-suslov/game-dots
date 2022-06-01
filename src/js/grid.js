// import colors from "./config";

const colors = [0xff0000, 0xffff00, 0x008000, 0x0000ff, 0x800080]; // hex

export default class Draw3 {
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