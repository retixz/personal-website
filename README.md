# Alexandru Stoica - Personal Website & Blog

This repository contains the source code for the personal website and blog of Alexandru Stoica, Software Engineer. The site serves as a portfolio, blog platform, recommendation display, and contact point.

**Live Demo:** [https://www.alexandrustoica.dev/](https://www.alexandrustoica.dev/)

## Technologies Used

This project leverages a combination of modern web technologies chosen for flexibility, performance, and maintainability:

* **Backend:** Node.js with the Express.js framework for routing and server logic.
* **Templating:** Embedded JavaScript (EJS) for server-side rendering of HTML pages.
* **Database:** PostgreSQL (hosted on Supabase for production).
* **ORM:** Sequelize for object-relational mapping, simplifying database interactions.
* **Frontend:**
    * Vanilla JavaScript for client-side interactions (navigation, theme switching).
    * CSS3 with Custom Properties (Variables) for flexible styling and theming.
    * Particles.js for a lightweight, theme-aware animated background.
    * Prism.js for client-side syntax highlighting in blog posts.
* **Environment:** `dotenv` for managing environment variables.
* **Security/Validation Middleware:** `helmet`, `cookie-parser`, `express-rate-limit`, `express-validator`.

## Features

* **Responsive Design:** Mobile-first approach ensuring usability across various screen sizes.
* **Dynamic Light/Dark Theme:** User preference is detected, applied instantly server-side (via Cookies) to prevent flashing, saved in `localStorage`, and can be toggled client-side. Prism.js theme also adapts automatically.
* **Blog Platform:**
    * Dynamically lists blog posts fetched from the database.
    * Displays individual blog posts with full content.
    * Supports formatted content including code blocks (with Prism.js syntax highlighting), images, quotes, etc.
    * Uses Sequelize models for data structure.
* **Recommendations/Reviews System:**
    * Displays approved recommendations on a dedicated page.
    * Allows users to submit new recommendations via a form.
    * Submissions are saved with a `pending` status for manual moderation.
    * Includes backend validation (`express-validator`), rate limiting (`express-rate-limit`), and a honeypot field for spam prevention.
    * Dedicated "Thank You" page after submission.
    * *(Note: Email notification for pending reviews is planned but not included in this description).*
* **Animated Background:** Uses `particles.js` initialized with theme-appropriate colors.
* **SEO Enhancements:** Includes dynamic page titles, per-post meta descriptions, JSON-LD schema markup (Person & BlogPosting), a dynamic `sitemap.xml` route, and `robots.txt`.
* **Security Measures:** Implements `helmet` for security headers, secure flags for cookies, environment variables for credentials, and relies on Sequelize's protection against SQL injection.
* **Contact Page:** Displays contact information.
* **CV Download:** Link to download the CV PDF.

## Project Structure

The project follows a standard MVC-like pattern:

* `/`: Contains main configuration files (`package.json`, `.gitignore`, `.env` template).
* `server.js`: The main application entry point, sets up Express, middleware, and routes.
* `database.js`: Configures the Sequelize database connection (PostgreSQL/SQLite).
* `/routes`: Contains Express route handlers (e.g., `index.js`, `blog.js`, `reviews.js`).
* `/models`: Defines Sequelize data models (e.g., `Post.js`, `Review.js`).
* `/views`: Contains EJS templates, including:
    * `/partials`: Reusable template fragments (`header.ejs`, `footer.ejs`).
    * Page templates (`index.ejs`, `blog.ejs`, `post-detail.ejs`, `contact.ejs`, `reviews.ejs`, `review-thank-you.ejs`).
* `/public`: Contains static assets served directly to the client:
    * `/css`: Stylesheets (`style.css`).
    * `/js`: Client-side JavaScript (`theme.js`, `nav.js`, `particles-init.js`).
    * `/images`: Site images (favicon, avatar).
    * Other static files (`robots.txt`, CV PDF).
* `/data`: (Optional, for SQLite) Contains the `database.sqlite` file during local development.

## Key Implementation Highlights

### SEO

* **Dynamic Metadata:** Page titles and meta descriptions (for blog posts) are generated dynamically based on content.
* **Structured Data:** JSON-LD schema for `Person` (homepage) and `BlogPosting` (blog posts).
* **Crawling & Indexing:** A dynamic `/sitemap.xml` route lists all relevant pages (including blog posts), and `robots.txt` guides crawlers.

### Performance

* **Theme Flash Prevention:** Uses a server-side cookie approach with class applied directly to `<html>` on initial response. Content visibility is managed via CSS/JS to prevent flashes.
* **Optimized Script Loading:** Client-side JavaScript loaded non-blockingly at the end of the `<body>`.
* **Efficient Background:** Uses `particles.js` (theme-aware) instead of heavier alternatives.
* **Server-Side:** Recommendations include adding HTTP compression (`compression`) and static asset caching (`express.static` options). Blog pagination is advised for future scaling.

### Security

* **HTTP Headers:** `helmet` middleware sets various security headers. Content Security Policy is configured via Helmet to allow required CDNs (Prism.js).
* **Cookie Security:** Theme cookie uses `SameSite=Lax` and `Secure` flags.
* **Credentials:** Database credentials managed via environment variables (`.env`).
* **Submission Security:** Review submission uses CSRF protection (implicitly via standard form POST, consider adding explicit CSRF tokens for higher security), rate limiting (`express-rate-limit`), a honeypot field, and server-side validation/sanitization (`express-validator`).
* **Dependencies:** Regular checks using `npm audit` are recommended.

### Code Clarity & Maintainability

* **Modular Structure:** Clear separation into routes, models, views.
* **Theming:** Extensive use of CSS Custom Properties (Variables) for easy light/dark theme management, including dynamic Prism.js theme switching.
* **Code Reusability:** EJS partials for header/footer.
* **Readability:** Use of linters/formatters like ESLint/Prettier is recommended.

## Setup & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    * Create a `.env` file in the project root (copy from `.env.example` if provided, or create manually).
    * Add your database connection string:
        ```dotenv
        # For PostgreSQL/Supabase (URL-encode password!)
        DATABASE_URL=postgresql://postgres:[YOUR-ENCODED-PASSWORD]@[YOUR_SUPABASE_HOST]:5432/postgres

        # Base URL for sitemap generation
        BASE_URL=http://localhost:3000 # Change for production

        # Optional: Email credentials (if adding notifications later)
        # EMAIL_HOST=...
        # EMAIL_PORT=...
        # EMAIL_SECURE=...
        # EMAIL_USER=...
        # EMAIL_PASS=...
        # ADMIN_EMAIL=...
        # EMAIL_FROM=...
        ```
4.  **Database Setup:**
    * The application uses `sequelize.sync({ force: false })` on startup. This will automatically create the `Posts` and `Reviews` tables in your configured database if they don't exist.
5.  **Add Content (Optional):** Add blog posts or approve reviews directly via your database tool (e.g., Supabase dashboard) to see content on the site.
6.  **Start the server:**
    ```bash
    npm start
    ```
7.  Open your browser and navigate to `http://localhost:3000` (or the port specified).

## Deployment

This application is designed for deployment on platforms like Render.

* Set environment variables (`DATABASE_URL`, `NODE_ENV=production`, `BASE_URL`, email credentials if used) in the hosting platform's settings.
* Ensure the production `DATABASE_URL` points to your live database (Supabase).
* Ensure the site is served over HTTPS.
* Consider implementing a build step for frontend assets.

## License

ISC License

Copyright (c) 2025, Alexandru Stoica

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.