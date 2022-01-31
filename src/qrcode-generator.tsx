import { ActionPanel, Form, Icon, popToRoot, showToast, SubmitFormAction, ToastStyle } from "@raycast/api";
import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";
// import { createStream, OutputType, SymbologyType } from "symbology";

interface FormInput {
  input: string;
  fileType: string;
}

export default function Lowercase() {
  return (
    <Form
      actions={
        <ActionPanel>
          <FormatAction />
        </ActionPanel>
      }
    >
      <Form.TextField id="input" title="Input" placeholder="The string to encode into QR Code" />
      <Form.Dropdown id="fileType" title="Output file type" storeValue>
        <Form.Dropdown.Item value="svg" title="SVG" />
        <Form.Dropdown.Item value="png" title="PNG" />
      </Form.Dropdown>
    </Form>
  );
}

function FormatAction() {
  async function handleSubmit(values: FormInput) {
    const { input, fileType } = values;

    if (typeof input !== "string") {
      showToast(ToastStyle.Failure, "Input must be a string");
      return;
    }

    if (input.length === 0) {
      showToast(ToastStyle.Failure, "Empty input");
      return;
    }

    const qrCode = await generateQRCode(input, fileType);
    await writeFileToDownloads(`qr-code-${new Date().toLocaleString().split(", ").join("-")}.${fileType}`, qrCode);

    await showToast(ToastStyle.Animated, "QR Code generated and saved to Downloads");
    popToRoot();
  }

  return <SubmitFormAction icon={Icon.Checkmark} title="Format" onSubmit={handleSubmit} />;
}

async function generateQRCode(input: string, fileType: string) {
  const imageType = fileType === "svg" ? OutputType.SVG : OutputType.PNG;

  const { data } = await createStream(
    {
      symbology: SymbologyType.QRCODE,
      showHumanReadableText: false,
      height: 512,
    },
    input,
    imageType
  );

  const dataStream: string = data as string;

  const rawBase64: string = dataStream.split(";base64,").pop() as string;

  const buff = Buffer.from(rawBase64, "base64");

  const resizedImage = await sharp(buff)
    .resize({
      width: 512,
      height: 512,
      kernel: sharp.kernel.nearest,
    })
    .toBuffer();

  return resizedImage;
}

async function writeFileToDownloads(fileName: string, data: Buffer) {
  const downloadFolder = path.join(os.homedir(), "Downloads");

  const filePath = path.join(downloadFolder, fileName);

  fs.writeFileSync(filePath, data);
}
