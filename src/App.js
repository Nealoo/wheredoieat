import React, { Component } from 'react';
import { List, Menu, Dropdown, Icon, Radio } from 'antd';
import axios from 'axios';
import './App.css';

import {RowItem} from './RowItem';

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
        this.handlePlay();
      }
    });
  }

  getPrizeId() {
    const rollMode = this.state.rollingMode;
    let prizeId = Math.floor(Math.random() * 12)

    this.updatePrizeItemTotalTime(prizeId);
    return prizeId;
  }

  updatePrizeItemTotalTime(prizeId){
    const thisId = this.state.list[prizeId]['_id'];
    const thisTotal = 1 + Number(this.state.list[prizeId]['totalTimes']);
    console.log(thisId,thisTotal);
    axios.get('/data/update', {
      params: {
        id: thisId,
        totalTimes: thisTotal
      }
    }).then(res=>{
      if(res.status == 200){
        console.log('updated this.total');
      }
    });
  }

  handleBegin() {
    // see if it's rolling now
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

    let prize = this.getPrizeId();

    // randomly get the minimal number of running
    let times = this.state.list.length * Math.floor(Math.random() * 5 + 4);

    this.setState({
      prizeId: prize,
      activedId: 0,
      times: times
    })

    // let's start roll
    this.begin = setInterval(() => {

      // go into the last run
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
          this.rollingAnimation();
        },400);
      }

      this.rollingAnimation();

    }, 40)
  }

  rollingAnimation = ()=>{

    let num = this.state.activedId;

    // let the items move by changing activedId state
    if (num === 11) {
      num = 0
    } else {
      num = num + 1
    }

    this.setState({
      actTimes: this.state.actTimes + 1,
      activedId: num
    })
  }

  render() {
    const { list, activedId } = this.state;

    const onClickMenu = ({ key })=>{
      //message.info(`${key}`);
      this.handleBegin();

      this.setState({
        rollingMode: 'key'
      });
    };

    const menu = (
      <Menu onClick={onClickMenu}>
        <Menu.Item key="most">most selected restaurant first</Menu.Item>
        <Menu.Item key="less">less selected restaurant first</Menu.Item>
        <Menu.Item key="even">do normal</Menu.Item>
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
