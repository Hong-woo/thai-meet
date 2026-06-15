const [
  ,
  ,
  command = "unknown",
  message = "This command is not scaffolded yet.",
  docPath = "docs/dev/ROADMAP.md"
] = process.argv;

if (command === "--help" || command === "-h") {
  console.log("Usage: node scripts/not-scaffolded.mjs <command> <message> <docPath>");
  console.log("");
  console.log("Prints a stable fail-closed scaffold guard:");
  console.log("  TM_COMMAND_NOT_SCAFFOLDED");
  console.log("  command=<command>");
  console.log("  message=<message>");
  console.log("  doc=<docPath>");
  process.exit(0);
}

console.error("TM_COMMAND_NOT_SCAFFOLDED");
console.error(`command=${command}`);
console.error(`message=${message}`);
console.error(`doc=${docPath}`);
process.exit(1);
