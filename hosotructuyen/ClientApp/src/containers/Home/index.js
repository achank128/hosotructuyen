import React from "react";
import { Row, Col, Image, Typography } from "antd";
import { colors } from "../../utils";

const { Title, Text, Paragraph } = Typography;

function Home() {
  // const contentStyle = {
  //   // height: "550",
  //   // background: "#364d79",
  //   // color: "#fff",
  //   lineHeight: "0px",
  //   textAlign: "center",
  // };

  return (
    <Col>
      {/* <Carousel autoplay>
        <div>
          <h3 style={contentStyle}>
            <Image preview={false} src="/files/imgs/home/banner1.jpg" />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image preview={false} src="/files/imgs/home/banner2.jpg" />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image preview={false} src="/files/imgs/home/banner3.jpg" />
          </h3>
        </div>
      </Carousel> */}
      <Row>
        <Image preview={false} src="/files/imgs/home/banner1.jpg" />
      </Row>
      <Row gutter={[40, 40]} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Row style={{ marginBottom: 20 }}>
            <Title level={5} style={{ color: colors.title }}>
              GIỚI THIỆU BỆNH VIỆN K
            </Title>
            <Paragraph>
              Ngày 17 tháng 7 năm 1969, được sự đồng ý của Chính phủ, Bộ trưởng
              Bộ Y tế ra quyết định số 711/QĐ-BYT thành lập Bệnh viện K được
              thành lập từ tiền thân là Viện Curie Đông Dương (Insitut Curie de
              L’Indochine) ra đời tại Hà Nội vào ngày 19/10/1923 do Luật sư
              Mourlan phụ trách.. Bệnh viện với 3 cơ sở khang trang, sạch sẽ và
              nhiều trang thiết bị hiện đại sánh ngang tầm với các quốc gia
              trong khu vực. Hiện nay, 3 cơ sở khám chữa bệnh trên địa bàn Hà
              Nội đó là:
              <ul>
                <li>
                  Cơ sở 1: Số 43 Quán Sứ, Hoàn Kiếm, Hà Nội và số 9A-9B Phan Chu
                  Trinh, Hoàn Kiếm, Hà Nội.
                </li>
                <li>Cơ sở 2: Tựu Liệt, Tam Hiệp, Thanh Trì, Hà Nội.</li>
                <li>
                  Cơ sở 3: cơ sở Tân Triều, số 30 Cầu Bươu, Thanh Trì, Hà Nội.
                </li>
              </ul>
            </Paragraph>
            <Paragraph>
              Bệnh viện hiện có 77 viện, trung tâm, khoa, phòng, bộ phận trực
              thuộc với hơn 1.700 cán bộ, người lao động.
              <br />
              Điểm trung bình chung của các tiêu chí chất lượng bệnh viện là
              4,29 điểm (so với năm 2018 là 4,05 điểm; năm 2019 là 4,06 điểm).
              Tỷ lệ hài lòng của người bệnh cũng tăng hơn so với những năm trước
              đó với 95,6% (so với năm 2018 là 91,5%, năm 2019 là 94,5%).
            </Paragraph>
          </Row>
          <Row>
            <Title level={5} style={{ color: colors.title }}>
              QUYẾT ĐỊNH THÀNH LẬP HỘI ĐỒNG ĐẠO ĐỨC
            </Title>
            <Paragraph>
              Căn cứ Thông tư số 4/TT-BYT ngày 05/3/2020 của Bộ Y tế Quy định
              việc thành lập, chức năng, nhiệm vụ và quyền hạn của Hội đồng đạo
              đức trong nghiên cứu y sinh học.
            </Paragraph>
            <Paragraph>
              Căn cứ Quyết định số 711/BYT-QĐ ngày 17/7/1969 của Bộ trưởng Bộ Y
              tế về việc thành lập Bệnh viện K.
            </Paragraph>
            <Paragraph>
              Căn cứ Quyết định số 5737/QĐ-BYT ngày 26/9/2018 của Bộ trưởng Bộ Y
              tế về việc ban hành Quy chế Tổ chức và Hoạt động của Bệnh viện K,
              trực thuộc Bộ Y tế.
            </Paragraph>
            <Paragraph>
              Theo đề nghị của Ông (Bà) Giám đốc Trung tâm Nghiên cứu lâm sàng,
              Trưởng phòng Kế hoạch Tổng hợp và Trưởng phòng Tổ chức cán bộ.
            </Paragraph>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Text strong>
              Quyết định thành lập Hội đồng đạo đức trong Nghiên cứu Y sinh học
              bệnh viện K, nhiệm kỳ 2021-2026.
            </Text>
          </Row>
          <Row>
            <Paragraph>
              Hội đồng đạo đức trong nghiên cứu y sinh học bệnh viện, nhiệm kỳ
              2021-2026 có nhiệm vụ đánh giá, xét duyệt về khía cạnh đạo đức và
              khoa học có liên quan đối với các nghiên cứu y sinh học được triển
              khai tại Bệnh viện theo đúng quy định của pháp luật; kiểm tra,
              giám sát việc triển khai thực hiện; đánh giá đề cương nghiên cứu
              và kết quả nghiên cứu đối với các nghiên cứu y sinh học có đối
              tượng nghiên cứu là con người thực hiện tại bệnh viện và tư vấn
              cho Giám đốc xem xét phê duyệt.
            </Paragraph>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Title level={5} style={{ color: colors.title }}>
              QUY TRÌNH NHẬN VÀ XỬ LÝ HỒ SƠ TRỰC TUYẾN
            </Title>
          </Row>
          <Row>
            <Col span={22}>
              <Image preview={false} src="/files/imgs/home/quytrinh.PNG" />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Image.PreviewGroup>
            <Row>
              <Image
                style={{
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: colors.inputRequire,
                  marginBottom: -1,
                }}
                src="/files/imgs/quyetdinh1.jpg"
              />
            </Row>
            <Row>
              <Image
                style={{
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: colors.inputRequire,
                }}
                src="/files/imgs/quyetdinh2.jpg"
              />
            </Row>
          </Image.PreviewGroup>
        </Col>
      </Row>
    </Col>
  );
}

export default Home;
