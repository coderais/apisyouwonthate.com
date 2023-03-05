// Install gray-matter and date-fns
import matter from 'gray-matter';
import { compareDesc } from 'date-fns';
import fs from 'fs';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';

import { parseTag } from './tags';

import mdxOptions from '../utils/mdxOptions';

export async function getContentBySlug(slug, directory, type) {
  const realSlug = slug.toLowerCase().replace(/\.mdx$/, '');
  const fullPath = join(directory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const articleDate = new Date(data.date);

  let mdxSource = '';
  try {
    mdxSource = await serialize(content, mdxOptions);
  } catch (error) {
    console.error('Error serializing MDX', error);
    mdxSource = await serialize('', mdxOptions);
  }

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date: articleDate?.toUTCString() ?? undefined,
      tags: data?.tags?.map((tag) => parseTag(tag)) || [],
      type,
    },
    content,
    source: mdxSource,
  };
}

export async function getAllContentFromDirectory(directory, type, slim = true) {
  const slugs = fs.readdirSync(directory);
  const articles = await Promise.all(
    slugs.map(async (slug) => await getContentBySlug(slug, directory, type))
  );

  // sort posts by date,  newest first
  articles.sort((a, b) =>
    compareDesc(new Date(a?.frontmatter?.date), new Date(b?.frontmatter?.date))
  );

  return articles.map((article) => {
    // remove content and source from the "all content" query, so index pages don't get super heavy
    const { source: _, ...trimmedArticle } = article;

    return slim ? trimmedArticle : article;
  });
}
