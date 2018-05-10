import React, { Component } from 'react';
import { List } from 'antd';

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
      'heroku',
      'Weighted Random algorithm',
      'Quick Sorting algorithm'
    ];

    const fList = [
      'go live',
      'reroll limitation everyday',
      'record vote || record member(quick select)',
      'code recommand base on members',
      'record reviews (rating) help to modify the weight',
      'block one item several days',
      'manully add weight for each item',
      'grab new food options from third party',
      'code randomly decide refuse reroll after 2 times reroll',
      '5 times reroll then block for 5 days',
      '10 times reroll then put item to trash bin'
    ];

    return (
      <div>
        <List
        header={<b>Package used in this small app</b>}
        bordered
        dataSource={tList}
        renderItem={item => (<List.Item>{item}</List.Item>)}
      />

        <List
        header={<b>Features in the next version</b>}
        bordered
        dataSource={fList}
        renderItem={item => (<List.Item>{item}</List.Item>)}
      />
      </div>
    );
  }
}
