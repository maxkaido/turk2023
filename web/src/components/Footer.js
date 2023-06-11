import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faGithub } from "@fortawesome/free-brands-svg-icons";

import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <a
          href="https://t.me/wikiwager"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <FontAwesomeIcon icon={faTelegram} className="h-7 w-7 mr-4" />
        </a>
        <a
          href="https://github.com/maxkaido/turk2023"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <FontAwesomeIcon icon={faGithub} className="h-7 w-7 mr-4" />
        </a>
        <a
          href="mailto:a@wikiwager.xyz"
          className="text-white hover:text-gray-300"
        >
          <FontAwesomeIcon icon={faEnvelope} className="h-7 w-7 mr-4" />
        </a>
      </div>
    </footer>
  );
}
