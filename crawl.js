const { JSDOM } = require("jsdom")

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
    getURLsFromHTML
}