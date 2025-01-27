import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "http://blackskies.net",
  author: "Mark Spratt",
  devsite: "http://markspratt.dev",
  desc: "A Software Developer, Electrical Engineer and Tech Writter.",
  title: "BlackSkies",
  ogImage: "favicon-512x512.png",
  lightAndDarkMode: true,
  postPerPage: 4,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/Hopelezz",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/mark-spratt/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Developer Website",
    href: SITE.devsite,
    linkTitle: `${SITE.title} Developer Website`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:panzerlink@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/_Hopelezz",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
];
