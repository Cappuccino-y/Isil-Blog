const net = require('net')

const PROXY_HOST = process.env.TUNNEL_PROXY_HOST || 'proxy.hk.hihonor.com'
const PROXY_PORT = Number(process.env.TUNNEL_PROXY_PORT || 8080)
const LISTEN_PORT = Number(process.env.TUNNEL_LISTEN_PORT || 1080)

function ts() {
    return new Date().toISOString()
}

function relayThroughHttpProxy(client, targetHost, targetPort) {
    const upstream = net.connect(PROXY_PORT, PROXY_HOST)
    let handshakeDone = false
    let proxyBuf = Buffer.alloc(0)
    let clientBuf = Buffer.alloc(0)

    const teardown = () => {
        client.destroy()
        upstream.destroy()
    }

    upstream.on('connect', () => {
        upstream.write(`CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\nHost: ${targetHost}:${targetPort}\r\n\r\n`)
    })

    upstream.on('data', chunk => {
        if (handshakeDone) return
        proxyBuf = Buffer.concat([proxyBuf, chunk])
        const idx = proxyBuf.indexOf('\r\n\r\n')
        if (idx === -1) return
        const statusLine = proxyBuf.slice(0, idx).toString().split('\r\n')[0]
        if (!/^HTTP\/1\.[01] 200/.test(statusLine)) {
            console.error(`[${ts()}] proxy refused ${targetHost}:${targetPort}: ${statusLine}`)
            teardown()
            return
        }
        handshakeDone = true
        const rest = proxyBuf.slice(idx + 4)
        if (clientBuf.length) upstream.write(clientBuf)
        if (rest.length) client.write(rest)
        upstream.pipe(client)
        client.pipe(upstream)
        clientBuf = Buffer.alloc(0)
        proxyBuf = Buffer.alloc(0)
    })

    upstream.on('error', err => {
        console.error(`[${ts()}] upstream error (${targetHost}:${targetPort}): ${err.message}`)
        teardown()
    })

    client.on('data', chunk => {
        if (!handshakeDone) clientBuf = Buffer.concat([clientBuf, chunk])
    })
    client.on('error', teardown)
    client.on('close', () => upstream.destroy())
    upstream.on('close', () => client.destroy())
}

function socksReply(client, code) {
    client.write(Buffer.from([0x05, code, 0x00, 0x01, 0, 0, 0, 0, 0, 0]))
}

const server = net.createServer(client => {
    let state = 'greet'
    let buf = Buffer.alloc(0)

    const cleanup = () => {
        client.removeAllListeners('data')
    }

    client.on('error', () => client.destroy())
    client.on('close', cleanup)

    client.on('data', function onData(chunk) {
        buf = Buffer.concat([buf, chunk])

        if (state === 'greet') {
            if (buf.length < 2 || buf.length < 2 + buf[1]) return
            if (buf[0] !== 0x05) {
                client.destroy()
                return
            }
            client.write(Buffer.from([0x05, 0x00]))
            state = 'connect'
            buf = buf.slice(2 + buf[1])
            if (buf.length === 0) return
        }

        if (state === 'connect') {
            if (buf.length < 4) return
            if (buf[0] !== 0x05 || buf[1] !== 0x01) {
                socksReply(client, 0x07)
                client.destroy()
                return
            }
            const atyp = buf[3]
            let need = 0
            let host = null
            if (atyp === 0x01) {
                need = 4 + 6
                if (buf.length < need) return
                host = Array.from(buf.slice(4, 8)).join('.')
            } else if (atyp === 0x04) {
                need = 16 + 6
                if (buf.length < need) return
                const parts = Array.from(buf.slice(4, 20))
                host = []
                for (let i = 0; i < 16; i += 2) host.push((parts[i] << 8 | parts[i + 1]).toString(16))
                host = host.join(':')
            } else if (atyp === 0x03) {
                const len = buf[4]
                need = 5 + len + 2
                if (buf.length < need) return
                host = buf.slice(5, 5 + len).toString()
            } else {
                socksReply(client, 0x08)
                client.destroy()
                return
            }
            const port = buf.readUInt16BE(need - 2)
            socksReply(client, 0x00)
            cleanup()
            relayThroughHttpProxy(client, host, port)
        }
    })
})

server.listen(LISTEN_PORT, '127.0.0.1', () => {
    console.log(`[${ts()}] socks5 tunnel: 127.0.0.1:${LISTEN_PORT} -> corporate proxy ${PROXY_HOST}:${PROXY_PORT}`)
})
