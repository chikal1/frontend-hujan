
import Swal from 'sweetalert2'
import { abi } from './ABI.js'
import {a2hex, hex2a, Time2a, aTo32bytehex, Time2HMS, TextType} from "./parser"

//address of the contract
const contractAddress = "0x26Afa9CC330c044ADCC6651ecc2abAb858df14d0";

console.log(abi)

const Web3 = require('web3');

function testweb3(){
    if(!window.web3){
        Swal({title:'No Web3 Wallet was detected. Please make sure you have metamask or another wallet, and are connected to the BSC Testnet.',
            type: 'info'
        });
    }
}

function reloadDom(){
    getPosts()
    getComments()
    getVoteCounters()
    getCommentVoteCounters()
    getUserData()
    getDonations()
    getUsers()
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
}

async function load() {
    await loadWeb3();
    updateStatus('Ready!');
}

function updateStatus(status) {
    console.log(status);
}

load();

async function loadContract() {
    return await new window.web3.eth.Contract(abi['abi'], contractAddress);
}

async function load_contract() {
    await loadWeb3();
    window.contract = await loadContract();
    updateStatus('Contract Ready!');
}



async function printCoolNumber() {
    updateStatus('fetching Cool Number...');
    const coolNumber = await window.contract.methods.coolNumber().call();
    updateStatus(`coolNumber: ${coolNumber}`);
}


async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}


export async function createNewPost(title, content, tags) {

    //notify the user that the post has been submitted
    Swal({title:'Post Transaction Submitted',
            type: 'info'
        });


    load_contract();

    //convert the data to an appropriate format for the blockchain to handle
    let byteTitle = window.web3.utils.asciiToHex(title);
    let byteContent = window.web3.utils.asciiToHex(content);
    let byteTags = window.web3.utils.asciiToHex(tags);

    //submit the data to the blockchain
    const account = await getCurrentAccount();

    console.log(account);

    await window.contract.methods.CreatePost(byteTitle, byteContent, byteTags).send({from: account

    }).then(res => Swal({
        title:'Post Created Successfully',
        type: 'success'

    })).catch(err => Swal(
        {
             title:'Post Creation Failed',
             type: 'error'
        }
    ));

}


//get data from contract events and convert it into a readable/useable state
export async function getPosts() {
    await load_contract();

    var a;
    window.contract.getPastEvents('PostContent', {
        filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    }, function(error, events){ console.log(events); })
    .then(function(events){
        convertPosts(events) // same results as the optional callback above
    });
}

export async function convertPosts(es){
    var posts = []
    var TagList = []

    console.log(es)

    var events = es

    for(var i=0; i<events.length; i++){

        console.log(i)
        let address = events[i]['returnValues']['author'];
        let maticaddress = address;

        //format data so it can be used and stored better

        
        var post = {
            title: window.web3.utils.hexToAscii(events[i]['returnValues']['title']),
            timestamp: Time2a(events[i]['returnValues']['postTimestamp']),
            tags: window.web3.utils.hexToAscii(events[i]['returnValues']['tags']),
            postid: events[i]['returnValues']['id'],
            author: "0x" + address,
            maticaddress: "0x" + maticaddress,
            content: window.web3.utils.hexToAscii(events[i]['returnValues']['text']),
            hms: Time2HMS(events[i]['returnValues']['postTimestamp']),
            type: TextType(window.web3.utils.hexToAscii(events[i]['returnValues']['text']))
          }
          TagList = TagList.concat(post['tags']);

        posts = posts.concat(post);
    }

    localStorage.setItem("Posts", JSON.stringify(posts));
    localStorage.setItem("TagList", JSON.stringify(TagList));

    return posts;
}

export async function createNewComment(commentText, postid,  parentComment) {

    //notify the user that the comment has been submitted
    Swal({title:'Comment Transaction Submitted',
            type: 'info'
        });


    
    load_contract();

    //submit the data to the blockchain
    const account = await getCurrentAccount();

    //convert the data to an appropriate format for the blockchain to handle
    //let byteTitle = a2hex(title);
    let bytecommentText = window.web3.utils.asciiToHex(commentText);
    let id = "0x" + Number(postid).toString(16);

    //submit the data to the blockchain
    await window.contract.methods.PostComment(bytecommentText, id, "0x00").send({from: account}).then(res => Swal({
        title:'Comment Posted Successfully',
        type: 'success'

    })).catch(err => Swal(
        {
             title:'Comment Post Failed',
             type: 'error'
        }
    ));

}

//get data from contract events and convert it into a readable/useable state
export async function getComments() {
    await load_contract();

    window.contract.getPastEvents('CommentCreated', {
        filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    }, function(error, events){ console.log(events); })
    .then(function(events){
        convertComments(events) // same results as the optional callback above
    });
}

