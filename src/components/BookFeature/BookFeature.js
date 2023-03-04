import Image from "next/legacy/image";

import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import Link from 'next/link';

import slugify from '../../utils/slugify';

const BookFeature = ({ book }) => {
  const { coverImage, title, subtitle } = book.frontmatter;

  const bookUrl = `/books/${slugify(title)}`;
  const bookImage = `/images/books/${coverImage}`;

  return (
    <Stack direction={{ base: 'column', md: 'row' }}>
      <Flex flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
          <Heading as="h2" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                content: "''",
                width: 'full',
                height: useBreakpointValue({ base: '20%', md: '30%' }),
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'purple.200',
                zIndex: -1,
              }}
            >
              {title}
            </Text>
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.600'}>
            {subtitle}
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Link href={bookUrl} passHref>
              <Button
                as="a"
                rounded={'full'}
                bg={'purple.400'}
                color={'white'}
                _hover={{
                  bg: 'purple.500',
                }}
              >
                Get the book
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1} justifyContent={'center'}>
        <Box>
          <Image
            height="550"
            width="400"
            src={bookImage}
            alt={`Cover image for ${title}`}
            objectFit={'cover'}
            priority
          />
        </Box>
      </Flex>
    </Stack>
  );
};

export default BookFeature;
