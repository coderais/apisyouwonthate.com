import Image from "next/image";
import Link from 'next/link';

import {
  Container,
  Grid,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';

import { AuthorSummary, Layout, NewsletterForm, Seo } from '../../components';

import { getAllAuthors } from '../../lib/authorLoader';
import config from '../../../config';

// load authors from getStaticProps
export const getStaticProps = async () => {
  const authors = await getAllAuthors();

  const staffAuthors = authors.filter((author) => !!author.frontmatter.isStaff);
  const contributingAuthors = authors.filter(
    (author) => !author.frontmatter.isStaff
  );

  return {
    props: {
      staffAuthors,
      contributingAuthors,
    },
  };
};

const AboutPage = ({ staffAuthors, contributingAuthors }) => {
  return (
    <Layout>
      <Seo
        title="About APIs You Won't Hate, and our authors"
        description={config.siteMetadata.description}
      />
      <Container mt="2rem">
        <Stack>
          <Grid gridTemplateColumns={['1fr', '1fr', '2fr 1fr']} gap={8}>
            <Stack>
              <Heading as="h1">About APIs You Won&apos;t Hate</Heading>
              <Text>
                API development is a topic very close to our hearts. APIs You
                Won&apos;t Hate started out as a book, with founder Phil pouring
                everything API related he knew, all the problems he faced, all
                the design decisions he wish he thought about earlier.
              </Text>
              <Text>
                Since the first book, APIs You Won&apos;t Hate has expanded to
                include many articles about API development, a podcast, several
                additional books, and a fantastic{' '}
                <Link href="/community">community</Link> of API developers. Our
                goal is simple: provide a space for this brilliant community to
                debate and share experiences knowledge with other smart people.
              </Text>
              <Text>
                APIs You Won&apos;t Hate is dedicated to learning, writing,
                sharing ideas and bettering understanding of API practices.
                Together we can erradicate APIs we hate.
              </Text>
            </Stack>

            <Stack>
              <Heading as="h2" size="lg">
                Subscribe to the newsletter
              </Heading>
              <NewsletterForm />
            </Stack>
          </Grid>

          <Spacer />

          <Stack>
            <Heading as="h2">Staff Authors</Heading>
            <Text>Meet the fouding team behind APIs You Won&apos;t Hate</Text>

            <SimpleGrid columns={[1, 1, 3]} spacing={8}>
              {staffAuthors.map((author) => (
                <AuthorSummary key={author.frontmatter.name} author={author} />
              ))}
            </SimpleGrid>

            <Spacer />

            <Heading as="h2" size={'lg'}>
              Contributing Authors
            </Heading>
            <Text>
              Thank you for the support from our fantastic community of
              contributors:
            </Text>

            <SimpleGrid columns={[1, 1, 3]} spacing={8}>
              {contributingAuthors.map((author) => (
                <AuthorSummary key={author.frontmatter.name} author={author} />
              ))}
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default AboutPage;
