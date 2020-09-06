import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import config from 'config';

type FileList = string[] | never[];
type BasePath = string;
type DownloadDirectoryPath = string;

/**
 * main
 */
(async () => {

  const files: FileList = config.get('rebrickable.tables');
  const basePath: BasePath = config.get('rebrickable.url');
  const downloadDirectory: DownloadDirectoryPath = config.get('dbSourceFiles');

  await downloadFiles(basePath, files, downloadDirectory);
  await gunzipFilesInDirectory(downloadDirectory);
})();

/**
 * download resource at a url and save it to a local path
 * @param url remote resource to download
 * @param path local file
 */
async function downloadFileToPath(url: string, path: string) {
  try {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", (error) => {
        reject(error);
      });
      fileStream.on("finish", () => {
        resolve();
      });
    });
  } catch (error) {
    console.log('downloadFileToPath error', error);
  }
}

/**
 * download all files in list from url and same them locally
 * @param basePath base download url
 * @param fileList list of files to download
 * @param directory local directory destination
 */
async function downloadFiles(basePath: BasePath = '', fileList: FileList = [], directory: DownloadDirectoryPath) {

  await fs.promises.mkdir(directory, { recursive: true });

  const suffix = '.csv.gz';

  for (const fileId of fileList) {
    const sourceFile = `${basePath}${fileId}${suffix}`;
    const destination = path.join(directory, `${fileId}${suffix}`);
    console.log(`Downloading... ${sourceFile} to ${destination}`);
    await downloadFileToPath(sourceFile, destination);
  }
}

/**
 * decompress all .gz files in a given directory
 * @param directory path to directory
 */
async function gunzipFilesInDirectory(directory: DownloadDirectoryPath) {
  const fileList: FileList = fs.readdirSync(directory);
  const regex = /\.gz/;
  for (const fileName of fileList) {
    if (fileName.match(regex)) {
      const file = path.join(directory, fileName);
      const newFileName = fileName.replace(regex, '');
      const readFile = fs.createReadStream(file);
      const writeFile = fs.createWriteStream(path.join(directory, newFileName));
      const gunzip = zlib.createGunzip();
      console.log(`decompressing ${file}`);
      readFile.pipe(gunzip).pipe(writeFile);
    }
  }
}
