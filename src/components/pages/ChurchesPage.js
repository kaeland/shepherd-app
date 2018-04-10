import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid, Message, Button,
  Segment, Container, Header
} from 'semantic-ui-react';
import sizeMe from 'react-sizeme'
import database from '../../firebase/firebase';
import _ from 'lodash';


class ChurchesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      churches: []
    };
  }

  componentDidMount() {
    const churchesRef = database.ref('churches');
    churchesRef.orderByChild('name').on('value', (snapshot) => {
      const churches = [];
      snapshot.forEach((childSnapshot) => {
        churches.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      this.setState(() => ({ churches }));
    });
  }

  // renderChurches() {
  //   const churches = ['Blueprint', 'Conerstone', 'Gospel Hope'];
  //   const churchList = this.state.churches.map((church) => {
  //     return (
  //       <Panel key={church.id}>
  //         <Panel.Heading>
  //           <Panel.Title>
  //             <div className="driver_header_wrapper">
  //               <p style={{ marginTop: '10px' }}>{church.name}</p>
  //               <div>
  //                 <Link to={`/drivers/${church.id}`}>
  //                   <Button className="driver_header_button">Find Rides</Button>
  //                 </Link>
  //                 <Link to={`/edit/church/${church.id}`}>
  //                   <Button className="driver_header_button">Edit</Button>
  //                 </Link>
  //               </div>
  //             </div>
  //           </Panel.Title>
  //         </Panel.Heading>
  //       </Panel>
  //     );
  //   });
  //   return churchList;
  // }

  renderChurches() {
    const churchList = this.state.churches.map(({ name, id }) => {
      const { push } = this.props.history;
      const { width } = this.props.size;
      // <div >
      // </div>
      return (
        <Segment key={id} clearing>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '5px' }}><p>{name}</p></div>
            <Button.Group size="tiny" fluid={ width < 450 ? true : false }> 
              <Button positive onClick={(e) => push(`/drivers/${id}`)}>Find a Ride</Button>
              <Button.Or />
              <Button onClick={(e) => push(`/edit/church/${id}`)}>Edit</Button>
            </Button.Group>
          </div>
        </Segment>
      );
    });
    return churchList;
  }

  renderHello() {
    return <div><p>Hi there</p></div>
  }

  render() {
    const { push } = this.props.history;
    

    return (
      <Grid>
        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Message color="blue">
            { _.isEmpty(this.state.churches)
              ? (
                <p>
                  Welcome to Shepherd! Use the button below to add the 
                  church you attend to the Shepherd database.    
                </p>
              )
              : <p>Find a ride with the churches below...</p>
            }
            </Message>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Button primary floated="right" onClick={(e) => push(`/add/church`)}>Add</Button>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            {this.renderChurches()}
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  }
}

export default sizeMe()(ChurchesPage);