//get data from contract events and convert it into a readable/useable state
export async function convertComments(es) {

    var events = es;
    var comments = []
    for(var i=0; i<events.length; i++){

        let address = events[i]['returnValues']['commenter'];
        console.log(address)
        let maticaddress = address

        var comment = {
            parentComment: hex2a(events[i]['returnValues']['parentComment']),
            postid: events[i]['returnValues']['postId'],
            author: "0x" + address,
            maticaddress: "0x" + maticaddress,
            content: hex2a(events[i]['returnValues']['comment']),
            timestamp: Time2a(events[i]['returnValues']['commentTimestamp']),
            commentid: events[i]['returnValues']['commentId'],
            hms: Time2HMS(events[i]['returnValues']['commentTimestamp'])
          }

          comments = comments.concat(comment);
    }

    localStorage.setItem("Comments", JSON.stringify(comments));

    return comments;
}

//get the vote counters from the blockchain
export async function getVoteCounters() {

    load_contract();

    //submit the data to the blockchain
    const account = await getCurrentAccount();

    let posts = JSON.parse(localStorage.getItem("Posts"));
    let votes = [];

    if (!posts){
        posts = [];
    }

    for(var i=0; i<posts.length; i++){
        let pid = posts[i]['postid'];
        let id = "0x" + Number(pid).toString(16);

        //grab vote data from the blockchain
        let up = await window.contract.methods.getUpVotes(id).call();
        let down = await window.contract.methods.getDownVotes(id).call();

        let postVote = {
            postid : pid,
            upvotes : up,
            downvotes: down,
            total: (up-down)
        }
        votes = votes.concat(postVote);
    } 

    localStorage.setItem("PostVotes", JSON.stringify(votes));
}

export async function VoteOnPost(postid, votetype) {

    load_contract();

    //submit the data to the blockchain
    const account = await getCurrentAccount();

    //convert the postid into a useable form
    let id = "0x" + Number(postid).toString(16);

    if (votetype == 0){
        //notify the user that the vote has been submitted
        Swal({title:'Post Up Voted',
        type: 'info'
        });
        //submit the data to the blockchain
        await window.contract.methods.UpvotePost(postid).send({from: account})
        .then(res => Swal({
            title:'Up Voted Successfully',
            type: 'success'

        })).catch(err => Swal(
            {
                title:'Up Vote Failed',
                type: 'error'
            }
        ));
    }else if (votetype == 1){

        //notify the user that the vote has been submitted
        Swal({title:'Post Down Voted',
        type: 'info'
        });

        //submit the data to the blockchain
        await window.contract.methods.DownvotePost(postid).send({from: account})
        .then(res => Swal({
            title:'Down Voted Successfully',
            type: 'success'

        })).catch(err => Swal(
            {
                title:'Down Vote Failed',
                type: 'error'
            }
        ));
    }

}

//// Comment Related Functions

//get the vote counters from the blockchain
export async function getCommentVoteCounters() {
    load_contract();
    const account = await getCurrentAccount();
    
    let comments = JSON.parse(localStorage.getItem("Comments"));
    let CommentVotes = [];

    if (!comments){
        comments = [];
    }

    for(var i=0; i<comments.length; i++){
        let pid = comments[i]['postid'];
        let cid = comments[i]['commentid'];

        let id = "0x" + Number(pid).toString(16);
        let comid = "0x" + Number(cid).toString(16);

        //grab vote data from the blockchain
        let up = await window.contract.methods.getCommentUpVotes(id, comid).call();
        let down = await window.contract.methods.getCommentDownVotes(id, comid).call();

        let commentVote = {
            postid : pid,
            commentid: cid,
            upvotes : up,
            downvotes: down,
            total: (up-down)
        }
        CommentVotes = CommentVotes.concat(commentVote);
    } 

    localStorage.setItem("CommentVotes", JSON.stringify(CommentVotes));

}


export async function VoteOnComment(postid, commentid, votetype) {

    load_contract();
    const account = await getCurrentAccount();

    //convert the postid into a useable form
    let id = "0x" + Number(postid).toString(16);
    let cid = "0x" + Number(commentid).toString(16);

    if (votetype == 0){
        //notify the user that the vote has been submitted
        Swal({title:'Comment Up Voted',
        type: 'info'
        });
        //submit the data to the blockchain
        await window.contract.methods.UpvoteComment(postid, cid).send({from: account})
        .then(res => Swal({
            title:'Up Voted Comment Successfully',
            type: 'success'

        })).catch(err => Swal(
            {
                title:'Comment Vote Failed',
                type: 'error'
            }
        ));
    }else if (votetype == 1){

        //notify the user that the vote has been submitted
        Swal({title:'Comment Down Voted',
        type: 'info'
        });

        //submit the data to the blockchain
        await window.contract.methods.DownvoteComment(postid, cid).send({from: account})
        .then(res => Swal({
            title:'Comment Down Voted Successfully',
            type: 'success'

        })).catch(err => Swal(
            {
                title:'Comment Vote Failed',
                type: 'error'
            }
        ));
    }

}

