// const GhostContentAPI = require('@tryghost/content-api');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

const outputDirectory = path.join(__dirname, '../public/posts/');
const indexDirectory = path.join(__dirname, '../public/');
const srcDirectory = path.join(__dirname, '../src/');
const postsData = path.join(__dirname, 'data/', 'data.json');



function generateIndexContent(posts) {
  // Use EJS to render the index template with the posts data
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'indexTemplate.ejs'), 'utf-8');
  
  return ejs.render(template, {
      posts: posts,
      featuredPost: posts[0]
  }, {
      root: path.join(__dirname, 'templates')
  });
}

function ensureDirectoryExistence(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function generatePostContent(post) {
  ensureDirectoryExistence(path.join(__dirname, '../public/posts/'));

  // Use EJS to render the post template with the post data
  return ejs.render(
    fs.readFileSync(path.join(__dirname, 'templates', 'postTemplate.ejs'), 'utf-8'), 
    {
      image: post.feature_image,
      title: post.title,
      content: post.html, // Content
      excerpt: post.excerpt
    }, {
      root: path.join(__dirname, 'templates') //Root directory for views
    }
  );
}

function saveToFile(filename, content) {
  fs.writeFile(filename, content, (err) => {
      if (err) {
          console.error(`Error saving ${filename}:`, err);
      } else {
          // console.log(`${filename} generated successfully!`);
      }
  });
}

async function generateStaticSite() {
  const posts = JSON.parse(fs.readFileSync(postsData, 'utf-8'));

  // Generate the main index page
  const indexContent = generateIndexContent(posts);
  saveToFile(path.join(indexDirectory, 'index.html'), indexContent);

  // Generate individual post pages
  for (const post of posts) {
    // console.log(post); // Debugging: print the post object
    const postContent = generatePostContent(post);
    saveToFile(path.join(outputDirectory, `${post.slug}.html`), postContent);
  }

  console.log("Generated static Post Pages!");
  
}

// const stylesheets = ['index.css', 'article.css'];

// async function copyStylesheets() {
//   for (const stylesheet of stylesheets) {
//     const srcPath = path.join(srcDirectory, './styles', stylesheet);
//     const destPath = path.join(indexDirectory, stylesheet);

//     fs.copyFile(srcPath, destPath, err => {
//       if (err) {
//         console.log(`Error copying ${stylesheet}:`, err);
//       } else {
//         console.log(`${stylesheet} copied successfully!`);
//       }
//     });
//   }
// }


generateStaticSite();
// copyStylesheets();


