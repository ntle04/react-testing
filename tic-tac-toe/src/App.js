import { useState } from 'react';

export default function Game() {
  let [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // Track the sort order
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((squares, move) => {
    const position = [Math.floor(move / 3), (move % 3)];

    let description;
    if (move > 0) {
      description = `Go to move #${move} at position (${position[0]}, ${position[1]})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const orderedMoves = isAscending ? moves : moves.slice().reverse();

  function changeMoveHistoryOrder() {
    setIsAscending(!isAscending);
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board currentMove={currentMove} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <button onClick={changeMoveHistoryOrder}>
          {'sort move history'}
        </button>
        <ol>{orderedMoves}</ol>
        <div>{'You are at move #' + currentMove}</div>
      </div>
    </div>
  )
}

function Board({ currentMove, xIsNext, squares, onPlay }) {
  const [winner, winning_squares] = calculateWinner(squares);
  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  let status;
  let winners = Array(9);
  if (winner) {
    status = 'Winner: ' + winner;
    for (const i of winning_squares) {
      winners.splice(i, 1, true);
    }

  }
  else if (currentMove == 9) {
    status = 'Draw!'
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isHighlighted={winners[0]} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isHighlighted={winners[1]} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isHighlighted={winners[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isHighlighted={winners[3]} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isHighlighted={winners[4]} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isHighlighted={winners[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isHighlighted={winners[6]} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isHighlighted={winners[7]} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isHighlighted={winners[8]} />
      </div>
    </>
  );
}

function Square({ value, onSquareClick, isHighlighted }) {

  if (isHighlighted)
    return (
      <button
        className="highlighted-square"
        onClick={() => {
          console.log('Square clicked!');
          onSquareClick();
        }}
      >
        {value}
      </button>
    );

  return (
    <button
      className="square"
      onClick={() => {
        console.log('Square clicked!');
        onSquareClick();
      }}
    >
      {value}
    </button>);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return [null, null];
}








