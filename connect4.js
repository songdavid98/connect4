/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = Array.from(Array( WIDTH ), () => new Array( HEIGHT ));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById("board");

  // create a clickable top row with cells with id of 0 through WIDTH - 1
  let top = document.createElement("tr");
  top.setAttribute("id", "row-top");
  top.addEventListener("mousedown", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create all table cells with id of 0-0 though HEIGHT-1 - WIDTH-1
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT-1; y > -1; y--) {
    console.log(x, y);
    console.log(board[x][y]);
    if ( board[x][y] == null ) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement("div");
  let cl = 1 == currPlayer ? "player1" : "player2";
  piece.classList.add( cl );
  piece.classList.add( "piece" );
  const cell = document.getElementById( `${y}-${x}` );
  console.log( cell );
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert( msg );
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  // + implicit logic converts string to integer
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[x][y] = currPlayer;

  checkForEnd();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // brute force checks all 4 directions at all positions on the board.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function checkForEnd() {
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // simply checks top row if it is empty for tie
  let isDraw = true;
  for (let i = 0; i < WIDTH - 1; i++) {
    if ( board[i][0] == null ) { 
      isDraw = false;
      break; 
    }
  }
  if ( isDraw ) {
    return endGame("This is a draw");
  }

  // switch players
  currPlayer = 1 == currPlayer ? 2 : 1;
}

makeBoard();
makeHtmlBoard();
