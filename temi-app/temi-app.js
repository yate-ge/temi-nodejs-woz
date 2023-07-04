
import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
// const path = require('path');

app.use(express.static(__dirname));
// 静态目录即为当前脚本的目录

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'temi-app.html'));
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});