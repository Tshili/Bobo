let cnf = require("/Users/Tshili/Documents/Project/instagram/config/config.json");
let ops = require("/Users/Tshili/Documents/Project/instagram/src/pouchDB.js");
const shuffle = require("shuffle-array");
const Instagram = require("instagram-web-api");


let numbersLikes = 1;
let numberFollows = 1;

//Method call if i want follow and like 
let followAndLike = async function followAndLike(page) {

    for (let r = 1; r < 8; r++) {
        for (let c = 1; c < 8; c++) {
            //Try to select post, wait, if successful continue
            let br = false;
            const url = page.url();

            if (url.includes("https://www.instagram.com/explore/locations")) {

                await page
                    .click(

                        "div:nth-child(4) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"

                    )
                    .catch((err) => {
                        br = true;
                        console.log(err);


                    });
                if (br) continue;
                await page.waitFor(2250 + Math.floor(Math.random() * 250));

            } else if (url.includes("https://www.instagram.com/explore/tags/")) {

                await page
                    .click(

                        "#react-root > section > main > article > div:nth-child(3) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"
                    )
                    .catch((err) => {
                        br = true;

                    });
                if (br) continue;
                await page.waitFor(2250 + Math.floor(Math.random() * 250));

            } else if (url.includes("https://www.instagram.com/")) {

                await page
                    .click(
                        //"div:nth-child(3) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"
                        "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"


                    )
                    .catch((err) => {
                        br = true;

                    });
                if (br) continue;
                await page.waitFor(2250 + Math.floor(Math.random() * 250));

            } else {

                await page
                    .click(
                        "div:nth-child(3) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"
                    )
                    .catch((err) => {
                        br = true;

                    });
                if (br) continue;
                await page.waitFor(2250 + Math.floor(Math.random() * 250));

            }



            // read the account name
            let username = await page.evaluate(x => {
                console.log("Recuperation du nom : " + x);
                let element = document.querySelector(x);
                return Promise.resolve(element ? element.innerHTML : "");
            }, cnf.selectors.post_username);

            // reading follow status
            let followStatus = await page.evaluate(x => {
                console.log("Recuperation du followsStatus : " + x);
                let element = document.querySelector(x);
                return Promise.resolve(element ? element.innerHTML : "");
            }, cnf.selectors.post_follow_link);

            //liking post
            let hasEmptyHeart = await page.$(cnf.selectors.post_heart_grey);




            if (hasEmptyHeart !== null && Math.random() < cnf.settings.like_ratio) {


                await page.click(cnf.selectors.post_like_button).catch(err => console.log("err when i want to like : " + err));
                console.log("---> like for " + username);
                console.log("++++ numbersLikes is : " + numbersLikes);
                numbersLikes++;
                await page.waitFor(10000 + Math.floor(Math.random() * 5000));
            }

            // following instagram users

            let isArchivedUser;
            await ops
                .inArchive(username)
                .then(() => (isArchivedUser = true))
                .catch(() => (isArchivedUser = false));

            if (
                followStatus === "Follow" &&
                !isArchivedUser

                &&
                Math.random() < cnf.settings.follow_ratio
            ) {
                await ops
                    .addFollow(username)
                    .then(() => {
                        return page.click(cnf.selectors.post_follow_link);
                    })
                    .then(() => {
                        console.log("---> follow for " + username);
                        console.log("++++++ Today number of follow : " + numberFollows++)
                        return page.waitFor(10000 + Math.floor(Math.random() * 5000));
                    })
                    .catch(() => {
                        console.log("---> Allready following " + username);
                    });
            }

            // Close post
            await page
                .click(cnf.selectors.post_close_button)
                .catch(() => console.log(":::> Error closing post"));
        }
    }
}


let getAllFollowing = async function () {
    followings = await ops.getFollowing().catch(err => console.log("getAllFollowing error : " + err))
    return followings
}



// let followers = async function followers(influencerId) {


//     const client = new Instagram({
//         username: cnf.fake_username,
//         password: cnf.fake_password
//     });

//     await client.login().catch((err) => console.log(err));

//     const followers = await client
//         .getFollowers({
//             userId: influencerId

//         })
//         .catch(err => console.log(err));

//     //console.log("=====   followers is " + JSON.stringify(followers));
//     console.log("=====   length of followers is " + JSON.stringify(followers));


//     usernames = [];
//     try {
//         for (
//             let index = 0; index < JSON.stringify(followers.data).length; index++
//         ) {

