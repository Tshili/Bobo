let cnf = require('../../config/config.json');
let ops = require('../pouchDB.js');
const shuffle = require('shuffle-array');

let following = async function(page) {
  followingInfluencer = [];

  for (let index = 0; index < cnf.influencer_name.length; index++) {
    await page.goto(
      'https://www.instagram.com/graphql/query/?query_hash=58712303d941c6855d4e888c5f0cd22f&variables=%7B%22id%22%3A%22' +
        cnf.influencer_name[index].id +
        '%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Afalse%2C%22first%22%3A10000%2C%22after%22%3A%22QVFEeDE3eVNiSEZocWFVWmRiSHJzOW5vd3FCOTZNN00tNy1GYXMyYmlnM1VhXzRTVklLclZOamVLNjFNdk1xY1RveUk1Z09aVjI3QWV6Y01VdWI3bk1DWQ%3D%3D%22%7D'
    );

    await page.waitFor(4500);
    try {
      let following = await page
        .evaluate('document.querySelector("body > pre").innerText')
        .catch(err =>
          console.log('err let following = await page.evaluate' + err)
        );

      followingInfluencer.push(JSON.parse(following));
    } catch (err) {
      console.error('Failed to write following cookies' + err);
    }
  }

  let followingUsernameInfluencer = [];
  for (let index = 0; index < followingInfluencer.length; index++) {
    for (
      let i = 0;
      i < followingInfluencer[index].data.user.edge_follow.edges.length;
      i++
    ) {
      followingUsernameInfluencer.push(
        followingInfluencer[index].data.user.edge_follow.edges[i].node.username
      );
    }
  }

  console.log(
    'followingUsernameInfluencer : ' + followingUsernameInfluencer.length
  );

  let selectedusernames = shuffle.pick(followingUsernameInfluencer, {
    picks: cnf.settings.following_number
  });

  return selectedusernames;
};

module.exports.following = following;
