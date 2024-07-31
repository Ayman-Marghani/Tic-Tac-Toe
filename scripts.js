/*
TODO: objects: 
* Game board (1) 
* Game Controller (1) [Players array (2) - board] 
* displayController (1)
TODO: Single instance -> wrap the factory inside an IIFE
*/

// Constructors
function Player(name, marker) {
  this.name = name;
  this.marker = marker;
}

function GameBoard() {
  let rows = 3;
  let cols = 3;
  let board = [];
 
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(".");
    }
  }

  const getBoard = () => board;

  const putMarker = (player, row, col) => {
    if (board[row][col] === ".") {
      board[row][col] = player.marker;
    }
  };

  const printBoard = () => {
    for (let i = 0; i < rows; i++) {
      let printedRow = "";
      for (let j = 0; j < cols; j++) {
        printedRow += " " + board[i][j];
      }
      console.log(printedRow);
    }
  };

  return {getBoard, putMarker, printBoard};
}

function GameController(
  playerOneName = "Player One", 
  playerTwoName = "Player Two"
) {
  let turn = 0;
  const board = GameBoard();

  const players = [
    new Player(playerOneName, "X"),
    new Player(playerTwoName, "O")
  ];

  let currentPlayer = players[0];

  const switchTurn = () => {
    turn++;
    currentPlayer = players[turn % 2];
  };

  const checkStatus = () => {
    const boardArr = board.getBoard();
    // Check Diagonals
    if (boardArr[0][0] === boardArr[1][1] && boardArr[1][1] === boardArr[2][2] ||
        boardArr[0][2] === boardArr[1][1] && boardArr[1][1] === boardArr[2][0]
    ) {
      if (boardArr[1][1] === "X") {
        return 1;
      }
      else if (boardArr[1][1] === "O") {
        return 2;
      }
    }
    // Check Rows & Columns
    for (let i = 0; i < 3; i++) {
      // Check Rows
      if (boardArr[i][0] === boardArr[i][1] && boardArr[i][1] === boardArr[i][2]) {
        if (boardArr[i][1] === "X") {
          return 1;
        }
        else if (boardArr[i][1] === "O") {
          return 2;
        }
      }
      // Check Columns
      if (boardArr[0][i] === boardArr[1][i] && boardArr[1][i] === boardArr[2][i]) {
        if (boardArr[1][i] === "X") {
          return 1;
        }
        else if (boardArr[1][i] === "O") {
          return 2;
        }
      }
    }
    // Check Draw
    if (turn >= 8) {
      return 3;
    }
    
    return 0;
  }
  /*
  1 1 1 
  1 1 1
  7 8 9
  */

  const printNewRound = () => {
    board.printBoard();
    console.log(`${currentPlayer.name}'s turn!`);
  };

  const playRound = (row, col) => {
    board.putMarker(currentPlayer, row, col);
    console.log(`${currentPlayer.name} is playing`);

    switchTurn();
    printNewRound();
  };

  printNewRound();

  return {playRound, checkStatus};
}

function DisplayController() {
  const game = GameController();
  let gameStatus = 0;

  const endScreen = () => {
    // Player one won
    console.log("Result: Player one won");
    // Player two won
    console.log("Result: Player two won");
    // Draw
    console.log("Result: Draw");

  };
 
  const updateDisplay = () => {
    while(gameStatus === 0) {
      let row = parseInt(prompt("Enter row: "));
      let col = parseInt(prompt("Enter col: "));
      game.playRound(row, col);
      gameStatus = game.checkStatus();
    } 
    endScreen();
  };

  updateDisplay();
}

DisplayController();
