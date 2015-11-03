// The .bind method from Prototype.js
Function.prototype.bind = function(){
    var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
    return function(){
        return fn.apply(object,
            args.concat(Array.prototype.slice.call(arguments)));
    };
};
var color = 'red';
var fn1 = function(){
    console.log(this.color);
}

fn1();

var Obj = function(){
    this.color = 'blue';
};

var ins = new Obj();

var fn2 = fn1.bind(ins);
fn2();