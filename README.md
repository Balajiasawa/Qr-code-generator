QR Code Generator
 Overview
Welcome to the QR Code Generator! This intuitive web application allows you to effortlessly create QR codes for various types of data, including URLs, plain text, and contact information (vCard). Built with React and styled beautifully with Tailwind CSS, it offers a seamless user experience with a focus on simplicity and functionality.

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
Start the development server:

Bash

npm start
# or
yarn start
Open your browser and navigate to http://localhost:3000 (or the address displayed in your terminal).

Usage
Login/Signup: The application will first present a login/signup screen. You can create a new account (mock authentication) or log in with existing mock credentials.

Select Tab: Choose between "URL", "Text", or "Contact" tabs based on the type of QR code you want to generate.

Enter Data: Fill in the relevant fields in the input section.

QR Code Display: The QR code will be generated and displayed in real-time on the right.

Actions:

Download: Click the "Download" button to save the QR code image.

Copy Data: Click "Copy Data" to copy the text encoded in the QR code.

Clear All Fields: Reset the form inputs.

Logout: Click the "Logout" button to return to the authentication screen.

Contributing
Contributions are welcome! If you have suggestions for improvements, new features, or find any bugs, please feel free to:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes.

Commit your changes (git commit -m 'Add new feature').

Push to the branch (git push origin feature/your-feature-name).

Open a Pull Request.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgements
React

Tailwind CSS

Lucide Icons

QRious

Google Charts API

QR Server API
