export const getQueryParam = (name: string) => {
  // 获取 URL 中的 query 参数部分
  const queryString = window.location.search.substring(1);
  // 将 query 参数部分拆分成一个个的参数对
  const queryPairs = queryString.split('&');
  // 遍历参数对，查找指定参数的值
  for (let i = 0; i < queryPairs.length; i++) {
    // 将参数对拆分成参数名和参数值
    const queryPair = queryPairs[i].split('=');
    // 判断参数名是否与指定参数的名称相同
    if (decodeURIComponent(queryPair[0]) === name) {
      return decodeURIComponent(queryPair[1]);
    }
  }
  // 如果遍历完所有参数对都没有找到指定参数，则返回 undefined
  return undefined;
};

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
