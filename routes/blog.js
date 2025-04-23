// routes/blog.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']]
    });

    const processedPosts = posts.map(post => {
      let snippet = '';
      if (post.content) {
        // Strip HTML tags using a regular expression
        const strippedContent = post.content.replace(/<[^>]*>/g, '');
        // Create snippet (e.g., first 200 chars)
        snippet = strippedContent.substring(0, 200);
        if (strippedContent.length > 200) {
          snippet += '...'; // Add ellipsis if content was truncated
        }
      }

      return {
        ...post.toJSON(), // Include all original post properties
        snippet: snippet // Add the generated snippet
      };
    });

    const data = {
      pageTitle: 'Blog',
      posts: processedPosts,
      currentTheme: req.cookies.themePreference || 'dark',
      linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
      email: 'r.alexandru.stoica@gmail.com',
      cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf'
    };
    res.render('blog', data);
  } catch (err) {
    console.error("Eroare la preluarea postărilor:", err);
    res.status(500).send("Eroare server la încărcarea blogului.");
  }
});
router.get('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId); 

    // If post not found, send a 404 response
    if (!post) {
      return res.status(404).send('Post not found.');
    }

    // Prepare data for the template
    const data = {
      pageTitle: post.title,
      currentTheme: req.cookies.themePreference || 'dark',
      post: post,
      linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
      email: 'r.alexandru.stoica@gmail.com',
      cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf'
    };

    res.render('post-detail', data); // Renders views/post-detail.ejs

  } catch (err) {
    console.error("Eroare la preluarea postării:", err);
    res.status(500).send("Eroare server la încărcarea postării.");
  }
});

module.exports = router;