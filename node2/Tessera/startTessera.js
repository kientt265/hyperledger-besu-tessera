const { exec } = require('child_process');
const path = require('path');

const startTessera = () => {
    const currentDir = __dirname;
    
    const dockerCommand = `docker run -v ${currentDir}:/app -p 9102:9102 --name tessera-node2 --rm quorumengineering/tessera:latest -configfile /app/config.json`;

    console.log('Starting Tessera node...');
    console.log(`Working directory: ${currentDir}`);

    const tessera = exec(dockerCommand);

    tessera.stdout.on('data', (data) => {
        console.log(`Tessera: ${data}`);
    });

    tessera.stderr.on('data', (data) => {
        console.error(`Tessera Error: ${data}`);
    });

    tessera.on('close', (code) => {
        console.log(`Tessera process exited with code ${code}`);
    });

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('Stopping Tessera node...');
        exec('docker stop tessera-node2', (error) => {
            if (error) {
                console.error('Error stopping container:', error);
            }
            process.exit();
        });
    });
}

startTessera();