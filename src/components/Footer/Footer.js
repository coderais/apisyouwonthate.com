import { Box, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

import * as classes from './Footer.module.css';

import { GitHubIcon, TwitterIcon } from '../icons';
import { NewsletterForm } from '../NewsletterForm';

const Subtitle = ({ children }) => (
  <Text textTransform={'uppercase'} fontWeight={'bold'}>
    {children}
  </Text>
);

const Footer = () => (
  <Box as="footer" margin="6rem 2rem 0">
    <Stack
      direction={['column', 'column', 'row', 'row']}
      justifyContent={'space-between'}
    >
      <Stack>
        <Subtitle>APIs You Won't Hate</Subtitle>
        <Link href="/books">
          <a>Books</a>
        </Link>

        <Link href="/blog">
          <a>Blog</a>
        </Link>

        <Link href="/videos">
          <a>Videos</a>
        </Link>

        <Link href="/podcast">
          <a>Podcast</a>
        </Link>
      </Stack>
      <Stack>
        <Subtitle>Community</Subtitle>
        <Stack direction="row" alignItems="center">
          <GitHubIcon />{' '}
          <a
            href="https://github.com/apisyouwonthate"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </Stack>
        <Stack direction="row" alignItems="center">
          <TwitterIcon />
          <a
            href="https://twitter.com/apisyouwonthate"
            target="_blank"
            rel="noreferrer noopener me"
          >
            @apisyouwonthate
          </a>
        </Stack>
        <Link href="/community">Join our Slack Community</Link>
        <a href="https://forum.apisyouwonthate.com">Forum</a>
        <Link href="/conduct">Code of Conduct</Link>
      </Stack>
      <Stack>
        <Subtitle>More help</Subtitle>
        <a href="https://calendly.com/philsturgeon">Consulting</a>
      </Stack>
      <Stack>
        <Subtitle>Subscribe to our newsletter</Subtitle>
        <NewsletterForm />
      </Stack>
    </Stack>
    <Stack>
      <p>
        <a
          href="https://www.netlify.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            alt="Deploys by netlify"
            src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
          />
        </a>
      </p>
      <small>
        © {new Date().getFullYear()}
        {` APIs You Won't Hate`}
      </small>
    </Stack>
  </Box>
);

export default Footer;
