const { crawlPage } = require("./crawl")

function main(){
    if(process.argv.length < 3) {
        console.log("no website provided")
        process.exit(1)
    }

    if(process.argv.length > 3) {
        console.log("too many commnad line arguments")
        process.exit(1)
    }

    console.log('URL', process.argv[2])

    const baseURL = process.argv[2]

    crawlPage(baseURL)

    console.log(`starting crawl of ${baseURL}`)
}

main()