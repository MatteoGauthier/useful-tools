import {
  copyTextToClipboard,
  popToRoot,
  showHUD,
  showToast,
  ActionPanel,
  Icon,
  SubmitFormAction,
  Form,
  ToastStyle,
} from "@raycast/api";

function strSlugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();
  const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  const to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  return str
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type IndentType = "tab" | "2" | "4" | "8";

interface FormInput {
  input: string;
  indent: IndentType;
}

export default function Slugify() {
  return (
    <Form
      actions={
        <ActionPanel>
          <FormatAction />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="Input" placeholder="Your string" />
    </Form>
  );
}

function FormatAction() {
  async function handleSubmit(values: FormInput) {
    const { input } = values;

    if (typeof input !== "string") {
      showToast(ToastStyle.Failure, "Input must be a string");
      return;
    }

    if (input.length === 0) {
      showToast(ToastStyle.Failure, "Empty input");
      return;
    }
    const output = strSlugify(input);
    await copyTextToClipboard(output);
    await showHUD("Copied to clipboard");
    popToRoot();
  }

  return <SubmitFormAction icon={Icon.Checkmark} title="Format" onSubmit={handleSubmit} />;
}
