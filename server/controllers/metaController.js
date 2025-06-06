const fs = require("fs");
const path = require("path");
const { exiftool } = require("exiftool-vendored");



const cleanExifData = (data) => {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
        // Пропускаем внутренние служебные поля
        if (["SourceFile", "Directory", "errors", "RenderingParameters", "IntrinsicMatrix", "InverseLensDistortionCoefficients", "LensDistortionCoefficients",
            "RegionAreaY", "RegionAreaW", "RegionAreaX", "RegionAreaH", "RegionAreaUnit", "RegionType", "ChromaticAdaptation",].includes(key)) continue;

        // Преобразуем вложенные даты в строки
        if (typeof value === "object" && value?._ctor === "ExifDateTime") {
            result[key] = `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")} ${value.hour}:${value.minute}:${value.second}`;
        } else {
            result[key] = value;
        }
    }
    return result;
};

exports.processFile = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: "Файл не загружен" });
    }

    const uploadedFile = req.files.file;
    const uploadDir = path.join(__dirname, "../uploads");

    // Убедись, что папка существует
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const tempFilePath = path.join(uploadDir, uploadedFile.name);
    fs.writeFileSync(tempFilePath, uploadedFile.data);

    try {
        const originalMetadata = await exiftool.read(tempFilePath);
        await exiftool.write(tempFilePath, {}, ['-all=']);
        const cleanedMetadata = await exiftool.read(tempFilePath);

        res.json({
            originalMetadata: cleanExifData(originalMetadata),
            cleanedMetadata: cleanExifData(cleanedMetadata),
            downloadUrl: `/uploads/${path.basename(tempFilePath)}`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка при обработке метаданных" });
    }
};
