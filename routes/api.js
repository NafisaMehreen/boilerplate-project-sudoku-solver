'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle, coordinate, value} = req.body;
      if(!puzzle || !coordinate || !value) {
        return res.json({error: "Required field(s) missing"});
      }
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      if(solver.validate(puzzle) !== "Valid") {
        return res.json({error: solver.validate(puzzle)});
      }
      const row = coordinate.split("")[0];
      const column = coordinate.split("")[1];
      if(
        coordinate.length !== 2 || 
        !/[A-I]/.test(row) || 
        !/[1-9]/.test(column)
      ) {
        return res.json({error: "Invalid coordinate"});
      }
      let index = (solver.letterToNumber(row) - 1) * 9 + (+column - 1);
      if(puzzle[index] === value) {
        return res.json({valid: true});
      }
      let validCol = solver.checkColPlacement(puzzle, row, column, value);
      let validRow = solver.checkRowPlacement(puzzle, row, column, value);
      let validRegion = solver.checkRegionPlacement(puzzle, row, column, value);
      let conflicts = [];
      if (validCol && validRegion && validRow) {
        return res.json({valid: true});
      } else{
        if (!validRow) {
          conflicts.push("row");
        }
        if (!validCol) {
          conflicts.push("column");
        }
        if (!validRegion) {
          conflicts.push("region");
        }
        res.json({valid: false, conflict: conflicts});
      }
    });

    
    app.route('/api/solve')
    .post((req, res) => {
        const puzzle = req.body.puzzle;

        // Validate the puzzle string
        if (!puzzle) {
            return res.json({ error: "Required field missing" });
        }
        if (puzzle.length !== 81) {
            return res.json({ error: "Expected puzzle to be 81 characters long" });
        }
        if (/[^1-9.]/.test(puzzle)) {
            return res.json({ error: "Invalid characters in puzzle" });
        }

        // Attempt to solve the puzzle
        const solved = solver.completeSudoku(puzzle);

        // Handle validation errors from completeSudoku
        if (typeof solved === "string" && solved.startsWith("Invalid")) {
            return res.json({ error: solved }); // Ensures error is in the correct format
        }
        
        if (!solved) {
            return res.json({ error: "Puzzle cannot be solved" });
        }

        return res.json({ solution: solved });
    });

};
