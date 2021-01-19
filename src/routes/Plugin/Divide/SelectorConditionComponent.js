import React, { Component, Fragment } from "react";
import { Select, Input, message, Row, Col, Icon } from "antd";
import { connect } from "dva";

const { Option } = Select;

@connect(({ global }) => ({
  platform: global.platform
}))
class SelectorConditionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectorConditions: props.selectorConditions || [
        {
          paramType: "uri",
          operator: "=",
          paramName: "/",
          paramValue: ""
        }
      ],
    }
  }
  

  conditionChange = (index, name, value) => {
    const { onChange } = this.props;
    let { selectorConditions } = this.state;
    selectorConditions[index][name] = value;
    if (name === "paramType") {
      let key = `paramTypeValueEn${index}`;
      if (value === "uri" || value === "host" || value === "ip") {
        this.setState({ [key]: true });
        selectorConditions[index].paramName = "/";
      } else {
        this.setState({ [key]: false });
      }
    }

    this.setState({ selectorConditions });
    onChange(selectorConditions);
  };

  handleAdd = () => {
    const { onChange } = this.props;
    let { selectorConditions } = this.state;
    selectorConditions.push({
      paramType: "uri",
      operator: "=",
      paramName: "/",
      paramValue: ""
    });
    this.setState({ selectorConditions }, () => {
      let len = selectorConditions.length || 0;
      let key = `paramTypeValueEn${len - 1}`;

      this.setState({ [key]: true });
      onChange(this.state.selectorConditions)
    });

  };

  handleDelete = index => {
    let { selectorConditions } = this.state;
    if (selectorConditions && selectorConditions.length > 1) {
      selectorConditions.splice(index, 1);
    } else {
      message.destroy();
      message.error("At least one condition");
    }
    this.setState({ selectorConditions });
  };

  render() {
    const { value, platform } = this.props;
    const { operatorEnums, paramTypeEnums } = platform;
    return (
      <Fragment>

        {value.map((item, index) => (
          <Row key={index}>
            <Col span={4}>
              <Select
                onChange={option => {
                  this.conditionChange(index, "paramType", option);
                }}
                value={item.paramType}
              >
                {paramTypeEnums.map(typeItem => {
                  return (
                    <Option
                      key={typeItem.name}
                      value={typeItem.name}
                    >
                      {typeItem.name}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            <Col
              span={4}
              style={{
                display: this.state[`paramTypeValueEn${index}`]
                  ? "none"
                  : "block"
              }}
            >
              <Input
                onChange={e => {
                  this.conditionChange(
                    index,
                    "paramName",
                    e.target.value
                  );
                }}
                value={item.paramName}
              />
            </Col>
            <Col span={4}>
              <Select
                onChange={option => {
                  this.conditionChange(index, "operator", option);
                }}
                value={item.operator}
              >
                {operatorEnums.map(opearte => {
                  return (
                    <Option key={opearte.name} value={opearte.name}>
                      {opearte.name}
                    </Option>
                  );
                })}
              </Select>
            </Col>

            <Col span={10}>
              <Input
                onChange={e => {
                  this.conditionChange(
                    index,
                    "paramValue",
                    e.target.value
                  );
                }}
                value={item.paramValue}
              />
            </Col>
            <Col span={2} style={{ float: 'right', textAlign: 'left' }}>
              
              <Icon
                type="close-circle"
                onClick={() => {
                  this.handleDelete(index);
                }}
                style={{ color: 'red', marginLeft: '10px' }}
              />
              {index === value.length -1 && (
                <Icon
                  type="plus-circle"
                  onClick={this.handleAdd}
                  style={{ color: 'green', marginLeft: '10px' }}
                />
              )}
            </Col>
          </Row>
        ))}
      </Fragment>
    )
  }
}

export default SelectorConditionComponent;