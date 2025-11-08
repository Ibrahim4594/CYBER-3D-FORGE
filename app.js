/**
 * CYBER 3D FORGE - Main Application
 * Enhanced with dynamic API key management and cyberpunk UI
 */

// Global variables
let scene, camera, renderer, controls, currentModel;
let wireframeEnabled = false;
let modelCount = 0;
let currentProvider = 'NOT SET';
let apiKeys = {
    meshy: '',
    tripo: '',
    csm: ''
};

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    loadSavedKeys();
    setupEventListeners();
    updateStats();
    console.log('%c CYBER 3D FORGE ONLINE ', 'background: #ff006e; color: #fff; font-size: 20px; padding: 10px;');
});

/**
 * Initialize UI elements
 */
function initializeUI() {
    // API config panel starts collapsed
    const apiConfig = document.getElementById('apiConfigContent');
    if (apiConfig) {
        apiConfig.classList.remove('active');
    }
}

/**
 * Load saved API keys from localStorage
 */
function loadSavedKeys() {
    try {
        const saved = localStorage.getItem('cyberForgeKeys');
        if (saved) {
            apiKeys = JSON.parse(saved);
            // Populate input fields
            if (apiKeys.meshy) document.getElementById('meshyApiKey').value = apiKeys.meshy;
            if (apiKeys.tripo) document.getElementById('tripoApiKey').value = apiKeys.tripo;
            if (apiKeys.csm) document.getElementById('csmApiKey').value = apiKeys.csm;

            // Set active provider based on which key is set
            if (apiKeys.meshy) {
                currentProvider = 'MESHY AI';
                setActiveProviderTab('meshy');
            } else if (apiKeys.tripo) {
                currentProvider = 'TRIPO AI';
                setActiveProviderTab('tripo');
            } else if (apiKeys.csm) {
                currentProvider = 'CSM AI';
                setActiveProviderTab('csm');
            }
        }
    } catch (e) {
        console.warn('Could not load saved keys:', e);
    }
}

/**
 * Save API keys to localStorage
 */
function saveApiKeys() {
    apiKeys.meshy = document.getElementById('meshyApiKey').value.trim();
    apiKeys.tripo = document.getElementById('tripoApiKey').value.trim();
    apiKeys.csm = document.getElementById('csmApiKey').value.trim();

    localStorage.setItem('cyberForgeKeys', JSON.stringify(apiKeys));

    // Update current provider
    const activeTab = document.querySelector('.provider-tab.active');
    if (activeTab) {
        const provider = activeTab.dataset.provider;
        currentProvider = activeTab.textContent.trim();
    }

    updateStats();
    showNotification('Configuration saved!', 'success');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // API Panel toggle
    document.getElementById('toggleApiPanel')?.addEventListener('click', () => {
        const content = document.getElementById('apiConfigContent');
        content.classList.toggle('active');
    });

    // Provider tabs
    document.querySelectorAll('.provider-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const provider = tab.dataset.provider;
            setActiveProviderTab(provider);
        });
    });

    // Save API config
    document.getElementById('saveApiConfig')?.addEventListener('click', saveApiKeys);

    // Prompt input
    const promptInput = document.getElementById('promptInput');
    promptInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    });

    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.dataset.prompt;
            document.getElementById('promptInput').value = prompt;
        });
    });

    // Generate button
    document.getElementById('generateBtn')?.addEventListener('click', handleGenerate);

    // Viewer controls
    document.getElementById('resetView')?.addEventListener('click', resetCamera);
    document.getElementById('toggleWireframe')?.addEventListener('click', toggleWireframe);
    document.getElementById('downloadModel')?.addEventListener('click', downloadModel);
}

/**
 * Set active provider tab
 */
