import Link from 'next/link';
import { Button, Container, Grid, Heading, Stack } from '@chakra-ui/react';

import { Layout, PodcastFeed, Seo } from '../../components';

const PodcastPage = () => {
  return (
    <Layout>
      <Seo title="Podcast" />
      <Container>
        <Grid gridTemplateColumns={['1fr', '1fr', '3fr 1fr']} gap={8}>
          <Stack>
            <Heading as="h1">APIs You Won&apos;t Hate (the podcast)</Heading>
            <PodcastFeed />
          </Stack>
          <Stack>
            <Heading as="h2" size="lg" pt="1.5em">
              Got a question for us?
            </Heading>
            <p>
              We&apos;d love to hear from you! Submit your question for the
              show, and we&apos;ll do our best to answer on an upcoming episode.
            </p>
            <Link href="/ama" passHref>
              <Button colorScheme={'purple'}>Ask us a question</Button>
            </Link>
          </Stack>
        </Grid>
      </Container>
    </Layout>
  );
};

export default PodcastPage;
