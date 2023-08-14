const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const expressLayouts = require('express-ejs-layouts');

app.use(express.json());

app.use(express.static('public'));

app.use('/scripts', express.static(__dirname + '/node_modules/flowbite/dist/'));

//Set Templating Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

// Function to read the generated HTML files
function getHTMLContent(slug) {
  const filePath = path.join(__dirname, 'public', 'posts', `${slug}.html`);

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading HTML file for ${slug}:`, error);
    return null;
  }
}

// Dynamic route creation
function createDynamicRoutes() {
  const pagesDirectory = path.join(__dirname, 'public', 'posts');

  fs.readdirSync(pagesDirectory).forEach((file) => {
    if (file.endsWith('.html')) {
      const slug = file.replace('.html', '');
      app.get(`/posts/${slug}`, (req, res) => {
        const pageContent = getHTMLContent(slug);
        if (pageContent) {
          res.send(pageContent);
        } else {
          res.status(404).send(`${slug} page not found`);
        }
      });
    }
  });
}

createDynamicRoutes();


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

