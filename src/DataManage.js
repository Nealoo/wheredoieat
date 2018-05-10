import React, { Component } from 'react';
import { Table, Button, Divider, Modal, Rate } from 'antd';
import axios from 'axios';

export class DataManage extends Component{

  constructor(){
    super();

    this.state = {
      filteredInfo: null,
      sortedInfo: null,
      visible: false
    };

    this.getDataFromDB();
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  }
  setWinTimeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'winTimes',
      },
    });
  }

  getDataFromDB(){
    //get and transfer data
    axios.get('/data/get').then(res=>{
      if(res.status == 200){
        res.data.map((item,index)=>item.index = index);
        this.setState({
          data: res.data
        })
      }
    });
  }

  updateRestaurant(recordId){
    this.setState({
      visible: true,
    });
    console.log(recordId);
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  render(){
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'winTimes',
      dataIndex: 'winTimes',
      key: 'winTimes',
      sorter: (a, b) => a.winTimes - b.winTimes,
      sortOrder: sortedInfo.columnKey === 'winTimes' && sortedInfo.order,
    }, {
      title: 'totalTimes',
      dataIndex: 'totalTimes',
      key: 'totalTimes',
      sorter: (a, b) => a.totalTimes - b.totalTimes,
      sortOrder: sortedInfo.columnKey === 'totalTimes' && sortedInfo.order,
    },{
      title: 'Rate',
      key: 'rate',
      render: (text, record) => (
        <Rate disabled allowHalf defaultValue={5*record.winTimes/record.totalTimes} />
      ),
    },{
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={()=>this.updateRestaurant(record._id)}>Update</a>
          <Divider type="vertical" />
        </span>
      ),
    }];
    return (
      <div>
        <Modal
          title="Modal"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText='update'
          cancelText='cancel'
        >
          <div style={{textAlign: 'center'}}>
            input data
          </div>
        </Modal>
        <div className="table-operations">
          <Button onClick={this.setWinTimeSort}>Sort winTimes</Button>
          <Button onClick={this.clearAll}>Clear</Button>
          <Button onClick={this.addNew}>Add a new restaurant</Button>
        </div>
        <Table rowKey='_id' columns={columns} dataSource={this.state.data} onChange={this.handleChange} />
      </div>
    );
  }
}
