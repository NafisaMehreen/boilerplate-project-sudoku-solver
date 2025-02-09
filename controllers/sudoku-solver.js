class SudokuSolver {

  validate(puzzle) {
   
    if (!puzzle) {
      return "Required field missing";
    }
    if (puzzle.length !== 81) {
      console.log(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."));
      return "Expected puzzle to be 81 characters long" ;
    }
    if (!/^[0-9.]*$/.test(puzzle)) {
      return "Invalid characters in puzzle";
    }
    return "Valid";
  }

  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return -1;
    }
  }

  checkRowPlacement(puzzle, row, column, value) {
    let grid = this.stringToBoard(puzzle);
    row = this.letterToNumber(row);
    // if (grid[row - 1][column - 1] !== 0){
    //   return false;
    // }
    for (let i = 0; i < 9; i++){
      if (grid[row - 1][i] === value){
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzle, row, column, value) {
    let grid = this.stringToBoard(puzzle);
    row = this.letterToNumber(row);
    // if (grid[row - 1][column - 1] !== 0){
    //   return false;
    // }
    for (let i = 0; i < 9; i++){
      if (grid[i][column - 1] === value){
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    let grid = this.stringToBoard(puzzle);
    row = this.letterToNumber(row);
    let startRow = row - (row%3),
      startCol = column - (column%3);
    for (let i = 0; i<3; i++){
      for (let j = 0; j<3; j++){
        if (grid[i + startRow][j + startCol] === value){
          return false;
        }
      }
    }
    return true;
  }

  stringToBoard(sudokuString) {
    const SIZE = 9;
    const board = [];

    for (let row = 0; row < SIZE; row++) {
      const start = row * SIZE;
      const end = start + SIZE;
      board[row] = sudokuString.substring(start, end).split("");
    }
    return board;
  }

  solveSol(board) {
    const SIZE = 9;
    const BOX_SIZE = 3;
    const EMPTY = ".";

    function canPlace(board, row, column, num) {
      for (let x = 0; x < SIZE; x++) {
        if (board[row][x] === num || board[x][column] === num) {
          return false;
        }
      }

      const startRow = row - (row % BOX_SIZE);
      const startCol = column - (column % BOX_SIZE);
      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          if (board[i + startRow][j + startCol] === num) {
            return false;
          }
        }
      }
      return true;
    }

    function solve(board) {
      for (let row = 0; row < SIZE; row++) {
        for (let column = 0; column < SIZE; column++) {
          if (board[row][column] === EMPTY) {
            for (let num = 1; num <= SIZE; num++) {
              if (canPlace(board, row, column, num.toString())) {
                board[row][column] = num.toString();
                if (solve(board)) {
                  return true;
                }
                board[row][column] = EMPTY;
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    return solve(board) ? board : false;
  }

  completeSudoku(puzzle) {
    // Validate puzzle length and characters first
    if (puzzle.length !== 81) {
      console.log('Invalid puzzle length');
      return false;  // Immediately return false if length is not 81
  }

  // Then check for any invalid characters (anything other than digits 1-9 or dot)
  if (/[^1-9.]/.test(puzzle)) {
      console.log('Invalid characters in puzzle');
        return false; // Return false for invalid length
    }
    if (/[^1-9.]/.test(puzzle)) {
        return false; // Return false if there are invalid characters
    }

    // Proceed with solving if the puzzle is valid
    const board = this.stringToBoard(puzzle);
    const solverBoard = this.solveSol(board);

    if (!solverBoard) {
        return false; // Handle unsolvable puzzles
    }

    return solverBoard.flat().join(""); // Return solved puzzle as a string
}


}

module.exports = SudokuSolver;

