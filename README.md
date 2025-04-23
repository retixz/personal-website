# Alexandru Stoica - Personal Website & Blog

This repository contains the source code for the personal website and blog of Alexandru Stoica, Software Engineer. The site serves as a portfolio, blog platform, and contact point.

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
* **Environment:** `dotenv` for managing environment variables.
* **Security Middleware:** `helmet`, `cookie-parser`.

## Features

* **Responsive Design:** Mobile-first approach ensuring usability across various screen sizes.
* **Dynamic Light/Dark Theme:** User preference is detected, applied instantly server-side (via Cookies) to prevent flashing, saved in `localStorage`, and can be toggled client-side.
* **Blog Platform:**
    * Dynamically lists blog posts fetched from the database.
    * Displays individual blog posts with full content.
    * Uses Sequelize models for data structure.
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
* `/routes`: Contains Express route handlers for different sections (e.g., `index.js`, `blog.js`).
* `/models`: Defines Sequelize data models (e.g., `Post.js`).
* `/views`: Contains EJS templates, including:
    * `/partials`: Reusable template fragments (`header.ejs`, `footer.ejs`).
    * Page templates (`index.ejs`, `blog.ejs`, `post-detail.ejs`, `contact.ejs`).
* `/public`: Contains static assets served directly to the client:
    * `/css`: Stylesheets (`style.css`).
    * `/js`: Client-side JavaScript (`theme.js`, `nav.js`, `particles-init.js`).
    * `/images`: Site images (favicon, avatar).
    * Other static files (`robots.txt`, CV PDF).
* `/data`: (Optional, for SQLite) Contains the `database.sqlite` file during local development.

## Key Implementation Highlights

### SEO

* **Dynamic Metadata:** Page titles and meta descriptions (for blog posts) are generated dynamically based on content for better search engine indexing.
* **Structured Data:** JSON-LD schema for `Person` (homepage) and `BlogPosting` (blog posts) provides rich context to search engines.
* **Crawling & Indexing:** A dynamic `/sitemap.xml` route lists all relevant pages (including blog posts fetched from the DB), and `robots.txt` guides crawlers.

### Performance

* **Theme Flash Prevention:** Uses a server-side cookie approach combined with careful class application on the initial HTML response to prevent content flashes when switching between light/dark themes.
* **Optimized Script Loading:** Client-side JavaScript is loaded at the end of the `<body>` to avoid render-blocking
* **Efficient Background:** Switched from Vanta.js to `particles.js` for a more lightweight animated background solution.
* **Server-Side:** Compression middleware (`compression`) and Cache-Control headers for static assets (via `express.static` options) are recommended additions. Database queries are kept simple, with pagination suggested for blog growth.

### Security

* **HTTP Headers:** `helmet` middleware is used to set various security-related HTTP headers (CSP, X-Frame-Options, etc.). The Content Security Policy is configured to allow necessary external scripts (CDNs) while maintaining security.
* **Cookie Security:** The theme preference cookie uses `SameSite=Lax` and the `Secure` flag (for HTTPS).
* **Credentials:** Database credentials are kept out of the codebase using environment variables (`.env` file loaded via `dotenv`). Ensure `.env` is in `.gitignore`.
* **Dependencies:** Regular checks using `npm audit` are recommended.
* **Data Handling:** Sequelize helps prevent SQL injection. Input validation and output sanitization are crucial if user input features are added.

### Code Clarity & Maintainability

* **Modular Structure:** Clear separation of concerns between routes, models, views, and static assets.
* **Theming:** Extensive use of CSS Custom Properties (Variables) makes theme management (light/dark) clean and maintainable.
* **Code Reusability:** EJS partials are used for common elements like the header and footer.
* **Readability:** Consistent naming and structure are aimed for. Linters/formatters like ESLint/Prettier are recommended.

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
    * Create a `.env` file in the project root.
    * Add your database connection string:
        ```dotenv
        # Option 1: Connect to Supabase/PostgreSQL (replace with your actual URI)
        DATABASE_URL=postgresql://postgres:[YOUR-ENCODED-PASSWORD]@[YOUR_SUPABASE_HOST]:5432/postgres

        # Option 2: If DATABASE_URL is not set, the app falls back to SQLite (database.js)
        # No DATABASE_URL needed if you only want to use the SQLite fallback locally.

        # Add your website's base URL (used for sitemap)
        BASE_URL=http://localhost:3000
        ```
    * *(Remember to URL-encode your password in the `DATABASE_URL`)*
4.  **Database Setup:**
    * The application uses `sequelize.sync({ force: false })` on startup. This will automatically create the `Posts` table in your configured database (SQLite or PostgreSQL) if it doesn't exist, based on the `models/Post.js` definition.
    * For production, managing the schema via Sequelize migrations is recommended over `sync`.
5.  **Add Blog Posts (Optional):** Add posts directly to your database (using Supabase Table Editor or DB Browser for SQLite) to see them on the `/blog` page.
6.  **Start the server:**
    ```bash
    npm start
    ```
7.  Open your browser and navigate to `http://localhost:3000` (or the port specified in `.env` or `server.js`).

## Deployment

This application is designed to be deployed on platforms like Render (as indicated by logs during debugging). Key considerations for deployment:

* Set environment variables (`DATABASE_URL`, `NODE_ENV=production`, `BASE_URL`) in the hosting platform's settings.
* Ensure the production `DATABASE_URL` points to your live database (Supabase).
* Ensure the site is served over HTTPS.
* Consider implementing a build step for frontend assets (minification, bundling) for optimal performance.

## License

MIT License