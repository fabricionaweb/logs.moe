document.body.addEventListener("dragenter", () => {
  document.body.classList.add("dragging")
})

document.body.addEventListener("dragleave", (event) => {
  document.body.classList.toggle("dragging", event.relatedTarget)
})

document.body.addEventListener("dragover", (event) => {
  event.preventDefault()
})

document.body.addEventListener("drop", (event) => {
  event.preventDefault()
  document.body.classList.remove("dragging")
  create(event.dataTransfer.files[0])
})

addEventListener("paste", (event) => {
  create(event.clipboardData.files[0] || event.clipboardData.getData("text"))
})

const create = async (data) => {
  if (!data) {
    return
  }

  const codeElement = document.querySelector("pre code")
  codeElement.textContent = "still sending 🚀"
  codeElement.classList.add("loading")

  try {
    const body = new FormData()
    body.append("data", data)
    const response = await fetch("/", { method: "POST", body })
    const url = await response.text()

    if (!url || !response.ok) {
      throw "error"
    }

    location.replace(url)
  } catch (err) {
    console.error(err)
    codeElement.textContent = "failed 💀"
    codeElement.classList.remove("loading")
  }
}
