import React from 'react'
import {
  Grid, Message, Button,
  Segment, Container, Header,
  Form
} from 'semantic-ui-react';
import database from '../../firebase/firebase';

export default class AddChurchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      church: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ church: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const churchesRef = database.ref('churches');
    const church = {
      name: this.state.church.trim()
    };
    churchesRef.push(church);
    this.setState({ church: '' });
    this.props.history.push('/');
  }

  render() {
    console.log(this.state, 'state', this.props, 'props', 'AddChurchPage');

    return (
      <Grid>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Message color="blue">
              <p>Add a church below...</p>
            </Message>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>Church</label>
                <input placeholder="Church's Name" type="text" value={this.state.church} onChange={this.handleChange}/>
              </Form.Field>
              <Button type="submit" primary>Add</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  };
};