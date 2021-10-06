import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign.js'
import { Card , Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes';
class CampaignShow extends Component{
    static async getInitialProps(props){
        //fetch address from url
        const campaign= Campaign(props.query.address);
        const summary= await campaign.methods.getSummary().call();
        
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards(){
        const {
            balance,
            manager,
            minimumContribution,
            requestCount,
            approversCount
        } = this.props;
        const items =[
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and create requests to withdraw money.',
                style: { overflowWrap: 'break-word' } // goes to the next line if overflows the card

            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to contribute.'
            },
            {
                header: requestCount,
                meta: 'Number of requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by the approvers.'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is the money this camapign has left to spend'
            }

        ];
        return <Card.Group items={items} />
    }

    render(){
        return(
            <Layout>
                <h3>Campaign Details</h3>
                <Grid>
                    <Grid.Row>
                    {/* out of 50% take 100% */}
                    <Grid.Column width={10}>
                    { this.renderCards() }
                    
                    </Grid.Column>
                {/* out of 50% take 60% */}
                <Grid.Column width={6}>
                <ContributeForm address={this.props.address}/>
                </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                        <a>
                            <Button primary>View Requests</Button>
                        </a>

                    </Link>
                    </Grid.Column>
                </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}
export default CampaignShow;