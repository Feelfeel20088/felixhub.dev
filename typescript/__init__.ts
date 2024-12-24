import fs from 'fs';
import path from 'path';

// Path to the folder containing the files you want to import
const folderPath = path.join(__dirname, './dynamic_endpoints');

// Read all files in the folder
const files = fs.readdirSync(folderPath);

files.forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(folderPath, file));
    }
});
