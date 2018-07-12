// File extensions we want to upload to s3
const EXTENSION_WHITELIST = ['js', 'css', 'map', 'svg', 'ico', 'png'];

/**
 * @param {string} file - The file name
 * Outputs extension of a file
 * @return string
 */
export const getExtension = (file) => {
  return file.split('.').pop();
};

/**
 * @param {string} file - The file name
 * Validates the file extension against the whitelist
 * @return bool
 */
export const isValidFile = (file) => {
  const extension = getExtension(file);
  return EXTENSION_WHITELIST.indexOf(extension) >= 0;
};

/**
 * @param {string} file - The file name
 * Outputs the content type of the file
 * @return string
 */
export const getContentType = (file) => {
  if (getExtension(file) === 'js') {
    return 'application/javascript';
  }

  if (getExtension(file) === 'css') {
    return 'text/css';
  }

  return 'application/octet-stream';
};
