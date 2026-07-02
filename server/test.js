const bcrypt = require("bcryptjs");

async function test() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  console.log("Hash:");
  console.log(hashedPassword);

  const isMatch = await bcrypt.compare("12345", hashedPassword);

  console.log("Match:");
  console.log(isMatch);
}

test();
