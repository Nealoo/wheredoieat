import React, { Component } from 'react';
import { List, Menu, Dropdown, Icon, message, Radio, Modal, Rate } from 'antd';
import axios from 'axios';
import './App.css';

// all the lottery grid items
class RowItem extends Component {

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

    const thisId = this.props.content['_id'];
    const thisWin = this.props.content['winTimes'];
    const thisTotal = 1 + 1*this.props.content['totalTimes'];
    axios.get('/data/update', {
      params: {
        id: thisId,
        winTimes: thisWin,
        totalTimes: thisTotal
      }
    }).then(res=>{
      console.log(res);
      if(res.status == 200){
        console.log(res.data);
      }
    });
  }

  acceptOption = () => {
    this.setState({
      visible: false,
    });

    const thisId = this.props.content['_id'];
    const thisWin = 1 + 1*this.props.content['winTimes'];
    const thisTotal = 1 + 1*this.props.content['totalTimes'];
    axios.get('/data/update', {
      params: {
        id: thisId,
        winTimes: thisWin,
        totalTimes: thisTotal
      }
    }).then(res=>{
      console.log(res);
      if(res.status == 200){
        console.log(res.data);
      }
    });
  }

  render() {
    const { content, activedId } = this.props;
    const RowItemId = content['index'];
    let rating = Number(content['winTimes'])/Number(content['totalTimes']);
    rating = 5*rating;

    return (
      <div>
        <Modal
          title="Modal"
          visible={this.state.visible}
          onOk={this.acceptOption}
          onCancel={this.hideModal}
          okText="Accept"
          cancelText="No I will reroll"
        >
          <div style={{textAlign: 'center'}}>
            <p>name: {content['name']}</p>
            <p>winTimes: {content['winTimes']}</p>
            <p>total: {content['totalTimes']}</p>
            <Rate disabled allowHalf defaultValue={rating} />
          </div>
        </Modal>
        <div onClick={this.showModal} className={activedId == RowItemId ? 'row__item row__item-active' : 'row__item'} id={`row_item_${RowItemId}`}>
          {content['name']}
        </div>
      </div>

    )
  }
}

export class TechList extends Component {

  render(){
    const tList = [
      'create-react-app',
      'babel-plugin-import',
      'antd',
      'axios',
      'mongoDB',
      'mongoose',
      'express',
      'heroku'
    ];

    return (
      <List
      header={<b>Package used in this small app</b>}
      bordered
      dataSource={tList}
      renderItem={item => (<List.Item>{item}</List.Item>)}
    />
    );
  }
}

export class App extends Component {
  constructor() {
    super();
    this.state = {
      // default draw list
      list: [{0:'rest1'}, {1:'rest2'}, {2:'rest1'}, {3:'rest1'}, {4:'rest1'}, {5:'rest1'}, {6:'rest1'}, {7:'rest1'}, {8:'rest1'}, {9:'rest1'}, {10:'rest1'}, {11:'rest1'} ],
      // current selected item
      activedId: '',
      // winnder id
      prizeId: null,
      // animation running times needs
      times: 0,
      // current animation times
      actTimes: 0,
      // is drawing?
      isRolling: false
    }
  }

  getDataFromDB(){
    //get and transfer data
    axios.get('/data/get').then(res=>{
      if(res.status == 200){
        res.data.map((item,index)=>item.index = index);
        this.setState({
          list: res.data
        })
        console.log(res.data);
        this.handlePlay();
      }
    });
  }

  handleBegin() {
    // this.state.isRolling为false的时候才能开始抽，不然会重复抽取，造成无法预知的后果
    if (!this.state.isRolling) {
      // reset all state every time start to roll
      this.setState({
        activedId: '',
        prizeId: null,
        times: 0,
        actTimes: 0,
        isRolling: true
      }, () => {
        // after reset state then get data prepare to roll
        this.getDataFromDB();
      })
    }
  }
  handlePlay() {
    // 随机获取一个中奖ID
    let prize = Math.floor(Math.random() * 12)
    this.setState({
      prizeId: prize,
      activedId: 0
    })
    // randomly get the minimal number of running
    let times = this.state.list.length * Math.floor(Math.random() * 5 + 4);
    this.setState({
      times: times
    })

    const rollingFucntion = ()=>{
      let num;
      // let the items move by changing state
      if (this.state.activedId === '') {
        num = 0
        this.setState({
          activedId: num
        })
      } else {
        num = this.state.activedId
        if (num === 11) {
          num = 0
          this.setState({
            activedId: num
          })
        } else {
          num = num + 1
          this.setState({
            activedId: num
          })
        }
      }

      this.setState({
        actTimes: this.state.actTimes + 1
      })
    }
    // let's start roll
    this.begin = setInterval(() => {

      // go into the last
      if(this.state.actTimes >= this.state.times){
        clearInterval(this.begin);

        // run set a slow running animation
        this.slowRoll = setInterval(() => {
          // on the awards item, stop
          if(this.state.activedId === this.state.prizeId){
            clearInterval(this.slowRoll)
            this.setState({
              isRolling: false
            })
            return
          }
          rollingFucntion();
        },400);
      }

      rollingFucntion();

      // if (this.state.activedId === this.state.prizeId && this.state.actTimes > this.state.times) {
      //   // 符合上述所有条件时才是中奖的时候，两个ID相同并且动画执行的次数大于(或等于也行)设定的最小次数
      //   clearInterval(this.begin)
      //   this.setState({
      //     isRolling: false
      //   })
      //   return
      // }

    }, 40)
  }
  render() {
    const { list, activedId } = this.state;

    const onClick = ({ key })=>{
      //message.info(`${key}`);
      this.handleBegin();
    };

    const menu = (
      <Menu onClick={onClick}>
        <Menu.Item key="1">most selected restaurant first</Menu.Item>
        <Menu.Item key="2">less selected restaurant first</Menu.Item>
        <Menu.Item key="3">do normal</Menu.Item>
      </Menu>
    );

    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;

    function onChange(e) {
      console.log(`radio checked:${e.target.value}`);
    }

    return (
      <div className="App" style={{textAlign: 'center'}}>
        <RadioGroup onChange={onChange} defaultValue="a">
          <RadioButton value="a">Mode1</RadioButton>
          <RadioButton value="b" disabled>Mode2</RadioButton>
          <RadioButton value="c">Mode3</RadioButton>
          <RadioButton value="d">Mode4</RadioButton>
        </RadioGroup>
        <div style={{height: '30px'}}></div>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="#">
            Hover me, Click to find the restaurant <Icon type="down" />
          </a>
        </Dropdown>
        <div className="prize">
          <div className="prize__container">
            <div className="container__area">
              <div className="begin__btn" style={{textAlign: 'center'}}>
                Have Fun, boys!!
              </div>
              <div className="area__row">
                <RowItem content={list[0]} activedId={activedId} />
                <RowItem content={list[1]} activedId={activedId} />
                <RowItem content={list[2]} activedId={activedId} />
                <RowItem content={list[3]} activedId={activedId} />
              </div>
              <div className="area__row">
                <RowItem content={list[11]} activedId={activedId} />
                <RowItem content={list[4]} activedId={activedId} />
              </div>
              <div className="area__row">
                <RowItem content={list[10]} activedId={activedId} />
                <RowItem content={list[5]} activedId={activedId} />
              </div>
              <div className="area__row">
                <RowItem content={list[9]} activedId={activedId} />
                <RowItem content={list[8]} activedId={activedId} />
                <RowItem content={list[7]} activedId={activedId} />
                <RowItem content={list[6]} activedId={activedId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
