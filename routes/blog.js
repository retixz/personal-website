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
        const strippedContent = post.content.replace(/<[^>]*>/g, '');
        // Create snippet (e.g., first 200 chars)
        snippet = strippedContent.substring(0, 200);
        if (strippedContent.length > 200) {
          snippet += '...'; // Add ellipsis if content was truncated
        }
      }

      return {
        ...post.toJSON(),
        snippet: snippet
      };
    });

    const data = {
      pageTitle: 'Blog',
      posts: processedPosts,
      currentTheme: req.cookies.themePreference || 'light',
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

    if (!post) {
      return res.status(404).send('Postarea nu a fost găsită.');
    }

    let metaDescription = 'Read this blog post by Alexandru Stoica.';
    if (post.content) {
      const strippedContent = post.content.replace(/<[^>]*>/g, '');
      metaDescription = strippedContent.substring(0, 160);
      if (strippedContent.length > 160) {
        metaDescription += '...';
      }
    }

    // Prepare data for the template
    const data = {
      pageTitle: post.title,
      post: post,
      metaDescription: metaDescription,
      currentTheme: req.cookies.themePreference || 'light',
      linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
      email: 'r.alexandru.stoica@gmail.com',
      cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf'
    };

    res.render('post-detail', data);

  } catch (err) {
    console.error("Eroare la preluarea postării:", err);
    res.status(500).send("Eroare server la încărcarea postării.");
  }
});

module.exports = router;