import React from 'react';
import Link from 'next/link';

import {
  Container,
  Grid,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';

import {
  BlogPostItem,
  BookFeature,
  CarbonAd,
  FeaturedBlogPost,
  Layout,
  Overline,
  PodcastFeed,
  Seo,
} from '../components';

import { getAllPosts } from '../lib/blogPostLoader';

import { getAllBooks } from '../lib/bookLoader';
import { generateRSSFeed } from '../utils/rss';

// load books, podcasts, and posts fro useStaticProps
export const getStaticProps = async () => {
  const posts = await getAllPosts();
  const books = await getAllBooks();

  generateRSSFeed(posts);

  return {
    props: {
      books,
      posts,
    },
  };
};

const IndexPage = ({ books, posts }) => {
  const [firstPost, ...otherPosts] = posts.slice(0, 12);
  return (
    <Layout>
      <Container maxW="7xl">
        <Seo
          title="API News, articles, podcasts, and books"
          keywords={[
            `http`,
            `api`,
            `api design`,
            `api development`,
            `programming`,
            `systems architecture`,
            `rest`,
            `graphql`,
            `grpc`,
          ]}
        />
        <Stack spacing={6}>
          <Grid
            gridTemplateColumns={['1fr', '1fr', '1fr fit-content(130px)']}
            gap={4}
          >
            <FeaturedBlogPost post={firstPost} />
            <CarbonAd />
          </Grid>

          <Spacer />

          <Overline id="books">Books for API Developers</Overline>
          <SimpleGrid minChildWidth={'400px'} spacing={8}>
            {books.map((book, i) => {
              return (
                <div key={book.frontmatter.title}>
                  <BookFeature book={book} />
                </div>
              );
            })}
          </SimpleGrid>

          <Spacer />

          <Overline id="more">More API goodness</Overline>
          <SimpleGrid minChildWidth="300px" spacing={8} mt={4}>
            <PodcastFeed dark height="500" />
            {otherPosts.map((post) => {
              return <BlogPostItem key={post.slug} post={post} />;
            })}
            <Link href="/blog" passHref>
              <Text
                color="green.700"
                fontWeight={'bold'}
                _hover={{ color: 'green.400' }}
              >
                Read more articles &rarr;
              </Text>
            </Link>
          </SimpleGrid>
        </Stack>
      </Container>
    </Layout>
  );
};

export default IndexPage;