function setActiveProviderTab(provider) {
    // Update tab UI
    document.querySelectorAll('.provider-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-provider="${provider}"]`)?.classList.add('active');

    // Update input groups
    document.querySelectorAll('.api-input-group').forEach(group => {
        group.classList.remove('active');
    });
    document.querySelector(`.api-input-group[data-provider="${provider}"]`)?.classList.add('active');
}

/**
 * Handle generate button click
 */
async function handleGenerate() {
    const prompt = document.getElementById('promptInput').value.trim();

    if (!prompt) {
        showNotification('Please enter a prompt!', 'warning');
        return;
    }

    // Check if any API key is set
    if (!apiKeys.meshy && !apiKeys.tripo && !apiKeys.csm) {
        showNotification('Please configure an API key first!', 'error');
        document.getElementById('apiConfigContent').classList.add('active');
        return;
    }

    // Determine which API to use
    const activeTab = document.querySelector('.provider-tab.active');
    const provider = activeTab?.dataset.provider || 'meshy';

    if (!apiKeys[provider]) {
        showNotification(`Please enter ${provider.toUpperCase()} API key!`, 'error');
        return;
    }

    // Show loading state
    setLoadingState(true, 'Initializing neural network...');

    try {
        let modelData;

        if (provider === 'meshy') {
            modelData = await generateWithMeshy(prompt);
        } else if (provider === 'tripo') {
            modelData = await generateWithTripo(prompt);
        } else if (provider === 'csm') {
            modelData = await generateWithCSM(prompt);
        }

        // Render the model
        await renderModel(modelData);

        modelCount++;
        updateStats();
        showNotification('Model generated successfully!', 'success');
        document.getElementById('viewerStatus').textContent = `Model: ${prompt}`;
    } catch (error) {
        console.error('Generation error:', error);
        showNotification(`Error: ${error.message}`, 'error');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Generate with Meshy AI
 */
async function generateWithMeshy(prompt) {
    updateStatus('Connecting to Meshy AI...');

    const response = await fetch('https://api.meshy.ai/openapi/v2/text-to-3d', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKeys.meshy}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            art_style: 'realistic',
            negative_prompt: 'low quality, blurry'
        })
    });

    if (!response.ok) {
        throw new Error(`Meshy API error: ${response.statusText}`);
    }

    const taskData = await response.json();
    const taskId = taskData.id;

    updateStatus('Generating model...');

    // Poll for completion
    return await pollMeshyTask(taskId);
}

/**
 * Poll Meshy task
 */
async function pollMeshyTask(taskId) {
    const maxWait = CONFIG.SETTINGS.MAX_WAIT_TIME || 300000;
    const pollInterval = CONFIG.SETTINGS.POLL_INTERVAL || 5000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
        const response = await fetch(`https://api.meshy.ai/openapi/v2/text-to-3d/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${apiKeys.meshy}`
            }
        });

        const data = await response.json();

        if (data.status === 'SUCCEEDED') {
            updateStatus('Downloading model...');
            return {
                url: data.model_urls.glb,
                format: 'glb'
            };
        } else if (data.status === 'FAILED') {
            throw new Error('Model generation failed');
        }

        updateStatus(`Generating... (${Math.floor((Date.now() - startTime) / 1000)}s)`);
        updateProgress((Date.now() - startTime) / maxWait * 100);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Generation timeout');
}

/**
 * Generate with Tripo AI
 */
async function generateWithTripo(prompt) {
    updateStatus('Connecting to Tripo AI...');

    const response = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKeys.tripo}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'text_to_model',
            prompt: prompt,
            model_version: 'v2.0-20240919'
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Tripo API error');
    }

    const taskData = await response.json();
    const taskId = taskData.data.task_id;

    updateStatus('Generating model...');

    return await pollTripoTask(taskId);
}

/**
 * Poll Tripo task
 */
