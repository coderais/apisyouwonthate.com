import Link from 'next/link';
import Image from "next/image";

import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import { Layout, Overline, Seo } from '../../components';

import { getAllBooks, getBookBySlug } from '../../lib/bookLoader';
import mdxOptions from '../../utils/mdxOptions';

export async function getStaticPaths() {
  const books = await getAllBooks();

  return {
    paths: books.map((book) => {
      return {
        params: {
          slug: book.slug,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const book = await getBookBySlug(params.slug);

  const mdxSource = await serialize(book.content, mdxOptions);

  return {
    props: {
      slug: params.slug,
      book: {
        ...book,
        source: mdxSource,
      },
    },
  };
}

const BookPage = ({ book }) => {
  const {
    amazonLinks,
    coverImage,
    description,
    leanpubLinks,
    subtitle,
    shopifyData,
    title,
  } = book.frontmatter;

  const coverImageUrl = `/images/books/${coverImage}`;

  const actions = (
    <SimpleGrid minChildWidth={'120px'} gap={4}>
      {shopifyData?.map(({ productId, label, url }) => (
        <Link href={url} passHref key={`shopify-action-${productId}`}>
          <Button
            rounded={'full'}
            colorScheme={'purple'}
            _hover={{ bg: 'green.500' }}
          >
            {label}
          </Button>
        </Link>
      ))}
      {leanpubLinks?.map(({ url, label }, idx) => (
        <Link href={url} key={`leanpub-link-${idx}`} passHref>
          <Button
            as="a"
            target="_blank"
            rel="noopener noreferrer"
            rounded={'full'}
            colorScheme={'purple'}
            _hover={{ bg: 'purple.400', color: 'black' }}
          >
            {label}
          </Button>
        </Link>
      ))}
    </SimpleGrid>
  );

  const amazonSection =
    amazonLinks?.length > 0 ? (
      <Stack spacing={4}>
        <Text fontSize={['sm', 'md']}>
          Also available on these sites{' '}
          <Text as="small">(but they take a bigger cut of your money)</Text>:
        </Text>
        <SimpleGrid minChildWidth={'100px'} gap={4}>
          {amazonLinks.map(({ url, label }, idx) => (
            <Link href={url} key={`amazon-link-${idx}`} passHref>
              <Button
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                rounded={'full'}
              >
                {label}
              </Button>
            </Link>
          ))}
        </SimpleGrid>
      </Stack>
    ) : null;

  const buyLinks = (
    <>
      {actions}
      {amazonSection}
    </>
  );

  return (
    <Layout>
      <Seo title={title} description={subtitle} imageUrl={coverImageUrl} />
      <Container>
        <Overline>Get the book</Overline>
        <Grid
          gridTemplateColumns={['1fr', '1fr', '2fr 1fr']}
          spacing={[4, 8, 12]}
          margin="1rem 0 2rem"
          gap={16}
        >
          <Stack spacing={8}>
            <Heading
              fontWeight={900}
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}
              as="h1"
            >
              {title}
            </Heading>
            <Text color={'gray.700'} fontSize={'2xl'} maxW={'xl'}>
              {subtitle}
            </Text>
            <Text color={'gray.500'} maxW={'xl'}>
              {description}
            </Text>
            {buyLinks}
          </Stack>
          <Image
            src={coverImageUrl}
            alt={`${title} cover page`}
            objectFit={'contain'}
            height="700"
            width={'550'}
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
        </Grid>
      </Container>

      <Box background={'green.50'} padding="2rem 0" marginBottom={'-6rem'}>
        <Container maxWidth={'65ch'} fontSize={'lg'}>
          <Stack spacing={8}>
            <MDXRemote {...book.source} />
            <Box padding="2rem" bgColor="white">
              <Stack spacing={4}>
                <Heading as="h3">Get {title}</Heading>
                {buyLinks}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
};

export default BookPage;
