const { JSDOM } = require("jsdom")

/**
 * Craw a website provided in currentURL
 * @param {*} currentURL String for webpage URL tha will be crawled 
 */
async function crawlPage(currentURL) {
    console.log(`actively crawling: ${currentURL}`)

    try {
        const resp = await fetch(currentURL)
        if(resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return
        }

        const contentType = resp.headers.get("content-type")

        if(contentType.includes("text/html")){
            console.log(`no html response, content type: ${contentType}, on page: ${currentURL}`)
            return
        }

        console.log(await resp.text())
    } catch(err) {
        console.log(`Error in ${err.message}  on page ${currentURL}`)
    }
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