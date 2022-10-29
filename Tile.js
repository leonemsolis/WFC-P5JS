class Tile {
  constructor(img, edges) {
    this.img = img;
    this.edges = edges;
    
    this.up = [];
    this.right = [];
    this.down = [];
    this.left = [];
  }
  
  analyze(tiles) {
    let compareEdges = (a, b) => {
      let reverseString = (s) => {
        const arr = s.split("");
        return arr.reverse().join("");
      };
      return a == reverseString(b);
    };
    
    var i = 0;
    for(let other of tiles) {
      // up connections
      if(compareEdges(this.edges[0], other.edges[2])) {
        this.up.push(i);
      }
      // right connections
      if(compareEdges(this.edges[1], other.edges[3])) {
        this.right.push(i);
      }
      // down connections
      if(compareEdges(this.edges[2], other.edges[0])) {
        this.down.push(i);
      }
      // left connections
      if(compareEdges(this.edges[3], other.edges[1])) {
        this.left.push(i);
      }
      i++;
    }
    
  }
  
  rotate(num) {
    const iw = this.img.width;
    const ih = this.img.height;
    const newImage = createGraphics(iw, ih);
    newImage.imageMode(CENTER);
    newImage.translate(iw / 2, ih / 2);
    newImage.rotate(HALF_PI * num);
    newImage.image(this.img, 0, 0);
    
    const newEdges = [];
    const len = this.edges.length;
    for(let i = 0; i < len; i++) {
      newEdges[i] = this.edges[(i - num + len) % len];
    }
    return new Tile(newImage, newEdges);
  }
}
