
export default function genGrid(start, height, width, mineCount) {

  if (mineCount > height * width - 9) throw new Error("Too many mines!");

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

  function getRandInt(max) {
    return Math.floor(Math.random() * max);
  }

  function isNeighbour(cell, neighbour) {
    for (let i = 0; i < 8; i++) {
      if(cell == neighbour + neighbours[i]) return true;
    }
    return false;
  }

  let grid = new Array(width * height).fill(0);

  for (let i = 0; i < mineCount; i++) {
    while (true) {
      const cell = getRandInt(width * height);
      if (cell == start || grid[cell] == 9 || isNeighbour(cell, start)) continue;
      grid[cell] = 9;
      break;
    }
  }

  for (let i = 0; i < height * width; i++) {
    if (grid[i] == 9) continue;

    let family = 0;

    for (let j = 0; j < 8; j++) {
      if (i % width == 0) {
        if (j == 0 || j == 3 || j == 5) continue;
      }

      if (i % width == width - 1) {
        if (j == 2 || j == 4 || j == 7) continue;
      }

      if (grid[i + neighbours[j]] == 9) family++;
    }

    grid[i] = family;
  }

  return grid;
}

/*
let a = genGrid(61, 100, 100, 9991);

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    process.stdout.write(`${a[i * 100 + j]} `);
  }
  process.stdout.write('\n');
}
  */