import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const targetUrl = searchParams.get('url')

    if (!targetUrl) {
        return NextResponse.json({ error: 'Missing URL' }, { status: 400 })
    }

    console.log('正在代理请求:', targetUrl) // 👈 这一行会打印在你的 VSCode 终端里

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                // 👇 关键修复：伪装成 Chrome 浏览器，防止被网关拦截
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })

        if (!response.ok) {
            throw new Error(`Upstream Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error: any) {
        console.error('代理请求失败详情:', error) // 👈 报错时看终端
        return NextResponse.json(
            {
                error: 'Failed to fetch metadata',
                details: error.message // 把真实错误吐给前端看
            },
            { status: 500 }
        )
    }
}
