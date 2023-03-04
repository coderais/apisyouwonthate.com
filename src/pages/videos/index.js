import Image from "next/legacy/image";

import {
  Container,
  Grid,
  Heading,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';

import { Layout, Seo, VideoFeature } from '../../components';
import { getAllVideos } from '../../lib/videoLoader';

import videoHeaderImage from '../../../public/images/videos/videos-page-header-image.jpg';

// load books, podcasts, and posts fro useStaticProps
export const getStaticProps = async () => {
  const videos = await getAllVideos();

  return {
    props: {
      videos,
    },
  };
};

const VideosPage = ({ videos }) => {
  return (
    <Layout>
      <Seo
        title="Videos"
        keywords={['apis', 'api', 'rest', 'rpc', 'graphql']}
        description="Watch videos from conferences and meetups around the world about the API design and development process."
        imageUrl={`/images/videos/videos-page-header-image.jpg`}
      />
      <Container>
        <Grid gridTemplateColumns={['1fr', '1fr', '2fr 3fr']} gap={8} mb="3rem">
          <Stack>
            <Heading as="h1">Videos</Heading>
            <Text>
              Can&apos;t make it to the big conferences In Paris, London, or San
              Francisco? we get it! We&apos;ve all got local bars to keep up
              appearances at, bike races to train for, and pet turtles
              don&apos;t feed themselves!
            </Text>
            <Text>
              Grab these mini conference talks, and watch then whenever you
              fancy.
            </Text>
          </Stack>
          <figure>
            <Image
              src={videoHeaderImage}
              alt="A slide from one of Phil's many talks over the years"
            />
            <figcaption>
              A slide from one of Phil&apos;s many talks over the years
            </figcaption>
          </figure>
        </Grid>
        <Spacer />
        <Stack spacing={12}>
          {videos.map((video) => (
            <div key={video.id || video.frontmatter.title}>
              <VideoFeature video={video} />
            </div>
          ))}
        </Stack>
      </Container>
    </Layout>
  );
};

export default VideosPage;
