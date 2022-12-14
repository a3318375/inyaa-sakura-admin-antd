import React, {useRef, useState} from "react";
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormInstance,
  ProFormTextArea
} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@@/exports";
import 'md-editor-rt/lib/style.css';
import MdEditor from "md-editor-rt";
import {list1} from "@/services/ant-design-pro/blogTypeAdmin";
import {list2} from "@/services/ant-design-pro/blogTagAdmin";
import {info1} from "@/services/ant-design-pro/blogAdmin";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type AddBlogProps = {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onFinish?: (formData: API.InyaaBlog) => Promise<boolean | void>;
  values?: Partial<API.InyaaBlog>;
  titleLabel: string;
};

const AddBlog: React.FC<AddBlogProps> = (props) => {
  const [text, setText] = useState('');
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();
  const updateText = (val: string) => {
    setText(val);
    formRef?.current?.setFieldsValue?.({
      context: val,
    });
  }
  return (
    <ModalForm
      title={intl.formatMessage({
        id: props.titleLabel,
        defaultMessage: 'New blog',
      })}
      formRef={formRef}
      width="800px"
      params={{id: props.values?.id}}
      request={async (params) => {
        updateText('');
        const info: API.InyaaBlog = {}
        console.log(0, props.values)
        if (props && props.values && props.values.id !== 0) {
          const infoResp = await info1(params);

          if (infoResp && infoResp.data && infoResp.data.article && infoResp.data.article.context){
            infoResp.data.context = infoResp.data.article.context;
            if (infoResp.data.type) {
              infoResp.data.type.value = infoResp.data.type.id;
              infoResp.data.type.label = infoResp.data.type.name;
            }
            if (infoResp.data.tagList) {
              for (const tag of infoResp.data.tagList) {
                tag.label = tag.name;
                tag.value = tag.id;
              }
            }
            updateText(infoResp.data.article.context);
          }
          formRef?.current?.resetFields?.()
          return infoResp.data;
        }
        formRef?.current?.resetFields?.()
        return info;
      }}
      visible={props.visible}
      onVisibleChange={props.onVisibleChange}
      onFinish={props.onFinish}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.createForm.titleRule"
                defaultMessage="????????????"
              />
            ),
          },
        ]}
        label={intl.formatMessage({
          id: 'pages.searchTable.blog.title',
          defaultMessage: '??????',
        })}
        name="title"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.createForm.summaryRule"
                defaultMessage="????????????"
              />
            ),
          },
        ]}
        label={intl.formatMessage({
          id: 'pages.searchTable.blog.summary',
          defaultMessage: '??????',
        })}
        name="summary"
      />
      <ProForm.Group>
        <ProFormSelect
          name="type"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.blog.type',
            defaultMessage: '??????',
          })}
          fieldProps={{
            labelInValue: true
          }}
          request={async () => {
            const types = await list1();
            const typeResp = []
            if (types && types.data) {
              for (const tag of types.data) {
                const obj: API.SelectType = {};
                obj.label = tag.name;
                obj.value = tag.id;
                typeResp.push(obj);
              }
            }
            return typeResp;
          }}
        />
        <ProFormSelect.SearchSelect
          name="tagList"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.blog.tag',
            defaultMessage: '??????',
          })}
          request={async () => {
            const tags = await list2();
            const tagResp = []
            if (tags && tags.data) {
              for (const tag of tags.data) {
                const obj: API.SelectType = {};
                obj.label = tag.name;
                obj.value = tag.id;
                tagResp.push(obj);
              }
            }
            return tagResp;
          }}

        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSwitch name="status" label="????????????"/>
        <ProFormSwitch name="isHot" label="????????????"/>
        <ProFormSwitch name="isComment" label="??????????????????"/>
      </ProForm.Group>
      <MdEditor modelValue={text} onChange={updateText}/>
      <ProFormTextArea name="context" hidden />
    </ModalForm>
  );
}
export default AddBlog;
