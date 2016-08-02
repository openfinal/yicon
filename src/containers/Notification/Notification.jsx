import './Notification.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubTitle, Content, Menu, Main, Timeline, InfoItem } from '../../components/';
import { autobind } from 'core-decorators';
import {
  getInfo,
} from '../../actions/notification';
import Pager from '../../components/common/Pager/';

const scope = {
  repo: '系统',
  project: '项目',
};

@connect(
  state => ({
    all: state.user.notification.allInfo,
    system: state.user.notification.systemInfo,
    project: state.user.notification.projectInfo,
  }),
  {
    getInfo,
  }
)
export default class Notification extends Component {
  static propTypes = {
    getInfo: PropTypes.func,
    all: PropTypes.object,
    system: PropTypes.object,
    project: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      tag: 'all',
    };
  }

  componentWillMount() {
    this.props.getInfo();
  }

  @autobind
  onChangePage(page) {
    this.getInfo(this.state.tag, page);
  }

  @autobind
  changeTag(e) {
    const nextTag = e.currentTarget.dataset.tag;
    this.setState({
      tag: nextTag,
    });
  }

  render() {
    const attrName = this.state.tag;
    const InfoList = (this.props[attrName] && this.props[attrName].list) || [];
    const currentPage = this.props[attrName].currentPage;
    const totalPage = this.props[attrName].totalPage;
    let mainClassList = InfoList.length === 0 ? 'empty-container' : '';
    return (
      <div className="notification">
        <SubTitle tit={'我的消息'} />
        <Content>
          <Menu>
            <li
              className={this.state.tag === 'all' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="all"
            >
              <a>全部消息
              {
                this.props.all.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.all.unReadCount}</i> :
                  null
              }
              </a>
            </li>
            <li
              className={this.state.tag === 'system' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="system"
            >
              <a>系统消息
              {
                this.props.system.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.system.unReadCount}</i> :
                  null
              }
              </a>
            </li>
            <li
              className={this.state.tag === 'project' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="project"
            >
              <a>项目消息
              {
                this.props.project.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.project.unReadCount}</i> :
                  null
              }
              </a>
            </li>
          </Menu>
          <Main extraClass={mainClassList} >
            {
              InfoList.length > 0 ?
                <Timeline>
                {InfoList.map(item => (
                  <InfoItem
                    key={item.id}
                    tag={scope[item.scope]}
                    timeStr={item.createdAt}
                    showTitleHtml
                    item={item}
                    isNew={item.userLog.unread}
                  />
                  ))
                }
                </Timeline> :
                null
            }
            <div className="pager-container">
              {InfoList.length > 0 ?
                <Pager
                  defaultCurrent={currentPage}
                  totalPage={totalPage}
                  onClick={this.onChangePage}
                /> :
                null
              }
            </div>
          </Main>
        </Content>
      </div>
    );
  }
}
