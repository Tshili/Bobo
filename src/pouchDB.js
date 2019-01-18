let PouchDB = require('pouchdb');

let db = new PouchDB('follows');
let dbFollowing = new PouchDB('following');
let db_archive = new PouchDB('followsArchive');
let db_stat = new PouchDB('stats');

let addFollow = async function(username) {
  return db.put({
    _id: username,
    added: new Date().getTime()
  });
};

let getFollows = async function() {
  return db.allDocs({
    include_docs: true
  });
};

let getUnfollowsArchive = async function() {
  return db_archive
    .allDocs({
      include_docs: true
    })
    .catch(e => console.log('all unfollow in archive ' + e));
};

let unFollow = async function(username) {
  return new Promise(function(resolve, reject) {
    db.get(username)
      .then(doc => {
        return db.remove(doc);
      })
      .then(() => {
        return db_archive.put({
          _id: username
        });
      })
      .then(() => {
        resolve(true);
      })
      .catch(e => reject(e));
  });
};

let inArchive = async function(username) {
  return db_archive.get(username);
};

// database for following

let addFollowing = async function(username) {
  return dbFollowing.put({
    _id: username,
    added: new Date().getTime()
  });
};

let getFollowing = async function() {
  return await dbFollowing.allDocs({
    include_docs: true
  });
};

/****** Stats ************/

let addNumberOfFollowers = async function(numberFollowers) {
  return await db_stat
    .put({
      _id: Math.random().toString(),
      count: numberFollowers,
      added: new Date().getTime()
    })
    .catch(e => console.log(' err addNumberOfFollowers ' + e));
};

let getNumberFollowers = async function() {
  return await db_stat
    .allDocs({
      include_docs: true
    })
    .catch(e => console.log(' err getNumberFollowers ' + e));
};

module.exports.addFollow = addFollow;
module.exports.inArchive = inArchive;
module.exports.getFollows = getFollows;
module.exports.unFollow = unFollow;
module.exports.getUnfollowsArchive = getUnfollowsArchive;

// following
module.exports.addFollowing = addFollowing;
module.exports.getFollowing = getFollowing;

//stats
module.exports.addNumberOfFollowers = addNumberOfFollowers;
module.exports.getNumberFollowers = getNumberFollowers;
