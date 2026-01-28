// Image Converter App - Main JavaScript

// State Management
const state = {
    originalFile: null,
    originalImage: null,
    convertedBlob: null,
    quality: 80,
    usedOriginal: false,
    uploadMode: 'single', // 'single' or 'zip'
    zipImages: [], // Array of images from zip file
    zipFileName: ''
};

// DOM Elements
const elements = {
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    previewSection: document.getElementById('previewSection'),
    settingsSection: document.getElementById('settingsSection'),
    resultSection: document.getElementById('resultSection'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    loadingProgress: document.getElementById('loadingProgress'),
    errorToast: document.getElementById('errorToast'),
    errorMessage: document.getElementById('errorMessage'),
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
    resetButton: document.getElementById('resetButton'),
    singleModeBtn: document.getElementById('singleModeBtn'),
    zipModeBtn: document.getElementById('zipModeBtn'),
    uploadText: document.getElementById('uploadText'),
    uploadHint: document.getElementById('uploadHint')
};

// Initialize App
function init() {
    // Check WebP support
    checkWebPSupport();
    registerServiceWorker();
    setupEventListeners();
    updateFooterYear();
}

// Update Footer Year
function updateFooterYear() {
    const footerText = document.getElementById('footerText');
    const currentYear = new Date().getFullYear();
    footerText.textContent = `© ${currentYear} a solvepao research product`;
}

// Check WebP Support
function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (!supported) {
        showError('Your browser does not support WebP conversion. Please use a modern browser like Chrome, Edge, or Safari 14+.');
    }
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
    // Upload mode selection
    elements.singleModeBtn.addEventListener('click', () => switchUploadMode('single'));
    elements.zipModeBtn.addEventListener('click', () => switchUploadMode('zip'));
    
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
    
    // Preset buttons
    document.querySelectorAll('.preset-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const quality = parseInt(e.currentTarget.dataset.quality);
            handlePresetClick(quality);
        });
    });
    
    // Convert button
    elements.convertButton.addEventListener('click', handleConvert);
    
    // Download button
    elements.downloadButton.addEventListener('click', handleDownload);
    
    // Reset button
    elements.resetButton.addEventListener('click', handleReset);
}

// Check if file is a valid image file (including HEIC)
function isValidImageFile(file) {
    if (file.type.startsWith('image/')) {
        return true;
    }
    // Check for HEIC/HEIF files which may not have proper MIME type
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return ext === '.heic' || ext === '.heif';
}

// File Selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (state.uploadMode === 'zip') {
        if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
            processZipFile(file);
        } else {
            showError('Please select a valid ZIP file');
        }
    } else {
        if (isValidImageFile(file)) {
            processFile(file);
        } else {
            showError('Please select a valid image file');
        }
    }
}

// Switch Upload Mode
function switchUploadMode(mode) {
    state.uploadMode = mode;
    
    // Update button states
    elements.singleModeBtn.classList.toggle('active', mode === 'single');
    elements.zipModeBtn.classList.toggle('active', mode === 'zip');
    
    // Update file input accept attribute
    if (mode === 'zip') {
        elements.fileInput.setAttribute('accept', '.zip,application/zip');
        elements.uploadText.textContent = 'Tap to upload ZIP file';
        elements.uploadHint.textContent = 'ZIP archive containing images';
    } else {
        elements.fileInput.setAttribute('accept', 'image/*,.heic,.heif');
        elements.uploadText.textContent = 'Tap to upload image';
        elements.uploadHint.textContent = 'Supports JPG, PNG, GIF, BMP, TIFF, HEIC';
    }
    
    // Reset if mode changed
    handleReset();
}

// Handle Preset Click
function handlePresetClick(quality) {
    state.quality = quality;
    elements.quality.value = quality;
    elements.qualityValue.textContent = `${quality}%`;
    
    // Update preset button states
    document.querySelectorAll('.preset-button').forEach(button => {
        button.classList.toggle('active', parseInt(button.dataset.quality) === quality);
    });
    
    hapticFeedback();
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
    if (!file) return;
    
    if (state.uploadMode === 'zip') {
        if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
            processZipFile(file);
        } else {
            showError('Please drop a valid ZIP file');
        }
    } else {
        if (isValidImageFile(file)) {
            processFile(file);
        } else {
            showError('Please drop a valid image file');
        }
    }
}

