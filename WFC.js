const SIZE = 20;

const tiles = [];
let grid = [];

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const rules = [
  [
    [BLANK, UP],
    [BLANK, RIGHT],
    [BLANK, DOWN],
    [BLANK, LEFT],
  ],
  [
    [RIGHT, LEFT, DOWN],
    [LEFT, UP, DOWN],
    [BLANK, DOWN],
    [RIGHT, UP, DOWN],
  ],
  [
    [RIGHT, LEFT, DOWN],
    [LEFT, UP, DOWN],
    [RIGHT, LEFT, UP],
    [BLANK, LEFT],
  ],
  [
    [BLANK, UP],
    [LEFT, UP, DOWN],
    [RIGHT, LEFT, UP],
    [RIGHT, UP, DOWN],
  ],
  [
    [RIGHT, LEFT, DOWN],
    [BLANK, RIGHT],
    [RIGHT, LEFT, UP],
    [UP, DOWN, RIGHT],
  ],
];

function preload() {
  tiles[0] = loadImage("tiles/demo/blank.png");
  tiles[1] = loadImage("tiles/demo/up.png");
  tiles[2] = loadImage("tiles/demo/right.png");
  tiles[3] = loadImage("tiles/demo/down.png");
  tiles[4] = loadImage("tiles/demo/left.png");
}

function setup() {
   createCanvas(800, 800);
   
   for(let i = 0; i < SIZE * SIZE; i++) {
     grid[i] = {
       collapsed: false,
       options: [BLANK, UP, RIGHT, DOWN, LEFT]
     };
   }
}

function draw() {
  background(0);
  
  const cellWidth = width / SIZE;
  const cellHeight = height / SIZE;
  
  for(let j = 0; j < SIZE; j++) {
    for(let i = 0; i < SIZE; i++) {
      let cell = grid[i + j * SIZE];
      if(cell.collapsed) {
        image(tiles[cell.options[0]], i * cellWidth, j * cellHeight, cellWidth, cellHeight); 
      } else {
        fill(0);
        stroke(255);
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  let gridNoCollapsed = grid.filter((cell) => !cell.collapsed);
  if(gridNoCollapsed.length == 0) {
    return;
  }
  
  const min = Math.min.apply(Math, gridNoCollapsed.map((cell) => cell.options.length));
  let gridCopy = gridNoCollapsed.filter((cell) => cell.options.length == min);
  console.table(gridCopy);
  
  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = random(cell.options);
  cell.options = [pick];
  
  
  //console.table(grid);
  
  
  
  
  
  
  const nextGrid = [];
  for(let j = 0; j < SIZE; j++) {
    for(let i = 0; i < SIZE; i++) {
      let index = i + j * SIZE;
      if(grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        var options = [BLANK, UP, RIGHT, DOWN, LEFT];
        
        // LOOK UP
        if(j > 0) {
          let up = grid[i + (j - 1) * SIZE];
          let validOptions = [];
          for(let option of up.options) {
            let valid = rules[option][2];
            validOptions = validOptions.concat(valid);
          }
          getValidOptions(options, validOptions);
        }
        
        // LOOK RIGHT
        if(i < SIZE - 1) {
          let right = grid[i + 1 + j * SIZE];
          let validOptions = [];
          for(let option of right.options) {
            let valid = rules[option][3];
            validOptions = validOptions.concat(valid);
          }
         getValidOptions(options, validOptions);
        }
        // LOOK DOWN
        if(j < SIZE - 1) {
          let down = grid[i + (j + 1) * SIZE];
          let validOptions = [];
          for(let option of down.options) {
            let valid = rules[option][0];
            validOptions = validOptions.concat(valid);
          }
          getValidOptions(options, validOptions);
        }
        
        // LOOK LEFT
        if(i > 0) {
          let left = grid[i - 1 + j * SIZE];
          let validOptions = [];
          for(let option of left.options) {
            let valid = rules[option][1];
            validOptions = validOptions.concat(valid);
          }
          getValidOptions(options, validOptions);
        }
        
        nextGrid[index] = {
          options,
          collapsed: false,
        };
      }
    }
  }
  
  grid = nextGrid;
  
  //noLoop(0);
}


function getValidOptions(arr, valid) {
  //console.log(arr, valid);
  for (let i = arr.length - 1; i >= 0; i--) {
    // VALID: [BLANK, RIGHT]
    // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
    // result in removing UP, DOWN, LEFT
    let element = arr[i];
    // console.log(element, valid.includes(element));
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
  // console.log(arr);
  // console.log("----------");
  
  
  // why code above differs from this?
  //arr = arr.filter((item) => valid.includes(item));
}
