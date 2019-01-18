let cnf = require('/Users/Tshili/Documents/Project/instagram/config/config.json');
let ops = require('/Users/Tshili/Documents/Project/instagram/src/pouchDB.js');

let unfollow = async function unfollow(page) {
  /*************  Unfollow  *************/

  if (cnf.settings.do_unfollows) {
    let cutoff =
      new Date().getTime() - cnf.settings.unfollow_after_days * 86400000;
    let follows = await ops.getFollows();

    let unfollows = [];

    follows.rows.forEach(user => {
      if (user.doc.added < cutoff) {
        unfollows.push(user.doc._id);
      }
    });

    console.log(' number of people i will remove ' + unfollows.length);

    for (let n = 0; n < unfollows.length; n++) {
      let user = unfollows[n];

      console.log('je rentre dans le unfollow ' + user);
      await page.goto('https://www.instagram.com/' + user);

      await page.waitFor(1500 + Math.floor(Math.random() * 500));

      let followStatus = await page
        .evaluate(x => {
          let element = document.querySelector(x);
          console.log('=====> followsStatus: ' + element);
          return Promise.resolve(element ? element.innerHTML : '');
        }, cnf.selectors.user_unfollow_button)
        .catch(err => {
          console.log('===== Error Followstatus' + err);
        });

      if (followStatus === 'Following') {
        console.log('---> unfollow ' + user);
        await page
          .click(cnf.selectors.user_unfollow_button)
          .catch(err => console.log('error for user_unfollow_button : ' + err));

        ops.unFollow(user);
        //await page.waitFor(10000 + Math.floor(Math.random() * 5000));

        await page.waitFor(10000);

        await page.click(cnf.selectors.user_unfollow_confirm_button);

        await page.waitFor(10000);
      } else {
        console.log('---> archive ' + user);
        ops.unFollow(user);
      }
    }
  }
};

module.exports.unfollow = unfollow;