// Process ZIP File
async function processZipFile(file) {
    state.zipFileName = file.name.replace('.zip', '');
    
    showLoading('Extracting images from ZIP...');
    
    try {
        const zip = await JSZip.loadAsync(file);
        const imageFiles = [];
        
        // Filter for image files
        for (const [filename, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir && isImageFile(filename)) {
                const blob = await zipEntry.async('blob');
                imageFiles.push({
                    name: filename,
                    blob: blob,
                    size: blob.size
                });
            }
        }
        
        if (imageFiles.length === 0) {
            hideLoading();
            showError('No images found in ZIP file');
            return;
        }
        
        state.zipImages = imageFiles;
        
        // Display preview of first image
        const firstImage = await loadImageFromBlob(imageFiles[0].blob, imageFiles[0].name);
        state.originalImage = firstImage;
        
        elements.originalImage.src = firstImage.src;
        elements.originalSize.textContent = `${imageFiles.length} images (${formatFileSize(file.size)} total)`;
        elements.originalDimensions.textContent = `First: ${firstImage.width} × ${firstImage.height}`;
        
        // Show sections
        elements.previewSection.style.display = 'block';
        elements.settingsSection.style.display = 'block';
        elements.resultSection.style.display = 'none';
        
        hideLoading();
        hapticFeedback();
        
    } catch (error) {
        hideLoading();
        showError('Error processing ZIP file: ' + error.message);
    }
}

// Check if file is HEIC format
function isHeicFile(filename) {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return ext === '.heic' || ext === '.heif';
}

// Convert HEIC blob to JPEG blob
async function convertHeicToJpeg(blob) {
    try {
        const convertedBlob = await heic2any({
            blob: blob,
            toType: 'image/jpeg',
            quality: 0.92
        });
        // heic2any may return an array for multi-image HEIC files
        return Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    } catch (error) {
        throw new Error('Failed to convert HEIC image: ' + error.message);
    }
}

// Check if file is an image
function isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.heic', '.heif'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
}

// Load Image from Blob (with HEIC support)
async function loadImageFromBlob(blob, filename = '') {
    // Convert HEIC to JPEG if needed
    if (isHeicFile(filename) || blob.type === 'image/heic' || blob.type === 'image/heif') {
        blob = await convertHeicToJpeg(blob);
    }
    
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = () => {
            URL.revokeObjectURL(url); // Clean up memory
            resolve(img);
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url); // Clean up memory even on error
            reject(new Error('Failed to load image'));
        };
        
        img.src = url;
    });
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

// Load Image (with HEIC support)
async function loadImage(file) {
    // Check if file is HEIC and needs conversion
    if (isHeicFile(file.name) || file.type === 'image/heic' || file.type === 'image/heif') {
        const convertedBlob = await convertHeicToJpeg(file);
        return loadImageFromBlob(convertedBlob);
    }
    
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
    
    if (state.uploadMode === 'zip' && state.zipImages.length > 0) {
        await handleBatchConvert();
    } else {
        await handleSingleConvert();
    }
}

