// Image Converter App - Main JavaScript

// State Management
const state = {
    originalFile: null,
    originalImage: null,
    convertedBlob: null,
    quality: 80
};

// DOM Elements
const elements = {
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    previewSection: document.getElementById('previewSection'),
    settingsSection: document.getElementById('settingsSection'),
    resultSection: document.getElementById('resultSection'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    originalImage: document.getElementById('originalImage'),
    originalSize: document.getElementById('originalSize'),
    originalDimensions: document.getElementById('originalDimensions'),
    quality: document.getElementById('quality'),
    qualityValue: document.getElementById('qualityValue'),
    resizeWidth: document.getElementById('resizeWidth'),
    resizeHeight: document.getElementById('resizeHeight'),
    convertButton: document.getElementById('convertButton'),
    convertedImage: document.getElementById('convertedImage'),
    convertedSize: document.getElementById('convertedSize'),
    savings: document.getElementById('savings'),
    downloadButton: document.getElementById('downloadButton'),
    resetButton: document.getElementById('resetButton')
};

// Initialize App
function init() {
    registerServiceWorker();
    setupEventListeners();
}

// Service Worker Registration
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker registered successfully');
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }
}

// Event Listeners
function setupEventListeners() {
    // Upload area click
    elements.uploadArea.addEventListener('click', () => {
        elements.fileInput.click();
    });
    
    // File input change
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('drop', handleDrop);
    
    // Quality slider
    elements.quality.addEventListener('input', handleQualityChange);
    
    // Convert button
    elements.convertButton.addEventListener('click', handleConvert);
    
    // Download button
    elements.downloadButton.addEventListener('click', handleDownload);
    
    // Reset button
    elements.resetButton.addEventListener('click', handleReset);
}

// File Selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    } else {
        showError('Please select a valid image file');
    }
}

// Drag Over
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.uploadArea.style.borderColor = 'var(--primary-color)';
}

// Drop
function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.uploadArea.style.borderColor = 'var(--border-color)';
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    } else {
        showError('Please drop a valid image file');
    }
}

// Process File
async function processFile(file) {
    state.originalFile = file;
    
    // Show loading
    showLoading();
    
    try {
        // Load image
        const img = await loadImage(file);
        state.originalImage = img;
        
        // Display preview
        elements.originalImage.src = img.src;
        elements.originalSize.textContent = formatFileSize(file.size);
        elements.originalDimensions.textContent = `${img.width} × ${img.height}`;
        
        // Set default resize values
        elements.resizeWidth.placeholder = img.width.toString();
        elements.resizeHeight.placeholder = img.height.toString();
        
        // Show sections
        elements.previewSection.style.display = 'block';
        elements.settingsSection.style.display = 'block';
        elements.resultSection.style.display = 'none';
        
        // Hide loading
        hideLoading();
        
        // Haptic feedback (if available)
        hapticFeedback();
        
    } catch (error) {
        hideLoading();
        showError('Error loading image: ' + error.message);
    }
}

// Load Image
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                resolve(img);
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Handle Quality Change
function handleQualityChange(event) {
    state.quality = parseInt(event.target.value);
    elements.qualityValue.textContent = `${state.quality}%`;
}

// Handle Convert
async function handleConvert() {
    if (!state.originalImage) return;
    
    showLoading();
    
    try {
        // Get resize dimensions
        const width = elements.resizeWidth.value 
            ? parseInt(elements.resizeWidth.value) 
            : state.originalImage.width;
        const height = elements.resizeHeight.value 
            ? parseInt(elements.resizeHeight.value) 
            : state.originalImage.height;
        
        // Convert to WebP
        const blob = await convertToWebP(state.originalImage, width, height, state.quality);
        state.convertedBlob = blob;
        
        // Display result
        const url = URL.createObjectURL(blob);
        elements.convertedImage.src = url;
        elements.convertedSize.textContent = formatFileSize(blob.size);
        
        // Calculate savings
        const savings = ((1 - blob.size / state.originalFile.size) * 100).toFixed(1);
        elements.savings.textContent = `${savings}% smaller`;
        
        // Show result section
        elements.resultSection.style.display = 'block';
        
        // Scroll to result
        elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide loading
        hideLoading();
        
        // Haptic feedback
        hapticFeedback();
        
    } catch (error) {
        hideLoading();
        showError('Error converting image: ' + error.message);
    }
}

// Convert to WebP
function convertToWebP(img, width, height, quality) {
    return new Promise((resolve, reject) => {
        try {
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            // Draw image
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to WebP
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert image'));
                    }
                },
                'image/webp',
                quality / 100
            );
        } catch (error) {
            reject(error);
        }
    });
}

// Handle Download
function handleDownload() {
    if (!state.convertedBlob) return;
    
    // Create download link
    const url = URL.createObjectURL(state.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName(state.originalFile.name) + '.webp';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    // Haptic feedback
    hapticFeedback();
}

// Handle Reset
function handleReset() {
    // Reset state
    state.originalFile = null;
    state.originalImage = null;
    state.convertedBlob = null;
    state.quality = 80;
    
    // Reset UI
    elements.fileInput.value = '';
    elements.quality.value = 80;
    elements.qualityValue.textContent = '80%';
    elements.resizeWidth.value = '';
    elements.resizeHeight.value = '';
    
    // Hide sections
    elements.previewSection.style.display = 'none';
    elements.settingsSection.style.display = 'none';
    elements.resultSection.style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Haptic feedback
    hapticFeedback();
}

// Utility Functions

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Get File Name (without extension)
function getFileName(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

// Show Loading
function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

// Hide Loading
function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

// Show Error
function showError(message) {
    alert(message);
}

// Haptic Feedback
function hapticFeedback() {
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('Install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    deferredPrompt = null;
});
