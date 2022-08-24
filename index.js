const {
  Engine,
  Render,
  Runner,
  World,
  Bodies
} = Matter;

const cells = 3;
const width = 600;
const height = 600;
const unitLength = width / cells;

const engine = Engine.create();
const {
  world
} = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width,
    height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);


// Walls
const walls = [
  //top
  Bodies.rectangle(width/2, 0, width, 40, {
    isStatic: true
  }),
  // bottom
  Bodies.rectangle(width/2, height, width, 40, {
    isStatic: true
  }),
  // left
  Bodies.rectangle(0, height/2, 40, height, {
    isStatic: true
  }),
  // right
  Bodies.rectangle(width, height/2, 40, height, {
    isStatic: true
  }),
];
World.add(world, walls);

// Maze generation

const shuffle =(arr) => {

  let counter = arr.length;

  while(counter > 0){
    const index = Math.floor(Math.random() * counter);
    counter --;
     const temp = arr[counter];
     arr[counter] = arr[index];
     arr[index] = temp;
  }
  return arr;
}

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells-1).fill(false));
const horizontals = Array(cells-1)
  .fill(null)
  .map(() => Array(cells).fill(false));

// for(let i = 0; i < 3; i++){
//   grid.push([]);
//   for(let j = 0; j < 3; j++){
//     grid[i].push(false);
//   }
// }

console.log(verticals, horizontals );

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  // If i have visited the cell, then return
  if(grid[row][column]){
    return;
  }

  // Mark this cell as being visited
  grid[row][column] = true;

  //Assamble randomly-ordered list of neighbor
  const neighbors = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left']
  ]);
  
  // For each neighbor....
  for(let neighbor of neighbors){
    const [nextRow, nextCoulumn, direction] = neighbor;

  //  See if the neighbor is out of baunce
  if(nextRow < 0 || nextRow >= cells || nextCoulumn < 0 || nextCoulumn >= cells){
    continue;
  }

  // If we have visited then neighbor continue to next
  if(grid[nextRow][nextCoulumn]){
    continue;
  }

  // remove a wall from either horizontal or verticales
  if(direction === 'left'){
    verticals[row][column-1] = true;
  }else if(direction === 'right'){
    verticals[row][column] = true;
  }else if(direction === 'up'){
    horizontals[row-1][column] = true;
  }else if(direction === 'down'){
    horizontals[row][column] = true;
  }
  stepThroughCell(nextRow, nextCoulumn)

  }
  // Visit that next cell
}

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex )=> {
  row.forEach((open, columnIndex) => {
    if(open){
      return
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      10,
      {
        isStatic: true
      }
    );
    World.add(world, wall);
  })
});

verticals.forEach((row, rowIndex) => {
  row
})