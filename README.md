<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Astro][astro-shield]][astro-url]
[![Built with Astro](https://astro.badg.es/v1/built-with-astro.svg)](https://astro.build)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Hopelezz/HopelezzBlog">
    <img src="https://user-images.githubusercontent.com/72772558/180280901-7d62a24c-0354-4da5-8526-0aef52a4c161.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">&#60;BlackSkies &#47;&#62;</h3>

  <p align="center">
    Welcome to BlackSkies.net, where we navigate the vast universe of tech and programming with curiosity and passion!
    <br />
    <a href="https://blackskies.net"><strong>Explore the Blog »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Hopelezz/HopelezzBlog">View Demo</a>
    ·
    <a href="https://github.com/Hopelezz/HopelezzBlog/issues">Report Bug</a>
    ·
    <a href="https://github.com/Hopelezz/HopelezzBlog/issues">Request Feature</a>
  </p>
</div>

## Table of Contents

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Contact]
- [Acknowledgments](#acknowledgements)

## About The Project

[BlackSkies] is your go-to place for all things tech and programming. Whether you're a seasoned developer or just dipping your toes into the digital universe, we've got something for you. From coding tips to tech reviews, we're here to make your journey through the black skies of technology a little brighter.

### Key Features

- 🔐 Secure Authentication with Supabase
- 📝 Markdown Post Editor with Live Preview
- 👥 Role-Based Access Control
- 🎨 Responsive Admin Dashboard
- 📊 Post Analytics and Statistics
- 🏷️ Tag Management System
- 🌓 Dark Mode Support
- 📱 Mobile-Friendly Design
- 🚀 Fast and Performant

### Built With

- [Astro](https://astro.build) - Static Site Generator
- [Supabase](https://supabase.com) - Backend & Authentication
- [Flowbite](https://flowbite.com) - UI Components
- [TailwindCSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Marked](https://marked.js.org/) - Markdown Parser

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Hopelezz/blackskies.git
   ```
2. Install NPM packages
   ```sh
    npm install
   ```
3. Start the development server
   ```sh
     npm run astro dev
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_SITE_URL=your_site_url
```

## Usage

The blog posts and content are written in markdown and can be found in the `src/posts` directory. To add a new post, simply create a new markdown file in the `src/posts` directory and follow the existing markdown files as a template.

## Roadmap

### Project Implementation Todo List

#### 1. Authentication & Authorization
- [x] Implement Supabase authentication
- [x] Add sign-in/sign-out functionality
- [ ] Implement role-based access control
  - [x] Admin role with full access
  - [ ] Editor role with content management
  - [ ] Author role with personal content control
  - [ ] Viewer role with read-only access

#### 2. User Interface & Design
- [x] Integrate Flowbite components
- [ ] Implement custom admin styling
  - [ ] Create admin.css for consistent styling in admin routes
  - [ ] Add dark mode support for admin routes
  - [ ] Style admin dashboard
- [ ] Add responsive design improvements
  - [ ] Mobile-friendly navigation
  - [ ] Adaptive layouts
  - [ ] Touch-friendly controls

#### 3. Content Management
- [x] Create post editor
- [x] Implement markdown support
- [ ] Add media management
  - [ ] Image upload and optimization
  - [ ] Video embed support
- [x] Implement tagging system
  - [ ] Tag-based post filtering
  - [ ] Tag creation and management
  - [ ] Tag-based filtering
  - [ ] Tag cloud visualization

#### 4. Admin Features
- [x] Dashboard statistics
- [ ] User management interface
  - [ ] User list with role management
  - [ ] User profile editing
  - [ ] Activity logging
- [ ] Content workflow
  - [x] Draft/publish system (Part of the post editor/Post Table)
  - [ ] Content scheduling (Can use the flowbite calendar)
  - [ ] Review process (Maybe have an editor role, or a review process with forced formatting?)

#### 5. Performance & Security
- [ ] Implement caching
- [ ] Add rate limiting (May not be needed due to setup.)
- [ ] Security improvements
  - [ ] Input validation
  - [x] DOMPurifier for script sanitization in the post editor
  - [ ] XSS protection
  - [ ] CSRF protection
- [ ] Performance monitoring

#### 6. Additional Features
- [ ] Search functionality (Can use the flowbite search component)
  - [ ] Full-text search
  - [ ] Advanced filters
- [ ] Analytics integration
- [ ] API documentation
- [ ] Automated testing
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] E2E tests

See the [open issues](https://github.com/Hopelezz/HopelezzBlog/issues) for a full list of proposed features (and known issues).

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Mark Spratt - [@\_hopelezz](https://x.com/_hopelezz)

Project Link: [BlackSkies](https://blackskies.netlify.app/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/Hopelezz/HopelezzBlog.svg?style=for-the-badge
[contributors-url]: https://github.com/Hopelezz/HopelezzBlog/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Hopelezz/HopelezzBlog.svg?style=for-the-badge
[forks-url]: https://github.com/Hopelezz/HopelezzBlog/network/members
[stars-shield]: https://img.shields.io/github/stars/Hopelezz/HopelezzBlog.svg?style=for-the-badge
[stars-url]: https://github.com/Hopelezz/HopelezzBlog/stargazers
[issues-shield]: https://img.shields.io/github/issues/Hopelezz/HopelezzBlog.svg?style=for-the-badge
[issues-url]: https://github.com/Hopelezz/HopelezzBlog/issues
[license-shield]: https://img.shields.io/github/license/Hopelezz/HopelezzBlog.svg?style=for-the-badge
[license-url]: https://github.com/Hopelezz/HopelezzBlog/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[astro-shield]: https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=fff&style=for-the-badge
[astro-url]: https://astro.build/
[product-screenshot]: images/screenshot.png
