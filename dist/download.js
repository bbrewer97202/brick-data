"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const zlib_1 = __importDefault(require("zlib"));
const config_1 = __importDefault(require("config"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const files = config_1.default.get('rebrickable.tables');
    const basePath = config_1.default.get('rebrickable.url');
    const downloadDirectory = config_1.default.get('dbSourceFiles');
    yield downloadFiles(basePath, files, downloadDirectory);
    yield gunzipFilesInDirectory(downloadDirectory);
}))();
function downloadFileToPath(url, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield node_fetch_1.default(url);
            const fileStream = fs_1.default.createWriteStream(path);
            yield new Promise((resolve, reject) => {
                res.body.pipe(fileStream);
                res.body.on("error", (error) => {
                    reject(error);
                });
                fileStream.on("finish", () => {
                    resolve();
                });
            });
        }
        catch (error) {
            console.log('downloadFileToPath error', error);
        }
    });
}
function downloadFiles(basePath = '', fileList = [], directory) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_1.default.promises.mkdir(directory, { recursive: true });
        const suffix = '.csv.gz';
        for (const fileId of fileList) {
            const sourceFile = `${basePath}${fileId}${suffix}`;
            const destination = path_1.default.join(directory, `${fileId}${suffix}`);
            console.log(`Downloading... ${sourceFile} to ${destination}`);
            yield downloadFileToPath(sourceFile, destination);
        }
    });
}
function gunzipFilesInDirectory(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileList = fs_1.default.readdirSync(directory);
        const regex = /\.gz/;
        for (const fileName of fileList) {
            if (fileName.match(regex)) {
                const file = path_1.default.join(directory, fileName);
                const newFileName = fileName.replace(regex, '');
                const readFile = fs_1.default.createReadStream(file);
                const writeFile = fs_1.default.createWriteStream(path_1.default.join(directory, newFileName));
                const gunzip = zlib_1.default.createGunzip();
                console.log(`decompressing ${file}`);
                readFile.pipe(gunzip).pipe(writeFile);
            }
        }
    });
}
//# sourceMappingURL=download.js.map