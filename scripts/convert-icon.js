const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/notification-icon.svg');
const pngPath = path.join(__dirname, '../assets/notification-icon.png');

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Convert SVG to PNG
sharp(svgBuffer)
    .resize(96, 96)
    .png()
    .toFile(pngPath)
    .then(() => {
        console.log('Successfully converted SVG to PNG');
    })
    .catch(err => {
        console.error('Error converting SVG to PNG:', err);
    }); 