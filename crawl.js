const { JSDOM } = require("jsdom")

/**
 * Craw a website provided in currentURL
 * @param {*} currentURL String for webpage URL that will be actively crawled
 * @param {*} baseURL The starting point, the home page of the website
 * @param {*} pages Objec that keep all pages of the entire website
 */
async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname){
        console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)

    if(pages[normalizedCurrentURL] > 0 ) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)

    try {
        const resp = await fetch(currentURL)
        if(resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")

        if(!contentType.includes("text/html")) {
            console.log(`no html response, content type: ${contentType}, on page: ${currentURL}`)
            return pages
        }

        // console.log(await resp.text())

        const htmlBody = await resp.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages)
        }


    } catch(err) {
        console.log(`Error in ${err.message}  on page ${currentURL}`)
    }

    return pages
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const domObj = new JSDOM(htmlBody)

    const linkElements = domObj.window.document.querySelectorAll('a')

    for (const link of linkElements){
        if(link.href.slice(0,1) === "/"){
            //Relative Path

            try {
                const url = new URL(`${baseURL}${link.href}`) 
                urls.push(url.href)
            } catch (err){
                console.log('Error with relative URL: ', err.message)
            }
        }else {
            // Absolute 
            try{
                const url = new URL(link.href)
                urls.push(url.href)
            } catch (err) {
                console.log('Error with absolute URL: ', err.message)
            }
        }
    }
    return urls
}


function normalizeURL(urlString){
    const urlObj = new URL(urlString);
    const hostPath =  `${urlObj.hostname}${urlObj.pathname}`;

    if(hostPath.length > 0 && hostPath.slice(-1) === "/"){
        return hostPath.slice(0, -1)
    }

    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}