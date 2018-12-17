let select_post_on_profile = async function (page) {
    console.log("i am here ");
    //let br = false;
    await page
        .click(
            //"#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"
            "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > a"

        )
        .catch((err) => {
            br = true;
            console.log("-------- event listener error " + err);


        });
    // if (br) {
    //     continue;
    // }


    await page.waitFor(2250 + Math.floor(Math.random() * 250));
}



module.exports.select_post_on_profile = select_post_on_profile;