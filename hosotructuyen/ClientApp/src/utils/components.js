import React from "react";
import { Popover, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export function ButtonGoiYLePhi() {
  let goiYContent = (
    <div>
      <p>• <b>Mức 1</b> áp dụng cho Thử nghiệm lâm sàng</p>
      <p>• <b>Mức 2</b> áp dụng cho Nghiên cứu can thiệp khác</p>
      <p>• <b>Mức 3</b> áp dụng cho Nghiên cứu không can thiệp</p>
      <p>• <b>Mức 4</b> áp dụng cho các nghiên cứu cấp cơ sở, luận văn, luận án</p>
    </div>
  );
  return (
    <Popover title="Gợi ý mức lệ phí" content={goiYContent}>
      <Typography.Text type="secondary" style={{cursor : "help"}}>
        <QuestionCircleOutlined />
      </Typography.Text>
    </Popover>
  );
}
