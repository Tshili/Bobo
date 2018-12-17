let launchBrowser = async function (puppeteer, cnf) {
    return await puppeteer.launch({
        headless: cnf.settings.headless,
        args: ["--no-sandbox"]
        //args: ['--window-size=1920,1080']
    }).catch(err => console.log(err));

}


let loadInstagram = async function (page, cnf) {
    await page.goto(
        "https://www.instagram.com/accounts/login/?hl=fr&source=auth_switcher"
    );

    await page.waitFor(4500).catch(err => console.log("page.waitFor" + err));
    //login
    await page.click(cnf.selectors.username_field).catch(err => {
        console.log("click on username_field error : " + err);
    });
    await page.keyboard.type(cnf.username).catch(err => console.log("page.waitFor" + err));
    await page.click(cnf.selectors.password_field).catch(err => {
        console.log("click on password_field error : " + err);
    });
    await page.keyboard.type(cnf.password).catch(err => console.log("page.keyboard.type password : " + err));
    await page.click(cnf.selectors.login_button).catch(err => {
        console.log("click on login button error : " + err);
    });
    await page.waitForNavigation().catch(err => console.log("page.waitForNavigation : " + err));
}


let chromeParameter = async function (page) {
    page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3477.0 Safari/537.36"
    ).catch(err => console.log(err));
}



let chromeSize = async function (page) {
    page.setViewport({
        width: 1200,
        height: 764
    });

    await page.waitFor(4500);
}




module.exports.launchBrowser = launchBrowser;
module.exports.loadInstagram = loadInstagram;
module.exports.chromeParameter = chromeParameter;
module.exports.chromeSize = chromeSize;