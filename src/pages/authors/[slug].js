import Link from 'next/link';
import Image from "next/legacy/image";

import { serialize } from 'next-mdx-remote/serialize';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MDXRemote } from 'next-mdx-remote';

import {
  BlogPostItem,
  CarbonAd,
  Colophon,
  Layout,
  NewsletterCTA,
  Seo,
} from '../../components';

import { GitHubIcon, InstagramIcon, TwitterIcon } from '../../components/icons';

import { getAllAuthors, getAuthorBySlug } from '../../lib/authorLoader';
import { getAllPostsByAuthor } from '../../lib/blogPostLoader';

import mdxOptions from '../../utils/mdxOptions';

export async function getStaticPaths() {
  const authors = await getAllAuthors();

  return {
    paths: authors.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const author = await getAuthorBySlug(params.slug);

  const posts = await getAllPostsByAuthor(
    author.frontmatter.name || params.slug
  );

  const mdxSource = await serialize(author.content, mdxOptions);

  return {
    props: {
      slug: params.slug,
      author: {
        ...author,
        source: mdxSource,
      },
      posts,
    },
  };
}

const AuthorPage = ({ author, posts }) => {
  const {
    consultingUrl,
    github,
    instagram,
    isStaff,
    name,
    photo,
    shortName,
    shortBio,
    twitter,
  } = author.frontmatter;

  const pageTitle = `${name}, ${isStaff ? 'staff' : 'contributing'} author`;

  const authorImageUrl = `/images/authors/${photo}`;

  return (
    <Layout>
      <Seo title={pageTitle} description={shortBio} imageUrl={authorImageUrl} />
      <Container>
        <Stack>
          <Heading as="h1">{name}</Heading>
          <Grid
            gridTemplateColumns={['1fr', '1fr', '300px 1fr fit-content(130px)']}
            gap={8}
          >
            <Stack>
              <Image
                src={authorImageUrl}
                height="300"
                width="300"
                alt={`${name} headshot`}
              />
              {consultingUrl && (
                <Button>
                  <a
                    href={consultingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hire {shortName || name}
                  </a>
                </Button>
              )}
              {twitter && (
                <Link href={`https://twitter.com/${twitter}`}>
                  <a target="_blank" rel="noopener noreferrer">
                    <Stack direction="row" alignItems="center">
                      <TwitterIcon />
                      <Text>{twitter}</Text>
                    </Stack>
                  </a>
                </Link>
              )}
              {github && (
                <Link href={`https://github.com/${github}`}>
                  <a target="_blank" rel="noopener noreferrer">
                    <Stack direction="row" alignItems="center">
                      <GitHubIcon />
                      <Text>{github}</Text>
                    </Stack>
                  </a>
                </Link>
              )}
              {instagram && (
                <Link href={`https://instagram.com.com/${github}`}>
                  <a target="_blank" rel="noopener noreferrer">
                    <Stack direction="row" alignItems="center">
                      <InstagramIcon />
                      <Text>{instagram}</Text>
                    </Stack>
                  </a>
                </Link>
              )}
            </Stack>
            <Box fontSize={'lg'} mt={0}>
              <MDXRemote {...author.source} />
            </Box>
            <CarbonAd />
          </Grid>
          <Stack>
            {posts?.length > 0 && (
              <Heading as="h2" mt="2rem">
                {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}{' '}
                from {name}
              </Heading>
            )}
            <SimpleGrid minChildWidth="300px" spacing={8}>
              {posts.map((post) => (
                <BlogPostItem key={post.slug} post={post} />
              ))}
            </SimpleGrid>
            <Colophon />

            <Stack alignSelf={'center'}>
              <NewsletterCTA />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default AuthorPage;
