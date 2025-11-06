# Image Converter - WebP PWA

A Progressive Web App (PWA) for converting images to WebP format, built following Apple's Human Interface Guidelines.

## Features

- 🖼️ **Universal Image Support**: Convert JPG, PNG, GIF, BMP, and TIFF to WebP
- ⚙️ **Customizable Settings**: Adjust quality and resize images
- 📱 **Responsive Design**: Optimized for both desktop and mobile (portrait mode)
- 🎨 **Apple Design System**: Clean interface with glassmorphism effects
- ⚡ **Fast & Offline**: Works offline as a PWA with service worker caching
- 📥 **Easy Download**: One-click download of converted images
- 🔒 **Privacy First**: All processing happens locally in your browser

## Design Principles

This application follows Apple's Human Interface Guidelines:

- **San Francisco Font**: Uses -apple-system and SF Pro Display font stack
- **Minimalism**: Clean, uncluttered interface with purpose-driven elements
- **White Space**: Generous padding and breathing room
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Haptic Feedback**: Visual feedback on touch interactions
- **Safe Areas**: Respects iOS notch and home indicator regions

## Usage

1. **Upload**: Click or drag & drop an image
2. **Configure**: Adjust quality (1-100%) and optionally resize
3. **Convert**: Click "Convert to WebP"
4. **Download**: Save your optimized WebP image

## Deployment to GitHub Pages

This app is designed to be hosted on GitHub Pages:

1. Push code to your repository
2. Go to Settings → Pages
3. Select branch (main/master) and root folder
4. Your app will be available at: `https://yourusername.github.io/image-converter/`

## Local Development

Simply open `index.html` in a modern browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then open: `http://localhost:8000`

## Browser Support

- Chrome/Edge 80+
- Safari 14+
- Firefox 75+

WebP conversion requires browser support for Canvas API and WebP encoding.

## Credits

A product by **solvepao research**

## License

MIT License - Feel free to use and modify
