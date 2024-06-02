import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js"
import { decrypt } from "./subtle.mjs"

/**
 * @param  {string}     contentType
 * @param  {Uint8Array} iv
 * @return {Promise<void>}
 */
export const init = async (contentType, iv) => {
  const uuid = location.pathname.slice(1)
  const [k, ...hash] = location.hash.slice(1).split(/(?=[:.])/)
  // only if I could work with RegEx
  const forcedLanguage = hash.find((str) => str.startsWith("."))?.slice(1)
  const selectedLines = hash.find((str) => str.startsWith(":"))?.slice(1)
  const preElement = document.createElement("pre")
  let childElement = document.createElement("code")

  try {
    const response = await fetch(`/data/${uuid}`)
    const encrypted = await response.arrayBuffer()
    const buffer = await decrypt(iv, k, encrypted)

    if (contentType.startsWith("image/")) {
      childElement = Object.assign(document.createElement("img"), {
        src: URL.createObjectURL(new Blob([buffer])),
      })
    } else {
      childElement.textContent = new TextDecoder().decode(buffer) || "empty 👀"
    }
  } catch (err) {
    console.error(err)
    childElement.textContent = "failed 💀"
    return
  } finally {
    preElement.appendChild(childElement)
    document.body.innerHTML = ""
    document.body.appendChild(preElement)
  }

  if (childElement.tagName.toLowerCase() !== "code") {
    return
  }

  if (forcedLanguage) {
    hljs.configure({ languages: [forcedLanguage] })
  }

  // do not call highlight.js if contents is too big
  if (preElement.textContent.length < 1_000_000) {
    hljs.highlightAll()
  }

  addLineNumbers(preElement)
  selectLines(preElement, selectedLines)
}

/**
 * @param  {Element} preElement
 * @return {void}
 */
const addLineNumbers = (preElement) => {
  const { height } = preElement.getClientRects()[0]
  const { lineHeight } = getComputedStyle(preElement)
  const totalLines = parseInt(height / parseFloat(lineHeight))
  const listElement = document.createElement("ol")

  for (let i = 1; i < totalLines; i++) {
    listElement.appendChild(
      Object.assign(document.createElement("li"), {
        id: `L${i}`,
      }),
    )
  }

  preElement.insertBefore(listElement, preElement.firstChild)
}

/**
 * @param  {Element} preElement
 * @param  {string} selectedLines
 * @return {void}
 */
const selectLines = (preElement, selectedLines = "") => {
  const [start, total = start] = selectedLines.split("-").map((i) => parseInt(i) || 0)

  if (!start) {
    return
  }

  const markElement = Object.assign(document.createElement("mark"))
  markElement.style.setProperty("--top", start - 1)
  markElement.style.setProperty("--height", total - start + 1)

  preElement.appendChild(markElement)

  // scrollIntoView needs to defer
  setTimeout(() => markElement.scrollIntoView(), 100)
}
