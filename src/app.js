// Constants
const ROWS = 12;
const COLS = 12;
const PIXELS = ROWS * COLS;
const COLORS = Object.freeze(['black', 'white', 'red', 'orange', 'blue', 'green', 'yellow', 'purple', 'pink']);

// Cache DOM queries

// Initialize current color
let currentColor = 'black';

// Create color picker
function createColorPicker(colorPicker) {
    COLORS.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = color;
        if (color === currentColor) {
            colorBox.classList.add('selected');
        }
        colorBox.setAttribute('role', 'button');
        colorBox.setAttribute('aria-label', `Select ${color} color`);
        colorBox.setAttribute('tabindex', '0');
        colorPicker.appendChild(colorBox);
    });
    colorPicker.addEventListener('click', function(event) {
        // Check if the clicked element is a color box
        if (event.target.classList.contains('color-box')) {
            // Remove selected from all color boxes
            document.querySelectorAll('.color-box').forEach(function(box) {
                box.classList.remove('selected');
            });

            // Add selected to clicked box
            event.target.classList.add('selected');
            
            // Set new background color
            currentColor = event.target.style.backgroundColor;
            }
        });
}

// Create grid
function createGrid(initialPattern, grid) {
    for (let i = 0; i < PIXELS; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.style.backgroundColor = COLORS[initialPattern[i]];
        grid.appendChild(pixel);
    }
    grid.addEventListener('click', function(event) {
        // Check if the clicked element is a pixel
        if (event.target.classList.contains('pixel')) {
        event.target.style.backgroundColor = currentColor;
        }
    });
}

// Setup clear functionality
function setupClearButton(clearBtn) {
    clearBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (!confirm('Are you sure you want to clear the grid?')) {
            return;
        }
        document.querySelectorAll('.pixel').forEach(function(pixel) {
            pixel.style.backgroundColor = 'white';
        });
        // Clear url parameters from location bar
        window.history.replaceState({}, document.title, window.location.pathname);

    });
}

// Setup share functionality
function setupShareButton(shareBtn) {
    shareBtn.addEventListener('click', function() {
        event.preventDefault();
        // Get pattern from grid
        const pattern = Array.from(
            document.querySelectorAll('.pixel')).map(
            pixel => COLORS.indexOf(pixel.style.backgroundColor)
        ).join('');

        // Copy URL to clipboard
        const url = new URL(window.location.href);
        url.searchParams.set('pattern', pattern);
        navigator.clipboard.writeText(url.href);
        alert('URL copied to clipboard!');

        // Set new url in location bar
        window.history.replaceState({}, document.title, url);
    });
}

function getInitialPattern(window) {
    try {
        const url = new URL(window.location.href);
        const pattern = url.searchParams.get('pattern');
        return (pattern?.length === PIXELS && /^[0-8]+$/.test(pattern))
            ? pattern
            : '1'.repeat(PIXELS);
    } catch (e) {
        console.error('URL parsing failed:', e);
        return '1'.repeat(PIXELS);
    }
}

// Initialize the app
function init() {
    createColorPicker(document.getElementById('color-picker'));
    const grid = document.getElementById('grid');
    let initialPattern = getInitialPattern(window);
    createGrid(initialPattern, grid);
    setupClearButton(document.getElementById('clear-btn'));
    setupShareButton(document.getElementById('share-btn'));
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
