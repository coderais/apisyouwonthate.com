import React from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  SimpleGrid,
  Image,
  Link,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  useColorModeValue,
} from '@chakra-ui/react';

import { Overline } from '..';

const FeaturedBlogPost = ({ post }) => {
  const { author, coverImage, subtitle, title } = post.frontmatter;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
      <Stack spacing={4}>
        <Overline>Article</Overline>
        <Heading>{title}</Heading>
        <Text>
          written by{' '}
          <Link color="green.600" fontSize={'md'} href={`/authors/${author}`}>
            <a>{author}</a>
          </Link>
        </Text>
        <Text color={'gray.500'} fontSize={'lg'}>
          {subtitle}
        </Text>
        <Stack
          spacing={4}
          divider={
            <StackDivider
              borderColor={useColorModeValue('gray.100', 'gray.700')}
            />
          }
        ></Stack>
      </Stack>
      <Flex>
        <Image
          rounded={'md'}
          alt={title}
          src={`/images/posts/${coverImage}`}
          width="500px"
          height="100%"
          objectFit="cover"
        />
      </Flex>
    </SimpleGrid>

    // return (
    //   <Link href={`/blog/${slugify(title)}`}>
    //     <a>
    //       <Stack as="article" direction={'row'}>
    //         <Image
    //           alt={title}
    //           src={`/images/posts/${coverImage}`}
    //           width="500px"
    //           height="100%"
    //           objectFit="cover"
    //         />
    //         <main>
    //           <TypeLabel>Article</TypeLabel>
    //           <h2>{title}</h2>
    //           <p>{subtitle}</p>
    //         </main>
    //       </Stack>
    //     </a>
    //   </Link>
  );
};

FeaturedBlogPost.propTypes = {
  post: PropTypes.shape({}),
};

export default FeaturedBlogPost;
