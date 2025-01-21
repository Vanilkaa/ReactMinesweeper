import { useEffect, useState } from 'react'
import './App.css'
import genGrid from './grid'
import one from "./assets/1.png"
import two from "./assets/2.png"
import three from "./assets/3.png"
import four from "./assets/4.png"
import five from "./assets/5.png"
import six from "./assets/6.png"
import seven from "./assets/7.png"
import eight from "./assets/8.png"
import BOMB from "./assets/bomb.png"
import flag from "./assets/flag.png"
import { useStopwatch } from 'react-timer-hook'

function App() {

  const [height, setHeight] = useState(10);
  const [width, setWidth] = useState(10);
  const [minecount, setMinecount] = useState(20);
  const [grid, setGrid] = useState([]);
  const [cellState, setCellState] = useState(Array.apply(0, Array(width * height)));
  const [gameStatus, setGameStatus] = useState(0);
  const [pendingRevealIndex, setPendingRevealIndex] = useState(null);
  const [heightInput, setHeightInput] = useState(10);
  const [widthInput, setWidthInput] = useState(10);
  const [minecountInput, setMinecountInput] = useState(20);
  const [errorCell, setErrorCell] = useState(undefined);

  const { totalSeconds, start, pause, reset} = useStopwatch();

  useEffect(() => {
    if (cellState.filter((cell) => cell == 1).length == height * width - minecount) {
      pause();
      setGameStatus(2);
    }
    
    if (cellState.filter((cell, index) => cell == 1 && grid[index] == 9).length > 0) {
      pause();
      setGameStatus(3);
    }
  }, [cellState])

  useEffect(() => {
    if (gameStatus == 2) {
      setCellState((prevCellState) => prevCellState.map((cell, ind) => grid[ind] == 9 ? 2 : cell));
    }

    if (gameStatus == 3) {
      setCellState((prevCellState) => prevCellState.map((cell, ind) => cell == undefined && grid[ind] == 9 ? 1 : cell));
    }
  }, [gameStatus])

  function resetGame() {
    setGameStatus(0);
    setErrorCell(undefined);
    if (Number.isInteger(Number(heightInput)) && heightInput >= 0 && heightInput <= 50) setHeight(heightInput);
    if (Number.isInteger(Number(widthInput)) && widthInput >= 0 && widthInput <= 50) setWidth(widthInput);
    if (Number.isInteger(Number(minecountInput)) && minecountInput >= 0 && minecountInput <= height * width * 0.9) setMinecount(minecountInput);
    setGrid(Array.apply(0, Array(width * height)));
    setCellState(Array.apply(0, Array(width * height)));
    reset();
    pause();
  }

  function buttonImage(index) {
    if (cellState[index] == undefined) return;
    if (cellState[index] == 1) {
      switch (grid[index]) {
        case 0:
          return '';
        case 1:
          return one;
        case 2:
          return two;
        case 3:
          return three;
        case 4:
          return four;
        case 5:
          return five;
        case 6:
          return six;
        case 7:
          return seven;
        case 8:
          return eight;
        case 9:
          return BOMB;
      }
    }
    if (cellState[index] == 2) return flag;
  }

  function handleButton (index) {
    if (cellState[index] == undefined && grid[index] == 9) {
      setErrorCell(index);
    }

    if (gameStatus == 0) {
      setGrid(genGrid(index, height, width, minecount));
      setGameStatus(1);

      setPendingRevealIndex(index);
      return;
    }

    if (gameStatus == 3 || gameStatus == 2) return;

    revealCell(index);
  }

  function revealCell(index) {
    let visited = [];

    const neighbours = [
      -width - 1,
      -width,
      -width + 1,
      -1,
      +1,
      width - 1,
      width,
      width + 1,
    ]

    function revealNeighbours(cell) {
      if (visited.includes(cell)) return;
      visited.push(cell);

      for (let i = 0; i < 8; i++) {
        if (cell % width == 0) {
          if (i == 0 || i == 3 || i == 5) continue;
        }
        if (cell % width == width - 1) {
          if (i == 2 || i == 4 || i == 7) continue;
        }

        if (grid[cell] != 0 && cellState[cell + neighbours[i]] == 2) continue;

        setCellState((prevCellState) => prevCellState.map((v, ind) => ind == cell + neighbours[i] ? 1 : v))

        if (grid[cell + neighbours[i]] == 0) revealNeighbours(cell + neighbours[i]);
      }

    }

    let flags = 0;

    for (let i = 0; i < 8; i++) {
        if (index % width == 0) {
          if (i == 0 || i == 3 || i == 5) continue;
        }

        if (index % width == width - 1) {
          if (i == 2 || i == 4 || i == 7) continue;
        }

        if (cellState[index + neighbours[i]] == 2) flags++;
    }

    if (flags == grid[index]) revealNeighbours(index);

    if (grid[index] == 0) revealNeighbours(index);

    setCellState((prevCellState) => prevCellState.map((v, ind) => ind == index ? 1 : v))
    } 

    useEffect(() => { if (pendingRevealIndex != null) {
      reset();
      revealCell(pendingRevealIndex);
      setPendingRevealIndex(null);
    }
  }, [grid, pendingRevealIndex]);


  return (
    <div className={'container'}>
    <button onClick={resetGame} className="panel" >
      <div className="mines">{minecount - cellState.filter((cell) => cell == 2).length}</div>
      <div className="status">{gameStatus == 0 || gameStatus == 1 ? '🙂': gameStatus == 2 ? '😎' : '💀'}</div>
      <div className="time">{totalSeconds}</div>
    </button>
    <div className="board" style={{gridTemplateColumns : `repeat(${width}, 1fr)`}}>
      {Array.apply(null, Array(height*width)).map((num, index) => {
        return (
        <button
          key={index}
          onClick={() => handleButton(index)}
          className={errorCell == index ? 'error' : grid[index] == 9 ? "bomb" : cellState[index] == undefined ? 'zero' : cellState[index] == 1 ? 'one' : 'two'}
          style={{width : `${80/width}vh`, aspectRatio : '1/1', backgroundImage : `url(${buttonImage(index)})`, backgroundSize : grid[index] == 9 && cellState[index] == 1 ? '75%' : '50%', backgroundPosition : 'center', backgroundRepeat : 'no-repeat'}}
          onContextMenu={(e) => {
            e.preventDefault();
            if (gameStatus == 3 || gameStatus == 2) return;
            if (cellState[index] == undefined) {
              setCellState((prevCellState) => prevCellState.map((v, i) => i == index ? 2 : v));
              return;
            }
            if (cellState[index] == 2) {
              setCellState((prevCellState) => prevCellState.map((v, i) => i == index ? undefined : v));
              return;
            }
          }}
        ></button>)}
      )}
    </div>
    <div className="settings">
      <div className="input">
        <label htmlFor="height" className='height'></label>
        <input type="text" className="height" name='height' onChange={(e) => setHeightInput(+e.target.value)} placeholder={'10'}/>
      </div>
      <div className="input">
        <label htmlFor="wdith" className='width'></label>
        <input type="text" className="width" name='width' onChange={(e) => setWidthInput(+e.target.value)} placeholder={'10'}/>
      </div>
      <div className="input">
        <label htmlFor="minecount" className='minecount'></label>
        <input type="text" className="minecount" name='minecount' onChange={(e) => setMinecountInput(+e.target.value)} placeholder={'20'}/>
      </div>
    </div>
    </div>
  )
}

export default App
