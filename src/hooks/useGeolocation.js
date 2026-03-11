import { useState, useCallback } from 'react'

/**
 * React hook for capturing geolocation
 * Returns position, error, loading state, and capture function
 */
export const useGeolocation = () => {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const capture = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy } = pos.coords
        setPosition({
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          timestamp: Date.now(),
        })
        setLoading(false)
      },
      (err) => {
        let errorMessage
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Geolocation permission denied'
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Position information is unavailable'
            break
          case err.TIMEOUT:
            errorMessage = 'Geolocation request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred'
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  const reset = useCallback(() => {
    setPosition(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    position,
    error,
    loading,
    capture,
    reset,
    hasPosition: position !== null,
  }
}
