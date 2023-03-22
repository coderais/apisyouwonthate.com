import fs from 'fs';
import * as Convert from './convertToMobiledoc.mjs';

describe('convertToMobiledoc', () => {
  describe('markdownToJson()', () => {
    it('should return an object with data parsed from markdown', () => {
      const markdown = fs.readFileSync(
        `${__dirname}/src/content/blog/api-design-first-vs-code-first.mdx`,
        'utf8'
      );
      const data = Convert.markdownToJson(markdown);
      expect(typeof data).toEqual('object');
      expect(data.title).toEqual('API Design-First vs Code First');
      expect(data.content.length > 100).toEqual(true);
      expect(typeof data.mobiledoc).toEqual('string');
      // console.log('data', data);
    });

    it('should extract author info', async () => {
      const markdown = fs.readFileSync(
        `${__dirname}/src/content/authors/alexander-karan.mdx`,
        'utf8'
      );
      const data = Convert.markdownToJson(markdown);
      expect(typeof data).toEqual('object');
      expect(data.name).toEqual('Alexander Karan');
      expect(data.shortName).toEqual('Alexander');
      expect(data.content.length > 100).toEqual(true);
      // console.log('data', data);
    });
  });

  describe('exportUsers()', () => {
    it('should return an array with users information', async () => {
      const users = Convert.exportUsers();

      expect(Array.isArray(users)).toEqual(true);
      expect(!users.find((u) => !u.id)).toEqual(true); // All user objects should have ID
      // console.log('users:', users);
    });
  });

  describe('exportPosts()', () => {
    it('should return an array with posts information', async () => {
      const users = Convert.exportUsers();
      const posts = Convert.exportPosts(users);

      expect(Array.isArray(posts)).toEqual(true);
      expect(!posts.find((p) => !p.id)).toEqual(true); // All user objects should have ID
      // console.log('posts:', posts);
    });
  });

  describe('exportImages()', () => {
    it('should export all the images', async () => {
      await Convert.exportImages();
      expect(fs.lstatSync(`${__dirname}/.ghost/images.zip`).isFile()).toEqual(
        true
      );
    });
  });
});
