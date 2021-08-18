
import React, { Component } from 'react';
class DummyItem extends Component {

  render() {
      let type = "Comment";
      if(this.props.isPost) {
        type = "Post"
      }
    return (
      <div className="DummyItem">
        <div class="container">
            <div class="row">
              There are no {type}'s to display. This may be because you aren't connected to the Polygon Mumbai Testnet using MetaMask or another web3 wallet. If you are connected, try refreshing the page to load events from the Smart Chain EVM. If no events are shown, try pointing your matic chain to another server.
            </div>
          </div>
        </div>
    );
  }
}

export default DummyItem;
