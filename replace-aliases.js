/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

function replaceInDir(dir, relativeLibPath) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath, relativeLibPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            // Replace @/lib/utils with relative path
            content = content.replace(/@\/lib\/utils/g, relativeLibPath);
            // Replace @/components/ui with relative path depending on folder
            if (dir.includes('/shared')) {
                content = content.replace(/@\/components\/ui/g, '../ui');
                content = content.replace(/@\/utils\/chartUtils/g, '../../../utils/chartUtils');
            } else if (dir.includes('/ui')) {
                content = content.replace(/@\/components\/ui/g, '.');
            }
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated ' + fullPath);
            }
        }
    }
}

replaceInDir('/Users/sohamghadge/Desktop/Projects/work/renext/src/components/dashboard/ui', '../../../../lib/utils');
replaceInDir('/Users/sohamghadge/Desktop/Projects/work/renext/src/components/dashboard/shared', '../../../../lib/utils');
