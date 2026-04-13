const defaultRedirectPath = '/projects'

export function getSafeRedirectPath(redirectTo: string | null | undefined) {
  if (!redirectTo || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return defaultRedirectPath
  }

  return redirectTo
}

export function withRedirectQuery(pathname: string, redirectTo: string) {
  const safeRedirect = getSafeRedirectPath(redirectTo)
  const searchParams = new URLSearchParams({
    redirectTo: safeRedirect,
  })

  return `${pathname}?${searchParams.toString()}`
}
