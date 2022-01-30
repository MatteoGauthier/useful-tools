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

interface FormInput {
  input: string;
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
    const output = input.toUpperCase();
    await copyTextToClipboard(output);
    await showHUD("Copied to clipboard");
    popToRoot();
  }

  return <SubmitFormAction icon={Icon.Checkmark} title="Format" onSubmit={handleSubmit} />;
}
