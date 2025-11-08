/**
 * Configuration file for the 3D Model Generator
 *
 * SETUP INSTRUCTIONS:
 * 1. Choose your API provider (Meshy AI recommended for text-to-3D)
 * 2. Sign up and get an API key from your chosen provider
 * 3. Replace 'your-api-key-here' with your actual API key
 * 4. Update the API_PROVIDER if using a different service
 */

const CONFIG = {
    // API Provider: 'meshy', 'stability', or 'custom'
    // Using Meshy AI - Professional quality!
    API_PROVIDER: 'meshy',

    // API Configuration for Meshy AI (https://www.meshy.ai/)
    // Sign up at: https://www.meshy.ai/ to get your API key
    MESHY: {
        API_KEY: 'msy_ck5dayn00PfheR86SUWaHZexGEOdYo4oMtth',
        API_URL: 'https://api.meshy.ai/openapi/v2/text-to-3d',
        TASK_URL: 'https://api.meshy.ai/openapi/v2/text-to-3d'
    },

    // API Configuration for Stability AI (https://stability.ai/)
    // Note: Stability AI's 3D support may be limited
    STABILITY: {
        API_KEY: 'your-stability-api-key-here',
        API_URL: 'https://api.stability.ai/v2alpha/3d/stable-fast-3d'
    },

    // Custom API endpoint configuration
    // Using TRIPO AI - REAL AI GENERATION! (PROFESSIONAL QUALITY!)
    CUSTOM: {
        API_KEY: 'none',  // No API key needed for local server
        API_URL: 'http://localhost:5003/api/generate',
        // Add any custom headers or parameters needed
        HEADERS: {
            'Content-Type': 'application/json'
        }
    },

    // Model generation settings
    SETTINGS: {
        // Time to wait between polling for model completion (milliseconds)
        POLL_INTERVAL: 5000,

        // Maximum time to wait for model generation (milliseconds)
        MAX_WAIT_TIME: 300000, // 5 minutes

        // Default model quality/resolution
        QUALITY: 'medium', // Options: 'low', 'medium', 'high'

        // Enable demo mode (uses procedurally generated models instead of API)
        DEMO_MODE: false // Using REAL Meshy AI now!
    },

    // Three.js scene settings
    SCENE: {
        BACKGROUND_COLOR: 0x1a2332,
        AMBIENT_LIGHT_COLOR: 0xffffff,
        AMBIENT_LIGHT_INTENSITY: 0.5,
        DIRECTIONAL_LIGHT_COLOR: 0xffffff,
        DIRECTIONAL_LIGHT_INTENSITY: 0.8,
        CAMERA_FOV: 75,
        CAMERA_NEAR: 0.1,
        CAMERA_FAR: 1000
    }
};

/**
 * Validate configuration on load
 */
function validateConfig() {
    if (!CONFIG.SETTINGS.DEMO_MODE && CONFIG.API_PROVIDER !== 'custom') {
        const apiKey = CONFIG[CONFIG.API_PROVIDER.toUpperCase()]?.API_KEY;
        if (!apiKey || apiKey === 'your-meshy-api-key-here' || apiKey === 'your-stability-api-key-here') {
            console.warn(
                '%c⚠️ API Key Not Configured',
                'color: #f59e0b; font-size: 14px; font-weight: bold;',
                '\nPlease configure your API key in config.js or enable DEMO_MODE to test the interface.'
            );
        }
    }

    if (CONFIG.SETTINGS.DEMO_MODE) {
        console.info(
            '%c🎭 Demo Mode Enabled',
            'color: #10b981; font-size: 14px; font-weight: bold;',
            '\nThe app will generate procedural 3D models. Configure a real API key and set DEMO_MODE to false for AI-generated models.'
        );
    }

    if (CONFIG.API_PROVIDER === 'custom') {
        console.info(
            '%c🚀 Using Local API',
            'color: #10b981; font-size: 14px; font-weight: bold;',
            `\nConnected to your self-hosted API at ${CONFIG.CUSTOM.API_URL}\nMake sure your API server is running!`
        );
    }
}

// Run validation when config loads
validateConfig();
