import {
  cancel,
  confirm,
  isCancel,
  password,
  select,
  text,
} from "@clack/prompts";

import { CliError } from "./errors";

export function canPrompt() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

export async function promptText({
  message,
  flag,
  initialValue,
  validate,
}: {
  message: string;
  flag: string;
  initialValue?: string;
  validate?: (value: string | undefined) => string | undefined;
}) {
  ensurePromptable(flag);

  const value = await text({
    message,
    initialValue,
    validate,
  });

  return unwrapPrompt(value).trim();
}

export async function promptPassword({
  message,
  flag,
  validate,
}: {
  message: string;
  flag: string;
  validate?: (value: string | undefined) => string | undefined;
}) {
  ensurePromptable(flag);

  const value = await password({
    message,
    validate,
  });

  return unwrapPrompt(value).trim();
}

export async function promptConfirm({
  message,
  flag,
  initialValue,
}: {
  message: string;
  flag: string;
  initialValue: boolean;
}) {
  ensurePromptable(flag);

  const value = await confirm({
    message,
    initialValue,
  });

  return unwrapPrompt(value);
}

export async function promptSelect<Value extends string>({
  message,
  flag,
  options,
  initialValue,
}: {
  message: string;
  flag: string;
  options: {
    value: Value;
    label?: string;
    hint?: string;
    disabled?: boolean;
  }[];
  initialValue?: Value;
}) {
  ensurePromptable(flag);

  const value = await select<Value>({
    message,
    options: options as Parameters<typeof select<Value>>[0]["options"],
    initialValue,
  });

  return unwrapPrompt(value);
}

function ensurePromptable(flag: string) {
  if (!canPrompt()) {
    throw new CliError(
      `Missing ${flag}. Pass it as an option when running non-interactively.`,
    );
  }
}

function unwrapPrompt<Value>(value: Value | symbol) {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    throw new CliError("Operation cancelled.");
  }

  return value;
}
