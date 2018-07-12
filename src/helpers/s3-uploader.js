import AWS from 'aws-sdk';
import fs from 'fs';
import * as FileHelper from './file-helper';

const config = {
  get: () => 'hello'
};

/**
 * @param {object} s3 - The AWS S3 object
 * @param {string} dir - The directory where the file lives
 * @param {string} file - The file name
 * Reads the raw data of the file and then
 * uploads it to s3
 * @return bool
 */
const pushFile = (s3, dir, file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${dir}/${file}`, (err, data) => {
      if (err) {
        return reject(err);
      }

      // S3 expects raw data
      const base64data = new Buffer(data, 'binary');

      // Asset key
      const key = `${config.get('s3.bucketPrefix')}/${file}`;

      // Push object up to s3
      s3.putObject({
        Bucket: config.get('s3.bucket'),
        Key: key,
        ACL: config.get('s3.acl'),
        CacheControl: config.get('s3.cacheControl'),
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

/**
 * @param {string} dir - The directory the file lives
 * @param {object} webpackStats - The webpack stats after build completion
 * Used to loop through the files webpack creates and push the
 * assets up to S3.
 * @return Promise
 */
export const upload = (dir, compilation) => {
  const { assets } = compilation;

  const s3 = new AWS.S3({
    region: config.get('s3.region'),
    httpOptions: {
      timeout: 240000,
      connectTimeout: 240000
    }
  });

  return new Promise((resolve, reject) => {
    const filePromises = Object.keys(assets).filter(FileHelper.isValidFile).map((file) => pushFile(s3, dir, file));

    Promise.all(filePromises)
      .then((files) => resolve({ files, message: 'Successfully uploaded files' }))
      .catch((err) => reject({ message: err.message }));
  });
};
