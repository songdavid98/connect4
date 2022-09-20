/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor( p1, p2, width = 7, height = 6 ) {
    this.players = [p1, p2];
    this.WIDTH = width;
    this.HEIGHT = height;
    this.currPlayer = p1;
    this.board = [];
    this.createStartButton();
    this.gameOver = false;
  }

  resetVariables() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    const p1Color = document.getElementById('p1-color').value;
    const p2Color = document.getElementById('p2-color').value;
    let p1 = new Player(p1Color);
    let p2 = new Player(p2Color);
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.board = [];
    this.gameOver = false;
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('mousedown', this.handleClick.bind(this) );

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }


  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer.color;
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {
    if (this.gameOver) {
      return;
    }
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    console.log( this.currPlayer );
    console.log( this.players[0] );
    console.log( this.currPlayer === this.players[0] );
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];;
  }

  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        const winHelper = _win.bind(this);
        if (winHelper(horiz) || winHelper(vert) || winHelper(diagDR) || winHelper(diagDL)) {
          this.gameOver = true;
          return true;
        }
      }
    }
  }

  createStartButton() {
    const g = document.getElementById('game');
    const b = document.createElement('button');
    b.innerHTML = 'Start or Restart';
    b.addEventListener('mousedown', this.startGame.bind(this) );
    g.append(b);
  }

  startGame() {
    this.resetVariables();
    this.makeBoard();
    this.makeHtmlBoard();
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}
let p1 = new Player('red');
let p2 = new Player('blue');
new Game(p1, p2, 6, 7);