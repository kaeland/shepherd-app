import React from 'react';
import {
  Grid, Message, Button,
  Segment, Container, Header,
  Form
} from 'semantic-ui-react';
import database from '../../firebase/firebase';

class AddRiderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: ''
    };
    
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onFirstNameChange(e) {
    const firstName = e.target.value;
    this.setState(() => ({ firstName }));
  }

  onLastNameChange(e) {
    const lastName = e.target.value;
    this.setState(() => ({ lastName }));
  }

  handleSubmit(e) {
    e.preventDefault();
    const church_id = this.props.match.params.church_id;
    const driver_id = this.props.match.params.driver_id;
    const driversSeatsString = `churches/${church_id}/drivers/${driver_id}/seatsAvailable`;
    const driversSeatsRef = database.ref(driversSeatsString);
    const ridersRefString = `churches/${church_id}/drivers/${driver_id}/riders`;  
    const ridersRef = database.ref(ridersRefString);
    const rider = {
      firstName: this.state.firstName.trim(),
      lastName: this.state.lastName.trim()
    };
    driversSeatsRef.transaction((currentSeatsAvailable) => {
      if (currentSeatsAvailable > 0) {
        ridersRef.push(rider);
        return currentSeatsAvailable - 1;
      }
    });
    this.setState(() => ({
      firstName: '',
      lastName: ''
    }));
    this.props.history.push(`/drivers/${church_id}`);
  }

  render() {
    return (
      <Grid>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Message color="blue">
              <p>Add a rider below...</p>
            </Message>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Form onSubmit={this.handleSubmit}> 

              <Form.Field>
                <label>First Name</label>
                <input placeholder="First Name" type="text" value={this.state.firstName} onChange={this.onFirstNameChange} />
              </Form.Field>

              <Form.Field>
                <label>Last Name</label>
                <input placeholder="Last Name" type="text" value={this.state.lastName} onChange={this.onLastNameChange} />
              </Form.Field>

              <Button type="submit" primary>Add</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  }
}

export default AddRiderPage;