# CertAuto
Auto-generates e-certificates for events based on attendance data.

## Installation

```bash
# Install React and TypeScript dependencies
npm install react react-dom @types/react @types/react-dom

# Install Konva for canvas manipulation
npm install konva react-konva --save

# Install Cloudinary for image management
npm install next-cloudinary

# Install Firebase for authentication and database
npm install firebase

# Install EmailJS for sending emails
npm install --save @emailjs/browser

# Install UI components
npm install antd @ant-design/icons

# Install other project dependencies
npm install

# Start development server
npm run dev
```

## Troubleshooting

### React-Konva in Next.js

If you encounter issues with react-konva in a Next.js environment, consider the following:

1. Make sure both `konva` and `react-konva` packages are installed
2. Use the "use client" directive for components using react-konva
3. Use dynamic imports with `{ ssr: false }` for all Konva components:

   ```tsx
   import dynamic from 'next/dynamic';

   const Stage = dynamic(() => import('react-konva').then(mod => mod.Stage), { 
     ssr: false 
   });
   ```

4. Add this to your `next.config.js` to disable canvas resolution on server-side:

   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     webpack: (config) => {
       config.resolve.alias = {
         ...config.resolve.alias,
         'canvas': false,
         'jsdom': false,
       };
       return config;
     },
   };

   module.exports = nextConfig;
   ```

5. When working with images, make sure to create them only on the client side:

   ```tsx
   useEffect(() => {
     if (typeof window !== 'undefined') {
       const img = new window.Image();
       // ... rest of your image loading logic
     }
   }, []);
   ```

### Cloudinary Setup
You'll need to create a Cloudinary account and configure your environment variables with your Cloudinary credentials.

### Firebase Setup
After installation, initialize Firebase in your project and configure authentication and database services as needed.

### EmailJS Configuration
Create an EmailJS account and set up your email templates before implementing the email functionality.

## Features

### Certificate Designer
- Upload certificate template images
- Position and format participant names on certificates
- Preview how certificates will look with sample names
- Save certificate templates for future use