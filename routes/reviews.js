const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// --- Rate Limiter for Submissions ---
const reviewSubmitLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 3,
    message: 'Too many submission attempts from this IP, please try again after an hour',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// --- GET /reviews - Display approved reviews and submission form ---
router.get('/', async (req, res) => {
    try {
        const approvedReviews = await Review.findAll({
            where: { status: 'approved' },
            order: [['createdAt', 'DESC']]
        });
        const data = {
            pageTitle: 'Recommendations',
            reviews: approvedReviews,       
            errors: [],
            oldData: {}
        };
        res.render('reviews', data);
    } catch (err) {
        console.error("Error fetching approved reviews:", err);
        res.status(500).send("Server error loading recommendations page.");
    }
});

router.get('/thank-you', (req, res) => {
    try {
        const data = {
            pageTitle: 'Thank You!',
        };
        res.render('review-thank-you', data);
    } catch (err) {
        console.error("Error rendering thank you page:", err);
        res.status(500).send("Server error.");
    }
})

router.post(
    '/submit',
    reviewSubmitLimiter, // Apply rate limiting first
    [ // Validation rules array
        body('name', 'Name is required').trim().notEmpty(),
        body('roleCompany', 'Role/Company is required').trim().notEmpty(),
        body('content', 'Recommendation content is required').trim().notEmpty(),
        body('linkedinUrl', 'Please enter a valid URL for LinkedIn (optional)')
            .optional({ checkFalsy: true }).trim().isURL()
    ],
    async (req, res) => {
        if (req.body.website_url_dont_fill) {
            console.warn('Honeypot field filled, likely spam submission.');
            // Return a generic success message to confuse bots, but don't save
            return res.send('Thank you for your submission!');
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            try {
                // Need to fetch approved reviews again to display the page
                const approvedReviews = await Review.findAll({
                    where: { status: 'approved' },
                    order: [['createdAt', 'DESC']]
                });

                // Data object, including errors and old submitted data
                const data = {
                    pageTitle: 'Recommendations | Error',
                    reviews: approvedReviews,
                    errors: errors.array(),
                    oldData: req.body,
                };
                // Set status to 400 and re-render the SAME template
                return res.status(400).render('reviews', data);
            } catch (fetchErr) {
                // Handle error fetching reviews needed for re-render
                console.error("Error fetching reviews for error re-render:", fetchErr);
                return res.status(500).send("An error occurred while processing your request.");
            }
        }

        // If validation passes and honeypot is empty, proceed
        try {
            const { name, roleCompany, content, linkedinUrl } = req.body;

            const newReview = await Review.create({
                name: name,
                roleCompany: roleCompany,
                content: content,
                linkedinUrl: linkedinUrl || null,
                status: 'pending'
            });

            console.log('New review submitted, pending approval:', newReview.toJSON());

            // TODO (Optional): Send email notification here

            // Send a success response
            res.redirect('/reviews/thank-you');

        } catch (error) {
            console.error("Error during review submission process:", error);

            // Check if it's a Sequelize Validation Error ---
            if (error.name === 'SequelizeValidationError') {
                console.log("Sequelize validation errors:", error.errors);
                try {
                    const approvedReviews = await Review.findAll({ where: { status: 'approved' }, order: [['createdAt', 'DESC']] });
                    const data = {
                        pageTitle: 'Recommendations | Error',
                        reviews: approvedReviews,
                        errors: error.errors.map(e => ({ msg: e.message, path: e.path })),
                        oldData: req.body,
                    };
                    return res.status(400).render('reviews', data);
                } catch (fetchErr) {
                     console.error("Error fetching reviews for Sequelize error re-render:", fetchErr);
                     return res.status(500).send("An error occurred while processing your request.");
                }
            }
            else {
                res.status(500).send("Server error submitting recommendation.");
            }
        }
    }
);


module.exports = router;