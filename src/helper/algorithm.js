/**
 * chrome v8 实现
 */
/*
// ECMA 262 - 15.8.2.14
	var rngstate;  // Initialized to a Uint32Array during genesis.
	function MathRandom() {
		var r0 = (MathImul(18030, rngstate[0] & 0xFFFF) + (rngstate[0] >>> 16)) | 0;
		rngstate[0] = r0;
		var r1 = (MathImul(36969, rngstate[1] & 0xFFFF) + (rngstate[1] >>> 16)) | 0;
		rngstate[1] = r1;
		var x = ((r0 << 16) + (r1 & 0xFFFF)) | 0;
		// Division by 0x100000000 through multiplication by reciprocal.
		return (x < 0 ? (x + 0x100000000) : x) * 2.3283064365386962890625e-10;
	} 
*/

/**
 * 取范围内随机整数
 * @param {number} minNum
 * @param {number} maxNum
 */
export function randomNum(minNum = 1, maxNum) {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}
/**
 * 单次抽奖
 * @param {number} total 总人数
 * @param {array} won 已中奖
 * @param {number} num 本次抽取人数
 */
export function luckydrawHandler(total, won = [], num) {
  const peolist = [];
  for (let i = 1; i <= total; i++) {
    peolist.push(i);
  }

  const wons = won;

  const res = [];
  for (let j = 0; j < num; j++) {
    const nodraws = peolist.filter(item => !wons.includes(item));
    const current = nodraws[randomNum(1, nodraws.length) - 1];
    res.push(current);
    wons.push(current);
  }
  return res;
}

export function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
}

export function getRepeatNum(arr) {
  return arr.reduce((prev, next) => {
    prev[next] = (prev[next] + 1) || 1;
    return prev;
  }, {});
}

export function loadImages(files) {

  return new Promise((resolve, reject) => {
    let tobeload = 0;
    const data = [];

    files.forEach(file => {
      tobeload++;
      const reader = new FileReader();

      reader.onload = () => {
        tobeload--;
        data.push({ source: reader.result, filename: file.name });
        if (tobeload === 0) {
          resolve(data);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });

  });
}

export function loadImages2(files) {

  return new Promise((resolve, reject) => {
    let tobeload = 0;
    const data = [];

    files.forEach(file => {
      const url = URL.createObjectURL(file);
      tobeload++;
      const image = new Image();

      data.push({ source: url, filename: file.name });

      image.onload = () => {
        tobeload--;
        if (tobeload === 0) {
          resolve(data);
        }
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.src = url;
    });
  });
}
