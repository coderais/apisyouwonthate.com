import { serialize } from 'next-mdx-remote/serialize';

import Image from "next/image";

import { Box, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { MDXRemote } from 'next-mdx-remote';

import {
  AuthorDisplay,
  CarbonAd,
  Colophon,
  Layout,
  NewsletterCTA,
  Seo,
} from '../../components';

import { getAllPosts, getPostBySlug } from '../../lib/blogPostLoader';
import { formatDate } from '../../utils/formatDate';
import mdxOptions from '../../utils/mdxOptions';

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  const mdxSource = await serialize(post.content, mdxOptions);

  return {
    props: {
      slug: params.slug,
      post: {
        ...post,
        source: mdxSource,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

const BlogPage = ({ post }) => {
  const { author, date, coverImage, title, subtitle } = post.frontmatter;

  const postImageUrl = `/images/posts/${coverImage}`;
  return (
    <Layout>
      <Container>
        <Seo
          title={title}
          description={subtitle}
          author={author}
          imageUrl={coverImage ? postImageUrl : null}
        />
        <Stack>
          <Grid
            gridTemplateColumns={['1fr', '1fr', '1fr fit-content(130px)']}
            gap={4}
            alignContent={'start'}
            justifyContent={'start'}
          >
            {coverImage ? (
              <Box rounded={'sm'} align={'flex-start'}>
                <Image
                  alt={title}
                  src={postImageUrl}
                  width="1200px"
                  height="600px"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain"
                  }} />
              </Box>
            ) : (
              <div />
            )}
            <CarbonAd />
          </Grid>

          <Container
            maxWidth="70ch"
            alignSelf={'center'}
            pt="2rem"
            padding={[0, 'inherit']}
          >
            <Heading as="h1">{title}</Heading>
            <Stack direction="row">
              <AuthorDisplay name={author} />
              <Text as="time" dateTime={date} color="gray.600">
                {formatDate(date, 'MMMM dd, yyyy')}
              </Text>
            </Stack>
            <Box fontSize={'lg'} mt="1rem">
              <MDXRemote {...post.source} />
            </Box>
            <Colophon />
            <NewsletterCTA />
          </Container>
        </Stack>
      </Container>
    </Layout>
  );
};

export default BlogPage;
