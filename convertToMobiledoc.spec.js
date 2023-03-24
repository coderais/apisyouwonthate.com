import fs from 'fs';
import * as Convert from './convertToMobiledoc.mjs';
import { execSync } from 'child_process';
import axios from 'axios';

jest.setTimeout(1000 * 40);

export async function refreshGhost() {
  execSync('ghost stop -d ./ghost');
  execSync('rm -rf ghost/content/data/ghost-local.db');
  execSync('ghost start -d ./ghost');
  axios({
    method: 'POST',
    url: `${Convert.GHOST_API}/authentication/setup/`,
    data: {
      setup: [
        {
          email: process.env.GHOST_USER,
          name: process.env.GHOST_USER,
          password: process.env.GHOST_PASSWORD,
          blogTitle: 'Test Blog',
        },
      ],
    },
  });
  return new Promise((resolve) => setTimeout(resolve, 1000 * 2));
}

// it('refresh ghost', async () => {
//   await refreshGhost();
// });

describe('convertToMobiledoc', () => {
  describe('createGhostUserSession()', () => {
    it('should return user session key', async () => {
      const result = await Convert.createGhostUserSession();
      expect(typeof result).toEqual('string');
      expect(result.length > 0).toEqual(true);
      // console.log('result', result);
    });
  });

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

  describe('exportRolesUsers()', () => {
    it('should assign contributor role to all users except for Mike and Phil', async () => {
      const users = Convert.exportUsers();
      const result = await Convert.exportRolesUsers(users, '');

      expect(Array.isArray(result)).toEqual(true);
      // expect(result.length).toEqual(users.length - 2);

      const resultKeys = result
        .flatMap((r) => Object.keys(r))
        .filter((value, index, arr) => arr.indexOf(value) === index);

      expect(resultKeys).toEqual(['user_id', 'role_id']);
      // expect(
      //   result.filter((r) => r.role_id !== Convert.CONTRIBUTOR_ROLE_ID).length
      // ).toEqual(0);
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

  describe('exportPostsAuthors', () => {
    it('should export the posts_authors relation', async () => {
      const users = Convert.exportUsers();
      const posts = Convert.exportPosts(users);
      const result = Convert.exportPostsAuthors(posts, users);
      expect(Array.isArray(result)).toEqual(true);

      const resultKeys = result
        .flatMap((r) => Object.keys(r))
        .filter((value, index, arr) => arr.indexOf(value) === index);

      expect(resultKeys).toEqual(['post_id', 'user_id']);
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

  describe('checkPostsAuthorsAndFix()', () => {
    it('should correctly assign authors', async () => {
      // refreshGhost();
      const users = Convert.exportUsers();
      const posts = Convert.exportPosts(users);

      let result;
      try {
        result = await Convert.checkPostsAuthorsAndFix(posts, users);
      } catch (error) {
        console.log('error:', error);
        expect(error).toEqual(undefined);
      }
      expect(result).toEqual(true);

      const blogPosts = await Convert.findPosts(posts.length + 100);
      const importedPosts = blogPosts.posts.filter((p) =>
        posts.find((pl) => p.slug === pl.slug)
      );
      const invalidPosts = importedPosts.filter((p) => {
        const post = posts.find((pl) => p.slug === pl.slug);
        const user = users.find((u) => u.id === post.author_id);
        return p.primary_author.email !== user.email;
      });
      expect(invalidPosts.length).toEqual(0);
    });
  });

  describe('checkUsersRolesAndFix()', () => {
    it('should correctly assign authors', async () => {
      // refreshGhost();
      const users = Convert.exportUsers();

      let result;
      try {
        result = await Convert.checkUsersRolesAndFix(users);
      } catch (error) {
        console.log('error:', error);
        expect(error).toEqual(undefined);
      }
      expect(result).toEqual(true);

      const blogUsers = await Convert.findUsers();
      const importedUsers = blogUsers.users.filter((u) =>
        users.find((ul) => u.slug === ul.slug)
      );
      const invalidUsers = importedUsers.filter((u) => {
        return (
          !Convert.ADMIN_USERS.includes(u.name) &&
          u.roles.find((r) => r.name !== 'Contributor')
        );
      });
      expect(invalidUsers.length).toEqual(0);
    });
  });

  describe('autoImportToGhost()', () => {
    it('should automatically upload the migration file', async () => {
      // refreshGhost();
      const db = await Convert.initExport(false);

      let result;
      try {
        result = await Convert.autoImportToGhost(
          `${__dirname}/.ghost/migrationFromNext.json`
        );
      } catch (error) {
        console.log('error:', error);
        expect(error).toEqual(undefined);
      }

      expect(result.status).toEqual(200);
      expect(result.data.problems.length).toEqual(0);

      const data = await Convert.findPosts(db.data.posts.length);
      expect(data.posts.length).toEqual(db.data.posts.length);

      const nonAdminPosts = data.posts.filter((p) =>
        p.authors.find((a) => a.id !== '1')
      );
      // console.log('nonAdminPosts:', nonAdminPosts);
      expect(nonAdminPosts.length).not.toEqual(0);
    });
  });
});
