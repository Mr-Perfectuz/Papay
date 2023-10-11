/*

I-Task:

Shunday function tuzing, u bir array argument qilib qabul qilib, osha arrayning 0 index qiymatni arrayning oxiriga qoyib return qilsin


masalan: getCompute(['h', 'e', 'l', 'l', 'o']) return qilishi kerak ['e', 'l', 'l', 'o', 'h'] */

function getCompute(arr) {
  let index_zero = arr.splice(0, 1);
  arr.push(index_zero.join(""));
  console.log(arr);
}
getCompute(["h", "e", "l", "l", "o"]);
