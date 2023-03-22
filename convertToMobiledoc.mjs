import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import JSZip from 'jszip';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  const users = fs.readdirSync(`${__dirname}/src/content/authors`);
  return users.map((userFile, index) => {
    const markdown = fs.readFileSync(
      `${__dirname}/src/content/authors/${userFile}`,
      'utf8'
    );
    const slug = `${userFile.replace('.mdx', '')}`;
    const data = markdownToJson(markdown);
    return {
      slug,
      id: index + 3,
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
}

/**
 * Export posts from `blog` folder.
 *
 * @param {Array} users
 * @returns {Array} an array of post objects compatible with Ghost.
 */
export function exportPosts(users) {
  const posts = fs.readdirSync(`${__dirname}/src/content/blog`);
  return posts.map((postFile, index) => {
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
      data.published_by = author.id;
    }

    return data;
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

export async function initExport() {
  // create a directory called .mobiledoc if it doesn't exist
  if (!fs.existsSync(`${__dirname}/.ghost`)) {
    fs.mkdirSync(`${__dirname}/.ghost`);
  }

  const users = exportUsers();
  const posts = exportPosts(users);
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
    },
  };

  // write to a file, and create that file if it doesn't exist
  // the file name is the same as the post's name, but ends in .json
  fs.writeFileSync(
    `${__dirname}/.ghost/migrationFromNext.json`,
    JSON.stringify(db, null, 2),
    { flag: 'w' }
  );
}

(async () => {
  console.log('initializing export...');
  await initExport();
  console.log('export completed');
  console.log('Open Ghost Dashboard -> Settings -> Labs');
  console.log('Import .ghost/images.zip and migrationFromNext.json');
})();
