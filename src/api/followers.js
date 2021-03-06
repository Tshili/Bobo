let cnf = require('../../config/config.json');
let ops = require('../pouchDB.js');
const shuffle = require('shuffle-array');

let followers = async function(page) {
  followerInfluencers = [];

  for (let index = 0; index < cnf.influencer_name.length; index++) {
    await page.goto(
      'https://www.instagram.com/graphql/query/?query_hash=56066f031e6239f35a904ac20c9f37d9&variables=%7B%22id%22%3A%22' +
        cnf.influencer_name[index].id +
        '%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Afalse%2C%22first%22%3A10000%2C%22after%22%3A%22QVFEeDE3eVNiSEZocWFVWmRiSHJzOW5vd3FCOTZNN00tNy1GYXMyYmlnM1VhXzRTVklLclZOamVLNjFNdk1xY1RveUk1Z09aVjI3QWV6Y01VdWI3bk1DWQ%3D%3D%22%7D'
    );

    await page.waitFor(4500);
    try {
      let followers = await page
        .evaluate('document.querySelector("body > pre").innerText')
        .catch(err =>
          console.log('err let followers = await page.evaluate' + err)
        );

      followerInfluencers.push(JSON.parse(followers));
    } catch (err) {
      console.error('Failed to write followers cookies' + err);
    }
  }

  let followersUsernameInfluencer = [];
  for (let index = 0; index < followerInfluencers.length; index++) {
    for (
      let i = 0;
      i < followerInfluencers[index].data.user.edge_followed_by.edges.length;
      i++
    ) {
      followersUsernameInfluencer.push(
        followerInfluencers[index].data.user.edge_followed_by.edges[i].node
          .username
      );
    }
  }

  console.log(
    'size of followersUsernameInfluencer : ' +
      followersUsernameInfluencer.length
  );

  let selectedusernames = shuffle.pick(followersUsernameInfluencer, {
    picks: cnf.settings.followers_number
  });

  return selectedusernames;
};

module.exports.followers = followers;
