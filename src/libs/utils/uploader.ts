import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

/** MULTER IMAGE UPLOADER **/
function getTargetImageStorage(address: string) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const fullPath = path.join("uploads", address);
            // Ensure the directory exists
            fs.mkdirSync(fullPath, { recursive: true });
            cb(null, fullPath);
        },
        filename: function (req, file, cb) {
            const extension = path.extname(file.originalname); // safer
            const random_name = uuidv4() + extension;
            cb(null, random_name);
        },
    });
}

const makeUploader = (address: string) => {
    const storage = getTargetImageStorage(address);
    return multer({ storage: storage });
};

export default makeUploader;
