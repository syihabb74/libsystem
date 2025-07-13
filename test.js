let a = [1,2,1];
let b = {};

let c = a.find((e) => {
    if (e === 2) {
        return {test : e}
    }
})

console.log(c)

console.log(Array.isArray(a))
console.log(Array.isArray(b))