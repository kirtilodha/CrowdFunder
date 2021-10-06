import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout.js'
import { Link } from '../routes';

class CampaignIndex extends Component{
    static async getInitialProps(){

        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns}; //return object mandatory
    }
    renderCampaigns(){
        const items = this.props.campaigns.map(address => {
            return{
                header: address,
                description: (
                <Link route={`/campaigns/${address}`}>
                <a> View Campaign</a>
                </Link>),
                fluid: true //css to stretch
            };
        });
        return <Card.Group items={items} />;
    }
    render(){
        return(
            <Layout>
            <div>
                
            <h3>Open Campaigns</h3>
            {/* routing */}
            <Link route="/campaigns/new"> 
            {/* anchor tag for moving around */}
                <a>
            <Button floated="right"
            content="Create  Campaign"
            icon="add circle"
            primary={ true }
            />
            </a>
            </Link>

            { this.renderCampaigns() }
            </div>
            </Layout>
        )
    }
}

export default CampaignIndex;