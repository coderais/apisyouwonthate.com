import Image from "next/legacy/image";

import {
  Button,
  Container,
  Grid,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Layout, Seo } from '../../components';

import slackImage from '../../../public/images/community/slack.png';

const CommunityPage = () => (
  <Layout>
    <Seo
      title="Community"
      keywords={['apis', 'api', 'rest', 'rpc', 'graphql']}
    />
    <Container>
      <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']} gap={20}>
        <Stack>
          <Heading as="h1">
            Join the APIs You Won&apos;t Hate Slack Community
          </Heading>
          <Text>
            Get your API, REST and HTTP questions answered by almost 5,000
            people! We&apos;re the largest API-centric Slack channel on the web.
          </Text>

          <Button
            colorScheme="purple"
            as="a"
            href="https://slack.apisyouwonthate.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            Join us in Slack
          </Button>
        </Stack>
        <Image src={slackImage} alt="Our slack community" />
      </Grid>
    </Container>
  </Layout>
);

export default CommunityPage;
