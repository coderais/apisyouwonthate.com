const { join } = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const slugify = require('slugify');
const fetch = require('node-fetch');
const he = require('he');

const TurndownService = require('turndown');
const turndownService = new TurndownService();

const remotiveApiHost = 'https://remotive.io/api';
const category = 'software-dev';
const search = 'api';
const jobsFolder = join(process.cwd(), '.jobs');

const FULL_TIME = 'Full Time';
const PART_TIME = 'Part Time';

const getJobs = async () => {
  const searchUrl = `${remotiveApiHost}/remote-jobs?category=${category}&search=${search}`;
  const response = await fetch(searchUrl);

  const data = await response.json();

  if (!data.jobs || data.jobs.length <= 0) {
    throw Error('no jobs found');
  }

  const normalizeJobType = {
    full_time: FULL_TIME,
    part_time: PART_TIME,
  };

  return data.jobs.map((job) => {
    const { description, ...rest } = job;
    return {
      frontmatter: {
        ...rest,
        id: job.id,
        title: he.encode(job.title),
        company: he.encode(job.company_name),
        salary: he.encode(job.salary),
        currency: '',
        employment_type: normalizeJobType[job.job_type] || 'Unknown',
        location: he.encode(job.candidate_required_location) || 'Anywhere',
        date: he.encode(job.publication_date),
        type: 'jobs',
        url: job.url,
        published: true,
      },
      description: he.encode(job.description),
    };
  });
};

// make a .jobs folder to dump the jobs in
fs.mkdir(jobsFolder, { recursive: true }, (err) => {
  if (err) throw err;
});

const main = async () => {
  const jobs = await getJobs();

  jobs.forEach((job) => {
    const newJobMarkdown = `---
${yaml.dump(job.frontmatter)}
---
${turndownService.turndown(job.description)}`;

    // arbitrarily putting d- in front of job titles for dynamically loaded jobs
    // this will be ignored in gitignore
    const fileNameTemplate = `${job.frontmatter.title}-${job.frontmatter.company}-${job.frontmatter.id}`;

    const newFilename = `${slugify(fileNameTemplate, {
      remove: /[*+~.()\/'"?!:@,\[\]\\\#]/g,
      lower: true,
    })}.mdx`;

    const filepath = `${jobsFolder}/${newFilename}`;

    if (fs.existsSync(filepath)) {
      console.log(`Skipping ${filepath} as it already exists.`);
      return;
    }

    console.log(`creating ${newFilename}`);
    fs.writeFileSync(filepath, newJobMarkdown, 'utf8');
  });
};

Promise.resolve(main());
