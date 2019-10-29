function getFibonator() {
    let previousEl = 0;
    let current = 1;

    return function() {
        const result = previousEl + current;
        previousEl = current;
        current = result;

        return previousEl;
    }
}

let fib = getFibonator();
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());