//             //usernames.push(JSON.parse(JSON.stringify(followers.data[index].username)));
//         }
//     } catch (err) {
//         console.log(err);
//     }


//     console.log("=====   length of usernames is " + usernames.length);

//     let selectedusernames = shuffle.pick(usernames, {
//         'picks': 50
//     });

//     return usernames;

// }


let followers = async function (browser) {

    const instauto = await Instauto(browser, options);
    console.log("====> the influencer is : " + cnf.influencer_name);
    for (const username of cnf.influencer_name) {
        console.log("i am the username : " + username);

        await instauto.followUserFollowers(username, {
            maxFollowsPerUser: 10
        }).catch(err => console.log("Instauto.followUserFollowers : " + err));
        await instauto.sleep(10 * 60 * 1000);
    }

}

// let following = async function (influencerId) {

//     const client = new Instagram({
//         username: cnf.fake_username,
//         password: cnf.fake_password
//     });

//     await client.login().catch((err) => console.log(err));

//     const followers = await client.getFollowings({
//         userId: influencerId
//     }).catch(err => console.log(err));

//     usernames = [];

//     try {
//         for (
//             let index = 0; index < JSON.stringify(followers.data).length; index++
//         ) {
//             usernames.push(JSON.parse(JSON.stringify(followers.data[index].username)));
//         }
//     } catch (err) {
//         console.log(err);
//     }

//     let selectedusernames = shuffle(usernames);

//     console.log("======= length of selectedusernames : " + selectedusernames.length);
//     console.log("======= selectedusernames : " + selectedusernames);
//     return selectedusernames;
// }





let followingAndLike = async function followingAndLike(page) {

    for (let r = 1; r < 3; r++) {
        for (let c = 1; c < 3; c++) {
            //Try to select post, wait, if successful continue
            let br = false;
            const url = page.url();

            if (url.includes("https://www.instagram.com/")) {

                await page
                    .click(
                        //"div:nth-child(3) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"
                        "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"


                    )
                    .catch((err) => {
                        br = true;

                    });
                if (br) continue;
                await page.waitFor(2250 + Math.floor(Math.random() * 250));

            } else {

                await page
                    .click(
                        "div:nth-child(3) > div > div:nth-child(" + r + ") > div:nth-child(" + c + ") > a"
                    )
                    .catch((err) => {
                        br = true;

                    });
                if (br) continue;
                await page.waitFor(2250 + Math.floor(Math.random() * 250));

            }



            // read the account name
            let username = await page.evaluate(x => {
                console.log("Recuperation du nom : " + x);
                let element = document.querySelector(x);
                return Promise.resolve(element ? element.innerHTML : "");
            }, cnf.selectors.post_username);

            // reading follow status
            let followStatus = await page.evaluate(x => {
                console.log("Recuperation du followsStatus : " + x);
                let element = document.querySelector(x);
                return Promise.resolve(element ? element.innerHTML : "");
            }, cnf.selectors.post_follow_link);

            //liking post
            let hasEmptyHeart = await page.$(cnf.selectors.post_heart_grey);




            if (hasEmptyHeart !== null && Math.random() < cnf.settings.like_ratio) {


                await page.click(cnf.selectors.post_like_button);
                console.log("---> like for " + username);
                console.log("++++ numbersLikes is : " + numbersLikes);
                numbersLikes++
                await page.waitFor(10000 + Math.floor(Math.random() * 5000));
            }

            // following instagram users

            let isArchivedUser;
            await ops
                .inArchive(username)
                .then(() => (isArchivedUser = true))
                .catch(() => (isArchivedUser = false));

            if (
                followStatus === "Follow" &&
                !isArchivedUser

                &&
                Math.random() < cnf.settings.follow_ratio
            ) {
                await ops
                    .addFollow(username)
                    .then(() => {
                        return page.click(cnf.selectors.post_follow_link);
                    })
                    .then(() => {
                        console.log("---> follow for " + username);
                        console.log("++++++ Today number of follow : " + numberFollows++)
                        return page.waitFor(10000 + Math.floor(Math.random() * 5000));
                    })
                    .catch(() => {
                        console.log("---> Allready following " + username);
                    });
            }

            // Close post
            await page
                .click(cnf.selectors.post_close_button)
                .catch(() => console.log(":::> Error closing post"));
        }
    }
}



module.exports.followAndLike = followAndLike;
module.exports.followers = followers;
module.exports.numbersLikes = numbersLikes;
module.exports.followingAndLike = followingAndLike;


module.exports.getAllFollowing = getAllFollowing;