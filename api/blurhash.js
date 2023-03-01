const express = require('express');

const https = require("https");
// Sharp allows you to recieve a data buffer from the uploaded image.
const sharp = require('sharp');
// Import the encode function from the blurhash package.
const { encode } = require('blurhash');

const router = express.Router();

router.post('/blurhash', async (req, res) => {
    const { imageUrl } = req.body;
    // If the file is not available we're returning with error.
    if (!imageUrl) {
      res.status(400).json({ message: 'Image is missing' });
      return;
    }

    https.get(imageUrl, (response) => {
        const chunks = [];
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', async () => {
           const buffer = Buffer.concat(chunks);
          
            const componentX = req.body.componentX ?? 4;
            const componentY = req.body.componentY ?? 3;

            const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({
            resolveWithObject: true,
            });

            const blurhash = encode(data, info.width, info.height, componentX, componentY);
            return res.json({ blurhash });
        });
      }).on('error', (error) => {
        console.error(error);
      });
  });

module.exports = router;