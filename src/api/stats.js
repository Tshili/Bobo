require('dotenv').config();
let ops = require('/Users/Tshili/Documents/Project/instagram/src/pouchDB.js');
const moment = require('moment');

let numbersFollowers = async function(page) {
  await page.goto(
    'https://www.instagram.com/' + process.env.USER_PROD + '/?__a=1'
  );

  try {
    let stat = await page
      .evaluate('document.querySelector("body > pre").innerText')
      .catch(err =>
        console.log('err let following = await page.evaluate' + err)
      );
    stats = JSON.parse(stat);

    // Convert nuomber of followers to string value
    number = stats.graphql.user.edge_followed_by.count.toString();
    await ops.addNumberOfFollowers(number);
  } catch (err) {
    console.error('Failed to write following cookies' + err);
  }
};

let historicFollowers = async function() {
  console.log('-------- historic --------');
  return await ops.getNumberFollowers().then(data =>
    data.rows.forEach(element => {
      console.log(
        '---  number of follower : ' +
          element.doc.count +
          ' at : ' +
          moment(element.doc.added).format('DD-MM-YYYY HH:mm:ss')
      );
    })
  );
};

let numberFollowerPerDay = async function() {
  let dt = [];
  console.log('-------- number follower by day  --------');

  await ops.getNumberFollowers().then(data => {
    for (let index = 0; index < data.rows.length; index++) {
      const element = data.rows[index];
      if (
        moment(element.doc.added).format('DD-MM-YYYY 00:00:00') <
          moment(element.doc.added).format('DD-MM-YYYY HH:mm:ss') &&
        moment(element.doc.added).format('DD-MM-YYYY HH:mm:ss') <
          moment(element.doc.added).format('DD-MM-YYYY 23:59:59')
      ) {
        dt.push(parseInt(element.doc.count));
      }
    }
    console.log('----  followers gain : ' + dt[0]);
    console.log('----  followers gain  length: ' + dt[dt.length - 1]);
    console.log('sdfedfgrfg' + dt[dt.length - 1] - dt[0]);
  });
};

module.exports.numbersFollowers = numbersFollowers;
module.exports.historicFollowers = historicFollowers;
module.exports.numberFollowerPerDay = numberFollowerPerDay;
