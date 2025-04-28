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
      githubProfileUrl: 'https://github.com/retixz',
      linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
      email: 'r.alexandru.stoica@gmail.com',
      cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID

    };
    res.render('blog', data);
  } catch (err) {
    console.error("Eroare la preluarea postărilor:", err);
    res.status(500).send("Eroare server la încărcarea blogului.");
  }
});
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ where: { slug: req.params.slug } });

    if (!post) {
      return res.status(404).send('Post not found.');
    }

    // --- Session-Based View Count Logic ---

    // Initialize viewedPosts object in session if it doesn't exist
    req.session.viewedPosts = req.session.viewedPosts || {};

    const now = Date.now();
    const lastViewed = req.session.viewedPosts[req.params.slug];
    const oneHour = 60 * 60 * 1000; // 1h

    // Check if post was viewed within the last hour in this session
    if (!lastViewed || (now - lastViewed > oneHour)) {
      console.log(`Incrementing view count for post: ${req.params.slug}`);
      post.increment('viewCount').catch(err => console.error("Error incrementing view count:", err));

      // Update the timestamp in the session for this post
      req.session.viewedPosts[req.params.slug] = now;
    } else {
      console.log(`View count NOT incremented for post: ${req.params.slug} (viewed recently in session)`);
    }

    const baseUrl = process.env.BASE_URL || `http://${req.headers.host}`;
    const postUrl = `${baseUrl}/blog/${post.slug}`;

    let readingTimeText = '';
    if (post.content) {
      const strippedContent = post.content.replace(/<[^>]*>/g, '').trim(); // Strip HTML and trim
      const wordCount = strippedContent.split(/\s+/).filter(word => word.length > 0).length; // Count words
      const wordsPerMinute = 200; // Average reading speed
      const minutes = Math.ceil(wordCount / wordsPerMinute);
      readingTimeText = `${minutes} min read`;
    }

    // URL Encode the post URL for the share link parameter
    const encodedPostUrl = encodeURIComponent(postUrl);

    let metaDescription = 'Read this blog post by Alexandru Stoica.';
    if (post.content) {
      const strippedContent = post.content.replace(/<[^>]*>/g, '');
      metaDescription = strippedContent.substring(0, 160);
      if (strippedContent.length > 160) metaDescription += '...';
    }

    const data = {
      pageTitle: post.title,
      post: post,
      metaDescription: metaDescription,
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      currentTheme: req.cookies.themePreference || 'light',
      githubProfileUrl: 'https://github.com/retixz',
      linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
      email: 'r.alexandru.stoica@gmail.com',
      cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf',
      readingTimeText: readingTimeText,
      postUrl: postUrl,
      encodedPostUrl: encodedPostUrl,
      gaMeasurementId: process.env.GA_MEASUREMENT_ID
    };

    res.render('post-detail', data);

  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).send("Server error loading post.");
  }
});

module.exports = router;