async function pollTripoTask(taskId) {
    const maxWait = 300000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
        const response = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${apiKeys.tripo}`
            }
        });

        const data = await response.json();
        const status = data.data.status;

        if (status === 'success') {
            updateStatus('Downloading model...');
            return {
                url: data.data.output.model,
                format: 'glb'
            };
        } else if (status === 'failed') {
            throw new Error('Model generation failed');
        }

        updateStatus(`Generating... (${Math.floor((Date.now() - startTime) / 1000)}s)`);
        updateProgress((Date.now() - startTime) / maxWait * 100);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    throw new Error('Generation timeout');
}

/**
 * Generate with CSM AI (Hugging Face)
 */
async function generateWithCSM(prompt) {
    updateStatus('Connecting to CSM AI...');

    // This is a placeholder - CSM/HuggingFace would need specific implementation
    throw new Error('CSM AI integration coming soon! Use Meshy or Tripo for now.');
}

/**
 * Render 3D model
 */
async function renderModel(modelData) {
    if (!scene) {
        initThreeJS();
    }

    // Remove existing model
    if (currentModel) {
        scene.remove(currentModel);
        if (currentModel.geometry) currentModel.geometry.dispose();
        if (currentModel.material) {
            if (Array.isArray(currentModel.material)) {
                currentModel.material.forEach(m => m.dispose());
            } else {
                currentModel.material.dispose();
            }
        }
    }

    updateStatus('Loading model...');

    // Load based on format
    if (modelData.format === 'glb' || modelData.url.endsWith('.glb')) {
        currentModel = await loadGLB(modelData.url);
    } else if (modelData.url.endsWith('.obj')) {
        currentModel = await loadOBJ(modelData.url);
    }

    scene.add(currentModel);

    // Center and scale model
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;

    currentModel.position.sub(center);
    currentModel.scale.multiplyScalar(scale);

    resetCamera();
}

/**
 * Initialize Three.js scene
 */
function initThreeJS() {
    const container = document.getElementById('viewer');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    // Renderer with performance optimizations
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
    container.appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0x00f5ff, 0.3);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Animation loop
    animate();
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

/**
 * Load GLB model
 */
function loadGLB(url) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        loader.load(
            url,
            (gltf) => resolve(gltf.scene),
            undefined,
            (error) => reject(error)
        );
    });
}

/**
 * Load OBJ model
 */
function loadOBJ(url) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.OBJLoader();
        loader.load(
            url,
            (obj) => resolve(obj),
            undefined,
            (error) => reject(error)
        );
    });
}

/**
 * Reset camera position
 */
function resetCamera() {
    if (camera && controls) {
        camera.position.set(0, 0, 5);
        controls.target.set(0, 0, 0);
        controls.update();
    }
}

/**
 * Toggle wireframe mode
 */
function toggleWireframe() {
    if (!currentModel) return;

    wireframeEnabled = !wireframeEnabled;

    currentModel.traverse((child) => {
        if (child.isMesh) {
            child.material.wireframe = wireframeEnabled;
        }
    });
}

/**
 * Download current model
 */
function downloadModel() {
    if (!currentModel) {
        showNotification('No model to download!', 'warning');
        return;
    }

    showNotification('Download feature coming soon!', 'info');
}

/**
 * Set loading state
 */
function setLoadingState(loading, message = 'Processing...') {
    const btn = document.getElementById('generateBtn');
    const statusDisplay = document.getElementById('statusDisplay');

    if (loading) {
        btn.disabled = true;
        statusDisplay.classList.add('active');
        updateStatus(message);
        updateProgress(0);
    } else {
        btn.disabled = false;
        setTimeout(() => {
            statusDisplay.classList.remove('active');
        }, 2000);
    }
}

/**
 * Update status text
 */
function updateStatus(text) {
    document.getElementById('statusText').textContent = text;
}

/**
 * Update progress bar
 */
function updateProgress(percent) {
    document.querySelector('.progress-fill').style.width = `${percent}%`;
}

/**
 * Update stats display
 */
function updateStats() {
    document.getElementById('modelCount').textContent = modelCount;
    document.getElementById('activeProvider').textContent = currentProvider;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: '#06ffa5',
        error: '#ff006e',
        warning: '#ffbe0b',
        info: '#00f5ff'
    };

    console.log(`%c ${message} `, `background: ${colors[type]}; color: #000; padding: 5px;`);

    // Also update system status
    const systemStatus = document.getElementById('systemStatus');
    systemStatus.textContent = message;
    setTimeout(() => {
        systemStatus.textContent = 'SYSTEM ONLINE';
    }, 3000);
}

/**
 * Generate animated cyber city background
 */
