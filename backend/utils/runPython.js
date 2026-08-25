const { spawn } = require('child_process');
const path = require('path');

function runPython(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'python', scriptName);
    const pythonExecutable = process.env.PYTHON_BIN || 'python';

    const py = spawn(pythonExecutable, [scriptPath, ...args.map(String)], {
      cwd: path.join(__dirname, '..', 'python'),
      windowsVerbatimArguments: false,
      shell: false
    });

    let result = '';
    let error = '';

    py.stdout.on('data', (data) => {
      result += data.toString();
    });

    py.stderr.on('data', (data) => {
      error += data.toString();
    });

    py.on('error', reject);

    py.on('close', (code) => {
      if (code !== 0) {
        console.error('=== PYTHON STDERR ===');
        console.error(error);
        console.error('=== PYTHON STDOUT ==='); 
        console.error(result);
        return reject(new Error(error || `Python exited with code ${code}`));
      }
      try {
        resolve(JSON.parse(result.trim()));
      } catch (_err) {
        reject(new Error(`Could not parse Python output: ${result}`));
      }
    });
  });
}

module.exports = runPython;