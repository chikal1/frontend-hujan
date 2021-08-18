
import React, { Component } from 'react';

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="About">
        <div class="container">
            <div class="row">
            <form onSubmit={this.handleSubmit}>
                <div>

                <p align="justify">
                <h4> Hujan dApp</h4> 
                <p><strong> Polygon Mumbai Testnet Deployed Address - 0x26Afa9CC330c044ADCC6651ecc2abAb858df14d0</strong> </p>
                <p><strong> Hujan is in early stages!</strong> </p>
                <p><strong> Made for the Hack Africa || Polygon</strong> </p>
                </p>

                <iframe width="1280" height="720" src="https://youtu.be/AMGCmSqAso4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                
                <p align="justify">
                <h4>What is Hujan</h4>
                Hujan is a dApp media platform. The platform allows users to share content with other users, akin to platforms such as medium or reddit. It leverages the MATIC event system as a means of storing content in an immutable fashion. The platform allows users to reward the content they like with donations (in MATIC). The dApp also makes use of MATIC EVM Smart Contracts to keep track of statistics such as Votes and Donations. There is no fee model for this dApp (yet), other than the Gas cost for functions. it is freely useable in it current form. 
                The dApp essentially uses MATIC nodes as a server, and MATIC as a database, whilst the frontend acts as the client. The dApp allows the user to tap directly into a MATIC EVM api of their choice (via MetaMask or other Web3 client settings). Due to the fact that no data is stored offchain it is (theoretically) near impossible to censor.
                </p>

                <p align="justify">
                <h4>Why is it needed</h4>
                Being Censorship Resistant is a very important concept for the modern internet, which is under constant assault by government censorship and manipulation by shadowy organisations and private interests. Another area where this concept is important is in the realm of content policing and cancel culture, modern social platforms often alienate fringe communities with broad rules that can often push users to darker platforms or echo chambers. This is evident in many cases, with the recent parlor ban being one such controversial case.  Another need for this dApp is the case of data harvesting. The dApp only records bare bone facts about a user to the blockchain and does not track users in any form. This is appealing in the post camebridge-analytica social domain where people are normally the commodity!.
                </p>

                </div>
            </form>
            </div>
        </div>
      </div>
    );
  }
}

  export default About;
