
import React, { Component } from 'react';
import {DonateMATIC} from "../utils/maticweb";

class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MATICValue: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({MATICValue: event.target.value});
  }

  handleSubmit(event) {
    DonateMATIC(this.props.postid, this.state.MATICValue);
    event.preventDefault();
  }

  render() {
    let userData = JSON.parse(localStorage.getItem("User"))
    return (
    <div className="Donate">
        <div class="container">
            <div class="row">

            <form onSubmit={this.handleSubmit}>
                <div>
                    <input type="number" value={this.state.MATICValue} onChange={this.handleChange} /> MATIC
                </div>
                <p></p>
                
                <input type="submit" class="btn btn-outline-dark" value="Donate" />

                              <p></p>
                <strong>Post Has Earned: {this.props.donation['MATICDonation']}MATIC </strong> 
                
              <p></p>
            </form>
            </div>
        </div>
      </div>
    );
  }
}

  export default Donate;
