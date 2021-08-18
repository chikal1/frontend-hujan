
import React, { Component } from 'react';
import CommentBox from "./CommentBox";
import CommentsList from "./CommentsList";
import PostVote from "./PostVote";
import Donate from "./Donate";


import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';



class PostPage extends Component {

  render() {
    var postid = this.props.postid;
    let post;
    let donation;

    if(this.props.postid) {
      let posts = JSON.parse(localStorage.getItem("Posts"));
      let donations = JSON.parse(localStorage.getItem("Donations")); 
      for(var i=0; i<posts.length; i++){
        if(posts[i]['postid'] === this.props.postid){
          post = posts[i];
          break;
        }
      }

      for(var i=0; i<donations.length; i++){
        if(donations[i]['postid'] === this.props.postid){
          donation = donations[i];
          break;
        }
      } 

    }
    if(!post) {
      post = {
        title: "404 Not Found",
        author: "0x0",
        timestamp: "ERROR",
        content: "Post does not exist"
      }
      postid = -1;
    }

    let Users = JSON.parse(localStorage.getItem("KnownUsers"));
    let username = "anonymous"

    for(var i=0; i<Users.length; i++){
      if(Users[i]['HexAddress'] == post['author']){
        username = Users[i]['UserName'];
      }
    }

    var torrentId;
    var content = post['content']
    var hasTorrent = false;
    
    if(post['content'].includes("magnet:?")){
      console.log(post['content'])
      var s = post['content'].split(" ")
      for(var i =0; i < s.length; i++){
       if(s[i].includes("magnet:?")){
        torrentId = s[i];
        torrentId = torrentId.replace("<p>", "").replace("</p>", "").replace("&amp;", "&")
        hasTorrent = true;
        content = content.replace(s[i], "<a href=\"javascript: document.body.scrollIntoView(false);\">This post contains torrent media. Scroll to the bottom of the page to view! </a>")
        window.scrollTo(0,document.body.scrollHeight);
        break;
       }
      }
    }

    console.log(torrentId)
    //torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
    // torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
    torrentId = ''
    var WebTorrent = require('webtorrent')
    var client = new WebTorrent()

    client.add(torrentId, function (torrent) {

      torrent.files.forEach(function (file) {
        // Display the file by appending it to the DOM. Supports video, audio, images, and
        // more. Specify a container element (CSS selector or reference to DOM node).
        file.appendTo('body')
      })

      console.log(torrent)
    })
 
    return (
      <div className="PostPage">


        <ExpansionPanel expanded={true}>
            <ExpansionPanelSummary >
              <Typography ><h1>{post['title']}</h1></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div class="container">
              <div class="row">
                  <p></p>
                  <div class="container">
                  <p class="lead" align="justify">
                    <div dangerouslySetInnerHTML={{__html: content}} />
                    </p>
                  </div>
                  <div>

                  <Divider variant="middle" />

                  Posted on {post['timestamp']} at {post['hms']} by
                  <Tooltip title={" " +post['author']+" "+post['maticaddress']} leaveDelay={400} interactive={true}><strong> {username}</strong></Tooltip>
                  
                  <Divider variant="middle" />

                  </div>

              </div>
            </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel defaultExpanded={true}>
            <ExpansionPanelSummary >
              <Typography ><h3>Vote</h3></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <PostVote postid={postid} />
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel defaultExpanded={true}>
            <ExpansionPanelSummary >
              <Typography> <h3>Donate</h3> </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Donate postid={postid} donation={donation}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel defaultExpanded={true}>
            <ExpansionPanelSummary >
              <Typography ><h3>Leave Comment</h3></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <CommentBox postid={postid}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel defaultExpanded={true}>
            <ExpansionPanelSummary >
              <Typography ><h3>Comment Section</h3></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <CommentsList postid={postid}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

      </div>
    );
  }
}

export default PostPage;
