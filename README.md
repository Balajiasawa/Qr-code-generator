QR Code Generator
Overview
Welcome to the QR Code Generator! This intuitive web application allows you to effortlessly create QR codes for various data types, including URLs, plain text, and contact information (vCard). Built with React and styled beautifully with Tailwind CSS, it offers a seamless user experience focusing on simplicity and functionality.

Whether you need a QR code for your website, a quick note, or to share your business card, this tool has you covered. Plus, it features a login/signup system to enhance user experience (though currently using mock authentication for demonstration).

Features
Generate QR Codes for:

URLs: Converts website links into scannable QR codes.

Text: Encodes any custom text message.

Contact Information (vCard): Creates QR codes for names, phone numbers, emails, organizations, and websites.

Dynamic QR Code Rendering: Utilizes QRious for efficient client-side QR code generation with fallback options.

Download Functionality: Easily download your generated QR codes as PNG images.

Copy Data: Copy the raw QR code data to your clipboard.

User Authentication (Mock): Simple login and signup forms (with form validation) to simulate user sessions.

Responsive Design: Optimized for a great experience on both desktop and mobile devices.

Internationalization (i18n) Support: Ready for multiple languages (currently English and Spanish implemented).

Modern UI: Clean, dark-themed interface powered by Tailwind CSS and Lucide Icons.

Technologies Used
React: A JavaScript library for building user interfaces.

Tailwind CSS: A utility-first CSS framework for rapidly building custom designs.

Lucide React: A beautiful, open-source icon library.

QRious: A pure JavaScript library for generating QR codes in a browser.

Google Charts API / QR Server API: Fallback options for QR code generation.

Getting Started
Follow these steps to get a copy of the project up and running on your local machine.

Prerequisites
Make sure you have Node.js and npm (Node Package Manager) or Yarn installed.

Installation
Clone the repository:

Bash

git clone [YOUR_REPOSITORY_URL_HERE]
cd [your-project-folder-name]
Install dependencies:

Bash

npm install
# or
yarn install
Install and initialize Tailwind CSS:

Bash

npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss init -p
Configure tailwind.config.js:
Open tailwind.config.js and ensure the content array includes paths to your React components:

JavaScript

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
Add Tailwind directives to your CSS:
Open src/App.css (or src/index.css) and add the following:

CSS

/* src/App.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
Running the Application
