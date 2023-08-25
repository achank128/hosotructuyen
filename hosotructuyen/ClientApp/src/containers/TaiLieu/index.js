import React from "react";
import { Row, Col, Typography, Alert } from "antd";
import { connect } from "react-redux";
import { FileTextOutlined } from "@ant-design/icons";
import { colors, notify } from "../../utils";
import Login from "../Login";

const { Title, Paragraph, Text, Link } = Typography;

function KhoTaiLieu({ token, userInfo }) {
  if (!token || !userInfo) {
    return <Login />;
  } else if (userInfo.TrangThai !== "Đã kích hoạt") {
    return (
      <Col>
        <Alert
          message={notify.requireActive}
          description={notify.requireActiveDescription}
          type="error"
          showIcon
        />
      </Col>
    );
  }

  return (
    <Col>
      <Row>
        <FileTextOutlined
          style={{
            fontSize: "28px",
            color: colors.title,
            marginRight: 10,
          }}
        />
        <Title style={{ color: colors.title }} level={4}>
          BIỂU MẪU ĐÍNH KÈM HỒ SƠ XIN XÉT DUYỆT
        </Title>
      </Row>
      <Row style={{ marginTop: 10, marginBottom: 20 }}>
        <Paragraph>
          <Text strong>
            Nghiên cứu viên chính chuẩn bị trước các tài liệu sau để đính kèm
            vào Hồ sơ xin xét duyệt.
          </Text>
          <br></br>
          (Tài liệu cần định dạng pdf. Đầy đủ ngày tháng năm, chữ ký và dấu theo
          quy định.)
        </Paragraph>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>Phần 1: Thông tin chung của đề tài</Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>
                  Đơn xin xét duyệt khía cạnh đạo đức trong nghiên cứu y sinh
                  học{" "}
                  <Link href="/files/docs/Mau01_DonXinXetDuyet.docx">
                    (Mẫu 01)
                  </Link>
                </li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>
              Phần 2: Thông tin chứng nhận chấp thuận đạo đức
            </Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>Không yêu cầu đính kèm file</li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>Phần 3: Thông tin nhóm nghiên cứu</Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>
                  Lý lịch khoa học của cá nhân{" "}
                  <Link href="/files/docs/Mau02_LyLichKhoaHoc.doc">
                    (Mẫu 02)
                  </Link>
                </li>
                <li>Chứng chỉ GCP của nghiên cứu viên</li>
                <li>Sơ đồ tổ chức nhóm nghiên cứu</li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>
              Phần 4: Thông tin của đơn vị phối hợp triển khai nghiên cứu
            </Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>Thư ủng hộ của đơn vị phối hợp</li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>Phần 5: Nội dung nghiên cứu</Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>Tóm tắt nội dung nghiên cứu (01 trang A4)</li>
                <li>
                  Thuyết minh chi tiết{" "}
                  <Link href="/files/docs/Mau03_ThuyetMinhDeCuong.doc">
                    (Mẫu 03)
                  </Link>
                </li>
                <li>
                  Báo cáo tiến độ{" "}
                  <Link href="/files/docs/Mau04_BaoCaoTienDo.docx">
                    (Mẫu 04)
                  </Link>
                </li>
                <li>Báo cáo nghiệm thu khoa học</li>
                <li>Tài liệu tham khảo (AMA style)</li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>Phần 6: Thông tin về sản phẩm thử nghiệm</Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>Tóm tắt về sản phẩm thử nghiệm (01 trang A4)</li>
                <li>
                  Các tài liệu minh chứng về sản phẩm thử nghiệm (nối trong 01
                  file pdf)
                </li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>
              Phần 7: Thông tin chiến lược đảm bảo đạo đức nghiên cứu
            </Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>Quy trình tuyển chọn và duy trì tham gia nghiên cứu</li>
                <li>Khung thời gian tuyển chọn người tham gia nghiên cứu</li>
                <li>
                  Bản cung cấp thông tin cho người tham gia nghiên cứu{" "}
                  <Link href="/files/docs/Mau06_BanCungCapThongTinChoNguoiKhacThamGiaNghienCuu.docx">
                    (Mẫu 06)
                  </Link>
                </li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Title level={5}>Phần 8: Các tài liệu khác</Title>
          </Row>
          <Row>
            <Paragraph>
              <ul>
                <li>
                  Phần 8 được thiết kế để Nghiên cứu viên chính đính kèm/upload
                  các tài liệu cần thiết khác.
                  <br />
                  Ví dụ Mẫu bệnh án nghiên cứu, Phiếu thu thập thông tin nghiên
                  cứu (bắt buộc), Quy trình triển khai nghiên cứu, Đề cương gốc
                  bằng tiếng nước ngoài (nếu là đề tài hợp tác) và các tài liệu
                  khác.
                </li>
              </ul>
            </Paragraph>
          </Row>
          <Row>
            <Text strong>
              Đối với Đề tài của học viên Sau đại học sau khi thông qua Hội đồng
              khoa học/tiểu ban chuyên môn theo quy định của chương trình đào
              tạo sau đại học, yêu cầu NCVC đính kèm những tài liệu sau:
            </Text>
            <Paragraph>
              <ul>
                <li>Biên bản họp Hội đồng khoa học/tiểu ban chuyên môn</li>
                <li>
                  Quyết định công nhận tên đề tài luận văn/luận án (nếu có)
                </li>
                <li>
                  <Link href="/files/docs/Mau07_CongVanGiaiTrinhHoanThienHoSoTheoYKienHoiDong.docx">
                    Mẫu 07
                  </Link>{" "}
                  áp dụng cho lần Nộp hoàn thiện Hồ sơ theo ý kiến góp ý của Hội
                  đồng
                </li>
              </ul>
            </Paragraph>
          </Row>
        </Col>
      </Row>
    </Col>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

export default connect(mapStateToProps, null)(KhoTaiLieu);
