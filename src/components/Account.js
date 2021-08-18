
import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {ChangeUsername} from "../utils/maticweb";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        Username: ""
      };

      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleUserSubmit = this.handleUserSubmit.bind(this);

  }


  handleUserChange(event) {
    this.setState({Username: event.target.value});
  }

  handleUserSubmit(event) {
    ChangeUsername(this.state.Username);
    this.state.Username = " ";
    event.preventDefault();
  }

  render() {
    let userData = JSON.parse(localStorage.getItem("User"))

    return (
    <div className="Account">
        <div class="container">

            <h2>Account Settings and Information</h2>
            <Tabs>
                <TabList>
                    <Tab>Current User Information</Tab>
                    <Tab>Update Username</Tab>
                </TabList>

            
            <TabPanel>
                <div className="Information">.
                    <h3>Current User Information</h3>
                    <p></p>
                        <strong>Username: </strong> {userData['UserName']}
                    <p></p>
                        <strong>Address: </strong> {userData['maticaddress']}
                    <p></p>
                        <strong>Hex Address: </strong> {userData['HexAddress']}
                    <p></p>

                </div>
            </TabPanel>

            <TabPanel>
                <div className="Usename">
                    <h3>Update Username</h3>

                    <form onSubmit={this.handleUserSubmit}>
                    
                        <label> Username</label>

                        <div>
                            <input type="Text" maxLength={12} value={this.state.Username} onChange={this.handleUserChange} />
                        </div>

                        <p></p>
                            <input type="submit" class="btn btn-outline-dark btn-sm" value="Change" />
                        <p></p>

                    </form>
                </div>
            </TabPanel>

            </Tabs>
        </div>
      </div>
    );
  }
}

  export default Account;
