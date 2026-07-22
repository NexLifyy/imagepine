# 🌲 Image Pine

[![Live Website](https://img.shields.io/badge/Website-imagepine.com-5B5BD6?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.imagepine.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Privacy Focused](https://img.shields.io/badge/Privacy-100%25%20Client--Side-00C853?style=for-the-badge&logo=shield&logoColor=white)](https://www.imagepine.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

**Image Pine** (https://www.imagepine.com/) is a powerful, privacy-first web application featuring over 50+ free online image, document, AI metadata, GIF, and PDF tools. All image processing, canvas operations, OCR text extraction, and PDF manipulation take place locally in your browser sandbox, ensuring your files never leave your device.

---

## ✨ Key Features & Capabilities

### 🤖 1. AI Metadata & Vision Tagging
- **Gemini 3.5 Flash Integration**: Generate high-converting stock photo titles, descriptions, and SEO keywords automatically.
- **Batch Processing**: Infer metadata for up to 500 images simultaneously.
- **Stock Platform Formats**: One-click CSV export optimized for Adobe Stock, Shutterstock, iStock, Freepik, Pond5, and 123RF.

### 🎭 2. Interactive Meme Generator
- **Live Canvas Editor**: Click and drag text directly on top of images with real-time responsive font scaling.
- **100+ Meme Templates**: Built-in template search integration powered by Imgflip and Memegen APIs.
- **Custom Uploads & Zero Watermarks**: Import custom local photos and export high-resolution memes without watermarks.

### 🔄 3. Image Converters
- **Multi-Format Support**: Convert between PNG, JPG, WebP, HEIC, AVIF, SVG, TIFF, and BMP seamlessly.
- **Batch Conversions**: Process hundreds of image conversions in parallel inside Web Workers.
- **Vector & Raster Tools**: SVG rasterization and PNG-to-SVG vectorization.

### 📄 4. PDF Tools & Document Processing
- **PDF Converters**: Convert JPG, PNG, and WebP images to PDF documents and extract images from PDF files.
- **PDF Manipulation**: Merge, split, compress, and add or remove pages from PDF documents.
- **Privacy Guaranteed**: Local client-side processing using `pdf-lib`.

### 🎨 5. Image Editor & Utilities
- **Batch Resize & Rename**: Bulk resize images by percentage or custom dimensions, and bulk rename asset catalogs.
- **Crop, Rotate & Flip**: Precise aspect ratio cropping, rotation, and mirror flipping.
- **Filters & Effects**: Color adjustments, palette extraction, pixelator, watermark overlays, and photo collages.
- **OCR Text Extraction**: Client-side optical character recognition powered by Tesseract.js.
- **GIF Tools**: GIF maker, converter, and compression engine.
- **QR Code Generator**: Custom QR code creator with instant download options.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Modern Vanilla CSS Design Tokens
- **AI Integration**: Google Gemini 3.5 Flash Vision API
- **Client-Side Engines**:
  - **Canvas & Rendering**: HTML5 Canvas API
  - **OCR**: `tesseract.js`
  - **PDF Utilities**: `pdf-lib`
  - **Background Removal**: `@imgly/background-removal`
  - **Exif Data**: `exifreader`
  - **GIF Processing**: `gifshot` & `gifuct-js`
  - **HEIC Decoding**: `heic2any`
  - **Archival Export**: `jszip` & `file-saver`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NexLifyy/image-pine.git
   cd image-pine
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SITE_URL=https://www.imagepine.com
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

---

## 🔒 Privacy & Security

Image Pine is engineered with a strict **Privacy-First** architecture:
- All client images are processed in-memory using WebAssembly and Web Worker threads.
- Files are **never uploaded** to third-party file servers.
- API keys (such as Google Gemini keys) are stored locally in secure browser cookies and sent directly via preflight-restricted endpoints.

---

## ☕ Support & Community

If you find Image Pine helpful, consider supporting the project:

- **Website**: [https://www.imagepine.com/](https://www.imagepine.com/)
- **Buy Us a Coffee**: [https://buymeacoffee.com/thefaisal](https://buymeacoffee.com/thefaisal)
- **Product by**: **NexLifyy**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
