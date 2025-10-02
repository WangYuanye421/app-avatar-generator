import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const kvNamespaceId = 'ced0ede6965842b5ac65e302b496d946';
const publicDir = './public';

try {
    const files = fs.readdirSync(publicDir);
    const imageFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.ico'));

    if (imageFiles.length === 0) {
        console.log('No image files found in the public directory.');
        process.exit(0);
    }

    console.log(`Found ${imageFiles.length} image files to upload.`);

    for (const file of imageFiles) {
        const filePath = path.join(publicDir, file);
        const key = file;
        
        console.log(`Uploading ${filePath} to KV with key "${key}"...`);
        
        const command = `npx wrangler kv key put --namespace-id="${kvNamespaceId}" "${key}" --path="${filePath}" --remote`;
        
        execSync(command, { stdio: 'inherit' });
        
        console.log(`Successfully uploaded ${key}.`);
    }

    console.log('All images uploaded successfully!');

} catch (error) {
    console.error('An error occurred during the upload process:', error);
    process.exit(1);
}
