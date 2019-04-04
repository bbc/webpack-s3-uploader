import * as FileHelper from '../../src/helpers/file-helper';
import { expect } from 'chai';

describe('--- FileHelper ---', () => {

  describe('.getExtension()', () => {

    it('returns the correct file extension', () => {
      expect(FileHelper.getExtension('iamafile.png')).to.equal('png');
    });

    it('returns the correct file for multiple dots in filename', () => {
      expect(FileHelper.getExtension('iamafile.whateves.hola.map')).to.equal('map');
    });

    it('returns filename when no file extension', () => {
      expect(FileHelper.getExtension('iamafilewithnoextension')).to.equal('iamafilewithnoextension');
    });

  });

  describe('.isValidFile()', () => {
    const WHITELIST = ['js', 'css', 'map'];

    it('returns true for a valid file name', () => {
      expect(FileHelper.isValidFile('hello.js', WHITELIST)).to.be.true;
    });

    it('returns true for a css file', () => {
      expect(FileHelper.isValidFile('hello.css', WHITELIST)).to.be.true;
    });

    it('returns true for a valid file name with multiple dots', () => {
      expect(FileHelper.isValidFile('hello.js.map', WHITELIST)).to.be.true;
    });

    it('returns false for an invalid file name', () => {
      expect(FileHelper.isValidFile('hello.json', WHITELIST)).to.be.false;
    });

    it('returns true for a valid file name with non normalised extension', () => {
      expect(FileHelper.isValidFile('hello.js', WHITELIST)).to.be.true;
      expect(FileHelper.isValidFile('hello.JS     ', WHITELIST)).to.be.true;
    });

  });

  describe('.getContentType()', () => {

    it('returns the content type for a .js file', () => {
      expect(FileHelper.getContentType('hello.js')).to.equal('application/javascript');
    });

    it('returns the content type for a .map file', () => {
      expect(FileHelper.getContentType('hello.map')).to.equal('application/json');
    });

    it('returns the default content type for any other file', () => {
      expect(FileHelper.getContentType('hello.any')).to.equal('application/octet-stream');
    });

  });

});
