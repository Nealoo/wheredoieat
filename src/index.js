import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { TechList } from './TechList';
import { DataManage } from './DataManage';
import registerServiceWorker from './registerServiceWorker';

import { Layout, Menu, Tabs } from 'antd';


const { Header, Content, Footer } = Layout;
const TabPane = Tabs.TabPane;

ReactDOM.render((
  <Layout>
    <Header style={{ position: 'fixed', width: '100%' }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">Show case</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px', marginTop: 64 }}>
      <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tech used" key="1">
            <TechList />
          </TabPane>
          <TabPane tab="find restaurant" key="2">
            <App />
          </TabPane>
          <TabPane tab="enter restaurant data" key="3">
            <DataManage />
          </TabPane>
        </Tabs>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      presentation for MR workshop
    </Footer>
  </Layout>
), document.getElementById('root'));
registerServiceWorker();
