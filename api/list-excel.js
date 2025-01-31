import { readdirSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
try {
    // Path to the "public/excel" folder
    const excelDir = join(process.cwd(), "public/excel");

    // Read all files from the directory
    const files = readdirSync(excelDir)
        .filter((file) => file.endsWith(".xlsx"))
        .map((file) => file.replace(/\.[^/.]+$/, "")); // Remove extension

    res.status(200).json({ files });
} catch (error) {
    console.error("Error reading files:", error);
    res.status(500).json({ error: "Failed to read Excel files" });
    }
}