//DONATION SYSTEM

export async function DonateMATIC(postid, MATICAmount) {

    //load the contract 
    load_contract();
    const account = await getCurrentAccount();

    //convert the postid into a useable form
    let weiAmount = window.web3.utils.toWei(window.web3.utils.toBN(MATICAmount), 'ether')

    let id = "0x" + Number(postid).toString(16);


    Swal({title:'Transaction to Donate ' + MATICAmount.toString() + "MATIC sent",
    type: 'info'
    });


    //submit the data to the blockchain
    await window.contract.methods.makeDonation(id).send({from: account, value: weiAmount})
    .then(res => Swal({
        title:'Donation Successful',
        type: 'success'

    })).catch(err => Swal(
        {
            title:'Donation Failed',
            type: 'error'
        }
    ));
}


//get the donation counters from the blockchain
export async function getDonations() {
    load_contract();
    const account = await getCurrentAccount();

    let posts = JSON.parse(localStorage.getItem("Posts"));
    let Donations = [];

    if (!posts){
        posts = [];
    }

    for(var i=0; i<posts.length; i++){
        let pid = posts[i]['postid'];
        let id = "0x" + Number(pid).toString(16);

        //grab vote data from the blockchain
        let ContractPostDonation = await window.contract.methods.getPostDonations(id).call();
        let Sun = window.web3.utils.fromWei(ContractPostDonation)

        let Donation = {
            postid : pid,
            SunDonations : Sun,
            MATICDonation: Sun
        }

        Donations = Donations.concat(Donation);
    } 

    localStorage.setItem("Donations", JSON.stringify(Donations));

}

//USERNAME SYSTEM

export async function ChangeUsername(UsernameString) {

    //load the contract 
    load_contract();
    const account = await getCurrentAccount();

    //convert matic amount into a sun value as sun is used as the call value
    let user = aTo32bytehex(UsernameString)

    //notify the user that the deposit has been attempted
    Swal({title:'Changing Username to : ' + UsernameString,
    type: 'info'
    });

    //submit the data to the blockchain
    await window.contract.methods.SetUsername(user).send({from: account})
    .then(res => Swal({
        title:'Username Changed Successfully',
        type: 'success'

    })).catch(err => Swal(
        {
            title:'Username Change Failed',
            type: 'error'
        }
    ));
}

export function reloadcurrentpage(){
    window.history.go(0)
}

//get the current users data
export async function getUserData() {
    load_contract();
    const account = await getCurrentAccount();

    let user = JSON.parse(localStorage.getItem("User"));

    if (!user){
        user = [];
    }

    //grab the sender address from the blockchain
    let add = account;
    console.log(add)
    let username = window.web3.utils.hexToAscii(await window.contract.methods.getUsername(add).call());

    let balance = await window.web3.eth.getBalance(add);
    console.log(balance)
    console.log(account)
    

    user = {
        maticaddress : add,
        HexAddress : add,
        UserName : username,
        SunBalance : balance * (10^16)
    }

    localStorage.setItem("User", JSON.stringify(user));
}


export async function getUsers() {
    load_contract();
    const account = await getCurrentAccount();

    let posts = JSON.parse(localStorage.getItem("Posts"));
    let comments = JSON.parse(localStorage.getItem("Comments"));

    let unique = []

    if(posts){
        for(var i = 0; i<posts.length; i++){
            var author = posts[i]['author']
            if(unique.includes(author ) == false) {
                unique = unique.concat(author)
            }
        }
    }

    if(comments){

        for(var i = 0; i<comments.length; i++){
            var author = comments[i]['author']
            if(unique.includes(author ) == false) {
                unique = unique.concat(author)
            }
        }
    }

    var UserNames = []

    let NoUsername = await window.contract.methods.getUsername("0000000000000000000000000000000000000000").call();
    let nousernameascii = hex2a(NoUsername);

    for (var i = 0; i<unique.length; i++){
        var address = unique[i].substring(2, unique[i].length)
        let ContractUsername = await window.contract.methods.getUsername(address).call();
        let username = hex2a(ContractUsername);

        if(username == nousernameascii){
            username = "anonymous"
        }
        
        
        var user = {
            HexAddress : unique[i],
            UserName : username
        }

        UserNames = UserNames.concat(user)
    }
    localStorage.setItem("KnownUsers", JSON.stringify(UserNames));
}

export {testweb3}
