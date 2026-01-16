const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: ElonMD,
    useMultiFileAuthState,
    jidNormalizedUser,
    Browsers,
    delay,
    makeInMemoryStore,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, {
        recursive: true,
        force: true
    });
}

const { readFile } = require('node:fs/promises');

router.get('/', async (req, res) => {
    const id = makeid();
    async function ELON_MD_QR_CODE() {
        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Qr_Code_By_Elondrex = ElonMD({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeInMemoryStore(state.keys, pino({ level: 'silent' }).child({ level: 'silent' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }).child({ level: 'silent' }),
                browser: ['Ubuntu', 'Chrome'],
                syncFullHistory: false,
                connectTimeoutMs: 60000,
                keepAliveIntervalMs: 30000
            });

            Qr_Code_By_Elondrex.ev.on('creds.update', saveCreds);
            Qr_Code_By_Elondrex.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect, qr } = s;
                if (qr) await res.end(await QRCode.toBuffer(qr));
                if (connection === 'open') {
                    await Qr_Code_By_Elondrex.sendMessage(Qr_Code_By_Elondrex.user.id, { text: `
╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ Hello! 👋 You're now connected to Elon MD.

┋❒ Please wait a moment while we generate your session ID. It will be sent shortly... ⚡
╰┈┈┈┈━━━━━━┈┈┈┈◈
` });
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(8000);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Qr_Code_By_Elondrex.sendMessage(Qr_Code_By_Elondrex.user.id, { text: '' + b64data });

                    let ELON_MD_TEXT = `
🚀✨ *WELCOME TO ELON MD* ✨🚀  
╭━━━★˚⚡˚★━━━╮  
*🎯 DEVICE CONNECTED SUCCESSFULLY 🎯*  
╰━━━★˚🤖˚★━━━╯

📦 *Your Session ID is Ready!*  
🔐 Please copy and store it securely — you'll need it to deploy your *Elon MD* bot.

⚡ *Powerful WhatsApp automation at your fingertips!*

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

📌 *Need Assistance? Reach Out Anytime:*  
• 👑 *Owner:* https://wa.me/2347018486818  
• 📢 *Channel:* https://whatsapp.com/channel/0029VbC58oLAjPXSXn7Hyv1Q  
• 📧 *Email:* elondrex@gmail.com  
• 💻 *GitHub Repo:* https://github.com/elondrex/Elon-MD  
• 🌐 *Website:* https://elondrex.vercel.app

🧠 *Support Elon MD Project:*  
⭐ Star & 🍴 Fork the repo to stay updated with new features!

🚀 *#ElonMD | #Innovation | #WhatsAppBot*`;

                    await Qr_Code_By_Elondrex.sendMessage(Qr_Code_By_Elondrex.user.id, { text: ELON_MD_TEXT }, { quoted: session });

                    await delay(100);
                    await Qr_Code_By_Elondrex.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(5000); 
                    ELON_MD_QR_CODE();
                }
            });
        } catch (err) {
            console.log('Service restarted due to error:', err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.json({ code: 'Service is Currently Unavailable' });
            }
        }
    }
    return await ELON_MD_QR_CODE();
});

module.exports = router;