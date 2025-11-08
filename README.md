# Text to 3D Model Generator

A modern web application that converts text descriptions into interactive 3D models using AI-powered generation APIs and Three.js for rendering.

## Features

- Simple, intuitive user interface with text input
- Real-time 3D model generation from text descriptions
- Interactive 3D viewer with orbit controls
- Wireframe toggle for viewing model structure
- Camera reset functionality
- Model download capability
- Responsive design that works on desktop and mobile
- Demo mode for testing without API keys
- Support for multiple AI 3D generation APIs

## Demo Mode

The application comes with **Demo Mode** enabled by default, which allows you to test the interface immediately without configuring API keys. Demo mode generates procedural 3D shapes based on keywords in your prompt:

- "sphere", "ball", "planet" → Creates a sphere
- "cylinder", "can", "tube" → Creates a cylinder
- "cone", "pyramid" → Creates a cone
- "torus", "ring", "donut" → Creates a torus
- "character", "person", "goku" → Creates a simple character model
- Default → Creates a cube

Try entering: "make a red character" or "create a blue sphere"

## Setup Instructions

### 1. Prerequisites

You need a modern web browser (Chrome, Firefox, Edge, or Safari) that supports WebGL.

### 2. Running Locally

#### Option A: Using a Simple HTTP Server

The easiest way to run this application is using a simple HTTP server. Here are several options:

**Python 3 (if installed):**
```bash
# Navigate to the project directory
cd "C:\Users\ibrah\OneDrive\Desktop\3d generator"

# Start server
python -m http.server 8000
```

**Python 2 (if installed):**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (if installed):**
```bash
# Install http-server globally (one time only)
npm install -g http-server

# Start server
http-server -p 8000
```

**Using VS Code:**
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

**Using PHP (if installed):**
```bash
php -S localhost:8000
```

After starting the server, open your browser and navigate to:
```
http://localhost:8000
```

#### Option B: Direct File Opening (Limited Functionality)

You can open `index.html` directly in your browser, but some features may not work due to CORS restrictions.

### 3. Configuring API Keys (For Production Use)

To use real AI-powered 3D generation instead of demo mode, you need to configure an API key:

#### Option 1: Meshy AI (Recommended)

Meshy AI specializes in text-to-3D generation and provides excellent results.

