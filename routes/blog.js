// routes/blog.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']]
    });
    const data = {
      pageTitle: 'Blog',
      posts: posts
    };
    res.render('blog', data);
  } catch (err) {
    console.error("Eroare la preluarea postărilor:", err);
    res.status(500).send("Eroare server la încărcarea blogului.");
  }
});

// (Opțional) Rută pentru a afișa o singură postare
// router.get('/:postId', async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     // Folosim metoda findByPk() (Find By Primary Key)
//     const post = await Post.findByPk(postId);
//     if (!post) {
//       return res.status(404).send('Postarea nu a fost găsită.');
//     }
//     res.render('post-detail', { pageTitle: post.title, post: post });
//   } catch (err) {
//     console.error("Eroare la preluarea postării:", err);
//     // Sequelize poate arunca erori diferite pentru ID-uri invalide,
//     // dar verificarea `!post` este de obicei suficientă.
//     res.status(500).send("Eroare server la încărcarea postării.");
//   }
// });

// Aici ai putea adăuga rute POST pentru a crea postări noi folosind Post.create()

module.exports = router;