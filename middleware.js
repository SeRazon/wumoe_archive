export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|vercel.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|bmp|css|js|mjs|woff|woff2|ttf|eot|otf|ico|json|txt|xml|html?)$).*)',
  ],
}

export default function middleware(request) {
  const url = new URL(request.url)
  let { pathname } = url
  const original = pathname

  // 1. 命名空间冒号 → 下划线: /吾萌:关于 → /吾萌_关于
  pathname = pathname.replace(/^\/(吾萌|帮助|分类|用户|用户讨论):/, '/$1_')

  // 2. URL中的空格 → 下划线
  pathname = pathname.replace(/ /g, '_')

  // 3. 帮助子页面斜杠 → 下划线: /帮助_吾萌编辑简明指南/欢迎 → /帮助_吾萌编辑简明指南_欢迎
  if (pathname.startsWith('/帮助_吾萌编辑简明指南/')) {
    pathname = pathname.replace('/帮助_吾萌编辑简明指南/', '/帮助_吾萌编辑简明指南_')
  }

  if (pathname !== original) {
    url.pathname = pathname
    return new Response(null, {
      status: 200,
      headers: { 'x-middleware-rewrite': url.toString() },
    })
  }
}
