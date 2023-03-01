const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");
// Sharp allows you to recieve a data buffer from the uploaded image.
const sharp = require('sharp');
// Import the encode function from the blurhash package.
const { encode } = require('blurhash');

const app = express();

app.use(cors());
app.use(bodyParser.json());

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
          console.log('buffer', buffer);
          
            // Users can specify number of components in each axes.
            const componentX = req.body.componentX ?? 4;
            const componentY = req.body.componentY ?? 3;
        
            // We're converting provided image to a byte buffer.
            // Sharp currently supports multiple common formats like JPEG, PNG, WebP, GIF, and AVIF.

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

app.listen(3500, () => {
  console.log('up and running')
});

module.exports = app;