/**
 * ============================================================
 * NEW IMPRESSIVE FEATURES - JAVASCRIPT
 * ============================================================
 */

// Global variables for new features
let currentModel = null;
let batchGenerationActive = false;
let batchQueue = [];
let batchCurrentIndex = 0;

/**
 * ============================================================
 * MODEL EDITOR
 * ============================================================
 */

// Initialize Model Editor
function initModelEditor() {
    const scaleSlider = document.getElementById('modelScale');
    const rotXSlider = document.getElementById('modelRotX');
    const rotYSlider = document.getElementById('modelRotY');
    const rotZSlider = document.getElementById('modelRotZ');
    const colorPicker = document.getElementById('modelColor');
    const resetColorBtn = document.getElementById('resetColor');
    const applyBtn = document.getElementById('applyEdits');

    // Update value displays
    scaleSlider?.addEventListener('input', (e) => {
        document.getElementById('scaleValue').textContent = e.target.value;
        applyModelEdits();
    });

    rotXSlider?.addEventListener('input', (e) => {
        document.getElementById('rotXValue').textContent = e.target.value;
        applyModelEdits();
    });

    rotYSlider?.addEventListener('input', (e) => {
        document.getElementById('rotYValue').textContent = e.target.value;
        applyModelEdits();
    });

    rotZSlider?.addEventListener('input', (e) => {
        document.getElementById('rotZValue').textContent = e.target.value;
        applyModelEdits();
    });

    colorPicker?.addEventListener('input', () => {
        applyModelEdits();
    });

    resetColorBtn?.addEventListener('click', () => {
        colorPicker.value = '#ffffff';
        applyModelEdits();
    });

    console.log('%c 🎨 MODEL EDITOR INITIALIZED ', 'background: #8338ec; color: #fff; padding: 5px;');
}

function applyModelEdits() {
    if (!currentModel) return;

    const scale = parseFloat(document.getElementById('modelScale').value);
    const rotX = parseFloat(document.getElementById('modelRotX').value);
    const rotY = parseFloat(document.getElementById('modelRotY').value);
    const rotZ = parseFloat(document.getElementById('modelRotZ').value);
    const color = document.getElementById('modelColor').value;

    // Apply scale
    currentModel.scale.set(scale, scale, scale);

    // Apply rotation (convert degrees to radians)
    currentModel.rotation.x = (rotX * Math.PI) / 180;
    currentModel.rotation.y = (rotY * Math.PI) / 180;
    currentModel.rotation.z = (rotZ * Math.PI) / 180;

    // Apply color tint
    currentModel.traverse((child) => {
        if (child.isMesh) {
            const hexColor = parseInt(color.replace('#', '0x'));
            child.material.color.setHex(hexColor);
        }
    });

    console.log('✅ Model edits applied:', { scale, rotX, rotY, rotZ, color });
}

/**
 * ============================================================
 * AR PREVIEW
 * ============================================================
 */

function initARPreview() {
    const arBtn = document.getElementById('arPreview');

    arBtn?.addEventListener('click', () => {
        if (!currentModelUrl) {
            showStatus('⚠️ No model loaded for AR preview!', 'warning');
            return;
        }

        // Create AR preview
        generateARPreview(currentModelUrl);
    });

    console.log('%c 📱 AR PREVIEW INITIALIZED ', 'background: #06ffa5; color: #000; padding: 5px;');
}

function generateARPreview(modelUrl) {
    console.log('%c 📱 GENERATING AR PREVIEW... ', 'background: #06ffa5; color: #000; padding: 5px;');

    // Create QR code for AR viewing
    const arUrl = createARViewerURL(modelUrl);

    // Show AR modal with QR code
    showARModal(arUrl);
}

function createARViewerURL(modelUrl) {
    // Create model viewer URL for AR
    const encodedUrl = encodeURIComponent(modelUrl);
    return `https://arvr.google.com/scene-viewer/1.0?file=${encodedUrl}&mode=ar_preferred`;
}

function showARModal(arUrl) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'ar-modal';
    modal.innerHTML = `
        <div class="ar-modal-content">
            <h2>📱 AR PREVIEW</h2>
            <p>Scan this QR code with your phone to view in AR:</p>
            <div id="qrcode"></div>
            <p class="ar-instructions">Or click below to open on mobile:</p>
            <a href="${arUrl}" target="_blank" class="cyber-btn">OPEN IN AR</a>
            <button class="cyber-btn close-ar-modal">CLOSE</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Generate QR code (simple text for now, would need QR library in production)
    document.getElementById('qrcode').innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="color: #000; font-size: 0.9em; text-align: center;">
                QR Code functionality requires QR library<br>
                Use the button below to open on mobile
            </p>
        </div>
    `;

    // Close modal
    modal.querySelector('.close-ar-modal').addEventListener('click', () => {
        modal.remove();
    });

    console.log('✅ AR Modal displayed');
}

