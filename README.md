# Silvia Ohren - Sound Designer Portfolio

A modern, responsive portfolio website showcasing Silvia Ohren's work as a Sound Designer and Composer for film, documentary, and commercial projects.

## 🎯 Features

- **Single Page Application (SPA)** with smooth navigation
- **Torn Poster Effect** - Interactive cards with realistic paper tear animation
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation
- **Contact Form** - Integrated with Web3Forms for easy communication
- **Protected Upload Area** - Password-protected section for client content
- **Modern CSS** - CSS Grid, Flexbox, CSS Variables, and smooth animations

## 📁 Folder Structure (2024)

```
so-sound-main/
├── index.html                # Main HTML entry point
├── README.md                 # This documentation
├── svg/                      # All main code, demos, and utilities
│   ├── script.js
│   ├── blog.js
│   ├── styles.css
│   ├── blog.css
│   ├── cropper.min.css
│   ├── cropper.min.js
│   ├── upload-handler.php
│   ├── FAVICON_audio-editing.png
│   └── blog.html             # Standalone blog demo
├── data/                     # All project info, uploads, and docs
│   ├── film/                 # Film project info JSONs
│   ├── documentary/          # Documentary project info JSONs
│   ├── commercial/           # Commercial project info JSONs
│   ├── libraries/            # Libraries project info JSONs
│   ├── blogupload/           # Blog uploads
│   └── docs/                 # Site info, CV, privacy, etc.
├── images/                   # All images and icons
│   ├── poster/               # Project posters (film, documentary, commercial, libraries)
│   ├── icons/                # SVG and PNG icons
│   ├── logo-main/            # Main logo(s)
│   ├── blog-pic/             # Blog images
│   ├── profile/              # Profile images and ASCII art
│   ├── cv1.png
│   ├── IMDb.png
│   ├── IMDB2.jpg
│   └── Master_logo_BNC_web_color.png
├── sounds/                   # Audio files (MP3, WAV, etc.)
├── font/                     # Custom fonts (TTF, WOFF, etc.)
```

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Add your fonts** to the `font/` directory:
   - `SVBasicManual.ttf`, `SVBasicManual-Bold.ttf`, etc.
3. **Add audio files** to the `sounds/` directory
4. **Open `index.html`** in your browser (all code and assets are referenced from their new locations)

## 🎨 Design Features

- **Torn Poster Effect**: Realistic paper tear animation on hover/click
- **Color Scheme**: Dark background, light text, pink and emerald accents
- **Typography**: Custom fonts, responsive sizing
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## 📱 Responsive Design

- **Desktop**: Full layout with grid
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Single column layout, optimized navigation

## 🔧 Customization & Maintenance

- **Adding Projects**: Add info JSONs to the appropriate folder in `data/` and poster images to `images/poster/`
- **Changing Styles**: Edit CSS in `svg/styles.css` and `svg/blog.css`
- **Updating Scripts**: Edit JS in `svg/script.js` and `svg/blog.js`
- **Upload Area**: All upload forms now point to `svg/upload-handler.php`
- **Favicon**: Located at `svg/FAVICON_audio-editing.png` and referenced in `index.html`
- **Standalone Blog Demo**: Open `svg/blog.html` directly for a minimal blog demo using the same codebase

## 🔒 Security Notes

- **Password Protection**: The upload area uses client-side password protection
- **For Production**: Consider implementing server-side authentication
- **API Keys**: Keep Web3Forms access key secure

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📈 Performance Optimizations

- **External CSS/JS**: Separated for better caching
- **Optimized Images**: Use WebP format when possible
- **Font Loading**: `font-display: swap` for better performance
- **Minified Assets**: Consider minifying CSS/JS for production

## 🎵 Audio Integration

- Place audio files in `sounds/`
- Reference them in your project info JSONs or HTML as needed

## 📞 Contact

For questions or support:
- Email: siorengo19@gmail.com
- IMDB: [Silvia Ohren on IMDB](https://www.imdb.com/it/name/nm8344062/)
- Studio: [BNC Apps](https://www.bncapps.it/)

## 📄 License

© 2025 silviaohrenwebdesign - All rights reserved

---

**Note**: This portfolio is designed to showcase sound design work with an emphasis on visual storytelling and user experience. The torn poster effect creates a unique, memorable interaction that reflects the creative nature of sound design work.