export function calcTip(total, tipPercent = 0.15) {
  return total + total * tipPercent;
}

export function add(num1, num2) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof num1 === "number" && typeof num2 === "number") {
        resolve(num1 + num2);
      } else {
        reject(new Error("Both arguments must be number"));
      }
    }, 2000);
  });
}
