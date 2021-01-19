import React, { Component, Fragment } from 'react';
import { Select, Input, Row, Col, Icon, message } from 'antd';

// background: #e8e8e8;
//     height: 30px;
//     line-height: 30px;
//     text-align: center;
//     border-right: 1px solid #fff;

const { Option } = Select;


class HttpConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upstreamList: props.value,
    }
  }

  divideHandleAdd = () => {
    const { onChange } = this.props;
    let { upstreamList } = this.state;
    if (upstreamList) {
      upstreamList.push({
        upstreamHost: "",
        protocol: "",
        upstreamUrl: "",
        weight: "50",
        status: true,
        timestamp: "0",
        warmup: "0"
      });
    } else {
      upstreamList = [];
    }

    this.setState({ upstreamList });
    onChange(upstreamList)
  };

  divideHandleDelete = index => {
    const { onChange } = this.props;
    let { upstreamList } = this.state;
    if (upstreamList && upstreamList.length > 1) {
      upstreamList.splice(index, 1);
    } else {
      message.destroy();
      message.error("At least one upstream");
    }
    this.setState({ upstreamList });
    onChange(this.state.upstreamList);
  };

  divideHandleChange = (index, name, value) => {
    const { onChange } = this.props;
    let { upstreamList } = this.state;
    upstreamList[index][name] = value;
    this.setState({ upstreamList });
    onChange(upstreamList);
  };


  render() {
    const { value = [] } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={3}>host</Col>
          <Col span={4}>protocol</Col>
          <Col span={3}>ip:port</Col>
          <Col span={3}>weight</Col>
          <Col span={3}>startupTime</Col>
          <Col span={3}>warmupTime</Col>
          <Col span={3}>status</Col>
          <Col spen={3}>Action</Col>
        </Row>
        {value.map((item, index) => {
          return (
            <Row key={index}>
              <Col span={3}>
                <Input
                  onChange={e => {
                        this.divideHandleChange(
                          index,
                          "upstreamHost",
                          e.target.value
                        );
                      }}
                  placeholder="HostName"
                  value={item.upstreamHost}
                />
              </Col>
              <Col span={4}>
                <Input
                  onChange={e => {
                        this.divideHandleChange(
                          index,
                          "protocol",
                          e.target.value
                        );
                      }}
                  placeholder="http://"
                  value={item.protocol}
                />
              </Col>
              <Col span={3}><Input
                onChange={e => {
                        this.divideHandleChange(
                          index,
                          "upstreamUrl",
                          e.target.value
                        );
                      }}
                placeholder="ip:port"
                value={item.upstreamUrl}
              />
              </Col>
              <Col span={3}>
                <Input
                  onChange={e => {
                        this.divideHandleChange(
                          index,
                          "weight",
                          e.target.value
                        );
                      }}
                  placeholder="weight"
                  value={item.weight}
                />
              </Col>
              <Col span={3}>
                <Input
                  onChange={e => {
                        this.divideHandleChange(
                          index,
                          "timestamp",
                          e.target.value
                        );
                      }}
                  placeholder="timestamp"
                  type="number"
                  value={`${item.timestamp? item.timestamp : "0"}`}
                />
              </Col>
              <Col span={3}>
                <Input
                  onChange={e => {
                        this.divideHandleChange(
                          index,
                          "warmup",
                          e.target.value
                        );
                      }}
                  placeholder="warmup time(ms)"
                  type="number"
                  value={`${item.warmup? item.warmup : "0"}`}
                />
              </Col>
              <Col span={3}>
                <Select
                  onChange={option => {
                        this.divideHandleChange(
                          index,
                          "status",
                          option
                        );
                      }}
                  value={`${item.status? item.status : true}`}
                >
                  <Option key="open" value="true">open</Option>
                  <Option key="close" value="false">close</Option>
                </Select>
              </Col>
              <Col span={2}>
                <Icon
                  type="close-circle"
                  onClick={() => {
                  this.divideHandleDelete(index);
                }}
                  style={{ color: 'red', marginLeft: '10px' }}
                />
                {index === value.length -1 && (
                <Icon
                  type="plus-circle"
                  onClick={this.divideHandleAdd}
                  style={{ color: 'green', marginLeft: '10px' }}
                />
              )}
              </Col>

            </Row>
          );
        })}
      </Fragment>
    )
  }
}

export default HttpConfig;