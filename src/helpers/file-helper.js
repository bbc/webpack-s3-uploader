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
export const isValidFile = (file, whitelist) => {
  const extension = getExtension(file);
  return whitelist.includes(extension);
};

const mimeTypes = {
  // HyperText Markup Language
  htm: 'text/html',
  html: 'text/html',
  // Cascading Style Sheets
  css: 'text/css',
  // Comma-separated values
  csv: 'text/csv',
  // OpenType font
  otf: 'font/otf',
  // TrueType Font
  ttf: 'font/ttf',
  // Web Open Font Format (WOFF)
  woff: 'font/woff',
  // Web Open Font Format (WOFF)
  woff2: 'font/woff2',
  // Graphics Interchange Format
  gif: 'image/gif',
  // Portable Network Graphics
  png: 'image/png',
  // JPEG images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  // Scalable Vector Graphics
  svg: 'image/svg+xml',
  // JavaScript
  js: 'application/javascript',
  // Javascript MAP file
  map: 'application/javascript',
  // JJavaScript Object Notation
  json: 'application/json',
  // Small Web Format (or Adobe Flash document)
  swf: 'application/x-shockwave-flash',
  // MS Embedded OpenType fonts
  eot: 'application/vnd.ms-fontobject'
};

const DEFAULT_MIME_TYPE = 'application/octet-stream';

/**
 * @param {string} file - The file name
 * Outputs the content type of the file
 * @return string
 */
export const getContentType = (file) => {
  const extension = getExtension(file);
  const mimeType = mimeTypes[extension];
  // if the mime type is defined in the mapping
  if (mimeType) {
    // return it
    return mimeType;
  }
  // otherwise return the default one
  return DEFAULT_MIME_TYPE;
};
