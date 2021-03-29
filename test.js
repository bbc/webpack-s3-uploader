const fs = require('fs');
const path = '/Users/spaccs01/workspace/playground/webpack-plugin';
const subPath = '/Users/spaccs01/workspace/playground/webpack-plugin/dist/assets';
const diffPath = '...';


const pathExists = (p) => {
  try {
    fs.statSync(p);
    return true;
  } catch (e) {
    return false;
  }
};

const getBasePath = (path, subPath, diffPath) => {
  if (
    subPath.startsWith(`${path}/${diffPath}`) && pathExists(`${path}/${diffPath}`) && diffPath !== '') {
    return subPath.replace(`${path}/${diffPath}`, '');
  } else {
    return subPath.replace(path, '');
  }
}

console.log(getBasePath(path, subPath, diffPath));