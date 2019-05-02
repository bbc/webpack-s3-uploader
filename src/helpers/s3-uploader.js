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
      const base64data = Buffer.from(data, 'binary');

      // Asset key
      const key = `${basePath}/${file}`;

      // Push object up to s3
      s3.putObject(
        {
          ...s3UploadOptions,
          Key: key,
          ContentType: FileHelper.getContentType(file),
          Body: base64data
        },
        error => {
          if (error) {
            return reject(err);
          }
          resolve({
            uploadSuccess: true,
            message: `Successfully uploaded: ${file}`
          });
        }
      );
    });
  });
};

/**
 * @param {object} options - The plugin options
 * @param {object} webpackStats - The webpack stats after build completion
 * Used to loop through the files webpack creates and push the
 * assets up to S3.
 * @return Promise
 */
export const upload = (options, compilation) => {
  const { whitelist, s3Options } = options;
  const { assets } = compilation;

  const s3 = new AWS.S3({
    ...s3Options
  });

  return new Promise((resolve, reject) => {
    const filePromises = Object.keys(assets)
      .filter(file => FileHelper.isValidFile(file, whitelist))
      .map(file => pushFile(options, s3, file));

    Promise.all(filePromises)
      .then(files => resolve({ files, message: 'Successfully uploaded files' }))
      .catch(err => reject({ message: err.message }));
  });
};
