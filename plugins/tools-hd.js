import fs from "fs"
import path from "path"
import fetch from "node-fetch"
import Jimp from "jimp"
import FormData from "form-data"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ""

    if (!/^image\/(jpe?g|png)$/.test(mime)) {
      return m.reply('🪐 𝐑𝐞𝐬𝐩𝐨𝐧𝐝𝐞 𝐚 𝐮𝐧𝐚 𝐢𝐦𝐚𝐠𝐞𝐧 𝐉𝐏𝐆 𝐨 𝐏𝐍𝐆.')
    }

    await conn.sendMessage(m.chat, { text: `⏳ Mejorando Su Imagen Espere Un Momento.\n> ${dev}` }, { quoted: m })

    const buffer = await q.download()
    const image = await Jimp.read(buffer)
    image.resize(800, Jimp.AUTO)

    const tmp = path.join(__dirname, `tmp_${Date.now()}.jpg`)
    await image.writeAsync(tmp)

    const pene = await uploadToUguu(tmp)
    if (!pene) throw new Error('Lo Sentimos La Api Fue Un Fracaso Total, Bueno Todas son asi😿')

    const enhanced = await upscaleImage(pene)
    await conn.sendFile(m.chat, enhanced, 'hd.jpg', '', m)
    await conn.sendMessage(m.chat, { text: "✅ 𝐈𝐦𝐚𝐠𝐞𝐧 𝐦𝐞𝐣𝐨𝐫𝐚𝐝𝐚." }, { quoted: m })

  } catch (err) {
    conn.reply(m.chat, `*Error:* ${err.message}\n > 🕊️.`, m)
  }
}

handler.help = ['upscale']
handler.tags = ['tools']
handler.command = ['hd', 'remini', 'upscale']

export default handler

async function uploadToUguu(filePath) {
  const form = new FormData()
  form.append("files[]", fs.createReadStream(filePath))

  try {
    const res = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      headers: form.getHeaders(),
      body: form
    })

    const json = await res.json()
    await fs.promises.unlink(filePath)
    return json.files?.[0]?.url
  } catch {
    await fs.promises.unlink(filePath)
    return null
  }
}

async function upscaleImage(url) {
  const res = await fetch(`https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error("No se pudo mejorar la imagen.")
  return await res.buffer()
}