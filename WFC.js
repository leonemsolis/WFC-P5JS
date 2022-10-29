const SIZE = 20;

const tileImages = [];
const tiles = [];
let grid = [];

function preload() {
  const path = "tiles/circuit";
  for(let i = 0; i < 13; i++) {
    tileImages.push(loadImage(`${path}/${i}.png`));
  }
}

function setup() {
   createCanvas(800, 800);
   
   // Loaded & created the tiles
   tiles.push(new Tile(tileImages[0],   ["AAA","AAA","AAA","AAA"]));
   tiles.push(new Tile(tileImages[1],   ["BBB","BBB","BBB","BBB"]));
   tiles.push(new Tile(tileImages[2],   ["BBB","BCB","BBB","BBB"]));
   tiles.push(new Tile(tileImages[3],   ["BBB","BDB","BBB","BDB"]));
   tiles.push(new Tile(tileImages[4],   ["ABB","BCB","BBA","AAA"]));
   tiles.push(new Tile(tileImages[5],   ["ABB","BBB","BBB","BBA"]));
   tiles.push(new Tile(tileImages[6],   ["BBB","BCB","BBB","BCB"]));
   tiles.push(new Tile(tileImages[7],   ["BDB","BCB","BDB","BCB"]));
   tiles.push(new Tile(tileImages[8],   ["BDB","BBB","BCB","BBB"]));
   tiles.push(new Tile(tileImages[9],   ["BCB","BCB","BBB","BCB"]));
   tiles.push(new Tile(tileImages[10],  ["BCB","BCB","BCB","BCB"]));
   tiles.push(new Tile(tileImages[11],  ["BCB","BCB","BBB","BBB"]));
   tiles.push(new Tile(tileImages[12],  ["BBB","BCB","BBB","BCB"]));
   
   
   for(let i = 2; i < 11; i++) {
     tiles.push(tiles[i].rotate(1));
     tiles.push(tiles[i].rotate(2));
     tiles.push(tiles[i].rotate(3));
   }
   
   // Generate the adjecency rules based on edges
   tiles.forEach(tile => tile.analyze(tiles));
   
   startOver();
}

function startOver() { 
   // Create cell for each spot on the grid
   for(let i = 0; i < SIZE * SIZE; i++) {
     grid[i] = new Cell(tiles.length);
   }
}

function draw() {
  // Draw current grid
  background(0);
  const cellWidth = width / SIZE;
  const cellHeight = height / SIZE;
  for(let j = 0; j < SIZE; j++) {
    for(let i = 0; i < SIZE; i++) {
      let cell = grid[i + j * SIZE];
      if(cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * cellWidth, j * cellHeight, cellWidth, cellHeight); 
      } else {
        fill(0);
        stroke(255);
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  // Check if grid fully collapsed
  let gridNoCollapsed = grid.filter((cell) => !cell.collapsed);
  if(gridNoCollapsed.length == 0) {
    noLoop(0);
    return;
  }
  
  // Collapse grid
  const min = Math.min.apply(Math, gridNoCollapsed.map((cell) => cell.options.length));
  let gridCopy = gridNoCollapsed.filter((cell) => cell.options.length == min);
  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = random(cell.options);
  if(pick === undefined) {
    startOver();
    return;
  }
  cell.options = [pick];
    
  const nextGrid = [];
  for(let j = 0; j < SIZE; j++) {
    for(let i = 0; i < SIZE; i++) {
      let index = i + j * SIZE;
      if(grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        var options = [...Array(tiles.length).keys()];
        // LOOK UP
        if(j > 0) {
          let up = grid[i + (j - 1) * SIZE];
          let validOptions = [];
          for(let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          options = getValidOptions(options, validOptions);
        }
        
        // LOOK RIGHT
        if(i < SIZE - 1) {
          let right = grid[i + 1 + j * SIZE];
          let validOptions = [];
          for(let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
         options = getValidOptions(options, validOptions);
        }
        // LOOK DOWN
        if(j < SIZE - 1) {
          let down = grid[i + (j + 1) * SIZE];
          let validOptions = [];
          for(let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          options = getValidOptions(options, validOptions);
        }
        
        // LOOK LEFT
        if(i > 0) {
          let left = grid[i - 1 + j * SIZE];
          let validOptions = [];
          for(let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          options = getValidOptions(options, validOptions);
        }
        nextGrid[index] = new Cell(options);
      }
    }
  }
  
  grid = nextGrid;
  
  //noLoop(0);
}


function getValidOptions(arr, valid) {
  //console.log("--------------");
  //console.log("V: ", valid);
  //console.log("A: ", arr);
  //for (let i = arr.length - 1; i >= 0; i--) {
  //  // VALID: [BLANK, RIGHT]
  //  // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
  //  // result in removing UP, DOWN, LEFT
  //  let element = arr[i];
  //  // console.log(element, valid.includes(element));
  //  if (!valid.includes(element)) {
  //    arr.splice(i, 1);
  //  }
  //}
  
  
   //why code above differs from this?
   
  return arr.filter((item) => valid.includes(item));
  //console.log("B: ", arr);
}
