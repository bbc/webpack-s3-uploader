import AWS from 'aws-sdk';
import fs from 'fs';
import * as FileHelper from './file-helper';

/**
 * @param {object} options - The plugin options
 * @param {object} s3 - The AWS S3 object
 * @param {string} file - The file name
 * Reads the raw data of the file and then
 * uploads it to s3
 * @return bool
 */
const pushFile = (options, s3, file) => {
  const { directory, basePath, s3UploadOptions } = options;
  return new Promise((resolve, reject) => {
    fs.readFile(`${directory}/${file}`, (err, data) => {
      if (err) {
        return reject(err);
      }

      // S3 expects raw data
      const base64data = new Buffer(data, 'binary');

      // Asset key
      const key = `${basePath}/${file}`;

      // Push object up to s3
      s3.putObject({
        ...s3UploadOptions,
        Key: key,
        ContentType: FileHelper.getContentType(file),
        Body: base64data
      }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve({
          uploadSuccess: true,
          message: 'Successfully uploaded: ' + file
        });
      });
    });
  });
};

const test = (key, data, s3, options) => {
  const { s3UploadOptions } = options;

  console.log('============ test ============');
  console.log(`key: ${key}`);
  console.log('============ test ============');

  return new Promise((resolve, reject) => {
    resolve();
    // Push object up to s3
    // s3.putObject({
    //   ...s3UploadOptions,
    //   Key: key,
    //   ContentType: FileHelper.getContentType(key),
    //   // (node:9560) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
    //   Body: Buffer.from(data, 'binary')
    // }, (err) => {
    //   if (err) {
    //     return reject(err);
    //   }
    //   resolve({
    //     message: `Successfully uploaded: ${file}`
    //   });
    // });
  });
};

/**
 * @param {object} options - The plugin options
 * @param {object} webpackStats - The webpack stats after build completion
 * Used to loop through the files webpack creates and push the
 * assets up to S3.
 * @return Promise
 */
export const upload = (pluginOptions, compilation) => {
  const { extensions, s3Options, assetsDirectory, keyNamePrefix} = pluginOptions;
  const { assets, options } = compilation;

  const s3 = new AWS.S3({
    ...s3Options
  });

  const assetsFolder = FileHelper.getDiffPath(options.context, options.output.path, assetsDirectory);

  return new Promise((resolve, reject) => {
    resolve({ message: 'Succesfully' })
    const filePromises = Object.keys(assets)
      .filter((file) => FileHelper.isWhitelisted(file, extensions))
      .map((file) => test(`${keyNamePrefix}/${assetsFolder}/${file}`, assets[file]._value, s3, pluginOptions));

    Promise.all(filePromises)
      .then((files) => resolve({ files, message: 'Successfully uploaded files' }))
      .catch((err) => reject({ message: err.message }));
  });
};
