const fs = require('fs');
exports.deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('File deletion error:', err);
                return reject(err);
            }
            resolve();
        });
    });
}