// @ts-ignore
const _ = require('lodash');

let aaa;
let count;
const results = [];
const RUNS = 10000;

for (let i = 0; i < RUNS; i++) {
  aaa = [];
  count = 0;

  do {
    const rnd = _.random(1, 10);
    aaa = [...aaa, rnd];
    aaa = _.uniq(aaa);
    count++;
  } while (aaa.length < 10);

  results.push(count);
}

const obj = {
  count: RUNS,
  min: _.min(results),
  avg: _.mean(results),
  max: _.max(results)
};

console.log(obj);
