class Cell {
  constructor(arg) {
    this.collapsed = false;
    if(arg instanceof Array) {
      this.options = arg;
      return;
    }
    
    this.options = [...Array(arg).keys()]; 
  }
}
