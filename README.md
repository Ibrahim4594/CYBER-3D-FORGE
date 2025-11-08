# CYBER 3D FORGE

<div align="center">

![Version](https://img.shields.io/badge/version-2.0-00f5ff)
![Status](https://img.shields.io/badge/status-active-06ffa5)
![License](https://img.shields.io/badge/license-MIT-ff006e)
![Code](https://img.shields.io/badge/code-4600%2B%20lines-8338ec)

**Transform Text into 3D Reality with AI**

*A cutting-edge cyberpunk-themed web application that converts text descriptions into interactive 3D models using advanced AI generation APIs.*

[Features](#-features) • [Quick Start](#-quick-start) • [Demo](#-demo) • [API Setup](#-api-setup) • [Usage](#-usage) • [Troubleshooting](#-troubleshooting)

---

</div>

## 🎮 Features

### Core Features
- **AI-Powered 3D Generation** - Convert any text description into 3D models
- **Multi-Provider Support** - Works with Meshy AI, Tripo AI, and custom APIs
- **Real-time 3D Viewer** - Interactive WebGL-based model viewer with orbit controls
- **Cyberpunk UI** - Stunning Kafka x Silver Wolf themed interface
- **60 FPS Performance** - GPU-accelerated, lag-free experience

### Advanced Features

#### 📱 AR Preview
View your 3D models in augmented reality on your phone!
- Generate QR codes for instant AR viewing
- Google AR Scene Viewer integration
- No app installation required
- View models in your real-world environment

#### 🎨 Model Editor
Edit and customize your 3D models in real-time:
- **Scale Control** - Resize from 0.5x to 3.0x
- **Rotation Control** - Rotate on X/Y/Z axes (0° - 360°)
- **Color Tinting** - Apply custom colors to entire models
- **Live Preview** - See changes instantly

#### ⚡ Batch Generator
Generate multiple models automatically:
- Process unlimited prompts at once
- Auto-download generated models
- Customizable delay between generations (5-60s)
- Real-time progress tracking
- Stop/resume capability

#### 🤖 AI Prompt Enhancer
Transform simple prompts into professional descriptions:
- **6 Style Presets:**
  - Cyberpunk (neon, holographic, futuristic)
  - Anime (vibrant, cel-shaded, manga)
  - Realistic (photorealistic, ultra HD)
  - Low Poly (geometric, minimalist)
  - Fantasy (magical, mystical, ornate)
  - Sci-Fi (advanced tech, space-age)
- One-click prompt enhancement
- Instant application to generator

### Additional Features
- **YouTube Music Integration** - Background music with toggle control
- **Model Gallery** - Auto-saves last 20 generated models
- **Generation History** - Tracks up to 50 generations
- **Theme Switcher** - 5 color themes (Blue, Purple, Pink, Green, Gold)
- **Wireframe Mode** - View model structure
- **Download Models** - Export as OBJ/GLB files
- **Responsive Design** - Works on desktop and mobile

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Python 3.7+ (for local server)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ibrahim4594/CYBER-3D-FORGE.git
cd CYBER-3D-FORGE
```

2. **Start the local server**
```bash
python -m http.server 8000
```

3. **Open in browser**
```
http://localhost:8000
```

That's it! The application is now running.

---

## 🎯 Demo

**Want to try it without API keys?**

The application includes a **Demo Mode** with procedural 3D generation:

- "sphere" → Creates a sphere
- "cylinder" → Creates a cylinder
- "cone" → Creates a cone
- "torus" → Creates a torus
- "character" → Creates a simple character model
- Default → Creates a cube

Try: `"create a red sphere"` or `"make a blue character"`

---

## 🔑 API Setup

For **real AI-powered 3D generation**, configure an API provider:

### Option 1: Meshy AI (Recommended)

1. **Sign up:** [meshy.ai](https://www.meshy.ai/)
2. **Get API Key:** Dashboard → API Settings
3. **Configure:**

Open `config.js` and update:
```javascript
API_PROVIDER: 'meshy',

MESHY: {
    API_KEY: 'msy_your_actual_api_key_here',
    API_URL: 'https://api.meshy.ai/v2/text-to-3d',
    TASK_URL: 'https://api.meshy.ai/v2/text-to-3d'
},

SETTINGS: {
    DEMO_MODE: false  // Disable demo mode
}
```

### Option 2: Tripo AI

1. **Sign up:** [tripo3d.ai](https://www.tripo3d.ai/)
2. **Get API Key:** Account → Developer
3. **Configure:**

```javascript
API_PROVIDER: 'tripo',

TRIPO: {
    API_KEY: 'your_tripo_api_key_here'
},

SETTINGS: {
    DEMO_MODE: false
}
```

### Option 3: Custom API

```javascript
API_PROVIDER: 'custom',

CUSTOM: {
    API_KEY: 'your_custom_key',
    API_URL: 'https://your-api.com/generate',
    HEADERS: {
        'Content-Type': 'application/json'
    }
}
```

---

## 📖 Usage

### Basic Generation

1. **Enter Prompt**
   ```
   "a futuristic cyberpunk robot with neon lights"
   ```

2. **Click Generate** or press Enter

3. **Interact with Model**
   - **Left Click + Drag** - Rotate
   - **Scroll** - Zoom
   - **Right Click + Drag** - Pan

### Using the Model Editor

1. Generate a 3D model
2. Scroll down to **MODEL EDITOR**
3. Adjust sliders:
   - **Scale** - Make bigger/smaller
   - **Rotation X/Y/Z** - Rotate on axes
   - **Color** - Apply tint
4. Click **APPLY CHANGES**

### Using the Batch Generator

1. Scroll to **BATCH GENERATOR**
2. Click **EXPAND**
3. Enter prompts (one per line):
   ```
   cyberpunk robot
   futuristic car
   neon character
   sci-fi weapon
   ```
4. Set options:
   - ☑ Auto-download models
   - ⏱️ Delay: 10 seconds
5. Click **🚀 START BATCH GENERATION**

### Using the Prompt Enhancer

1. Scroll to **AI PROMPT ENHANCER**
2. Click **EXPAND**
3. Enter simple prompt: `"robot"`
4. Select style: **Cyberpunk**
5. Click **✨ ENHANCE PROMPT**
6. Result:
   ```
   "A robot, neon-lit, holographic, futuristic, high-tech,
   glowing circuits, chrome details, dark atmosphere,
   urban dystopia, high quality 3D model, detailed,
   well-lit, professional render"
   ```
7. Click **USE THIS PROMPT** to apply

### AR Preview

1. Generate a model
2. Click **📱 AR** button
3. Scan QR code with phone OR click link
4. View in AR!

---

## 🎨 Project Structure

```
CYBER-3D-FORGE/
├── index.html              # Main structure
├── app.js                  # Core logic (1100+ lines)
├── styles.css              # Main styling (1600+ lines)
├── config.js               # API configuration
├── new-features.js         # Advanced features (450+ lines)
├── new-features.css        # Feature styling (370 lines)
├── .gitignore             # Git exclusions
└── README.md              # This file
```

**Total: 4,600+ lines of code**

---

## 🛠️ Technologies

- **Three.js** - 3D graphics rendering
- **WebGL** - Hardware-accelerated graphics
- **YouTube IFrame API** - Background music
- **Google AR Scene Viewer** - AR preview
- **Meshy AI / Tripo AI** - AI 3D generation
- **HTML5/CSS3/ES6+** - Modern web standards

---

## ⚙️ Configuration

### Settings in `config.js`

```javascript
SETTINGS: {
    // Polling interval for generation status (ms)
    POLL_INTERVAL: 5000,

    // Maximum wait time (ms)
    MAX_WAIT_TIME: 300000,  // 5 minutes

    // Model quality
    QUALITY: 'medium',  // 'low', 'medium', 'high'

    // Enable/disable demo mode
    DEMO_MODE: true,

    // Theme
    THEME: 'blue'  // 'blue', 'purple', 'pink', 'green', 'gold'
}
```

### Performance Settings

For **maximum performance**:
```javascript
SETTINGS: {
    QUALITY: 'medium',
    // Buildings already optimized to 60 (from 180)
    // Particle animations disabled
    // GPU acceleration enabled
}
```

For **best quality**:
```javascript
SETTINGS: {
    QUALITY: 'high',
    POLL_INTERVAL: 3000  // Check more frequently
}
```

---

## 🔧 Troubleshooting

### Models Not Generating?

**Check:**
1. Browser console (F12) for errors
2. API key is correct in `config.js`
3. Running via HTTP server (not direct file)
4. API credits available
5. Try demo mode first

**Solution:**
```javascript
// Enable demo mode to test
SETTINGS: {
    DEMO_MODE: true
}
```

### Music Not Playing?

**Cause:** Browsers block autoplay

**Solution:**
1. Click the music button (bottom-left)
2. Music will start playing
3. Click again to pause

### Performance Issues?

**Optimizations:**
1. Close other browser tabs
2. Update graphics drivers
3. Reduce browser window size
4. Disable browser extensions
5. Use Chrome/Edge (best WebGL support)

**Already Optimized:**
- 60 buildings (reduced from 180)
- Particle animations disabled
- GPU acceleration enabled
- Efficient rendering pipeline

### CORS Errors?

**Cause:** Opening `index.html` directly

**Solution:**
```bash
# MUST use HTTP server
python -m http.server 8000
```

### AR Preview Not Working?

**Requirements:**
- AR-capable device (most modern phones)
- Chrome/Safari on mobile
- Model must be generated first

### Batch Generator Stuck?

**Solutions:**
1. Click **⏹️ STOP BATCH**
2. Refresh page
3. Check API rate limits
4. Reduce delay between generations

---

## 🎓 Pro Tips

### Tip 1: Batch + Enhance Combo
1. Enhance each prompt individually
2. Copy enhanced prompts to batch generator
3. Generate high-quality batch results

### Tip 2: Edit Before AR
1. Use Model Editor to perfect the model
2. Adjust rotation, scale, color
3. Then preview in AR
4. Saves time!

### Tip 3: Auto-Download Overnight
1. Prepare 50+ prompts
2. Enable auto-download in Batch Generator
3. Set 30s delay
4. Let it run overnight
5. Wake up to 50+ models!

### Tip 4: Style Consistency
1. Pick one style in Prompt Enhancer
2. Use for all batch prompts
3. Get cohesive collection

### Tip 5: Keyboard Shortcuts
- **Enter** - Generate model
- **F** - Reset camera view
- **W** - Toggle wireframe

---

## 🌟 Example Prompts

### Cyberpunk Style
```
"a neon-lit cyberpunk robot with holographic displays"
"futuristic motorcycle with glowing wheels"
"cyber samurai with energy sword"
```

### Fantasy Style
```
"magical crystal castle floating in clouds"
"ancient dragon with shimmering scales"
"enchanted forest with glowing mushrooms"
```

### Realistic Style
```
"photorealistic sports car, red, detailed"
"modern office chair, leather, professional"
"vintage camera, brass details, weathered"
```

### Characters
```
"anime character with spiky hair"
"superhero in dynamic pose"
"cute robot companion"
```

---

## 🚨 Important Notes

### Security
- **Never commit API keys to version control**
- Add `config.js` to `.gitignore` for private repos
- Rotate API keys periodically
- Use environment variables in production

### Limitations
- Generation time: 30s - 5 minutes
- Quality depends on AI API
- Complex prompts may vary in results
- API rate limits apply

### Browser Compatibility
| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Recommended |
| Edge    | 90+     | ✅ Recommended |
| Firefox | 88+     | ✅ Supported |
| Safari  | 14+     | ✅ Supported |
| Opera   | 76+     | ✅ Supported |

---

## 📊 Feature Comparison

| Feature | Basic | With API | Pro |
|---------|-------|----------|-----|
| 3D Generation | ✅ Demo | ✅ AI | ✅ AI |
| Model Editor | ✅ | ✅ | ✅ |
| AR Preview | ✅ | ✅ | ✅ |
| Batch Generator | ❌ | ✅ | ✅ |
| Prompt Enhancer | ❌ | ✅ | ✅ |
| Quality | Low | Medium | High |
| Speed | Instant | 30s-2m | 2-5m |

---

## 🎯 Roadmap

### Planned Features
- [ ] 3D model comparison (side-by-side)
- [ ] Advanced material editor
- [ ] Animation support
- [ ] Texture customization
- [ ] STL/FBX export
- [ ] Cloud save/load
- [ ] Collaborative editing
- [ ] Mobile app version

### Completed Features
- [x] AI 3D generation
- [x] Model editor
- [x] AR preview
- [x] Batch generator
- [x] Prompt enhancer
- [x] YouTube music
- [x] Model gallery
- [x] Theme switcher

---

## 🤝 Contributing

Want to contribute? Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📜 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 CYBER 3D FORGE

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

---

## 📞 Support

### For Issues With:

**This Application:**
- Check [Troubleshooting](#-troubleshooting) section
- Open an issue on GitHub
- Check browser console for errors

**Meshy AI:**
- [Meshy AI Documentation](https://docs.meshy.ai/)
- [Meshy AI Support](https://www.meshy.ai/support)

**Tripo AI:**
- [Tripo AI Documentation](https://platform.tripo3d.ai/docs)
- [Tripo AI Support](https://www.tripo3d.ai/support)

---

## 🎖️ Credits

### Technologies
- **Three.js** - [threejs.org](https://threejs.org/)
- **Meshy AI** - [meshy.ai](https://www.meshy.ai/)
- **Tripo AI** - [tripo3d.ai](https://www.tripo3d.ai/)
- **Google AR** - [developers.google.com/ar](https://developers.google.com/ar)
- **YouTube API** - [developers.google.com/youtube](https://developers.google.com/youtube)

### Inspiration
- Kafka x Silver Wolf (Honkai: Star Rail)
- Cyberpunk aesthetic
- Modern 3D workflows

---

## 📈 Stats

![Code Size](https://img.shields.io/badge/code-4600%2B%20lines-blue)
![Files](https://img.shields.io/badge/files-8-green)
![Features](https://img.shields.io/badge/features-60%2B-orange)
![Performance](https://img.shields.io/badge/performance-60%20FPS-red)

**Built with:**
- 1100+ lines JavaScript (core)
- 450+ lines JavaScript (features)
- 1600+ lines CSS (main)
- 370+ lines CSS (features)

---

<div align="center">

## 🎮 Ready to Forge 3D Models?

**[Start Creating →](http://localhost:8000)**

Made with 💜 by the CYBER 3D FORGE Team

**Star this repo if you found it useful!** ⭐

</div>

---

### Quick Links

- [GitHub Repository](https://github.com/Ibrahim4594/CYBER-3D-FORGE)
- [Report Bug](https://github.com/Ibrahim4594/CYBER-3D-FORGE/issues)
- [Request Feature](https://github.com/Ibrahim4594/CYBER-3D-FORGE/issues)
- [Discussions](https://github.com/Ibrahim4594/CYBER-3D-FORGE/discussions)

---

**Last Updated:** November 2025 | **Version:** 2.0 | **Status:** Active Development
