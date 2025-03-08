// gpuProvider.js
const { exec } = require('child_process');

/**
 * Führt den Befehl aus, um die GPU-Auslastung zu ermitteln.
 * Hier wird das Kommando "nvidia-smi" genutzt, welches von NVIDIA-Treibern bereitgestellt wird.
 */
function getGPUUsage() {
    return new Promise((resolve, reject) => {
        // Beispielbefehl: Gibt den GPU-Auslastungswert als Zahl (Prozent) aus.
        exec('nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits', (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            // stdout enthält z. B. "25", also 25% GPU-Auslastung
            const usage = parseInt(stdout.trim(), 10);
            resolve(usage);
        });
    });
}

/**
 * Die Hauptfunktion, die vom Provider aufgerufen wird.
 * Sie ruft die GPU-Daten ab und gibt ein Objekt zurück, das in deiner Statusbar angezeigt werden kann.
 */
module.exports = async function runGPUProvider() {
    try {
        const usage = await getGPUUsage();
        return {
            name: 'NVIDIA GPU',
            usage: usage
        };
    } catch (error) {
        // Fehlerbehandlung: Falls der Aufruf fehlschlägt, wird 0% ausgegeben
        return {
            name: 'NVIDIA GPU',
            usage: 0,
            error: error.message
        };
    }
};
