// Read cookie in file 
let readCookies = async function (page, cookies) {
    try {
        for (const cookie of cookies) {
            await page.setCookie(cookie);
        }
    } catch (err) {
        console.error("Failed to load cookies" + err);
    }

}


// Save cookie in file 
let saveCookies = async function (page, fs) {
    try {
        const cookies = await page.cookies().catch(err => console.log("err save cookies : " + err));

        await fs.writeFile(
            "/Users/Tshili/Documents/Project/instagram/config/cookiesPath.json",
            JSON.stringify(cookies, null, 2)
        );
    } catch (err) {
        console.error("Failed to save cookies" + err);
    }
}


//get cookie
let getCookies = async function (fs) {
    try {
        let cookies = JSON.parse(await fs.readFile("/Users/Tshili/Documents/Project/instagram/config/cookiesPath.json"));
        return await cookies;

    } catch (error) {
        console.log(error);

    }
}








module.exports.readCookies = readCookies;
module.exports.saveCookies = saveCookies;
module.exports.getCookies = getCookies;