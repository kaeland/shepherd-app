import React, { Component } from 'react'
import { Button, Confirm } from 'semantic-ui-react'

class ConfirmModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Confirm
          open={this.state.open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </div>
    )
  }
}

export default ConfirmModal;