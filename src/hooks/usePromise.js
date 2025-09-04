import { useCallback, useState } from 'react'

const usePromise = () => {
  const [resolver, setResolver] = useState(null)
  const [rejecter, setRejecter] = useState(null)
  const [isPending, setIsPending] = useState(false)

  const createPromise = useCallback(() => {
    return new Promise((resolve, reject) => {
      setResolver(() => resolve)
      setRejecter(() => reject)
      setIsPending(true)
    })
  }, [])

  const resolvePromise = useCallback(
    value => {
      if (resolver) {
        resolver(value)
        cleanup()
      }
    },
    [resolver],
  )

  const rejectPromise = useCallback(
    error => {
      if (rejecter) {
        rejecter(error)
        cleanup()
      }
    },
    [rejecter],
  )

  const cleanup = useCallback(() => {
    setResolver(null)
    setRejecter(null)
    setIsPending(false)
  }, [])

  return {
    createPromise,
    resolvePromise,
    rejectPromise,
    isPending,
  }
}

export default usePromise
