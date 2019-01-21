const puppeteer = require('puppeteer');
const shuffle = require('shuffle-array');
const fs = require('fs-extra');

let follow = require('../src/api/follow.js');
let cnf = require('../config/config.json');
let fnl = require('../src/api/follow.js');
let fwg = require('../src/api/following.js');
let fwe = require('../src/api/followers.js');

let unf = require('../src/api/unfollow-user.js');
let flw = require('./api/following.js');
let cook = require('../config/cookies.js');
let navigation = require('../src/api/browser.js');
let stat = require('../src/api/stats.js');

let run = async () => {
  /*************  Configuration of chrome   ****************/

  // creation d'une instance de chrome
  const browser = await navigation.launchBrowser(puppeteer, cnf);

  //creation d'une nouvel onglet
  const page = await browser
    .newPage()
    .catch(err => console.log('create tab eror : ' + err));

  await navigation.chromeParameter(page);

  // get cookies
  let cookies;
  cookies = await cook.getCookies(fs);

  if (cookies != undefined) {
    await cook.readCookies(page, cookies);
  }

  await navigation.chromeSize(page);

  //Load instagram
  await navigation.loadInstagram(page, cnf);

  if (cookies === undefined) {
    await cook.saveCookies(page, fs);
  }

  await page.waitFor(4500);

  /*************  numbers of Followers  *************/
  //await stat.numbersFollowers(page);

  /*************  historic of numbers of Followers  *************/
  await stat.historicFollowers();

  /*************  historic of numbers of Followers  *************/
  // await stat.numberFollowerPerDay();

  /*************  Unfollow  *************/

  //await unf.unfollow(page);

  /*************  Like and follow by hashtags   *************/

  let hashtags = shuffle(cnf.hashtags);

  //searching hashtags and looping through posts
  for (let h1 = 0; h1 < hashtags.length; h1++) {
    await page.goto('https://www.instagram.com/explore/tags/' + hashtags[h1]);
    console.log(' =======> hashtags search: ' + hashtags[h1]);
    await fnl.followAndLike(page);
  }

  /*************  Like and follow by location  *************/

  let location = shuffle(cnf.location);

  for (let h1 = 0; h1 < location.length; h1++) {
    await page.goto(
      'https://www.instagram.com/explore/locations/' + location[h1].id
    );
    console.log(' =======>  Location: ' + location[h1].place);
    await fnl.followAndLike(page);
  }

  /*************  Followings of influencers    *************/

  let followingInfluencer;

  followingInfluencer = await fwg.following(page);

  for (let index = 0; index < followingInfluencer.length; index++) {
    await page.goto('https://www.instagram.com/' + followingInfluencer[index]);
    console.log(
      ' =======> following of influencer :  ' + followingInfluencer[index]
    );
    await fnl.followingAndLike(page);
  }

  /*************  followers of influencers    *************/

  let followersInfluencer;

  followersInfluencer = await fwe.followers(page);

  for (let index = 0; index < followersInfluencer.length; index++) {
    await page.goto('https://www.instagram.com/' + followersInfluencer[index]);
    console.log(
      ' =======> followers of my influencer :  ' + followersInfluencer[index]
    );
    await fnl.followingAndLike(page);
  }

  /*************  Follow the commenters of photos of users *************/
  let commentator;

  for (let index = 0; index < cnf.influencer_name.length; index++) {
    await page.goto(
      'https://www.instagram.com/' + cnf.influencer_name[index].username
    );

    for (let r = 1; r < 3; r++) {
      for (let c = 1; c < 3; c++) {
        let br = false;
        await page
          .click(
            '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(' +
              r +
              ') > div:nth-child(' +
              c +
              ') > a'
          )
          .catch(err => {
            br = true;
            console.log('error Follow the commenters of photos ' + err);
          });

        if (br) continue;

        await page.waitFor(4500);

        const url = page.url();

        if (
          !url.includes(
            'https://www.instagram.com/agriculteurs_de_bretagne/'
          ) &&
          !url.includes('https://www.instagram.com/bestofbretagne/') &&
          !url.includes('https://www.instagram.com/leportdattache/') &&
          !url.includes('https://www.instagram.com/jaimelabretagne/') &&
          !url.includes('https://www.instagram.com/destinationbretagne/')
        ) {
          console.log('je rentre dans la selection');

          var result = url.match(
            /(?:([^\:]*)\:\/\/)?(?:([^\:\@]*)(?:\:([^\@]*))?\@)?(?:([^\/\:]*)\.(?=[^\.\/\:]*\.[^\.\/\:]*))?([^\.\/\:]*)(?:\.([^\/\.\:]*))?(?:\:([0-9]*))?(\/[^\?#]*(?=.*?\/)\/)?([^\?#]*)?(?:\?([^#]*))?(?:#(.*))?/
          );

          var t = result[8].substr(1).substr(2);

          console.log('=== the shortcode : ' + t.substr(0, t.length - 1));

          await page.goto(
            ' https://www.instagram.com/graphql/query/?query_hash=49699cdb479dd5664863d4b647ada1f7&variables=%7B%22shortcode%22%3A%22' +
              t.substr(0, t.length - 1) +
              '%22%2C%22child_comment_count%22%3A3%2C%22fetch_comment_count%22%3A40%2C%22parent_comment_count%22%3A24%2C%22has_threaded_comments%22%3Afalse%7D'
          );

          try {
            let following = await page
              .evaluate('document.querySelector("body > pre").innerText')
              .catch(err =>
                console.log('err let following = await page.evaluate' + err)
              );
            commentator = JSON.parse(following);

            console.log(
              'list commentator  : ' +
                commentator.data.shortcode_media.edge_media_to_comment.edges
            );
          } catch (err) {
            console.error('Failed to write following cookies' + err);
          }

          for (
            let index = 0;
            index <
            commentator.data.shortcode_media.edge_media_to_comment.edges.length;
            index++
          ) {
            await page.goto(
              'https://www.instagram.com/' +
                commentator.data.shortcode_media.edge_media_to_comment.edges[
                  index
                ].node.owner.username
            );
            console.log(
              ' =======> following of influencer :  ' +
                commentator.data.shortcode_media.edge_media_to_comment.edges[
                  index
                ].node.owner.username
            );
            await fnl.followingAndLike(page);
          }
        }

        await page.waitFor(4500);

        await page
          .click('body > div:nth-child(15) > div > button')
          .catch(err => {
            br = true;
            console.log('error clic commenter ' + err);
          });

        await page.waitFor(4500);
      }
    }
  }

  /*************  Follow the likers of photos users *************/

  for (let index = 0; index < cnf.influencer_name.length; index++) {
    await page.goto(
      'https://www.instagram.com/' + cnf.influencer_name[index].username
    );

    for (let r = 1; r < 3; r++) {
      for (let c = 1; c < 3; c++) {
        let br = false;
        await page
          .click(
            '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(' +
              r +
              ') > div:nth-child(' +
              c +
              ') > a'
          )
          .catch(err => {
            br = true;
            console.log('error Follow the commenters of photos ' + err);
          });

        if (br) continue;

        await page.waitFor(4500);

        const url = page.url();

        if (
          !url.includes(
            'https://www.instagram.com/agriculteurs_de_bretagne/'
          ) &&
          !url.includes('https://www.instagram.com/bestofbretagne/') &&
          !url.includes('https://www.instagram.com/leportdattache/') &&
          !url.includes('https://www.instagram.com/jaimelabretagne/') &&
          !url.includes('https://www.instagram.com/destinationbretagne/')
        ) {
          console.log('je rentre dans la selection');

          var result = url.match(
            /(?:([^\:]*)\:\/\/)?(?:([^\:\@]*)(?:\:([^\@]*))?\@)?(?:([^\/\:]*)\.(?=[^\.\/\:]*\.[^\.\/\:]*))?([^\.\/\:]*)(?:\.([^\/\.\:]*))?(?:\:([0-9]*))?(\/[^\?#]*(?=.*?\/)\/)?([^\?#]*)?(?:\?([^#]*))?(?:#(.*))?/
          );

          var t = result[8].substr(1).substr(2);

          console.log('=== the shortcode : ' + t.substr(0, t.length - 1));

          await page.goto(
            'https://www.instagram.com/graphql/query/?query_hash=e0f59e4a1c8d78d0161873bc2ee7ec44&variables=%7B%22shortcode%22%3A%22' +
              t.substr(0, t.length - 1) +
              '%22%2C%22include_reel%22%3Atrue%2C%22first%22%3A10000%2C%22after%22%3A%22QVFDbWRCTGhsQjVNZ3J4NkRQMW9Ba1BPWF8xay1GWENNN3ZQdlZMQnlxVjExaDlHYmh3MmFRNmFqYkw1TXAzTUJha2lqR0hfeGlnNXFSbEs2R3dITW5LVQ%3D%3D%22%7D'
          );

          try {
            let liker = await page
              .evaluate('document.querySelector("body > pre").innerText')
              .catch(err =>
                console.log('err let following = await page.evaluate' + err)
              );
            likers = JSON.parse(liker);
          } catch (err) {
            console.error('Failed to write following cookies' + err);
          }

          let selectedusernames = shuffle.pick(
            likers.data.shortcode_media.edge_liked_by.edges,
            {
              picks: cnf.settings.likers_photo_of_influencer
            }
          );

          console.log('list likers   : ' + selectedusernames.length);

          for (let index = 0; index < selectedusernames.length; index++) {
            await page.goto(
              'https://www.instagram.com/' +
                selectedusernames[index].node.username
            );
            console.log(
              ' =======> following of influencer :  ' +
                selectedusernames[index].node.username
            );
            await fnl.followingAndLike(page);
          }
        }

        await page.waitFor(4500);

        await page
          .click('body > div:nth-child(15) > div > button')
          .catch(err => {
            br = true;
            console.log('error clic commenter ' + err);
          });

        await page.waitFor(4500);
      }
    }
  }

  /*************  who unfollow me    *************/

  /****** Create bot account  *******/
  /*************  Growth of users   *************/
  /******* followers gain by day  ******/
  /******* followers lost by day  ******/
  /*************  who doesn't follow me back    *************/

  /******* find out who your best fans are */

  await page.close();
};

module.exports = run;
