import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

import { Box, Button, Container, Stack, useTheme } from '@chakra-ui/react';

import logo from '../../../public/img/apis-you-wont-hate-light.png';

const Header = () => {
  const theme = useTheme();
  return (
    <Box padding="1rem 0" borderTop={`10px solid ${theme.colors.green[400]}`}>
      <Container maxW="7xl">
        <Stack
          as="header"
          direction={['column', 'row']}
          alignItems={['flex-start', 'center']}
          justifyContent="space-between"
        >
          <Link href="/">
            <Image
              src={logo}
              alt="APIs You Won't Hate"
              width="130px"
              height="60px"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Link>
          <Stack
            as="nav"
            direction={['column', 'row']}
            alignItems={['flex-start', 'center']}
          >
            <Link href="/blog">Blog</Link>
            <Link href="/books">Books</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/podcast">Podcast</Link>
            <Link href="/community" passHref>
              <Button
                colorScheme={'purple'}
                rounded={'full'}
                _hover={{ bgColor: 'purple.400' }}
              >
                Join the Community
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
