export default function genGrid(start) {

  const height = 32;
  const width = 19;

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

  let grid = [];

  for (let i = 0; i < height * width; i++) {
    grid.push(Math.random() > 0.2 ? 0 : 9);
  }

  grid[start] = 0;

  for (let i = 0; i < height * width; i++) {
    if (grid[i] == 9) continue;

    let family = 0;

    for (let j = 0; j < 8; j++) {
      if (grid[i + neighbours[j]] == 9) family++;
    }

    grid[i] = family;
  }

  return grid;
}

