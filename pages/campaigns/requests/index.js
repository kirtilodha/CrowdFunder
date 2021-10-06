import React , { Component } from 'react';
import { Button , Table } from 'semantic-ui-react';
import {Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component{
    static async getInitialProps(props){
        const { address } = props.query;
        const campaign= Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call(); //return string
        const approversCount = await campaign.methods.approversCount().call();
        const summary= await campaign.methods.getSummary().call();

        const requests= await Promise.all( //kind of making an array
            Array(parseInt(requestCount)).fill(). //makes array of size requestCount and fills with indexes
            map((element, index)=>{
                return campaign.methods.requests(index).call()
            })
        );


        return { address ,requests, requestCount, approversCount,manager: summary[4]};
    }
    renderRow(){ //fetching from array
        return this.props.requests.map((request, index)=>{
            return <RequestRow 
            key= {index} 
            id={index}
            request= {request}
            address={this.props.address}
            approversCount={this.props.approversCount}
            />
        })
    }

    render(){
        const { Header, Row, HeaderCell, Body } = Table;

        return(
            <Layout>
                <h3>Requests</h3>
                <Link route={ `/campaigns/${this.props.address}/requests/new`}>
                <a>
                    <Button primary floated="right" style={{marginBottom:10}}>Add Request</Button>
                    
                    </a>
                    </Link>
                    <Table>
                        <Header>
                            <Row>
                                <HeaderCell>ID</HeaderCell>
                                <HeaderCell>Description</HeaderCell>
                                <HeaderCell>Amount</HeaderCell>
                                <HeaderCell>Recipient</HeaderCell>
                                <HeaderCell>Approval</HeaderCell>
                                <HeaderCell>Approve</HeaderCell>
                                <HeaderCell>Finalise</HeaderCell>
                            </Row>
                        </Header>
                        <Body>
                            {this.renderRow()}
                        </Body>
                    </Table>
                    <div>
                        Found {this.props.requestCount} requests.
                    </div>
            </Layout>

        );
    }
}
export default RequestIndex;