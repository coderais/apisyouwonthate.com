import { useState } from 'react';

import Link from 'next/link';

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  Heading,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react';

import { Layout, Seo } from '../../components';

const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

const AMAPage = () => {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...formData }),
    })
      .then(() => setSubmitted(true))
      .catch((error) => alert(error));
  };

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  return (
    <Layout>
      <Seo title="Ask us a question!" />
      <Container>
        {submitted ? (
          <Stack>
            <Heading as="h1">Thank you!</Heading>
            <p>
              We&apos;ll do our best to answer your question as quickly as
              possible. Make sure to subscribe to the{' '}
              <Link href="/podcast">podcast</Link>, too. Have a great day!
            </p>
          </Stack>
        ) : (
          <Grid gridTemplateColumns={['1fr', '1fr', '3fr 5fr']} gap={8}>
            <Stack>
              <Heading as="h1">Got a question or comment?</Heading>
              <p>
                We&apos;d love to help you out! Leave us a question or comment
                below, and we&apos;ll do our best to answer it via twitter, or
                on the Podcast.
              </p>
            </Stack>

            <Stack
              as="form"
              name="contact"
              marginBottom={'2rem'}
              onSubmit={handleSubmit}
              spacing={6}
            >
              <FormControl>
                <FormLabel>Your name</FormLabel>
                <Input
                  onChange={handleChange}
                  name="contact-name"
                  type="text"
                  placeholder="Josephine Doe"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Your contact information</FormLabel>
                <Input
                  onChange={handleChange}
                  name="contact-info"
                  type="text"
                  placeholder="@irreverentmike or hello@apisyouwonthate.com"
                />
                <FormHelperText className="text-muted">
                  We&apos;ll use this to tag you in a response. Leave blank to
                  ask anonymously
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Your question or comment</FormLabel>
                <Textarea
                  onChange={handleChange}
                  name="comment"
                  as="textarea"
                  rows={3}
                  placeholder="What the heck is an API?"
                />
              </FormControl>

              <FormControl>
                <FormLabel>
                  Don&apos;t fill this out if you&apos;re human:
                </FormLabel>
                <Input
                  onChange={handleChange}
                  type="text"
                  placeholder="Away, botspam"
                  name="bot-field"
                />
              </FormControl>

              <Button variant="solid" colorScheme={'purple'} type="submit">
                Submit
              </Button>
            </Stack>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default AMAPage;