function generateCyberCity() {
    const city = document.getElementById('cyberCity');
    if (!city) return;

    const buildingHeights = ['short', 'medium', 'tall'];
    const buildingWidths = ['', 'wide'];

    // Create 3 layers for parallax effect (ULTRA OPTIMIZED: Minimal buildings for max performance)
    for (let layer = 1; layer <= 3; layer++) {
        const cityLayer = document.createElement('div');
        cityLayer.className = `city-layer city-layer-${layer}`;

        // Create buildings for this layer (ULTRA REDUCED: 10 per layer = 60 total)
        for (let copy = 0; copy < 2; copy++) {
            for (let i = 0; i < 10; i++) { // ULTRA REDUCED to 10 for maximum performance
                const building = document.createElement('div');
                const height = buildingHeights[Math.floor(Math.random() * buildingHeights.length)];
                const width = Math.random() > 0.7 ? buildingWidths[1] : buildingWidths[0];

                building.className = `building building-${height} ${width ? `building-${width}` : ''}`;

                // Random animation delay for pulse effect
                building.style.animationDelay = `${Math.random() * 3}s`;

                cityLayer.appendChild(building);
            }
        }

        city.appendChild(cityLayer);
    }

    console.log('%c 🏙️ CYBER CITY GENERATED ', 'background: #00f5ff; color: #000; padding: 5px;');
}

/**
 * Generate floating neon signs
 */
function generateNeonSigns() {
    const signs = document.getElementById('neonSigns');
    if (!signs) return;

    const texts = ['CYBER', 'NEO', 'TOKYO', '2077', 'NEON', 'TECH', '未来', 'AI', 'FORGE'];
    const colors = ['#ff006e', '#00f5ff', '#8338ec', '#ffbe0b'];

    for (let i = 0; i < 15; i++) {
        const sign = document.createElement('div');
        sign.className = 'neon-sign';
        sign.textContent = texts[Math.floor(Math.random() * texts.length)];
        sign.style.color = colors[Math.floor(Math.random() * colors.length)];
        sign.style.textShadow = `0 0 20px ${sign.style.color}`;
        sign.style.left = `${Math.random() * 90 + 5}%`;
        sign.style.top = `${Math.random() * 80 + 10}%`;
        sign.style.animationDelay = `${Math.random() * 2}s`;
        signs.appendChild(sign);
    }

    console.log('%c 📍 NEON SIGNS ACTIVATED ', 'background: #ff006e; color: #fff; padding: 5px;');
}

/**
 * Ensure video background plays
 */
function initVideoBackground() {
    const video = document.getElementById('bgVideo');
    if (video) {
        video.play().catch(err => {
            console.log('Video autoplay prevented, trying manual play...');
            // Fallback: try to play on user interaction
            document.addEventListener('click', () => {
                video.play();
            }, { once: true });
        });
        console.log('%c 🎬 VIDEO BACKGROUND LOADED ', 'background: #8338ec; color: #fff; padding: 5px;');
    }
}

/**
 * Initialize all new features
 */
