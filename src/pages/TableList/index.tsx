import {addRule, removeRule} from '@/services/mock/api';
import {info1, list9, save8} from '@/services/ant-design-pro/blogAdmin';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProFormSwitch, ProTable,} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, message} from 'antd';
import React, {useRef, useState} from 'react';
import AddBlog from "@/pages/TableList/components/AddBlog";

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.InyaaBlog) => {
  const hide = message.loading('正在添加');
  try {
    await save8({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleGet = async (id: number) => {
  const infoResp = await info1({id: id});
  if (infoResp && infoResp.code === 200) {

  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [saveTitle, setTitle] = useState<string>('pages.searchTable.createForm.newBlog');
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InyaaBlog>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.InyaaBlog>[] = [
    {
      title: (
        <FormattedMessage id="pages.searchTable.blog.title" defaultMessage="Rule name" />
      ),
      dataIndex: 'title',
      width: 300,
    },
    {
      title: <FormattedMessage id="pages.searchTable.blog.comments" defaultMessage="comments" />,
      dataIndex: 'comments',
    },
    {
      title: <FormattedMessage id="pages.searchTable.blog.views" defaultMessage="views" />,
      dataIndex: 'views',
    },
    {
      title: <FormattedMessage id="pages.searchTable.blog.status" defaultMessage="Status" />,
      dataIndex: 'status',
      valueType: 'switch',
      render: (_, record) => [
        <ProFormSwitch
          key={'status_' + record.id}
          fieldProps={{
            defaultChecked: record.status,
            onChange: async(e) => {
              record.status = e;
              await save8(record);
              return e;
            },
        }}
        />,
      ],
    },
    {
      title: <FormattedMessage id="pages.searchTable.blog.isHot" defaultMessage="isHot" />,
      dataIndex: 'isHot',
      valueType: 'switch',
      render: (_, record) => [
        <ProFormSwitch
          key={'isHot_' + record.id}
          fieldProps={{
            defaultChecked: record.isHot,
            onChange: async(e) => {
              record.isHot = e;
              await save8(record);
              return e;
            },
          }}
        />,
      ],
    },
    {
      title: <FormattedMessage id="pages.searchTable.blog.isComment" defaultMessage="isComment" />,
      dataIndex: 'isComment',
      valueType: 'switch',
      render: (_, record) => [
        <ProFormSwitch
          key={'isComment' + record.id}
          fieldProps={{
            defaultChecked: record.isComment,
            onChange: async(e) => {
              record.isComment = e;
              await save8(record);
              return e;
            },
          }}
        />,
      ],
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="Description" />,
      dataIndex: 'createTime',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setTitle('pages.searchTable.createForm.editBlog');
            handleModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.createForm.button.edit" defaultMessage="Configuration" />
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          <FormattedMessage
            id="pages.searchTable.createForm.button.delete"
            defaultMessage="Subscribe to alerts"
          />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.InyaaBlog, API.PageInyaaBlogVo>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow({id: 0});
              setTitle('pages.searchTable.createForm.newBlog');
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: T & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const resp = await list9({
            page: params.current,
            size: params.pageSize,
          });
          return {
            data: resp.data?.content,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: resp.code === 200,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: resp.data?.totalElements,
          };
        }}
        columns={columns}
        pagination={{defaultPageSize: 10}}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <AddBlog
        titleLabel={saveTitle}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        values={currentRow}
        onFinish={async (value) => {
          const article: {context: string} = {context: ''}
          if (value.context) {
            article.context = value.context;
            value.article = article;
          }
          if (value.type) {
            value.type = {id: value.type.value, name: value.type.label};
          }
          if (value.tagList) {
            const tags = [];
            for(const tag of value.tagList) {
              tags.push({id: tag.value, name: tag.label})
            }
            value.tagList = tags;
          }
          if(currentRow && currentRow.id !== 0) {
            value.id = currentRow.id;
          }
          console.log(1111, value);
          const success = await handleAdd(value as API.InyaaBlog);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
    </PageContainer>
  );
};

export default TableList;
