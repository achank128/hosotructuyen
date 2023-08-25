import React, { useState } from 'react';
import { Col, Form, Input, Row, Upload, Checkbox, Button, AutoComplete } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const normFile = (e) => {
  //console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

function TaiLieuDynamicItem({ name, fieldKey, restField, IsRequired, loaiTaiLieu, propsUploadTaiLieu, autoCompleteData}) {
  const [isRequired, setIsRequired] = useState(IsRequired)

  return (<Row align="top">
  <Col span={1} style={{ textAlign: "center" }}>
    <Checkbox checked={isRequired} onChange={(e) =>  setIsRequired(e.target.checked)}></Checkbox>
  </Col>
  <Col span={8} style={{ paddingRight: 4 }}>
    <Form.Item
      {...restField}
      name={[name, "DocNameVN"]}
      fieldKey={[fieldKey, "DocNameVN"]}
      rules={[{ required: isRequired, message: "Thông tin bắt buộc" }]}
      hasFeedback
      style={{ marginBottom: 4 }}
    >
      <AutoComplete
        options={autoCompleteData}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      >
        <Input placeholder="Tên tài liệu" />
      </AutoComplete>
    </Form.Item>
  </Col>
  <Col span={8} style={{ paddingRight: 4 }}>
    <Form.Item
      {...restField}
      name={[name, "VersionAndDate"]}
      fieldKey={[fieldKey, "VersionAndDate"]}
      rules={[{ required: isRequired, message: "Thông tin bắt buộc" }]}
      hasFeedback
      style={{ marginBottom: 4 }}
    >
      <Input placeholder="Phiên bản/ngày" />
    </Form.Item>
  </Col>
  <Col span={7}>
    <Form.Item
      {...restField}
      name={[name, "FileData"]}
      fieldKey={[fieldKey, "FileData"]}
      rules={[{ required: isRequired, message: "Hãy đính kèm file" }]}
      hasFeedback
      style={{ marginBottom: 4 }}
      valuePropName="fileList"
      getValueFromEvent={normFile}
    >
      <Upload {...propsUploadTaiLieu} accept=".pdf" maxCount={1} className="upload-trinh-nop">
        <Button icon={<UploadOutlined />}>Tải lên</Button>
      </Upload>
    </Form.Item>
  </Col>
  <Col span={0}>
    <Form.Item
      {...restField}
      name={[name, "Category"]}
      fieldKey={[fieldKey, "Category"]}
      initialValue={loaiTaiLieu}
      style={{ marginBottom: 4 }}
    >
      <Input type="hidden" />
    </Form.Item>
  </Col>
</Row>
  );
}

export default TaiLieuDynamicItem;