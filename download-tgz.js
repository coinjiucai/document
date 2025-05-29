const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createWriteStream } = require('fs');

// 读取 package-lock.json 文件
function readPackageLock() {
    try {
        const packageLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
        return packageLock;
    } catch (error) {
        console.error('Error reading package-lock.json:', error.message);
        return null;
    }
}

// 指定保存 tgz 文件的文件夹
const outputFolder = 'downloaded_tgz';

// 创建输出文件夹（如果不存在）
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// 提取依赖项的下载地址
function extractDownloadUrls(packageLock) {
    if (!packageLock) return [];
    let dependencies;
    if (packageLock.packages) {
        dependencies = packageLock.packages;
    } else if (packageLock.dependencies) {
        dependencies = packageLock.dependencies;
    } else {
        console.error('No dependencies found in package-lock.json');
        return [];
    }
    console.log('Dependencies in package-lock.json:', dependencies);
    const downloadUrls = [];

    for (const key in dependencies) {
        if (dependencies[key].resolved) {
            downloadUrls.push(dependencies[key].resolved);
        }
    }
    console.log('Extracted download URLs:', downloadUrls);
    return downloadUrls;
}

// 循环下载 tgz 文件
async function downloadTgzFiles(downloadUrls) {
    for (const url of downloadUrls) {
        try {
            const fileName = path.basename(url);
            const outputPath = path.join(outputFolder, fileName);

            const writer = createWriteStream(outputPath);

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            });

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`Downloaded: ${fileName}`);
        } catch (error) {
            console.error(`Error downloading ${url}:`, error);
        }
    }
}

// 主执行逻辑
const packageLock = readPackageLock();
const downloadUrls = extractDownloadUrls(packageLock);
downloadTgzFiles(downloadUrls);