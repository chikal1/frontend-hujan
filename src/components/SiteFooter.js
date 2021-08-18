
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class SiteFooter extends Component {

  render() {
    return (
        <div className="header">
            <footer class="page-footer font-small blue">
                <div class="footer-copyright text-center py-3">© Hujan [POLYGON MUMBAI TESTNET] || ENCODE - Heat Death of The Universe
                    <p><Link to="/">Home</Link> | <Link to="/new-post">Create New Post</Link> | <Link to="/about">About</Link> | <Link to="/search">Search</Link> | <Link to="/account">Account</Link> </p>
                </div>
            </footer>
        </div>
        );
     }
}

export default SiteFooter;