1. **Sign up for Meshy AI:**
   - Go to [https://www.meshy.ai/](https://www.meshy.ai/)
   - Create a free account
   - Navigate to your API settings to get your API key

2. **Configure the application:**
   - Open `config.js` in a text editor
   - Find the line: `API_KEY: 'your-meshy-api-key-here'`
   - Replace `'your-meshy-api-key-here'` with your actual API key
   - Set `DEMO_MODE: false` to enable real API calls

3. **Example configuration:**
```javascript
MESHY: {
    API_KEY: 'msy_1234567890abcdef',  // Your actual API key
    API_URL: 'https://api.meshy.ai/v1/text-to-3d',
    TASK_URL: 'https://api.meshy.ai/v1/text-to-3d'
},

SETTINGS: {
    DEMO_MODE: false  // Disable demo mode
}
```

#### Option 2: Stability AI

1. Sign up at [https://stability.ai/](https://stability.ai/)
2. Get your API key from the developer dashboard
3. Update `config.js`:
   - Set `API_PROVIDER: 'stability'`
   - Replace the API key in the `STABILITY` section
   - Set `DEMO_MODE: false`

#### Option 3: Custom API

If you have your own 3D generation service:

1. Update the `CUSTOM` section in `config.js`:
```javascript
API_PROVIDER: 'custom',

CUSTOM: {
    API_KEY: 'your-api-key',
    API_URL: 'https://your-api-endpoint.com/generate',
    HEADERS: {
        'Content-Type': 'application/json',
        // Add any custom headers
    }
}
```

2. You may need to modify the `generateWithCustomAPI` function in `app.js` to match your API's request/response format.

### 4. Configuration Options

In `config.js`, you can customize various settings:

```javascript
SETTINGS: {
    // Polling interval for checking model generation status (ms)
    POLL_INTERVAL: 5000,

    // Maximum time to wait for generation (ms)
    MAX_WAIT_TIME: 300000,  // 5 minutes

    // Model quality
    QUALITY: 'medium',  // 'low', 'medium', or 'high'

    // Enable/disable demo mode
    DEMO_MODE: true
}
```

## Usage

1. **Enter a description:** Type a description of the 3D model you want to create in the text input field.

   Examples:
   - "make a Goku 3D model"
   - "create a red sports car"
   - "generate a medieval castle"
   - "a blue dragon"

2. **Generate:** Click the "Generate 3D Model" button or press Enter.

3. **View:** The 3D model will appear in the viewer. You can:
   - Click and drag to rotate the view
   - Scroll to zoom in/out
   - Right-click and drag to pan

4. **Controls:**
   - **Reset View:** Returns camera to default position
   - **Wireframe:** Toggles wireframe view to see model structure
   - **Download:** Downloads the model as JSON (for procedural models)

## Project Structure

```
3d generator/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── config.js           # Configuration and API keys
├── app.js              # Main application logic
└── README.md           # This file
```

## Technologies Used

- **Three.js** - 3D graphics library for WebGL rendering
- **HTML5/CSS3** - Modern web standards
- **JavaScript (ES6+)** - Application logic
- **Meshy AI / Stability AI** - AI-powered 3D generation

## API Information

### Meshy AI

- **Website:** [https://www.meshy.ai/](https://www.meshy.ai/)
- **Documentation:** [https://docs.meshy.ai/](https://docs.meshy.ai/)
- **Pricing:** Free tier available with limited credits
- **Best for:** Text-to-3D generation, high-quality models

### Stability AI

- **Website:** [https://stability.ai/](https://stability.ai/)
- **Best for:** Various AI generation tasks

## Troubleshooting

### Models not generating?

1. Check browser console (F12) for errors
2. Verify your API key is correctly configured in `config.js`
3. Make sure you're running via HTTP server, not opening file directly
4. Check that you have available API credits
5. Try enabling demo mode to test the interface

### Viewer not showing?

1. Ensure your browser supports WebGL (test at [https://get.webgl.org/](https://get.webgl.org/))
2. Update your graphics drivers
3. Try a different browser

### API errors?

1. Verify your API key is valid and has credits
2. Check the browser console for detailed error messages
3. Ensure your API provider's service is operational
4. Review the API documentation for any changes

### CORS errors?

1. You must run the application through an HTTP server
2. Do not open `index.html` directly in the browser
3. Follow the "Running Locally" instructions above

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **For faster generation:** Use `mode: 'preview'` in Meshy API configuration
2. **For better quality:** Use `mode: 'refine'` (takes longer)
3. **Optimize viewport:** Reduce browser window size for better performance on slower machines
4. **Close other tabs:** 3D rendering can be resource-intensive

## Security Notes

- Never commit your API keys to version control
- Add `config.js` to `.gitignore` if using git
- Use environment variables for production deployments
- Keep your API keys secure and rotate them periodically

## Limitations

- Model generation time varies (typically 30 seconds to 5 minutes)
- Quality depends on the AI API's capabilities
- Some complex prompts may not generate as expected
- API rate limits may apply based on your plan

## Future Enhancements

Potential features to add:
- Support for more 3D file formats (STL, FBX)
- Advanced material editing
- Texture customization
- Animation support
- Model comparison view
- Prompt templates and examples
- History of generated models
- Enhanced export options

## License

This project is provided as-is for educational and development purposes.

## Support

For issues with:
- **This application:** Check the troubleshooting section above
- **Meshy AI:** Visit [Meshy AI Support](https://www.meshy.ai/)
- **Stability AI:** Visit [Stability AI Documentation](https://platform.stability.ai/docs)

## Credits

- Three.js - [https://threejs.org/](https://threejs.org/)
- Meshy AI - [https://www.meshy.ai/](https://www.meshy.ai/)
- Icons and UI inspired by modern design principles

---

**Ready to get started?** Open the application in your browser and try creating your first 3D model!
#   C Y B E R - 3 D - F O R G E  
 