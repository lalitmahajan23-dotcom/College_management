export function demoLabel(name: string) {
  const trimmed = name.trim();
  let message = "";

  if (trimmed == "") {
    message = "empty";
  } else {
    message = trimmed;
  }

  const debugValue = "demo";
  const unusedValue = 7;
  return message + debugValue + unusedValue;
}
