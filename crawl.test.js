const { normalizeURL, getURLsFromHTML } = require("./crawl")
const { test, expect, describe } = require("@jest/globals")

describe("NormalizeURL", () => {
    
    test('normalizeURL strip protocol', () => {
        const input = 'https://blog.boot.dev/path'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'

        expect(actual).toEqual(expected)
    })

    test('normalizeURL strip trailling slash', () => {
        const input = 'https://blog.boot.dev/path/'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'

        expect(actual).toEqual(expected)
    })

    test('normalizeURL capitals', () => {
        const input = 'https://BLOG.boot.dev/path/'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'

        expect(actual).toEqual(expected)
    })

    test('normalizeURL strip http', () => {
        const input = 'http://BLOG.boot.dev/path/'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'

        expect(actual).toEqual(expected)
    })
})


describe("GetURL", () => {
    test('GetURLsFromHTML', () => {

        const htmlBody = `
            <html>
                <body>
                    <a href="https://blog.boot.dev/path/">
                        Boot.dev Blog
                    </a>
                </body>
            </html>
        `

        const inputBaseURL = "https://blog.boot.dev/path/"
        const actual = getURLsFromHTML(htmlBody, inputBaseURL)
        const expected = ["https://blog.boot.dev/path/"]

        expect(actual).toEqual(expected)
    })

    test('GetURLsFromHTML relative URL', () => {

        const htmlBody = `
            <html>
                <body>
                    <a href="/path/">
                        Boot.dev Blog
                    </a>
                </body>
            </html>
        `

        const inputBaseURL = "https://blog.boot.dev"
        const actual = getURLsFromHTML(htmlBody, inputBaseURL)
        const expected = ["https://blog.boot.dev/path/"]

        expect(actual).toEqual(expected)
    })

    test('GetURLsFromHTML both relative and absolute', () => {

        const htmlBody = `
            <html>
                <body>
                    <a href="/path1/">
                        Boot.dev Blog
                    </a>
                    <a href="https://blog.boot.dev/path2/">
                        Boot.dev Blog
                    </a>
                </body>
            </html>
        `

        const inputBaseURL = "https://blog.boot.dev"
        const actual = getURLsFromHTML(htmlBody, inputBaseURL)
        const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]

        expect(actual).toEqual(expected)
    })

    test('GetURLsFromHTML invalid URL', () => {

        const htmlBody = `
            <html>
                <body>
                    <a href="invalid">
                        invalid
                    </a>
                </body>
            </html>
        `

        const inputBaseURL = "https://blog.boot.dev"
        const actual = getURLsFromHTML(htmlBody, inputBaseURL)
        const expected = []

        expect(actual).toEqual(expected)
    })
})