import React, { Component } from 'react';
import { Modal, Rate } from 'antd';
import axios from 'axios';

// all the lottery grid items
export class RowItem extends Component {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  acceptOption = () => {
    this.setState({
      visible: false,
    });

    const thisId = this.props.content['_id'];
    const thisWin = 1 + Number(this.props.content['winTimes']);
    axios.get('/data/update', {
      params: {
        id: thisId,
        winTimes: thisWin
      }
    }).then(res=>{
      if(res.status == 200){
        console.log('updated');
      }
    });
  }

  render() {
    const { content, activedId } = this.props;
    const RowItemId = content['index'];
    const rating = 5 * Number(content['winTimes'])/Number(content['totalTimes']);
    this.isPrize = Number(activedId) === Number(RowItemId);

    const onOKFunction = this.isPrize ? this.acceptOption : this.hideModal;
    const onOKText = this.isPrize ? 'Yes, we will go' : 'close';
    const onCancelText = this.isPrize ? 'No, we will reroll' : 'close';
    const popupText = this.isPrize ? 'Please Vote, do you got more than half people agree to go?' : '';

    // \nV2 will record people\s vote

    return (
      <div>
        <Modal
          title="Restaurant Detail"
          visible={this.state.visible}
          onOk={onOKFunction}
          onCancel={this.hideModal}
          okText={onOKText}
          cancelText={onCancelText}
        >
          <div style={{textAlign: 'center'}}>
            <p>name: {content['name']}</p>
            <p>winTimes: {content['winTimes']}</p>
            <p>total: {content['totalTimes']}</p>
            <Rate disabled allowHalf defaultValue={rating} />
            <p>{popupText}</p>
          </div>
        </Modal>
        <div onClick={this.showModal} className={ this.isPrize ? 'row__item row__item-active' : 'row__item'} id={`row_item_${RowItemId}`}>
          {content['name']}
        </div>
      </div>

    )
  }
}
