import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
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

// grab posts from the posts directory: /src/content/blog
const postsInMarkdown = fs.readdirSync(`${__dirname}/src/content/blog`);

// convert each post to a mobiledoc
const posts = postsInMarkdown.map((post) => {
  const slug = `${post.replace('.mdx', '')}`;
  const markdown = fs.readFileSync(
    `${__dirname}/src/content/blog/${post}`,
    'utf8'
  );

  // remove the frontmatter
  const markdownContent = markdown.replace(/---\n([\s\S]*?)\n---/, '');

  const mobiledoc = convertToMobiledoc(markdownContent);

  // grab title from the post's frontmatter
  let title = markdown.match(/title: (.*)/)[1].trim();

  // remove leading and trailing quote and apostrophes from title
  title = title.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

  // grab date from the post's frontmatter
  let date = markdown
    .match(/date: (.*)/)[1]
    .trim()
    .replace(/^"(.*)"$/, '$1')
    .replace(/^'(.*)'$/, '$1');

  date = new Date(date).valueOf();

  // grab subtitle from markdown, if it exists

  let subtitle = markdown.match(/subtitle: (.*)/);
  if (subtitle) {
    // if the first line contains >-, read until the next line that contains a word ending in a colon

    if (subtitle[1].trim().startsWith('>-')) {
      subtitle = markdown.match(/subtitle: >-\n([\s\S]*?)\n(\w*):/);
    }

    subtitle = subtitle[1].trim();
    subtitle = subtitle.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }

  const postObject = {
    title,
    mobiledoc,
    // excerpt: subtitle,
    slug,
    published_at: date,
    status: 'published',
  };

  // console.log(postObject);
  return postObject;
});

// create a database json in the format that Ghost expects
const db = {
  meta: {
    exported_on: new Date().valueOf(),
    version: '5.38.0',
  },
  data: {
    posts,
  },
};

// create a directory called .mobiledoc if it doesn't exist

if (!fs.existsSync(`${__dirname}/.ghost`)) {
  fs.mkdirSync(`${__dirname}/.ghost`);
}

// write to a file, and create that file if it doesn't exist
// the file name is the same as the post's name, but ends in .json
fs.writeFileSync(
  `${__dirname}/.ghost/migrationFromNext.json`,
  JSON.stringify(db, null, 2),
  { flag: 'w' }
);
