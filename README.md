# Image Converter - WebP PWA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-Enabled-brightgreen.svg)](https://developers.google.com/web/progressive-web-apps/)
[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red.svg)](https://github.com/devonepao/image-converter)

A powerful Progressive Web App (PWA) for converting images to WebP format with support for batch processing via ZIP files. Built following Apple's Human Interface Guidelines for a clean, intuitive user experience.

## ✨ Features

- 🖼️ **Universal Image Support**: Convert JPG, PNG, GIF, BMP, and TIFF to WebP
- 📦 **Batch Processing**: Upload ZIP files with multiple images and get back a ZIP with converted images
- ⚙️ **Flexible Quality Settings**: Choose from presets (Low, Medium, High, Maximum) or fine-tune with custom quality slider
- 📐 **Image Resizing**: Optionally resize images during conversion
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🎨 **Apple Design System**: Clean interface with glassmorphism effects and SF Pro Display font
- ⚡ **Fast & Offline**: Works offline as a PWA with service worker caching
- 📥 **Easy Download**: One-click download of converted images or ZIP archives
- 🔒 **Privacy First**: All processing happens locally in your browser - no server uploads
- 📊 **Real-time Progress**: See conversion progress for batch operations

## 🚀 Quick Start

### Online Use

Visit the live app: [https://devonepao.github.io/image-converter/](https://devonepao.github.io/image-converter/)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/devonepao/image-converter.git
cd image-converter
```

2. Open `index.html` in a modern browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

## 📖 Usage

### Single Image Conversion

1. **Select Mode**: Click "Single Image" button
2. **Upload**: Click or drag & drop an image
3. **Choose Quality**: Select a preset (Low, Medium, High, Maximum) or use the custom slider
4. **Optional Resize**: Enter new dimensions if needed
5. **Convert**: Click "Convert to WebP"
6. **Download**: Save your optimized WebP image

### Batch Processing (ZIP)

1. **Select Mode**: Click "ZIP Archive" button
2. **Upload**: Upload a ZIP file containing multiple images
3. **Choose Quality**: Select quality settings (applies to all images)
4. **Optional Resize**: Set dimensions (applies to all images)
5. **Convert**: Click "Convert to WebP" to process all images
6. **Download**: Get a new ZIP file with all converted images

### Quality Presets

- **Low (60%)**: Maximum compression, smaller file sizes, slight quality loss
- **Medium (80%)**: Balanced compression and quality (recommended)
- **High (90%)**: Minimal compression, excellent quality
- **Maximum (100%)**: Lossless or near-lossless quality

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS Variables
- **JavaScript (ES6+)**: Vanilla JS with async/await and modern APIs
- **Canvas API**: For image processing and WebP conversion
- **JSZip**: For handling ZIP file extraction and creation
- **Service Worker**: For offline functionality and caching
- **PWA Manifest**: For installable app experience

## 🎨 Design Principles

This application follows Apple's Human Interface Guidelines:

- **San Francisco Font**: Uses `-apple-system` and SF Pro Display font stack
- **Minimalism**: Clean, uncluttered interface with purpose-driven elements
- **White Space**: Generous padding and breathing room
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Haptic Feedback**: Visual and vibration feedback on touch interactions
- **Safe Areas**: Respects iOS notch and home indicator regions
- **Dark Mode**: Automatic theme switching based on system preferences

## 🌐 Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome  | 80+     | Full support |
| Edge    | 80+     | Full support |
| Safari  | 14+     | Full support |
| Firefox | 75+     | Full support |

**Requirements**: WebP conversion requires browser support for Canvas API and WebP encoding.

## 📦 Deployment

### GitHub Pages

1. Push code to your GitHub repository
2. Go to Settings → Pages
3. Select branch (main/master) and root folder
4. Your app will be available at: `https://yourusername.github.io/image-converter/`

### Other Platforms

The app is a static website and can be hosted on any web server or static hosting service:
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and structure
- Test your changes across different browsers
- Ensure mobile responsiveness
- Update documentation if needed
- Keep commits atomic and well-described

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/devonepao/image-converter/issues).

When reporting bugs, please include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 solvepao research

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**solvepao research**

- GitHub: [@devonepao](https://github.com/devonepao)

## 🙏 Acknowledgments

- [JSZip](https://stuk.github.io/jszip/) - For ZIP file handling
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - For image processing
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - For design inspiration

## 📊 Project Status

This project is actively maintained. Feel free to star ⭐ the repository if you find it useful!

---

<p align="center">Made with ❤️ by solvepao research</p>
