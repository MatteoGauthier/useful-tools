import fs from "fs";
import symbology from "symbology";
import sharp from "sharp";
import os from "os";
import path from "path";

const { SymbologyType, createStream, OutputType } = symbology;

(async () => {
  try {
    const { data } = await createStream(
      {
        symbology: SymbologyType.QRCODE,
        showHumanReadableText: false,
        height: 512,
      },
      "HEyyyyyyydsydgsydsyg ysdb ys yd",
      OutputType.PNG
    );

    const buff = Buffer.from(data.split(";base64,").pop(), "base64");

    const resizedImage = await sharp(buff)
      .resize({
        width: 512,
        height: 512,
        kernel: sharp.kernel.nearest,
      })
      .toBuffer();

    const downloadFolder = path.join(os.homedir(), "Downloads");

    const filePath = path.join(downloadFolder, "hey.png");

    fs.writeFileSync(filePath, resizedImage);
  } catch (err) {
    console.error("Error: ", err);
  }
})();
