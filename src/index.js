import { promises as fs } from 'fs'
import Parser from 'rss-parser'
import { WEBSITE } from './constants.js'

const parser = new Parser()

const getLatestArticlesFromBlog = () =>
  parser.parseURL(`${WEBSITE}/rss.xml`).then((data) => data.items.filter(({link}) => link.split('/')[3]=='blog'))

const getLatestProjects = () =>
  parser.parseURL(`${WEBSITE}/rss.xml`).then((data) => data.items.filter(({link}) => link.split('/')[3]=='projects'))



(async () => {
  
    const [template, articles, projects] = await Promise.all([
      fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
      getLatestArticlesFromBlog(),
      getLatestProjects()
    ])
  
    // create latest articles markdown
    const latestArticlesMarkdown = articles
      .slice(0, NUMBER_OF.ARTICLES)
      .map(({ title, link }) => `- [${title}](${link})`)
      .join('\n')
  
          // create latest articles markdown
    const latestProjectsMarkdown = projects
    .slice(0, NUMBER_OF.PROJECTS)
    .map(({ title, link }) => `- [${title}](${link})`)
    .join('\n')
   
    // replace all placeholders with info
    const newMarkdown = template
    .replace(PLACEHOLDERS.LATEST_ARTICLES, latestArticlesMarkdown)
    .replace(PLACEHOLDERS.LATEST_PROJECTS, latestProjectsMarkdown)

  
    await fs.writeFile('README.md', newMarkdown)
  })()