const { createCanvas, loadImage, registerFont } = require('canvas');
const http = require('http');
const url = require('url');
const fs = require('fs');

// Register the font
registerFont('./regt.ttf', { family: 'CustomFont' });

const server = http.createServer(async (req, res) => {
    const query = url.parse(req.url, true).query;

    if (req.method === 'GET' && query.img) {
        const imgUrl = query.img;
        const name = query.name || '';
        const epi = query.epi || '';
        const model = query.model || '';

        try {
            // Load the source image
            const srcImage = await loadImage(imgUrl);
            const dstCanvas = createCanvas(800, 600);
            const ctx = dstCanvas.getContext('2d');

            // Fill the background with black
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, 200, 600);

            // Set the text color to white
            ctx.fillStyle = 'white';
            ctx.font = '20px "CustomFont"';

            // Calculate text positioning
            const totalTextHeight = 20 * 3; // Font size times number of lines
            const startingHeight = (600 - totalTextHeight) / 2;
            const textPadding = 50;

            // Draw the text
            ctx.fillText(name, textPadding, startingHeight);
            ctx.font = '15px "CustomFont"';
            ctx.fillText(`Episode: ${epi}`, textPadding, startingHeight + 40);
            ctx.fillText(`Status: ${model}`, textPadding, startingHeight + 80);

            // Load the logo image
            const logoImage = await loadImage('./logo.png');
            const logoWidth = 100;
            const logoHeight = logoImage.height * (logoWidth / logoImage.width);

            // Draw the resized logo
            ctx.drawImage(logoImage, 0, 0, logoWidth, logoHeight);

            // Add bottom left corner text
            ctx.font = '12px "CustomFont"';
            ctx.fillText('www.takamaga-hara.com, @takafest', 10, 590);

            // Draw the source image shifted to the right
            ctx.drawImage(srcImage, 420, 0, 600, 600);

            // Set response header and send the image
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(dstCanvas.toBuffer('image/png'));

        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error: ' + error.message);
        }
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid request');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
