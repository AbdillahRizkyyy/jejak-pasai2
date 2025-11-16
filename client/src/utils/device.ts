export function getDeviceIdentifier() {
  let deviceIdentifier = localStorage.getItem('device_identifier')
  if (!deviceIdentifier) {
    const prefix = getDeviceType()
    deviceIdentifier = `${prefix}-${crypto.randomUUID()}`
    localStorage.setItem('device_identifier', deviceIdentifier)
  }
  return deviceIdentifier
}

export function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase()
  const isMobile = /(android|iphone|ipad|ipod)/.test(ua)
  const isDesktop = /(mac|win|linux)/.test(ua)

  return isMobile ? (ua.includes('android') ? 'android' : 'ios') : isDesktop ? 'desktop' : 'web'
}