// Handle Single Image Convert
async function handleSingleConvert() {
    showLoading('Converting image...');
    
    try {
        // Get resize dimensions with validation and aspect ratio preservation
        let width = state.originalImage.width;
        let height = state.originalImage.height;
        const aspectRatio = width / height;
        
        const hasWidth = elements.resizeWidth.value && parseInt(elements.resizeWidth.value) > 0;
        const hasHeight = elements.resizeHeight.value && parseInt(elements.resizeHeight.value) > 0;
        
        if (hasWidth && hasHeight) {
            // Both dimensions provided
            const parsedWidth = parseInt(elements.resizeWidth.value);
            const parsedHeight = parseInt(elements.resizeHeight.value);
            if (parsedWidth <= 10000 && parsedHeight <= 10000) {
                width = parsedWidth;
                height = parsedHeight;
            }
        } else if (hasWidth) {
            // Only width provided, calculate height to maintain aspect ratio
            const parsedWidth = parseInt(elements.resizeWidth.value);
            if (parsedWidth > 0 && parsedWidth <= 10000) {
                width = parsedWidth;
                height = Math.round(parsedWidth / aspectRatio);
            }
        } else if (hasHeight) {
            // Only height provided, calculate width to maintain aspect ratio
            const parsedHeight = parseInt(elements.resizeHeight.value);
            if (parsedHeight > 0 && parsedHeight <= 10000) {
                height = parsedHeight;
                width = Math.round(parsedHeight * aspectRatio);
            }
        }
        
        // Convert to WebP
        let blob = await convertToWebP(state.originalImage, width, height, state.quality);
        
        // Check if the converted image is larger than the original
        if (blob.size > state.originalFile.size) {
            blob = state.originalFile;
            state.usedOriginal = true;
        } else {
            state.usedOriginal = false;
        }
        
        state.convertedBlob = blob;
        
        // Display result
        const url = URL.createObjectURL(blob);
        elements.convertedImage.src = url;
        elements.convertedSize.textContent = formatFileSize(blob.size);
        
        // Calculate savings
        if (state.usedOriginal) {
            elements.savings.textContent = 'Original kept (WebP was larger)';
        } else {
            const savings = ((1 - blob.size / state.originalFile.size) * 100).toFixed(1);
            elements.savings.textContent = `${savings}% smaller`;
        }
        
        // Show result section
        elements.resultSection.style.display = 'block';
        elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        hideLoading();
        hapticFeedback();
        
    } catch (error) {
        hideLoading();
        showError('Error converting image: ' + error.message);
    }
}