/**
 * ============================================================
 * BATCH GENERATOR
 * ============================================================
 */

function initBatchGenerator() {
    const toggleBtn = document.getElementById('toggleBatchGen');
    const content = document.getElementById('batchGenContent');
    const startBtn = document.getElementById('startBatchGen');
    const stopBtn = document.getElementById('stopBatchGen');

    toggleBtn?.addEventListener('click', () => {
        content?.classList.toggle('active');
        toggleBtn.textContent = content?.classList.contains('active') ? 'COLLAPSE' : 'EXPAND';
    });

    startBtn?.addEventListener('click', startBatchGeneration);
    stopBtn?.addEventListener('click', stopBatchGeneration);

    console.log('%c ⚡ BATCH GENERATOR INITIALIZED ', 'background: #8338ec; color: #fff; padding: 5px;');
}

async function startBatchGeneration() {
    const promptsText = document.getElementById('batchPrompts').value.trim();

    if (!promptsText) {
        showStatus('⚠️ Please enter at least one prompt!', 'warning');
        return;
    }

    // Parse prompts (one per line)
    batchQueue = promptsText.split('\n').filter(p => p.trim());

    if (batchQueue.length === 0) {
        showStatus('⚠️ No valid prompts found!', 'warning');
        return;
    }

    console.log(`%c 🚀 STARTING BATCH GENERATION: ${batchQueue.length} prompts `, 'background: #ff006e; color: #fff; padding: 5px;');

    batchGenerationActive = true;
    batchCurrentIndex = 0;

    // Show progress, hide start button
    document.getElementById('batchProgress').style.display = 'block';
    document.getElementById('startBatchGen').style.display = 'none';
    document.getElementById('stopBatchGen').style.display = 'block';

    // Process queue
    await processBatchQueue();
}

