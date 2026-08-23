const { spawn } = require("child_process");
const path = require("path");

console.log("Starting JS process-frames wrapper...");

const pythonScript = path.join(__dirname, "process_frames.py");
const pythonProcess = spawn("python", [pythonScript]);

pythonProcess.stdout.on("data", (data) => {
  process.stdout.write(data.toString());
});

pythonProcess.stderr.on("data", (data) => {
  process.stderr.write(data.toString());
});

pythonProcess.on("close", (code) => {
  console.log(`Frame processing child process exited with code ${code}`);
  process.exit(code);
});
