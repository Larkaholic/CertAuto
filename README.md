# CertAuto
Auto-generates e-certificates for events based on attendance data.

## Installation

```bash
# Install required dependencies
npm install react react-dom konva react-konva @types/react @types/react-dom

# Install konva
npm install konva react-konva

# Install Resend
npm install resend

# Install other project dependencies
npm install

# Start development server
npm run dev
```

## Troubleshooting

If you encounter issues with react-konva in a Next.js environment, consider the following:

1. Make sure both `konva` and `react-konva` packages are installed
2. Use the "use client" directive for components using react-konva
3. For Next.js, you might need dynamic imports for Konva components to handle SSR