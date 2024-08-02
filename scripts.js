// Constructors
function Player(name, marker) {
  this.name = name;
  this.marker = marker;
}

function GameBoard() {
  const boardSize = 3;
  let board = [];
  
  const getBoardSize = () => boardSize;
  const getBoard = () => board;

  const createNewBoard = () => {
    board = [];
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        board[i].push(".");
      }
    }
  };

  const putMarker = (player, row, col) => {
    board[row][col] = player.marker;
  };
  
  // Create the initial board
  createNewBoard();

  return {getBoardSize, getBoard, createNewBoard, putMarker};
}

function GameController(
  playerOneName = "Player One", 
  playerTwoName = "Player Two"
) {
  const players = [
    new Player(playerOneName, "X"),
    new Player(playerTwoName, "O")
  ];

  let currentPlayer = players[0];
  let turn = 0;
  const board = GameBoard();
  const boardSize = board.getBoardSize();


  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    turn++;
    currentPlayer = players[turn % 2];
  };

  const getPlayerNameByMarker = (marker) => {
    if (marker === "X") {
      return players[0].name;
    }
    else if (marker === "O") {
      return players[1].name;
    }
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
    for (let i = 0; i < boardSize; i++) {
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
    if (turn >= 9) {
      return 3;
    }
    // Game still running
    return 0;
  }

  const playRound = (row, col) => {
    if (board.getBoard()[row][col] === ".") {
      board.putMarker(currentPlayer, row, col);
      switchTurn();
    }
  };

  const restartGame = () => {
    turn = 0;
    currentPlayer = players[0];
    board.createNewBoard();
  };

  return {playRound, checkStatus, getCurrentPlayer, getPlayerNameByMarker, restartGame, getBoard: board.getBoard, getBoardSize: board.getBoardSize};
}

function DisplayController() {
  let gameStatus = 0;
  const game = GameController();

  const gameBoardDiv = document.querySelector(".game-board");
  const textDisplayDiv = document.querySelector(".text-display");
  const restartBtn = document.querySelector(".restart-btn");

  const blueColor = "#0284c7";
  const redColor = "#e63946";
  const yellowColor = "#fbbf24";

  const updateScreen = () => {
    // clear the board
    gameBoardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const currentPlayer = game.getCurrentPlayer();
    // Render current player's turn
    textDisplayDiv.style.color = "#000";
    textDisplayDiv.textContent = `${currentPlayer.name}'s turn!`;

    const boardSize = game.getBoardSize();
    // Render board cells
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const boardCell = document.createElement("button");
        boardCell.classList.add("board-cell");
        boardCell.setAttribute("row", i);
        boardCell.setAttribute("col", j);
        boardCell.textContent = board[i][j] !== "." ? board[i][j] : "";
        if (boardCell.textContent === "X") {
          boardCell.style.color = blueColor;
        }
        else if (boardCell.textContent === "O") {
          boardCell.style.color = redColor;
        }
        gameBoardDiv.appendChild(boardCell);
      }
    }
  };

  const endScreen = () => {
    // Show Restart Button
    restartBtn.style.display = "inline-block";
    // the first player (X) won
    if ((gameStatus === 1)) {
      textDisplayDiv.textContent = `Game Result: ${game.getPlayerNameByMarker("X")} Won!`;
      textDisplayDiv.style.color = blueColor;
    }
    // the second player (O) Won
    else if ((gameStatus === 2)) {
      textDisplayDiv.textContent = `Game Result: ${game.getPlayerNameByMarker("O")} Won!`;
      textDisplayDiv.style.color = redColor;
    }
    else {
      textDisplayDiv.textContent = "Game Result: Draw!";
      textDisplayDiv.style.color = yellowColor;
    }
  };
  
  // Restart button click event handler
  restartBtn.addEventListener("click", () => {
    // Clear the board and update the screen
    game.restartGame();
    updateScreen();
    // Hide restart button
    restartBtn.style.display = "none";

    gameBoardDiv.addEventListener("click", clickBoardHandler);
  });
 
  // Game board event handler
  const clickBoardHandler = (event) => {
    const row = event.target.getAttribute("row");
    const col = event.target.getAttribute("col");
    // Make sure a cell is clicked not the gaps in between
    if (!row || !col) return;
    // put X or O on the clicked cell
    game.playRound(row, col);
    // update the screen with the last move
    updateScreen();
    gameStatus = game.checkStatus();
    // If the game ended (win, lose or draw) display the result and remove click handler
    if (gameStatus !== 0) {
      endScreen();
      gameBoardDiv.removeEventListener("click", clickBoardHandler);
    }
  };
  gameBoardDiv.addEventListener("click", clickBoardHandler);

  // Initial render
  updateScreen();
}

DisplayController();
