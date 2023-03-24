/**
 * Convert from MDX to Ghost.
 * Before doing anything, you need to:
 * 1. Copy example.env file to .env.
 * 2. Open .env file in your text editor and change variables
 *
 * @usage node ./convertToMobiledoc.mjs
 * @usage To auto import to Ghost using REST API: node ./convertToMobiledoc.mjs --auto
 * @file
 */
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import JSZip from 'jszip';
import axios from 'axios';
import FormData from 'form-data';
import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export const GHOST_API = process.env.GHOST_API;
const GHOST_SITE = process.env.GHOST_SITE;
const GHOST_USER = process.env.GHOST_USER;
const GHOST_PASSWORD = process.env.GHOST_PASSWORD;

// All users except for these will be given "contributor" role
export const ADMIN_USERS = process.env.ADMIN_USERS.split(',');

let currentGhostCookie;

/**
 * Login to Ghost blog and save the cookie.
 * @returns {Promise<String>} ghost admin api session key
 */
export async function createGhostUserSession() {
  if (currentGhostCookie) {
    return currentGhostCookie;
  }

  const resp = await axios.post(
    `${GHOST_API}/session/`,
    {
      username: GHOST_USER,
      password: GHOST_PASSWORD,
    },
    {
      headers: {
        Origin: GHOST_SITE,
        'Accept-Version': 'v3.0',
      },
      withCredentials: true,
    }
  );

  return resp.headers['set-cookie'][0]
    .split(';')
    .find((r) => r.includes('ghost-admin-api-session'));
}

/**
 * @param {Object} options - axios options
 * @returns {Object} axios result
 */