function initNewFeatures() {
    // Settings panel toggle
    document.getElementById('toggleSettings')?.addEventListener('click', () => {
        document.getElementById('settingsContent').classList.toggle('active');
    });

    // Settings controls
    document.getElementById('enableParticles')?.addEventListener('change', (e) => {
        document.querySelector('.cyber-particles').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('enableCity')?.addEventListener('change', (e) => {
        document.querySelector('.cyber-city').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('enableFlying')?.addEventListener('change', (e) => {
        document.querySelector('.flying-lights').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('enableVideo')?.addEventListener('change', (e) => {
        document.querySelector('.video-background').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('enableScanLines')?.addEventListener('change', (e) => {
        document.querySelector('.glitch-overlay').style.display = e.target.checked ? 'block' : 'none';
    });

    // Animation speed control
    document.getElementById('animSpeed')?.addEventListener('input', (e) => {
        const speed = e.target.value;
        document.getElementById('animSpeedValue').textContent = `${speed}x`;
        document.documentElement.style.setProperty('--anim-speed', speed);
    });

    // Video opacity control
    document.getElementById('videoOpacity')?.addEventListener('input', (e) => {
        const opacity = e.target.value;
        document.getElementById('videoOpacityValue').textContent = `${opacity}%`;
        const video = document.querySelector('.video-background video');
        if (video) video.style.opacity = opacity / 100;
    });

    // Color presets
    document.querySelectorAll('.color-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const color = btn.dataset.color;
            applyColorTheme(color);
        });
    });

    // Reset settings
    document.getElementById('resetSettings')?.addEventListener('click', () => {
        location.reload();
    });

    // Clear gallery
    document.getElementById('clearGallery')?.addEventListener('click', () => {
        localStorage.removeItem('modelGallery');
        loadGallery();
        showNotification('Gallery cleared!', 'success');
    });

    // Clear history
    document.getElementById('clearHistory')?.addEventListener('click', () => {
        localStorage.removeItem('generationHistory');
        loadHistory();
        showNotification('History cleared!', 'success');
    });

    // Quick actions
    document.getElementById('quickGenerate')?.addEventListener('click', () => {
        document.getElementById('promptInput')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('quickSettings')?.addEventListener('click', () => {
        document.querySelector('.settings-panel')?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('settingsContent')?.classList.add('active');
    });

    document.getElementById('quickGallery')?.addEventListener('click', () => {
        document.querySelector('.gallery-panel')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('quickHistory')?.addEventListener('click', () => {
        document.querySelector('.history-panel')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('scrollToTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Load saved data
    loadGallery();
    loadHistory();
}

/**
 * Initialize background music at perfect calm volume with toggle control
 * Using YouTube IFrame API
 */
let ytPlayer = null;
let isMusicPlaying = false;
let musicReady = false;

// This function will be called by YouTube IFrame API when ready
window.onYouTubeIframeAPIReady = function() {
    console.log('%c 📺 YOUTUBE API READY! ', 'background: #ff006e; color: #fff; padding: 5px;');

    ytPlayer = new YT.Player('ytplayer', {
        height: '0',
        width: '0',
        videoId: '8GW6sLrK40k',
        playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: '8GW6sLrK40k',
            enablejsapi: 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log('%c 🎬 PLAYER READY! ', 'background: #06ffa5; color: #000; padding: 5px;');

    musicReady = true;
    const musicBtn = document.getElementById('musicControlBtn');
    const musicStatus = musicBtn?.querySelector('.music-status');

    // Set volume to 25
    event.target.setVolume(25);

    // Set initial state to OFF (not playing)
    isMusicPlaying = false;
    if (musicBtn) musicBtn.classList.add('muted');
    if (musicStatus) musicStatus.textContent = 'OFF';

    console.log('%c ✅ MUSIC PLAYER READY - Click button to play! ', 'background: #06ffa5; color: #000; padding: 5px;');
}

function onPlayerStateChange(event) {
    const musicBtn = document.getElementById('musicControlBtn');
    const musicStatus = musicBtn?.querySelector('.music-status');

    // Keep track of playing state and update UI
    if (event.data === YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
        if (musicBtn) musicBtn.classList.remove('muted');
        if (musicStatus) musicStatus.textContent = 'ON';
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isMusicPlaying = false;
        if (musicBtn) musicBtn.classList.add('muted');
        if (musicStatus) musicStatus.textContent = 'OFF';
    }
}

function initBackgroundMusic() {
    const musicBtn = document.getElementById('musicControlBtn');
    const musicStatus = musicBtn?.querySelector('.music-status');

    console.log('%c 🎵 INIT MUSIC BUTTON ', 'background: #00f5ff; color: #000; padding: 5px;', {
        buttonFound: !!musicBtn,
        statusFound: !!musicStatus
    });

    if (!musicBtn) {
        console.error('❌ MUSIC BUTTON NOT FOUND!');
        return;
    }

    let isToggling = false; // Prevent double-clicks

    // Music toggle button with debounce
    musicBtn.addEventListener('click', (e) => {
        console.log('%c 🖱️ BUTTON CLICKED! ', 'background: #ffbe0b; color: #000; padding: 5px;');

        e.preventDefault();
        e.stopPropagation();

        // Prevent rapid clicking (debounce)
        if (isToggling) {
            console.log('⏸️ Debounced - wait 500ms');
            return;
        }
        isToggling = true;

        if (!musicReady || !ytPlayer) {
            console.log('%c ⚠️ MUSIC PLAYER NOT READY YET ', 'background: #ffbe0b; color: #000; padding: 5px;', {
                musicReady,
                ytPlayer: !!ytPlayer
            });
            setTimeout(() => { isToggling = false; }, 500);
            return;
        }

        console.log('%c 🎮 TOGGLING MUSIC ', 'background: #8338ec; color: #fff; padding: 5px;', {
            currentState: isMusicPlaying ? 'PLAYING' : 'PAUSED'
        });

        if (isMusicPlaying) {
            // Pause music
            ytPlayer.pauseVideo();
            console.log('%c 🔇 MUSIC OFF ', 'background: #ff006e; color: #fff; padding: 5px;');
        } else {
            // Play music
            ytPlayer.setVolume(25); // Ensure volume is 25%
            ytPlayer.playVideo();
            console.log('%c 🎵 MUSIC ON ', 'background: #06ffa5; color: #000; padding: 5px;');
        }

        // Re-enable after 500ms
        setTimeout(() => { isToggling = false; }, 500);
    });

    // Initial state - assume muted until we know it's playing
    musicBtn.classList.add('muted');
    if (musicStatus) musicStatus.textContent = 'OFF';

    console.log('%c ✅ MUSIC BUTTON INITIALIZED ', 'background: #06ffa5; color: #000; padding: 5px;');
}

/**
 * Apply color theme
 */
function applyColorTheme(color) {
    const colors = {
        cyan: '#00f5ff',
        pink: '#ff006e',
        purple: '#8338ec',
        green: '#06ffa5',
        yellow: '#ffbe0b'
    };

    if (colors[color]) {
        document.documentElement.style.setProperty('--cyber-blue', colors[color]);
        showNotification(`Theme changed to ${color}!`, 'success');
    }
}

/**
 * Load gallery from localStorage
 */
function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem('modelGallery') || '[]');
    const container = document.getElementById('modelGallery');

    if (gallery.length === 0) {
        container.innerHTML = `
            <div class="gallery-placeholder">
                <div class="placeholder-icon">📦</div>
                <p>Generated models will appear here</p>
                <small>Create your first model to start building your gallery!</small>
            </div>
        `;
    } else {
        container.innerHTML = gallery.map(item => `
            <div class="gallery-item" data-id="${item.id}">
                <img src="${item.thumbnail || 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'></svg>'}" alt="${item.prompt}">
                <div class="gallery-item-info">
                    <div class="gallery-item-prompt">${item.prompt}</div>
                    <div class="gallery-item-meta">
                        <span>${item.provider}</span>
                        <span>${item.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Load history from localStorage
 */
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('generationHistory') || '[]');
    const container = document.getElementById('historyList');

    if (history.length === 0) {
        container.innerHTML = `
            <div class="history-placeholder">
                <p>No generation history yet</p>
                <small>Your recent generations will be tracked here</small>
            </div>
        `;
    } else {
        container.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-item-prompt">${item.prompt}</span>
                    <span class="history-item-time">${item.time}</span>
                </div>
                <div class="history-item-meta">
                    <span>Provider: ${item.provider}</span>
                    <span>Duration: ${item.duration}s</span>
                    <span>Status: ${item.status}</span>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Add model to gallery
 */
function addToGallery(prompt, provider, thumbnail = '') {
    const gallery = JSON.parse(localStorage.getItem('modelGallery') || '[]');
    gallery.unshift({
        id: Date.now(),
        prompt,
        provider,
        thumbnail,
        date: new Date().toLocaleDateString()
    });

    // Keep only last 20 models
    if (gallery.length > 20) gallery.pop();

    localStorage.setItem('modelGallery', JSON.stringify(gallery));
    loadGallery();
}

/**
 * Add to history
 */
function addToHistory(prompt, provider, duration, status) {
    const history = JSON.parse(localStorage.getItem('generationHistory') || '[]');
    history.unshift({
        prompt,
        provider,
        duration,
        status,
        time: new Date().toLocaleTimeString()
    });

    // Keep only last 50 items
    if (history.length > 50) history.pop();

    localStorage.setItem('generationHistory', JSON.stringify(history));
    loadHistory();
}

/**
 * Performance optimization - Adaptive quality based on FPS
 */
let lastFrameTime = Date.now();
let fpsHistory = [];
let performanceMode = 'high'; // high, medium, low

function monitorPerformance() {
    const now = Date.now();
    const fps = 1000 / (now - lastFrameTime);
    lastFrameTime = now;

    fpsHistory.push(fps);
    if (fpsHistory.length > 60) fpsHistory.shift(); // Keep last 60 frames

    // Check average FPS every 60 frames
    if (fpsHistory.length === 60) {
        const avgFPS = fpsHistory.reduce((a, b) => a + b) / fpsHistory.length;

        // Adaptive quality adjustment
        if (avgFPS < 30 && performanceMode !== 'low') {
            performanceMode = 'low';
            applyPerformanceMode('low');
        } else if (avgFPS >= 30 && avgFPS < 50 && performanceMode !== 'medium') {
            performanceMode = 'medium';
            applyPerformanceMode('medium');
        } else if (avgFPS >= 50 && performanceMode !== 'high') {
            performanceMode = 'high';
            applyPerformanceMode('high');
        }

        fpsHistory = [];
    }

    requestAnimationFrame(monitorPerformance);
}

function applyPerformanceMode(mode) {
    const particles = document.querySelector('.cyber-particles');
    const grid = document.querySelector('.cyber-grid');
    const glitch = document.querySelector('.glitch-overlay');

    if (mode === 'low') {
        // Reduce effects for better performance
        if (particles) particles.style.opacity = '0.1';
        if (grid) grid.style.opacity = '0.3';
        if (glitch) glitch.style.opacity = '0.3';
        console.log('%c ⚡ PERFORMANCE MODE: LOW (FPS optimized)', 'background: #ffbe0b; color: #000; padding: 5px;');
    } else if (mode === 'medium') {
        if (particles) particles.style.opacity = '0.2';
        if (grid) grid.style.opacity = '0.5';
        if (glitch) glitch.style.opacity = '0.5';
        console.log('%c ⚡ PERFORMANCE MODE: MEDIUM', 'background: #00f5ff; color: #000; padding: 5px;');
    } else {
        // Full quality
        if (particles) particles.style.opacity = '0.3';
        if (grid) grid.style.opacity = '1';
        if (glitch) glitch.style.opacity = '1';
        console.log('%c ⚡ PERFORMANCE MODE: HIGH', 'background: #06ffa5; color: #000; padding: 5px;');
    }
}

/**
 * Debounced resize handler for better performance
 */
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (camera && renderer) {
            const container = document.getElementById('viewer');
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }, 250);
}

/**
 * Scroll handler - Show/hide quick actions based on scroll position
 */
let scrollTimeout;
function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const quickActions = document.querySelector('.quick-actions');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show quick actions after scrolling down 200px
        if (scrollTop > 200) {
            quickActions?.classList.add('visible');
        } else {
            quickActions?.classList.remove('visible');
        }
    }, 50); // Very short delay for smooth response
}

// Throttled scroll for better performance
let lastScrollTime = 0;
function throttledScroll() {
    const now = Date.now();
    if (now - lastScrollTime > 100) { // Throttle to 10fps
        lastScrollTime = now;
        handleScroll();
    }
}

// Initialize cyber city when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initVideoBackground();
        generateCyberCity();
        generateNeonSigns();
        initNewFeatures();

        // Start background music at calm volume
        initBackgroundMusic();

        // Start performance monitoring
        requestAnimationFrame(monitorPerformance);

        // Optimized resize handler
        window.removeEventListener('resize', handleResize);
        window.addEventListener('resize', handleResize);

        // Scroll handler for quick actions
        window.removeEventListener('scroll', throttledScroll);
        window.addEventListener('scroll', throttledScroll, { passive: true });

        // Check initial scroll position
        handleScroll();

        console.log('%c 🚀 CYBER 3D FORGE - PERFORMANCE OPTIMIZED ', 'background: #ff006e; color: #fff; font-size: 14px; padding: 10px;');
    });
} else {
    initVideoBackground();
    generateCyberCity();
    generateNeonSigns();
    initNewFeatures();

    // Start background music at calm volume
    initBackgroundMusic();

    requestAnimationFrame(monitorPerformance);
    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    // Scroll handler for quick actions
    window.removeEventListener('scroll', throttledScroll);
    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    console.log('%c 🚀 CYBER 3D FORGE - PERFORMANCE OPTIMIZED ', 'background: #ff006e; color: #fff; font-size: 14px; padding: 10px;');
}
