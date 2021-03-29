import { extname } from 'path';

/**
 * @param {string} file - The file name
 * Validates the file extension against the whitelist
 * @return bool
 */
export const isWhitelisted = (file, whitelist) => {
  return whitelist.includes(extname(file));
};

/**
 * @param {string} file - The file name
 * Outputs the content type of the file
 * @return string
 */
export const getContentType = (file) => {
  const extension = path.extname(file);
  
  if (extension === '.js') {
    return 'application/javascript';
  }

  if (extension === '.css') {
    return 'text/css';
  }

  if (extension === '.map') {
    return 'application/json';
  }

  return 'application/octet-stream';
};

const pathExists = (p) => {
  try {
    fs.statSync(p);
    return true;
  } catch (e) {
    return false;
  }
};

export const getDiffPath = (path, subPath, diffPath) => {
  if (
    subPath.startsWith(`${path}/${diffPath}/`) && pathExists(`${path}/${diffPath}`) && diffPath !== '') {
    return subPath.replace(`${path}/${diffPath}/`, '');
  } else {
    return subPath.replace(`${path}/`, '');
  }
}