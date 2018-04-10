import React from 'react'
import {
  Grid, Message, Button,
  Segment, Container, Header,
  Form
} from 'semantic-ui-react';
import database from '../../firebase/firebase';

export default class EditChurchPage extends React.Component {
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
    const church_id = this.props.match.params.church_id;
    const churchesRef = database.ref(`churches/${church_id}`);
    const church = {
      name: this.state.church.trim()
    };
    churchesRef.update(church);
    this.props.history.push('/');
  }

  componentDidMount() {
    const church_id = this.props.match.params.church_id;
    const churchesRef = database.ref(`churches/${church_id}/name`);
    churchesRef.once('value', (snapshot) => {
      const church = snapshot.val();
      console.log(snapshot.val());
      this.setState(() => ({ church }));
    });
  }

  render() {
    console.log(this.state, 'state', this.props, 'props', 'EditChurchPage');

    return (
      <Grid>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Message color="blue">
              <p>Edit a church below...</p>
            </Message>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>Church</label>
                <input placeholder="Church's Name" type="text" value={this.state.church} onChange={this.handleChange} />
              </Form.Field>
              <Button type="submit" primary>Add</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  };
};