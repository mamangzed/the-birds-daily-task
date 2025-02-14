import axios from 'axios';
import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';
import { Twisters } from 'twisters';
import fs from 'fs';

const spinner = new Twisters();


async function countdown(seconds, id) {
    return new Promise((resolve) => {
        let remaining = seconds;

        const interval = setInterval(() => {
            const hours = Math.floor(remaining / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const secs = remaining % 60;

            const formattedTime =
                `${hours.toString().padStart(2, '0')}:` +
                `${minutes.toString().padStart(2, '0')}:` +
                `${secs.toString().padStart(2, '0')}`;

            spinner.put(id, {
                text: `⏳ Menunggu ${formattedTime} sebelum melanjutkan...`
            });

            remaining--;

            if (remaining < 0) {
                clearInterval(interval);
                spinner.put(id, { text: '⏩ Mengirim ulang permintaan...' });
                resolve();
            }
        }, 1000);
    });
}


async function delay5jam(statusId) {
    const hours = 5;
    const totalSeconds = hours * 60 * 60;
    spinner.put(statusId, { text: `⏰ Menunggu ${hours} jam sebelum memulai sesi baru...` });
    await countdown(totalSeconds, statusId);
}

function displayAppTitle() {
    console.log('\n' + boxen(
        chalk.cyan(figlet.textSync(' TheBirds ', { horizontalLayout: 'full' })) +
        '\n' + chalk.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') +
        '\n' + chalk.gray('By Mamangzed') +
        '\n' + chalk.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'), {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'cyan',
            float: 'center'
        }
    ));
}

const motherfuckingheaders = (bearer) => {
    const head = {
        "if-none-match": `W/"143-W9idRk4YQsCv20d6SiobUrdr7G4"`,
        "origin": "https://thebirds.ai",
        "referer": "https://thebirds.ai",
        "accept": "application/json, text/plain, */*",
        "csrf-token": "",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "sec-fetch-site": "same-site",
        "sec-ch-ua": `"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"`,
        "authorization": bearer
    }
    return head;
}


function createBox(content, title, color = 'cyan') {
    return boxen(
        chalk[color](content), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: color,
            title: chalk.bold[color](title),
            titleAlignment: 'center'
        }
    );
}


async function getUser(headers) {
    try {
        const res = await axios.get('https://api.thebirds.ai/user', { headers });
        return res.data;
    }
    catch (err) {
        return err;
    }
}

async function getTelor(headers) {
    try {
        const res = await axios.get('https://api.thebirds.ai/minigame/egg/join', { headers });
        return res.data;
    }
    catch (err) {
        return err;
    }
}

async function pecahTelor(headers) {
    try {
        const res = await axios.get('https://api.thebirds.ai/minigame/egg/play', { headers });
        return true;
    }
    catch (err) {
        return false;
    }
}

async function claimTelor(headers) {
    try {
        const res = await axios.get('https://api.thebirds.ai/minigame/egg/claim', { headers });
        return true;
    }
    catch (err) {
        return false;
    }
}

function jamcuk(timestamp) {
    const date = new Date(timestamp);

    const options = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(date);

    return formattedDate;
}


async function processWallet(bearers) {

    // Generate unique IDs untuk setiap spinner
    const walletOrName = `wallet_${bearers}`;
    const telurId = `telur_${bearers}`;
    const playTimeId = `playtime_${bearers}`;
    const totalBurungId = `burung_${bearers}`;
    const delimeId = `delim_${bearers}`;
    const burungBelumKlaim = `burungme_${bearers}`

    spinner.put(delimeId, { text: chalk.dim('─'.repeat(process.stdout.columns - 3 || 80)) });

    spinner.put(walletOrName, { text: '🪙 Nama atau wallet lu...' });
    spinner.put(telurId, { text: '🥚 Sisa telor burung lu 0 ...' });
    spinner.put(playTimeId, { text: `⏰Terkahir kali main...` });
    spinner.put(burungBelumKlaim, { text: '🐣 Total burung belum klaim... ' });
    spinner.put(totalBurungId, { text: '🐦 Total burung 0 ' });

    const bearerscok = await motherfuckingheaders(bearers);
    const userInfo = await getUser(bearerscok);
    const telorInfo = await getTelor(bearerscok);

    spinner.put(walletOrName, { text: `💰 Nama atau wallet lu : ${userInfo.name || 0}`, active: true });
    spinner.put(telurId, { text: `🥚 Sisa telor burung lu ${telorInfo.turn || 0} ...`, active: true });
    spinner.put(playTimeId, { text: `⏰ Terkahir kali main.. ${jamcuk(telorInfo.lastPlayAt || 0)}`, active: true });
    spinner.put(totalBurungId, { text: `🐦 Total burung ${userInfo.balance || 0}`, active: true });
    spinner.put(burungBelumKlaim, { text: `🐣 Total burung belum kalim ${telorInfo.total || 0}`, active: true });
    spinner.put(telurId, { text: `🥚 Sisa telor burung lu ${telorInfo.turn || 0} ...`, active: true });
    if (telorInfo.turn === 0) {
        spinner.put(walletOrName, { text: `${chalk.yellow('+')} Nama atau wallet lu : ${userInfo.name || 0}`, active: false });
        spinner.put(telurId, { text: `${chalk.yellow('+')} Sisa telor burung lu ${telorInfo.turn || 0} ...`, active: false });
        spinner.put(totalBurungId, { text: `${chalk.yellow('+')} Total burung ${userInfo.balance || 0}`, active: false });
        spinner.put(burungBelumKlaim, { text: `${chalk.yellow('+')} Total burung belum kalim ${telorInfo.total || 0}`, active: false });
        spinner.put(telurId, { text: `${chalk.yellow('+')} Sisa telor burung lu ${telorInfo.turn || 0} ...`, active: false });
        await claimTelor(bearerscok);
        await delay5jam(playTimeId);

    }
    else {
        await pecahTelor(bearerscok);
    }
    processWallet(bearers);

}

async function readWallets() {
    try {
        const data = fs.readFileSync('bearers.json', 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error(chalk.red('Error membaca file wallets.json:'), error.message);
        process.exit(1);
    }
}

async function main() {
    console.clear();
    displayAppTitle();

    const wallets = await readWallets();
    if (!wallets.length) {
        console.error(chalk.red('❌ Tidak ada bearer token yang ditemukan di bearers.json'));
        process.exit(1);
    }

    console.log(boxen(
        `${chalk.blue('📌 Konfigurasi Sesi')}\n` +
        `${chalk.yellow('🔑 Jumlah Wallet:')} ${wallets.length}`, { padding: 1, borderStyle: 'round', borderColor: 'yellow' }
    ));

    const walletPromises = wallets.map(wallet => {

        return processWallet(wallet.bearer);
    });

    try {
        await Promise.all(walletPromises);
    }
    catch (error) {
        console.error(chalk.red('Error dalam menjalankan sesi:'), error);
    }
}

// Handle cleanup
process.on('SIGINT', () => {
    spinner.stop();
    process.exit();
});

process.on('uncaughtException', (error) => {
    console.error(chalk.red('Uncaught Exception:'), error);
    spinner.stop();
    process.exit(1);
});

main().catch(error => {
    console.error(chalk.red('Error:'), error);
    // spinner.stop();
    process.exit(1);
});
