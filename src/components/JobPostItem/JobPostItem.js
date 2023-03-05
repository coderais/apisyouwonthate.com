import React from 'react';

import Link from 'next/link';

import { Button, Heading, Stack, Text } from '@chakra-ui/react';

import { Overline } from '../';

const JobPostItem = ({ job }) => {
  const { title, company, location, employment_type } = job.frontmatter;
  const jobUrl = `/jobs/${job.slug}`;

  return (
    <Stack marginBottom="1.75rem" border="1px solid gray.800">
      <Overline>
        {location} {employment_type && ` | ${employment_type}`}
      </Overline>

      <Heading as="h2" size="md">
        {company} &middot; {title}
      </Heading>
      <Link href={jobUrl} passHref>
        <Button rel="nofollow">Find out more</Button>
      </Link>
    </Stack>
  );
};

export default JobPostItem;