export async function requestGhostApi(options) {
  const cookie = await createGhostUserSession();
  const axiosOptions = Object.assign(
    {
      method: 'GET',
      headers: {
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; rv:110.0) Gecko/20100101 Firefox/110.0`,
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Ghost-Version': '5.39',
        'App-Pragma': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
        DNT: '1',
        Connection: 'keep-alive',
        Referer: `${GHOST_SITE}/ghost/`,
        Cookie: `${cookie}`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
    },
    options
  );
  return await axios(axiosOptions);
}

const convertToMobiledoc = (markdown) => {
  const mobiledoc = JSON.stringify({
    version: '0.3.1',
    markups: [],
    atoms: [],
    cards: [['markdown', { cardName: 'markdown', markdown }]],
    // cards: [
    //   [
    //     'markdown',
    //     { cardName: 'markdown', markdown: 'markdown content goes here...' },
    //   ],
    // ],

    sections: [[10, 0]],
  });

  return mobiledoc;
};

/**
 * Extract metadata from a markdown string.
 *
 * @param {String} markdown
 * @returns {Object}
 */
export function markdownToJson(markdown) {
  const header = markdown.match(/---\n([\s\S]*?)\n---/);
  let metadata = {};

  // If the header is not empty, use YAML parser to extract metadata
  if (header && header.length > 1) {
    metadata = yaml.load(header[1]);
    if (metadata['date']) {
      metadata['date'] = new Date(metadata['date']).valueOf();
    }
  }

  let mobiledoc;
  const content = markdown
    .replace(/---\n([\s\S]*?)\n---/, '')
    .replace(/\/images\/posts/g, '/content/images/posts');

  if (content && content.length) {
    mobiledoc = convertToMobiledoc(content);
  }

  return { ...metadata, content, mobiledoc };
}

/**
 * Export users from `authors` folder.
 *
 * @returns {Array} an array of user objects compatible with Ghost
 */
export function exportUsers() {
  let userFiles = fs.readdirSync(`${__dirname}/src/content/authors`);

  const users = userFiles.map((userFile, index) => {
    const markdown = fs.readFileSync(
      `${__dirname}/src/content/authors/${userFile}`,
      'utf8'
    );
    const slug = `${userFile.replace('.mdx', '')}`;
    const data = markdownToJson(markdown);

    let id = index + 3;
    switch (data.name) {
      case ADMIN_USERS[0]:
        id = 1;
        break;
      case ADMIN_USERS[1]:
        id = 2;
        break;

      default:
        break;
    }

    return {
      slug,
      id,
      name: data.name,
      email: data.email || `${slug}@example.com`,
      profile_image: `/content/images/${data.photo}`,
      twitter: data.twitter ? `${data.twitter}` : null,
      bio: null,
      cover_image: null,
      website: null,
      location: null,
      accessibility: null,
      meta_title: null,
      meta_description: null,
      created_at: new Date().valueOf(), // epoch time in millis
      created_by: 1,
      updated_at: new Date().valueOf(), // epoch time in millis
      updated_by: 1,
    };
  });

  // Ignore admin users, don't export them
  // return users.filter((u) => !ADMIN_USERS.includes(u.name));
  return users;
}

/**
 * Fetch all the user roles from a Ghost blog.
 * @returns {Promise<Array<Object>>} array of roles
 */
export async function findUserRoles() {
  const resp = await requestGhostApi({
    method: 'GET',
    url: `${GHOST_API}/roles/?permissions=assign`,
  });

  return resp.data.roles;
}

/**
 * @param {String} name - the name of the role
 * @returns {Promise<Object|undefined>}
 */
export async function findUserRoleByName(name) {
  const roles = await findUserRoles();
  return roles ? roles.find((r) => r.name === name) : undefined;
}

/**
 * Find posts in a Ghost blog.
 *
 * @param {Number} limit
 * @param {Number} page
 * @returns {Promise<Object>}
 */
export async function findPosts(limit = 10, page = 1) {
  const resp = await requestGhostApi({
    url: `${GHOST_API}/posts/?formats=mobiledoc%2Clexical&limit=${limit}&page=${page}&filter=status%3Apublished`,
  });
  return resp.data;
}

/**
 * Find users in a Ghost blog.
 * @returns {Promise<Object>}
 */
export async function findUsers() {
  const resp = await requestGhostApi({
    url: `${GHOST_API}/users/?limit=all&include=roles`,
  });
  return resp.data;
}

/**
 * Make all users except for admin users contributors.
 *
 * @param {Array} users Ghost users
 * @returns {Promise<Array>} roles to users relation
 */
export async function exportRolesUsers(users) {
  const contributorRole = await findUserRoleByName('Contributor');
  const contributorRoleId = contributorRole.id;

  return users
    .filter((u) => !ADMIN_USERS.includes(u.name))
    .map((user) => {
      return { user_id: user.id, role_id: contributorRoleId };
    });
}

/**
 * Export posts from `blog` folder.
 *
 * @param {Array} users
 * @returns {Array} an array of post objects compatible with Ghost.
 */
export function exportPosts(users) {
  const postsFiles = fs.readdirSync(`${__dirname}/src/content/blog`);
  return postsFiles.map((postFile, index) => {
    const markdown = fs.readFileSync(
      `${__dirname}/src/content/blog/${postFile}`,
      'utf8'
    );
    const slug = `${postFile.replace('.mdx', '')}`;
    const meta = markdownToJson(markdown);

    const data = {
      slug,
      id: index + 1,
      title: meta.title,
      mobiledoc: meta.mobiledoc,
      feature_image: `/content/images/posts/${meta.coverImage}`,
      // excerpt: data.subtitle,
      created_at: meta.date,
      updated_at: meta.date,
      published_at: meta.date,
      status: 'published',
    };

    const author = users.find((u) => u.name === meta.author);
    if (author) {
      data.author_id = author.id;
      data.published_by = author.id;
    }

    return data;
  });
}

/**
 * @param {Array} posts
 * @param {Array} users
 * @returns {Array}
 */
export function exportPostsAuthors(posts, users) {
  return posts.map((post) => {
    return { post_id: post.id, user_id: post.author_id };
  });
}

/**
 * Export images to Ghost.
 * After completion, it creates a new Zip archive `images.zip` in .ghost folder.
 *
 * @returns {Promise<void>}
 */
export async function exportImages() {
  const zip = new JSZip();

  // Add author avatars into the zip archive
  const authors = fs.readdirSync(`${__dirname}/public/images/authors`);
  authors.forEach((authorImage) => {
    zip.file(
      authorImage,
      fs.readFileSync(`${__dirname}/public/images/authors/${authorImage}`)
    );
  });

  // Add post images into the archive
  const exportPostsImages = (relativePath = '') => {
    const dirPath = `${__dirname}/public/images/posts/${relativePath}`;
    let posts = [];
    try {
      posts = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch (error) {
      console.log('error:', error);
      return;
    }

    // Go through post images recursively following the folders
    posts.forEach((postImage) => {
      if (postImage.isDirectory()) {
        exportPostsImages(`${relativePath}${postImage.name}/`);
      } else {
        const zipPath = relativePath.length
          ? `images/posts/${relativePath}`
          : 'posts/';

        zip.file(
          `${zipPath}${postImage.name}`,
          fs.readFileSync(`${dirPath}/${postImage.name}`)
        );
      }
    });
  };

  exportPostsImages();

  const zipContent = await zip.generateAsync({ type: 'uint8array' });
  fs.writeFileSync(`${__dirname}/.ghost/images.zip`, zipContent);
}

/**
 * Check posts authors and if they are incorrect, fix them.
 * @param {Array} posts
 * @param {Array} users
 * @returns {Promise<Boolean>}
 */
export async function checkPostsAuthorsAndFix(posts, users) {
  const blogPosts = await findPosts(posts.length + 100);
  const importedPosts = blogPosts.posts.filter((p) =>
    posts.find((pl) => p.slug === pl.slug)
  );

  const invalidPosts = importedPosts.filter((p) => {
    const post = posts.find((pl) => p.slug === pl.slug);
    const user = users.find((u) => u.id === post.author_id);
    return p.primary_author.email !== user.email;
  });

  if (!invalidPosts.length) {
    return true;
  }

  const blogUsers = await findUsers();
  const promises = invalidPosts.map((blogPost) => {
    const post = posts.find((pl) => blogPost.slug === pl.slug);
    const user = users.find((u) => u.id === post.author_id);

    const blogUser = blogUsers.users.find((u) => u.slug === user.slug);

    return requestGhostApi({
      method: 'PUT',
      url: `${GHOST_API}/posts/${blogPost.id}/?formats=mobiledoc%2Clexical`,
      data: {
        posts: [
          {
            ...blogPost,
            primary_author: blogUser,
            authors: [blogUser],
          },
        ],
      },
    });
  });

  await Promise.all(promises);
  return true;
}

/**
 * @param {Array<Object>} users
 */
export async function checkUsersRolesAndFix(users) {
  const blogUsers = await findUsers();
  const importedUsers = blogUsers.users.filter((u) =>
    users.find((ul) => u.slug === ul.slug)
  );
  const invalidUsers = importedUsers.filter((u) => {
    return (
      !ADMIN_USERS.includes(u.name) &&
      u.roles.find((r) => r.name !== 'Contributor')
    );
  });

  if (!invalidUsers.length) {
    return true;
  }

  const role = await findUserRoleByName('Contributor');
  const promises = invalidUsers.map((user) => {
    return requestGhostApi({
      method: 'PUT',
      url: `${GHOST_API}/users/${user.id}/?include=roles`,
      data: {
        users: [
          {
            ...user,
            roles: [role],
          },
        ],
      },
    });
  });

  await Promise.all(promises);
  return true;
}

/**
 * Automatically upload any migration file to Ghost.
 * It is similar to uploading manually through Dashboard -> Settings -> Labs -> Open importer
 *
 * @param {String} data path of the file you want to import
 * @returns {Promise<Object>} result from axios
 */
export async function autoImportToGhost(dataPath) {
  const cookie = await createGhostUserSession();

  // Upload our local file
  const form = new FormData();
  form.append('importfile', fs.createReadStream(dataPath));

  const resp = await axios.post(`${GHOST_API}/db`, form, {
    headers: {
      ...form.getHeaders(),
      Referer: `${GHOST_SITE}/ghost/`,
      Cookie: `${cookie}`,
      Origin: GHOST_SITE,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; rv:110.0) Gecko/20100101 Firefox/110.0',
      Accept: 'text/plain, */*; q=0.01',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'X-Ghost-Version': '5.39',
      'App-Pragma': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
      DNT: '1',
      Connection: 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
  });

  return resp;
}

/**
 * @param {boolean} [shouldAutoImport]
 * @returns {Promise<Object>}
 */
export async function initExport(
  shouldAutoImport = process.argv[2] === '--auto'
) {
  // create a directory called .mobiledoc if it doesn't exist
  if (!fs.existsSync(`${__dirname}/.ghost`)) {
    fs.mkdirSync(`${__dirname}/.ghost`);
  }

  const users = exportUsers();
  const rolesUsers = await exportRolesUsers(users);
  const posts = exportPosts(users);
  const postsAuthors = exportPosts(posts, users);
  await exportImages();

  // create a database json in the format that Ghost expects
  const db = {
    meta: {
      exported_on: new Date().valueOf(),
      version: '5.38.0',
    },
    data: {
      posts,
      users,
      posts_authors: postsAuthors,
      roles_users: rolesUsers,
    },
  };

  // write to a file, and create that file if it doesn't exist
  // the file name is the same as the post's name, but ends in .json
  const migrationFile = `${__dirname}/.ghost/migrationFromNext.json`;
  fs.writeFileSync(migrationFile, JSON.stringify(db, null, 2), { flag: 'w' });

  // Auto import using REST API
  if (shouldAutoImport) {
    console.log('importing blog posts to Ghost...');
    await autoImportToGhost(migrationFile);

    console.log('fixing migration errors...');
    await checkPostsAuthorsAndFix(posts, users);
    await checkUsersRolesAndFix(users);

    console.log('importing images to Ghost...');
    await autoImportToGhost(`${__dirname}/.ghost/images.zip`);
  }

  return db;
}

(async () => {
  // Don't initialize import when running tests
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  console.log('initializing export...');
  await initExport();

  if (process.argv[2] !== '--auto') {
    console.log('export completed');
    console.log('Open Ghost Dashboard -> Settings -> Labs');
    console.log('Import .ghost/images.zip and migrationFromNext.json');
  } else {
    console.log(`successfully imported your data to ${GHOST_SITE}`);
  }
})();
