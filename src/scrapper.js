const rp = require('request-promise');

// 

const scrapeHashtags = (html) =>{
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;
    while ((match = regex.exec(html))) {
                matches.push(match[1]);
            }
    return matches;
} 


// remove duplicates hashtags scraped 
const removeDuplicates = (arr)=>{
    let newArr = [];

    arr.map(ele => {
        if (newArr.indexOf(ele) == -1){
            newArr.push(ele)
        }
    })

    return newArr;

}






let scrapping = async () => {

let keyWord = "bretagne"
let URL = `https://www.instagram.com/explore/tags/${keyWord}/`


rp(URL).then((html)=> {
    let hashtags = scrapeHashtags(html);
    hashtags = removeDuplicates(hashtags);
    hashtags = hashtags.map(ele => "#"+ele)
    console.log("la liste des hashtags :" + hashtags);

})
        .catch((error)=>{console.log("====> error : " + error)})

await scrapeHashtags;

await removeDuplicates;

}




module.exports = scrapping;


