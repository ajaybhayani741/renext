/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Fix the path that went one level too high
            content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/lib\/utils/g, '../../../lib/utils');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed ' + fullPath);
            }
        }
    }
}

replaceInDir('/Users/sohamghadge/Desktop/Projects/work/renext/src/components/dashboard/ui');
replaceInDir('/Users/sohamghadge/Desktop/Projects/work/renext/src/components/dashboard/shared');
