// By WillZek >> https://github.com/WillZek

import fetch from 'node-fetch';

let handler = async(m, { conn, usedPrefix, command, text }) => {

if (!text) return m.reply(`🍭 Ingresa Un Texto Para Buscar En Youtube\n> *Ejemplo:* ${usedPrefix + command} Ozuna`);

try {
let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();

let results = api.data[0];

let txt = `✨ *Título:* ${results.title}\n⌛ *Duración:* ${results.duration}\n📎 *Link:* ${results.url}\n📆 *Publicado:* ${results.publishedAt}`;

let img = results.image;

conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });

let api2 = await(await fetch(`https://api.vreden.my.id/api/ytmp3?url=${results.url}`)).json();

// if (!api2?.result?.download.url) return m.reply('𝐍𝐨 𝐒𝐞  𝐄𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐫𝐨𝐧 𝐑𝐞𝐬𝐮𝐥𝐭𝐚𝐝𝐨𝐬');

await conn.sendMessage(m.chat, { document: { url: api2.result.download.url }, mimetype: 'audio/mpeg', fileName: `${results.title}.mp3` }, { quoted: m });

} catch (e) {
m.reply(`Error: ${e.message}`);
m.react('✖️');
  }
}

handler.command = ['playdoc', 'pdoc'];

export default handler