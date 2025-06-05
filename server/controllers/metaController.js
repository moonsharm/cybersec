const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const exiftoolPath = "../../public/exiftool/exiftool.exe";

exports.processFile = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: "Файл не загружен" });
    }

    const uploadedFile = req.files.file;
    const tempFilePath = path.join(__dirname, "../uploads", uploadedFile.name);

    fs.writeFile(tempFilePath, uploadedFile.data, (err) => {
        if (err) {
            console.error("Ошибка при сохранении файла:", err);
            return res.status(500).json({ error: "Ошибка сохранения файла" });
        }
        console.log("Файл успешно сохранен:", tempFilePath);
        
      });

    exec(`"${exiftoolPath}" -all "${tempFilePath}"`, (error, originalMetadata) => {
        if (error) return res.status(500).json({ error: "Ошибка получения метаданных" });

        exec(`"${exiftoolPath}" -all= -overwrite_original "${tempFilePath}"`, (error) => {
            if (error) return res.status(500).json({ error: "Ошибка очистки метаданных" });

            exec(`"${exiftoolPath}" -all "${tempFilePath}"`, (error, cleanedMetadata) => {
                if (error) return res.status(500).json({ error: "Ошибка получения очищенных метаданных" });

                res.json({
                    originalMetadata,
                    cleanedMetadata,
                    downloadUrl: `/uploads/${path.basename(tempFilePath)}`,
                });
            });
        });
    });
};
