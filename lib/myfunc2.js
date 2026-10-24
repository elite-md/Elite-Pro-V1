import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axios = require("axios")
const cheerio = require("cheerio")
const { resolve } = require("path")
const util = require("util")
let BodyForm = require("form-data")
let { fromBuffer } = require("file-type")
let fs = require("fs")
const child_process = require("child_process")
const ffmpeg = require("fluent-ffmpeg")
const { unlink } = require("fs").promises
export const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
export const fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}
export const fetchBuffer = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: "GET",
            url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
                "DNT": 1,
                "Upgrade-Insecure-Request": 1
            },
            ...options,
            responseType: "arraybuffer"
        })
        return res.data
    } catch (err) {
        return err
    }
}
export const webp2mp4File = async (path) => {
    return new Promise((resolve, reject) => {
        const form = new BodyForm()
        form.append("new-image-url", "")
        form.append("new-image", fs.createReadStream(path))
        axios({
            method: "post",
            url: "https://s6.ezgif.com/webp-to-mp4",
            data: form,
            headers: {
                "Content-Type": `multipart/form-data; boundary=${form._boundary}`
            }
        }).then(({ data }) => {
            const bodyFormThen = new BodyForm()
            const $ = cheerio.load(data)
            const file = $('input[name="file"]').attr("value")
            bodyFormThen.append("file", file)
            bodyFormThen.append("convert", "Convert WebP to MP4!")
            axios({
                method: "post",
                url: "https://ezgif.com/webp-to-mp4/" + file,
                data: bodyFormThen,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${bodyFormThen._boundary}`
                }
            }).then(({ data }) => {
                const $ = cheerio.load(data)
                const result = "https:" + $("div#output > p.outfile > video > source").attr("src")
                resolve({
                    status: true,
                    message: "Created By Eternity",
                    result: result
                })
            }).catch(reject)
        }).catch(reject)
    })
}
export const fetchUrl = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}
export const WAVersion = async () => {
    let get = await fetchUrl("https://web.whatsapp.com/check-update?version=1&platform=web")
    let version = [get.currentVersion.replace(/[.]/g, ", ")]
    return version
}
export const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}
export const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "gi"))
}
export const isNumber = (number) => {
    const int = parseInt(number)
    return typeof int === "number" && !isNaN(int)
}
const sleepy = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
export const buffergif = async (image) => {
    const filename = `${Math.random().toString(36).slice(2)}`
    const tempDir = "./database/temp"
    await fs.promises.mkdir(tempDir, { recursive: true })
    const gifPath = `${tempDir}/${filename}.gif`
    const mp4Path = `${tempDir}/${filename}.mp4`
    await fs.promises.writeFile(gifPath, image)
    await new Promise((resolve, reject) => {
        child_process.exec(`ffmpeg -i "${gifPath}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${mp4Path}"`, (error) => {
            if (error) {
                reject(error)
                return
            }
            resolve()
        })
    })
    const buffer5 = await fs.promises.readFile(mp4Path)
    await Promise.all([
        unlink(mp4Path).catch(() => {}),
        unlink(gifPath).catch(() => {})
    ])
    return buffer5
}
