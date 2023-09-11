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

function TaiLieuDynamicItem({
  name,
  fieldKey,
  restField,
  IsRequired,
  loaiTaiLieu,
  propsUploadTaiLieu,
  autoCompleteData,
}) {
  const [isChecked, setIsChecked] = useState(IsRequired);

  return (
    <Row align="top">
      <Col span={1} style={{ textAlign: 'center' }}>
        <Form.Item
          {...restField}
          name={[name, 'IsChecked']}
          fieldKey={[fieldKey, 'IsChecked']}
          hasFeedback
          valuePropName="checked"
        >
          <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}></Checkbox>
        </Form.Item>
      </Col>
      <Col span={8} style={{ paddingRight: 4 }}>
        <Form.Item
          {...restField}
          name={[name, 'DocNameVN']}
          fieldKey={[fieldKey, 'DocNameVN']}
          rules={[{ required: isChecked, message: 'Thông tin bắt buộc' }]}
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
          name={[name, 'VersionAndDate']}
          fieldKey={[fieldKey, 'VersionAndDate']}
          rules={[{ required: isChecked, message: 'Thông tin bắt buộc' }]}
          hasFeedback
          style={{ marginBottom: 4 }}
        >
          <Input placeholder="Phiên bản/ngày" />
        </Form.Item>
      </Col>
      <Col span={7}>
        {isChecked && (
          <Form.Item
            {...restField}
            name={[name, 'FileData']}
            fieldKey={[fieldKey, 'FileData']}
            rules={[{ required: isChecked, message: 'Hãy đính kèm file' }]}
            hasFeedback
            style={{ marginBottom: 4 }}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload {...propsUploadTaiLieu} accept=".pdf" maxCount={1} className="upload-trinh-nop">
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            </Upload>
          </Form.Item>
        )}
      </Col>
      <Col span={0}>
        <Form.Item
          {...restField}
          name={[name, 'Category']}
          fieldKey={[fieldKey, 'Category']}
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
