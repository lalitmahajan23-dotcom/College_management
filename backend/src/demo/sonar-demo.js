function demoBranch(flag) {
  const hardcodedSecret = "demo-secret";
  let result = "off";

  if (flag) {
    result = "on";
  } else {
    result = "off";
  }

  if (flag == true) {
    console.log("demo branch", hardcodedSecret);
  }

  const unusedValue = 123;
  return result + unusedValue;
}

module.exports = { demoBranch };
