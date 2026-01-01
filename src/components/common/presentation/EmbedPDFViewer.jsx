import PDFViewer from '@embedpdf/react-pdf-viewer'
import React from 'react'


const EmbedPDFViewer = ({
  src,
  zoomConfig = {
    minZoom: 0.5,
    maxZoom: 1.5,
    levels: [0.25, 0.5, 1.0], // Only show 25%, 50%, and 100% in dropdown
  },
  disabledCategories = [
    'page',
    'annotation',
    'annotation-shape',
    'redaction',
    'panel-comment',
    'document-open',
    'document-close',
    'document-print',
    'document-fullscreen',
  ],
  isDesktop = false,
  style = isDesktop
    ? { width: '100%', height: '85vh' }
    : { width: '100%', height: '70vh' },
  onReady: customOnReady,
}) => {
  const handleReady = registry => {
    const unwantedLevels = ['125%', '150%', '200%', '400%', '800%', '1600%']
    const unwantedValues = ['1.25', '1.5', '2', '4', '8', '16']

    const hideUnwantedZoomLevels = () => {
      try {
        // Function to recursively search and hide unwanted items
        const processElement = element => {
          if (!element || typeof element !== 'object') return

          try {
            // Check shadow root
            if (element.shadowRoot) {
              processElement(element.shadowRoot)
            }

            // Process all child nodes
            if (element.querySelectorAll) {
              // Find all elements that might be menu items
              const allElements = element.querySelectorAll('*')

              allElements.forEach(el => {
                try {
                  // Check text content
                  const text = (el.textContent || el.innerText || '').trim()

                  // Check if text matches unwanted levels exactly or contains them
                  if (
                    unwantedLevels.some(
                      level => text === level || text.endsWith(level),
                    )
                  ) {
                    el.style.cssText =
                      'display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; padding: 0 !important; margin: 0 !important;'
                    el.setAttribute('hidden', 'true')
                    el.setAttribute('aria-hidden', 'true')

                    // Try to remove from DOM
                    try {
                      if (el.parentNode) {
                        el.parentNode.removeChild(el)
                      }
                    } catch (e) {
                      // Ignore removal errors
                    }
                  }

                  // Check data attributes
                  const dataValue = el.getAttribute?.('data-value')
                  const dataZoom = el.getAttribute?.('data-zoom-level')
                  const ariaLabel = el.getAttribute?.('aria-label') || ''

                  if (
                    unwantedValues.includes(dataValue) ||
                    unwantedValues.includes(dataZoom) ||
                    unwantedLevels.some(level => ariaLabel.includes(level))
                  ) {
                    el.style.cssText =
                      'display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; padding: 0 !important; margin: 0 !important;'
                    el.setAttribute('hidden', 'true')
                    el.setAttribute('aria-hidden', 'true')

                    try {
                      if (el.parentNode) {
                        el.parentNode.removeChild(el)
                      }
                    } catch (e) {
                      // Ignore removal errors
                    }
                  }
                } catch (e) {
                  // Continue processing other elements
                }
              })
            }

            // Recursively process children
            if (element.children) {
              Array.from(element.children).forEach(child => {
                processElement(child)
              })
            }
          } catch (e) {
            // Continue if element processing fails
          }
        }

        // Process document body
        processElement(document.body)

        // Process all embed-pdf-containers
        const containers = document.querySelectorAll('embed-pdf-container')
        containers.forEach(container => {
          processElement(container)
        })
      } catch (error) {
        // Silently handle errors
      }
    }

    // Run immediately and on multiple intervals
    hideUnwantedZoomLevels()
    setTimeout(hideUnwantedZoomLevels, 50)
    setTimeout(hideUnwantedZoomLevels, 100)
    setTimeout(hideUnwantedZoomLevels, 200)
    setTimeout(hideUnwantedZoomLevels, 500)
    setTimeout(hideUnwantedZoomLevels, 1000)

    // Set up continuous monitoring with interval
    const intervalId = setInterval(hideUnwantedZoomLevels, 200)

    // MutationObserver for dynamic content
    const observer = new MutationObserver(() => {
      hideUnwantedZoomLevels()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    const containers = document.querySelectorAll('embed-pdf-container')
    containers.forEach(container => {
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      })

      if (container.shadowRoot) {
        observer.observe(container.shadowRoot, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      }
    })

    // Listen for all mouse and keyboard events that might open dropdown
    const eventHandler = () => {
      setTimeout(hideUnwantedZoomLevels, 50)
      setTimeout(hideUnwantedZoomLevels, 150)
      setTimeout(hideUnwantedZoomLevels, 300)
    }

    document.addEventListener('click', eventHandler, true)
    document.addEventListener('mousedown', eventHandler, true)
    document.addEventListener('keydown', eventHandler, true)

    // Call custom onReady if provided
    if (customOnReady) {
      customOnReady(registry)
    }

    // Cleanup function (optional - runs when component unmounts)
    return () => {
      clearInterval(intervalId)
      observer.disconnect()
      document.removeEventListener('click', eventHandler, true)
      document.removeEventListener('mousedown', eventHandler, true)
      document.removeEventListener('keydown', eventHandler, true)
    }
  }

  return (
    <PDFViewer
      height={'100%'}
      width={'100%'}
      config={{
        src,
        zoom: zoomConfig,
        disabledCategories,
      }}
      onReady={handleReady}
      style={style}
    />
  )
}

export default EmbedPDFViewer
