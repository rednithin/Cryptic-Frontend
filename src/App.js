import React, { useContext, useEffect } from "react";
import Setup from "./Setup";
import Login from "./Login";
import Homepage from "./Homepage";
import { NavLink } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router";
import { Layout, Menu, Collapse, List } from "antd";
import Dataset from "./Dataset";
import Backtest from "./Backtest";
import PaperTrading from "./PaperTrading";
import HyperOptim from "./HyperOptim";
import Profile from "./Profile";
import { StoreContext } from "./Store";

export default props => {
  const [store, { getTasks }] = useContext(StoreContext);
  useEffect(() => {
    let tasksInterval = setInterval(getTasks, 10000);
    return () => {
      clearInterval(tasksInterval);
    };
  }, [store.user]);

  return (
    <div>
      <Layout>
        <Layout>
          <Layout.Header
            style={{
              zIndex: 1,
              width: "100%",
              background: "white",
              marginBottom: 20
            }}
          >
            {!store.user ? (
              <Menu
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{ lineHeight: "64px" }}
              >
                <Menu.Item key="1">
                  <NavLink to="/">Homepage</NavLink>
                </Menu.Item>
                <Menu.Item key="2">
                  <NavLink to="/login">Login</NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                  <NavLink to="/setup">Setup</NavLink>
                </Menu.Item>
              </Menu>
            ) : (
              <Menu
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{ lineHeight: "64px" }}
              >
                <Menu.Item key="1">
                  <NavLink to="/">Homepage</NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                  <NavLink to="/dataset">Download Dataset</NavLink>
                </Menu.Item>
                <Menu.Item key="5">
                  <NavLink to="/backtest">Backtest</NavLink>
                </Menu.Item>
                <Menu.Item key="6">
                  <NavLink to="/hyperoptimization">
                    Hyper Parameter Optimization
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="7">
                  <NavLink to="/papertrading">Paper Trading</NavLink>
                </Menu.Item>
                <Menu.Item key="8">
                  <NavLink to="/profile">Profile</NavLink>
                </Menu.Item>
              </Menu>
            )}
          </Layout.Header>
          <Layout.Content style={{ height: "92vh" }}>
            <Switch>
              <Route exact path="/setup" component={Setup} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dataset" component={Dataset} />
              <Route exact path="/hyperoptimization" component={HyperOptim} />
              <Route exact path="/backtest" component={Backtest} />
              <Route exact path="/papertrading" component={PaperTrading} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/" component={Homepage} />
              <Redirect from="*" to="/" />
            </Switch>
          </Layout.Content>
          {/* <Layout.Footer style={{ background: "white" }}>Footer</Layout.Footer> */}
        </Layout>
        {store.user ? (
          <Layout.Sider
            style={{ background: "white", borderLeft: "1px solid silver" }}
            width={400}
          >
            {store.tasks ? (
              <Collapse>
                <Collapse.Panel header="Finished" key="1">
                  <List
                    bordered
                    dataSource={store.tasks.finished}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Collapse.Panel>
                <Collapse.Panel header="Failed" key="2">
                  <List
                    bordered
                    dataSource={store.tasks.failed}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Collapse.Panel>
                <Collapse.Panel header="Running" key="3">
                  <List
                    bordered
                    dataSource={store.tasks.running}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Collapse.Panel>
                <Collapse.Panel header="Pending" key="4">
                  <List
                    bordered
                    dataSource={store.tasks.pending}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Collapse.Panel>
              </Collapse>
            ) : null}
          </Layout.Sider>
        ) : null}
      </Layout>
    </div>
  );
};