// Handle Batch Convert
async function handleBatchConvert() {
    showLoading('Converting images...', '0 / ' + state.zipImages.length);
    
    try {
        const zip = new JSZip();
        let totalOriginalSize = 0;
        let totalConvertedSize = 0;
        let convertedCount = 0;
        const usedFilenames = new Set(); // Track filenames to avoid collisions
        
        // Get resize dimensions with aspect ratio calculation
        const hasWidth = elements.resizeWidth.value && parseInt(elements.resizeWidth.value) > 0;
        const hasHeight = elements.resizeHeight.value && parseInt(elements.resizeHeight.value) > 0;
        const resizeWidth = hasWidth ? parseInt(elements.resizeWidth.value) : null;
        const resizeHeight = hasHeight ? parseInt(elements.resizeHeight.value) : null;
        
        for (let i = 0; i < state.zipImages.length; i++) {
            const imageFile = state.zipImages[i];
            
            updateLoadingProgress(`${i + 1} / ${state.zipImages.length}`);
            
            try {
                // Load image
                const img = await loadImageFromBlob(imageFile.blob, imageFile.name);
                
                // Calculate dimensions with aspect ratio preservation
                let width = img.width;
                let height = img.height;
                const aspectRatio = width / height;
                
                if (resizeWidth && resizeHeight) {
                    // Both dimensions specified
                    width = resizeWidth;
                    height = resizeHeight;
                } else if (resizeWidth) {
                    // Only width specified, maintain aspect ratio
                    width = resizeWidth;
                    height = Math.round(resizeWidth / aspectRatio);
                } else if (resizeHeight) {
                    // Only height specified, maintain aspect ratio
                    height = resizeHeight;
                    width = Math.round(resizeHeight * aspectRatio);
                }
                
                // Convert to WebP
                const webpBlob = await convertToWebP(img, width, height, state.quality);
                
                // Use smaller file
                let finalBlob = webpBlob;
                let fileName = imageFile.name;
                
                if (webpBlob.size < imageFile.size) {
                    // WebP is smaller, use it
                    fileName = getFileName(imageFile.name) + '.webp';
                    totalConvertedSize += webpBlob.size;
                } else {
                    // Original is smaller, keep it
                    finalBlob = imageFile.blob;
                    totalConvertedSize += imageFile.size;
                }
                
                totalOriginalSize += imageFile.size;
                
                // Handle filename collisions
                let uniqueFileName = fileName;
                let counter = 1;
                while (usedFilenames.has(uniqueFileName)) {
                    const baseName = getFileName(fileName);
                    const ext = fileName.substring(fileName.lastIndexOf('.'));
                    uniqueFileName = `${baseName}_${counter}${ext}`;
                    counter++;
                }
                usedFilenames.add(uniqueFileName);
                
                // Add to zip
                zip.file(uniqueFileName, finalBlob);
                convertedCount++;
                
            } catch (error) {
                console.error(`Error converting ${imageFile.name}:`, error);
                // Add original file on error with unique filename
                let uniqueFileName = imageFile.name;
                let counter = 1;
                while (usedFilenames.has(uniqueFileName)) {
                    const baseName = getFileName(imageFile.name);
                    const ext = imageFile.name.substring(imageFile.name.lastIndexOf('.'));
                    uniqueFileName = `${baseName}_${counter}${ext}`;
                    counter++;
                }
                usedFilenames.add(uniqueFileName);
                zip.file(uniqueFileName, imageFile.blob);
                totalConvertedSize += imageFile.size;
                totalOriginalSize += imageFile.size;
                convertedCount++;
            }
        }
        
        // Generate ZIP
        updateLoadingProgress('Creating ZIP file...');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        state.convertedBlob = zipBlob;
        
        // Display result
        const url = URL.createObjectURL(zipBlob);
        elements.convertedImage.src = state.originalImage.src; // Show first image as preview
        elements.convertedSize.textContent = `${convertedCount} images (${formatFileSize(zipBlob.size)})`;
        
        // Calculate savings
        const savings = ((1 - totalConvertedSize / totalOriginalSize) * 100).toFixed(1);
        elements.savings.textContent = `${savings}% total size reduction`;
        
        // Show result section
        elements.resultSection.style.display = 'block';
        elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        hideLoading();
        hapticFeedback();
        
    } catch (error) {
        hideLoading();
        showError('Error processing batch conversion: ' + error.message);
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
    
    // Set filename based on mode
    if (state.uploadMode === 'zip') {
        a.download = state.zipFileName + '_converted.zip';
    } else if (state.usedOriginal) {
        // Keep the original filename if we're using the original file
        a.download = state.originalFile.name;
    } else {
        // Use .webp extension for converted images
        a.download = getFileName(state.originalFile.name) + '.webp';
    }
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up URL after a short delay to ensure download starts
    const CLEANUP_DELAY = 100;
    setTimeout(() => URL.revokeObjectURL(url), CLEANUP_DELAY);
    
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
    state.usedOriginal = false;
    state.zipImages = [];
    state.zipFileName = '';
    
    // Reset UI
    elements.fileInput.value = '';
    elements.quality.value = 80;
    elements.qualityValue.textContent = '80%';
    elements.resizeWidth.value = '';
    elements.resizeHeight.value = '';
    
    // Reset preset buttons
    document.querySelectorAll('.preset-button').forEach(button => {
        button.classList.toggle('active', parseInt(button.dataset.quality) === 80);
    });
    
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
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex <= 0) {
        // No extension or filename starts with dot (e.g., ".gitignore")
        return filename;
    }
    return filename.substring(0, lastDotIndex);
}

// Show Loading
function showLoading(text = 'Converting...', progress = '') {
    elements.loadingOverlay.style.display = 'flex';
    elements.loadingText.textContent = text;
    elements.loadingProgress.textContent = progress;
}

// Hide Loading
function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

// Update Loading Progress
function updateLoadingProgress(progress) {
    elements.loadingProgress.textContent = progress;
}

// Show Error
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorToast.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.errorToast.style.display = 'none';
    }, 5000);
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