async function processBatchQueue() {
    const delay = parseInt(document.getElementById('batchDelay').value) * 1000;
    const autoDownload = document.getElementById('batchAutoDownload').checked;

    while (batchGenerationActive && batchCurrentIndex < batchQueue.length) {
        const prompt = batchQueue[batchCurrentIndex];

        // Update status
        document.getElementById('batchStatus').textContent = `Generating: ${prompt}`;
        document.getElementById('batchCount').textContent = `${batchCurrentIndex + 1}/${batchQueue.length}`;

        // Update progress bar
        const progress = ((batchCurrentIndex + 1) / batchQueue.length) * 100;
        document.getElementById('batchProgressFill').style.width = `${progress}%`;

        console.log(`%c [${batchCurrentIndex + 1}/${batchQueue.length}] Generating: ${prompt} `, 'background: #00f5ff; color: #000; padding: 5px;');

        // Set prompt and generate
        document.getElementById('promptInput').value = prompt;

        try {
            await generate3DModel(); // Use existing generation function

            // Wait for generation to complete
            await new Promise(resolve => setTimeout(resolve, 3000));

            if (autoDownload && currentModelUrl) {
                downloadCurrentModel();
            }

        } catch (error) {
            console.error(`Error generating model for "${prompt}":`, error);
        }

        batchCurrentIndex++;

        // Wait delay before next
        if (batchCurrentIndex < batchQueue.length) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Batch complete
    if (batchGenerationActive) {
        console.log('%c ✅ BATCH GENERATION COMPLETE! ', 'background: #06ffa5; color: #000; padding: 5px;');
        showStatus(`✅ Batch complete! Generated ${batchQueue.length} models`, 'success');
    }

    stopBatchGeneration();
}

function stopBatchGeneration() {
    batchGenerationActive = false;

    document.getElementById('batchProgress').style.display = 'none';
    document.getElementById('startBatchGen').style.display = 'block';
    document.getElementById('stopBatchGen').style.display = 'none';

    console.log('%c ⏹️ BATCH GENERATION STOPPED ', 'background: #ffbe0b; color: #000; padding: 5px;');
}

/**
 * ============================================================
 * AI PROMPT ENHANCER
 * ============================================================
 */

function initPromptEnhancer() {
    const toggleBtn = document.getElementById('toggleEnhancer');
    const content = document.getElementById('enhancerContent');
    const enhanceBtn = document.getElementById('enhancePrompt');
    const useBtn = document.getElementById('useEnhanced');

    toggleBtn?.addEventListener('click', () => {
        content?.classList.toggle('active');
        toggleBtn.textContent = content?.classList.contains('active') ? 'COLLAPSE' : 'EXPAND';
    });

    enhanceBtn?.addEventListener('click', enhancePrompt);
    useBtn?.addEventListener('click', useEnhancedPrompt);

    console.log('%c 🤖 PROMPT ENHANCER INITIALIZED ', 'background: #06ffa5; color: #000; padding: 5px;');
}

function enhancePrompt() {
    const simplePrompt = document.getElementById('simplePrompt').value.trim();
    const style = document.getElementById('enhancerStyle').value;

    if (!simplePrompt) {
        showStatus('⚠️ Please enter a prompt to enhance!', 'warning');
        return;
    }

    console.log(`%c ✨ ENHANCING PROMPT: "${simplePrompt}" with style: ${style} `, 'background: #8338ec; color: #fff; padding: 5px;');

    // AI-style prompt enhancement
    const enhanced = generateEnhancedPrompt(simplePrompt, style);

    // Display enhanced prompt
    const enhancedText = document.getElementById('enhancedText');
    enhancedText.textContent = enhanced;
    enhancedText.classList.add('enhanced');

    document.getElementById('useEnhanced').style.display = 'block';

    console.log('✅ Enhanced prompt:', enhanced);
}

function generateEnhancedPrompt(simple, style) {
    const styleEnhancements = {
        cyberpunk: 'neon-lit, holographic, futuristic, high-tech, glowing circuits, chrome details, dark atmosphere, urban dystopia',
        anime: 'anime style, vibrant colors, detailed linework, expressive, manga-inspired, cel-shaded, dramatic lighting',
        realistic: 'photorealistic, highly detailed, ultra HD, physically accurate, professional lighting, natural materials, lifelike textures',
        lowpoly: 'low poly, geometric, minimalist, faceted, clean edges, flat shading, stylized, simple polygons',
        fantasy: 'magical, enchanted, mystical, ornate details, ethereal glow, ancient runes, medieval inspired, fantastical',
        scifi: 'sci-fi, advanced technology, space-age, metallic, sleek design, energy effects, futuristic architecture'
    };

    const enhancement = styleEnhancements[style] || '';

    return `A ${simple}, ${enhancement}, high quality 3D model, detailed, well-lit, professional render`;
}

function useEnhancedPrompt() {
    const enhanced = document.getElementById('enhancedText').textContent;

    document.getElementById('promptInput').value = enhanced;

    showStatus('✅ Enhanced prompt applied to input!', 'success');

    // Scroll to prompt input
    document.getElementById('promptInput').scrollIntoView({ behavior: 'smooth', block: 'center' });

    console.log('✅ Enhanced prompt copied to input');
}

/**
 * ============================================================
 * COMPARE MODELS
 * ============================================================
 */

function initCompareModels() {
    const compareBtn = document.getElementById('compareModels');

    compareBtn?.addEventListener('click', () => {
        showStatus('🔀 Compare feature coming soon! Save models to gallery first.', 'info');
        // TODO: Implement side-by-side model comparison
    });

    console.log('%c 🔀 COMPARE MODELS INITIALIZED ', 'background: #ffbe0b; color: #000; padding: 5px;');
}

/**
 * ============================================================
 * HELPER FUNCTIONS
 * ============================================================
 */

function showStatus(message, type = 'info') {
    const statusElement = document.getElementById('viewerStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-${type}`;
    }
}

function downloadCurrentModel() {
    const downloadBtn = document.getElementById('downloadModel');
    if (downloadBtn) {
        downloadBtn.click();
    }
}

/**
 * ============================================================
 * INITIALIZE ALL NEW FEATURES
 * ============================================================
 */

function initializeNewFeatures() {
    console.log('%c 🚀 INITIALIZING NEW FEATURES... ', 'background: #ff006e; color: #fff; padding: 5px;');

    initModelEditor();
    initARPreview();
    initBatchGenerator();
    initPromptEnhancer();
    initCompareModels();

    console.log('%c ✅ ALL NEW FEATURES INITIALIZED! ', 'background: #06ffa5; color: #000; padding: 5px;');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNewFeatures);
} else {
    initializeNewFeatures();
}
