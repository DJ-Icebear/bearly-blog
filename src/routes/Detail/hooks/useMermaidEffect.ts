import { useEffect } from "react"
import mermaid from "mermaid"

const useMermaidEffect = () => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
    })
    if (!document) return
    const elements: HTMLCollectionOf<Element> =
      document.getElementsByClassName("language-mermaid")
    if (!elements) return

    const renderDiagrams = async () => {
      for (let i = 0; i < elements.length; i++) {
        const { svg } = await mermaid.render(
          "mermaid" + i,
          elements[i].textContent || ""
        )
        elements[i].innerHTML = svg
      }
    }

    renderDiagrams()
  }, [])

  return
}

export default useMermaidEffect
