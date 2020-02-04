const p2 = "bar";

const obj = {
  p1: "foo",
  m1: function() {
    console.log(p2);
    return this.p1;
  },
  m1a: () => {
    return p2;
  },
  m2: () => this.p1, 
  m2b: () => {
    return this.p1;
  } 
}

console.log(obj.m1())(1+1);
console.log(obj.m1a())
console.log(obj.m2())