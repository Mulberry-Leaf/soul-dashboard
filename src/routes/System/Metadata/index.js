import React, { Component } from "react";
import { Table, Input, Button, message, Popconfirm } from "antd";
import { connect } from "dva";
import { resizableComponents } from '../../../utils/resizable';
import AddModal from "./AddModal";
import { getCurrentLocale, getIntlContent } from "../../../utils/IntlUtils";
import AuthButton from '../../../utils/AuthButton';

@connect(({ metadata, loading, global }) => ({
  metadata,
  language: global.language,
  loading: loading.effects["metadata/fetch"]
}))
export default class Metadata extends Component {
  components = resizableComponents;

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      selectedRowKeys: [],
      appName: "",
      popup: "",
      localeName: window.sessionStorage.getItem('locale') ? window.sessionStorage.getItem('locale') : 'en-US',
    };
  }

  componentWillMount() {
    const { currentPage } = this.state;
    this.getAllMetadata(currentPage);
    this.initPluginColumns();
  }

  componentDidUpdate() {
    const { language } = this.props;
    const { localeName } = this.state;
    if (language !== localeName) {
      this.initPluginColumns();
      this.changeLocale(language);
    }
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  getAllMetadata = page => {
    const { dispatch } = this.props;
    const { appName } = this.state;
    dispatch({
      type: "metadata/fetch",
      payload: {
        appName,
        currentPage: page,
        pageSize: 12
      }
    });
  };

  pageOnchange = page => {
    this.setState({ currentPage: page });
    this.getAllMetadata(page);
  };

  closeModal = () => {
    this.setState({ popup: "" });
  };

  editClick = record => {
    const { dispatch } = this.props;
    const { currentPage } = this.state;
    const name = this.state.appName;
    dispatch({
      type: "metadata/fetchItem",
      payload: {
        id: record.id
      },
      callback: user => {
        // console.log(user)
        this.setState({

          popup: (
            <AddModal
              isShow={false}
              {...user}
              handleOk={values => {
                const { appName, methodName,id, parameterTypes,path,pathDesc, rpcExt, rpcType, serviceName } = values;

                dispatch({
                  type: "metadata/update",
                  payload: {
                    appName,
                    methodName,
                    parameterTypes,
                    // enabled,
                    pathDesc,
                    id,
                    path,
                    rpcExt,
                    rpcType,
                    serviceName
                  },
                  fetchValue: {
                    appName: name,
                    currentPage,
                    pageSize: 12
                  },
                  callback: () => {
                    this.closeModal();
                  }
                });
              }}
              handleCancel={() => {
                this.closeModal();
              }}
            />
          )
        });
      }
    });
  };

  searchOnchange = e => {
    const appName = e.target.value;
    this.setState({ appName });
  };

  searchClick = () => {
    this.getAllMetadata(1);
    this.setState({ currentPage: 1 });
  };

  deleteClick = () => {
    const { dispatch } = this.props;
    const { appName, currentPage, selectedRowKeys } = this.state;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      // console.log('000000000000000000')
      // console.log(selectedRowKeys)
      // console.log('000000000000000000')
      dispatch({
        type: "metadata/delete",
        payload: {
          list: selectedRowKeys
        },
        fetchValue: {
          appName,
          currentPage,
          pageSize: 12
        },
        callback: () => {
          this.setState({ selectedRowKeys: [] });
        }
      });
    } else {
      message.destroy();
      message.warn("Please select data");
    }
  };

  addClick = () => {
    const { currentPage } = this.state;
    const name = this.state.appName;
    this.setState({
      popup: (
        <AddModal
          isShow={true}
          handleOk={values => {
            const { dispatch } = this.props;
            const { appName, enabled, methodName, parameterTypes,path,pathDesc, rpcExt, rpcType, serviceName } = values;
            dispatch({
              type: "metadata/add",
              payload: {
                appName,
                methodName,
                enabled,
                parameterTypes,
                path,
                pathDesc,
                rpcExt,
                rpcType,
                serviceName
              },
              fetchValue: {
                appName: name,
                currentPage,
                pageSize: 12
              },
              callback: () => {
                this.setState({ selectedRowKeys: [] });
                this.closeModal();
              }
            });
          }}
          handleCancel={() => {
            this.closeModal();
          }}
        />
      )
    });
  };

  enableClick = () => {
    const { dispatch } = this.props;
    const { appName, currentPage, selectedRowKeys } = this.state;
    if (selectedRowKeys && selectedRowKeys.length > 0) {

      dispatch({
        type: "metadata/fetchItem",
        payload: {
          id: selectedRowKeys[0]
        },
        callback: user => {

          dispatch({
            type: "metadata/updateEn",
            payload: {
              list: selectedRowKeys ,
              enabled: !user.enabled
            },
            fetchValue: {
              appName,
              currentPage,
              pageSize: 12
            },
            callback: () => {
              this.setState({ selectedRowKeys: [] });
            }
          });
        }
      })
    } else {
      message.destroy();
      message.warn("Please select data");
    }
  };

  syncData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "metadata/syncDa"

    })
  };

  changeLocale(locale){
    this.setState({
      localeName: locale
    });
    getCurrentLocale(this.state.localeName);
  }

  initPluginColumns() {
    this.setState({
      columns: [
        {
          align: "center",
          title: getIntlContent("SOUL.AUTH.APPNAME"),
          dataIndex: "appName",
          key: "appName",
          ellipsis:true,
        },
        {
          align: "center",
          title: getIntlContent("SOUL.META.PATH"),
          dataIndex: "path",
          key: "path",
          ellipsis:true,
          width: 120,
        },
        {
          align: "center",
          title: getIntlContent("SOUL.META.SERVER.INTER"),
          dataIndex: "serviceName",
          key: "serviceName",
          ellipsis:true,
          width: 120,
        },
        {
          align: "center",
          title: getIntlContent("SOUL.META.FUNC.NAME"),
          dataIndex: "methodName",
          key: "methodName",
          ellipsis:true,
        },
        {
          align: "center",
          title: `${getIntlContent("SOUL.AUTH.PARAMS")}${getIntlContent("SOUL.COMMON.TYPE")}`,
          dataIndex: "parameterTypes",
          key: "parameterTypes",
          ellipsis:true,
          width: 120,
        },
        {
          align: "center",
          title: `Rpc${getIntlContent("SOUL.COMMON.TYPE")}`,
          dataIndex: "rpcType",
          key: "rpcType",
          ellipsis:true,
        },
        {
          align: "center",
          title: `Rpc${getIntlContent("SOUL.META.EXPAND.PARAMS")}`,
          dataIndex: "rpcExt",
          key: "rpcExt",
          ellipsis:true,
          width: 120,
        },
        {
          align: "center",
          title: getIntlContent("SOUL.AUTH.PATH.DESCRIBE"),
          dataIndex: "pathDesc",
          key: "pathDesc",
          ellipsis:true,
          width: 120,
        },
        {
          align: "center",
          title: getIntlContent("SOUL.SYSTEM.STATUS"),
          dataIndex: "enabled",
          key: "enabled",
          ellipsis:true,
          width: 60,
          render: text => {
            if (text) {
              return <div className="open">{getIntlContent("SOUL.COMMON.OPEN")}</div>;
            } else {
              return <div className="close">{getIntlContent("SOUL.COMMON.CLOSE")}</div>;
            }
          }
        },
        {
          align: "center",
          title: getIntlContent("SOUL.COMMON.OPERAT"),
          ellipsis:true,
          dataIndex: "operate",
          key: "operate",
          width: 60,
          render: (text, record) => {
            return (
              <AuthButton perms="system:meta:edit">
                <div
                  className="edit"
                  onClick={() => {
                    this.editClick(record);
                  }}
                >
                  {getIntlContent("SOUL.SYSTEM.EDITOR")}
                </div>
              </AuthButton>
            );
          }
        }
      ]
    })
  }

  render() {
    const { metadata, loading } = this.props;
    const { userList, total } = metadata;

    const { currentPage, selectedRowKeys, appName, popup } = this.state;
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <div className="plug-content-wrap">
        <div style={{ display: "flex" }}>
          <Input
            value={appName}
            onChange={this.searchOnchange}
            placeholder={getIntlContent("SOUL.META.INPUTAPPNAME")}
            style={{ width: 240 }}
          />
          <AuthButton perms="system:meta:list">
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={this.searchClick}
            >
              {getIntlContent("SOUL.SYSTEM.SEARCH")}
            </Button>
          </AuthButton>
          <AuthButton perms="system:meta:delete">
            <Popconfirm
              title={getIntlContent("SOUL.COMMON.DELETE")}
              placement='bottom'
              onConfirm={() => {
                this.deleteClick()
              }}
              okText={getIntlContent("SOUL.COMMON.SURE")}
              cancelText={getIntlContent("SOUL.COMMON.CALCEL")}
            >
              <Button
                style={{ marginLeft: 20 }}
                type="danger"
              >
                {getIntlContent("SOUL.SYSTEM.DELETEDATA")}
              </Button>
            </Popconfirm>
          </AuthButton>
          <AuthButton perms="system:meta:add">
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={this.addClick}
            >
              {getIntlContent("SOUL.COMMON.ADD")}
            </Button>
          </AuthButton>
          <AuthButton perms="system:meta:disable">
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={this.enableClick}
            >
              {getIntlContent("SOUL.PLUGIN.BATCH")}
            </Button>
          </AuthButton>
          <AuthButton perms="system:meta:modify">
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={this.syncData}
            >
              {getIntlContent("SOUL.AUTH.SYNCDATA")}
            </Button>
          </AuthButton>
        </div>

        <Table
          size="small"
          components={this.components}
          style={{ marginTop: 30 }}
          bordered
          rowKey={record => record.id}
          loading={loading}
          columns={columns}
          dataSource={userList}
          rowSelection={rowSelection}
          pagination={{
            total,
            current: currentPage,
            pageSize: 12,
            onChange: this.pageOnchange
          }}
        />
        {popup}
      </div>
    );
  }
}
