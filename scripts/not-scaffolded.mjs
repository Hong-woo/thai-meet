const [, , command = "unknown", message = "This command is not scaffolded yet."] = process.argv;

console.error(`[${command}] ${message}`);
process.exit(1);
