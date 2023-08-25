import React, { useState } from "react";
import { Row, Col, Typography, Steps, Image, Divider, Collapse } from "antd";
import { ReadOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import { colors } from "../../utils";
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

function HuongDan() {
  const [current, setCurrent] = useState(0);

  const onChange = (currentNew) => {
    setCurrent(currentNew);
  };

  function renderContent() {
    if (current === 0) {
      return (
        <Col>
          <Divider />
          <Row>
            <Text strong>
              Để tiến hành nộp hồ sơ trực tuyến, nghiên cứu viên chính cần đăng
              ký tài khoản. Sau đó nộp lệ phí duy trì hàng năm tương ứng với
              loại tài khoản đã đăng ký bằng cách chuyển khoản tới:
              <br />
              <ul>
                <li>
                  Vietcombank:
                  <br />
                  Số tài khoản: 0123456789876543210
                  <br />
                  Chủ tài khoản: Bệnh viện K
                </li>
                <li>
                  Techcombank:
                  <br />
                  Số tài khoản: 0123456789876543210
                  <br />
                  Chủ tài khoản: Bệnh viện K
                </li>
              </ul>
              Sau khi nộp lệ phí, xin vui lòng liên hệ với thư ký để được kích
              hoạt tài khoản.
              <br />
              Sau khi tài khoản được kích hoạt, bạn có thể đăng nhập vào hệ
              thống.
            </Text>
          </Row>
          <Row gutter={[40, 40]} style={{ marginTop: 10 }}>
            <Col span={12}>
              <Image src="/files/imgs/huongdan/Dang_ky.PNG" />
            </Col>
            <Col span={12}>
              <Image src="/files/imgs/huongdan/Dang_nhap.PNG" />
            </Col>
          </Row>
        </Col>
      );
    } else if (current === 1) {
      return (
        <Col>
          <Divider />
          <Row>
            <Text strong>
              Trong mục "Hồ sơ", ấn vào nút "Tạo hồ sơ". Sau đó điền đầy đủ
              thông tin và đính kèm các tài liệu cần thiết.
            </Text>
          </Row>
          <Row>
            <Paragraph>
              <Text strong>
                Ngoại trừ Hóa đơn lệ phí có thể dạng ảnh thì các tài liệu tải
                lên cần để ở định dạng pdf. Tài liệu được chia làm 5 mục:
              </Text>
              <ul>
                <li>Đề cương/Thuyết minh đề mục.</li>
                <li>Bệnh án nghiên cứu.</li>
                <li>Chấp thuận tham gia nghiên cứu ICF.</li>
                <li>Thuyết trình đề tài.</li>
                <li>Tài liệu khác.</li>
              </ul>
            </Paragraph>
          </Row>
          <Row gutter={[40, 40]}>
            <Col span={12}>
              <Image src="/files/imgs/huongdan/Ho_so_1.PNG" />
            </Col>
            <Col span={12}>
              <Image src="/files/imgs/huongdan/Ho_so_2.PNG" />
            </Col>
          </Row>
        </Col>
      );
    } else if (current === 2) {
      return (
        <Col>
          <Divider />
          <Row>
            <Text strong>
              Người nộp hồ sơ có thể bổ sung thêm các tài liệu trong mục "Bổ
              sung tài liệu":
            </Text>
          </Row>
          <Row gutter={[40, 40]} style={{ marginTop: 10 }}>
            <Col span={12}>
              <Image src="/files/imgs/huongdan/Bo_sung.PNG" />
            </Col>
          </Row>
        </Col>
      );
    } else if (current === 3) {
      return (
        <Col>
          <Divider />
          <Row>
            <Text strong>
              Sau khi thư ký tổng hợp và xin ý kiến của hội đồng sẽ gửi kết quả
              xét duyệt cho Nghiên cứu viên. Để xem kết quả xét duyệt, ấn vào
              xem chi tiết hồ sơ, sẽ có mục "Kết quả xét duyệt" ở phía dưới.
              Nghiên cứu viên có thể tải file kết quả của mình về.
            </Text>
          </Row>
          <Row gutter={[40, 40]} style={{ marginTop: 10 }}>
            <Col span={12}>
              <Image src="/files/imgs/huongdan/Ket_qua.PNG" />
            </Col>
          </Row>
        </Col>
      );
    }
  }

  return (
    <Col>
      <Row>
        <ReadOutlined
          style={{
            fontSize: "28px",
            color: colors.title,
            marginRight: 10,
          }}
        />
        <Title style={{ color: colors.title }} level={4}>
          HƯỚNG DẪN NỘP HỒ SƠ
        </Title>
      </Row>
      <Row style={{ marginTop: 10, marginBottom: 40 }}>
        <Steps current={current} onChange={onChange}>
          <Step
            title="Bước 1"
            description="Đăng ký tài khoản và đăng nhập hệ thống"
          />
          <Step title="Bước 2" description="Tạo Hồ sơ xin xét duyệt" />
          <Step title="Bước 3" description="Nộp bổ sung tài liệu cần thiết" />
          <Step title="Bước 4" description="Nhận kết quả xét duyệt" />
        </Steps>
        {renderContent()}
      </Row>

      <Row>
        <QuestionCircleOutlined
          style={{
            fontSize: "28px",
            color: colors.title,
            marginRight: 10,
          }}
        />
        <Title style={{ color: colors.title }} level={4}>
          NHỮNG CÂU HỎI THƯỜNG GẶP
        </Title>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse accordion>
            <Panel
              header="Câu 1: Tại sao tôi không truy cập được phần Hồ sơ?"
              key="1"
            >
              <Paragraph>
                <ul>
                  <li>
                    Để nộp hồ sơ bạn cần đăng ký một tài khoản. Sau đó nộp lệ
                    phí duy trì hàng năm tương ứng với loại tài khoản bạn đăng
                    ký.
                  </li>
                  <li>
                    Sau khi nộp lệ phí, xin vui lòng liên hệ với thư ký để được
                    kích hoạt tài khoản.
                  </li>
                  <li>
                    Khi tài khoản bạn được kích thoạt, lúc này bạn đã có thể
                    truy cập vào mục Hồ sơ và tiến hành nộp hồ sơ tới hội đồng
                    xét duyệt.
                  </li>
                </ul>
              </Paragraph>
            </Panel>
            <Panel header="Câu 2: Tại sao tôi không nộp được hồ sơ?" key="2">
              <Paragraph>
                <ul>
                  <li>
                    Hệ thống yêu cầu cần điền đầy đủ thông tin, ngoài mục "Mô tả
                    chi tiết" và "Tài liệu khác" ra thì các trường thông tin
                    khác là bắt buộc.
                  </li>
                  <li>
                    Các tài liệu đính kèm hồ sơ phải để ở định dạng file pdf.
                    Trừ file lệ phí có thể để ở dạng ảnh.
                  </li>
                  <li>
                    Sau khi ấn "Nộp ngay" hệ thống sẽ tiến hành kiểm tra xem các
                    thông tin khai báo đã đầy đủ và hợp lệ chưa. Nếu chưa thỏa
                    mãn điều kiện sẽ có thông báo cho người nộp hồ sơ để tiến
                    hành hổ sung, chỉnh sửa.
                  </li>
                </ul>
              </Paragraph>
            </Panel>
            <Panel header="Câu 3: Tôi nộp lệ phí xét duyệt khi nào?" key="3">
              <Paragraph>
                Nghiên cứu viên chính chỉ nộp lệ phí xét duyệt khi có thông báo
                bằng email của Hội đồng về Quy trình xét duyệt và Lệ phí xét
                duyệt. Email thông báo này sẽ được gửi trong vòng 05 ngày sau
                khi bản cứng Hồ sơ nghiên cứu đã được tiếp nhận thành công.
              </Paragraph>
            </Panel>
            <Panel
              header="Câu 4: Tôi nộp lệ phí xét duyệt bằng cách nào?"
              key="4"
            >
              <Col>
                <Row>
                  <Paragraph>
                    Người nộp hồ sơ sau khi nộp hồ sơ bản cứng tới hội đồng sẽ
                    tiến hành nộp lệ phí theo hình thức chuyển khoản online tới
                    tài khoản:
                    <br />
                    <ul>
                      <li>
                        Vietcombank:
                        <br />
                        Số tài khoản: 0123456789876543210
                        <br />
                        Chủ tài khoản: Bệnh viện K
                      </li>
                      <li>
                        Techcombank:
                        <br />
                        Số tài khoản: 0123456789876543210
                        <br />
                        Chủ tài khoản: Bệnh viện K
                      </li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    Sau đó tiến hành nộp hồ sơ online. Trong mục Lệ phí chọn mức
                    lệ phí mình đóng và kèm theo là file hóa đơn chuyển khoản:
                  </Paragraph>
                </Row>
                <Row>
                  <Image
                    width={"50%"}
                    src="/files/imgs/huongdan/Nop_le_phi.PNG"
                  />
                </Row>
              </Col>
            </Panel>
            <Panel
              header="Câu 5: Tiêu chí đánh giá khía cạnh đạo đức đối với Hồ sơ Nghiên cứu là gì?"
              key="5"
            >
              <Collapse accordion>
                <Panel
                  header="1. Ý nghĩa/tác động của nghiên cứu đối với bệnh nhân nói riêng và xã hội nói chung (Social and clinical value)"
                  key="1"
                >
                  <Paragraph>
                    Mỗi nghiên cứu đều được thiết kế để trả lời một câu hỏi cụ
                    thể (research question). Vậy việc trả lời câu hỏi nghiên cứu
                    có đóng góp những giá trị gì cho xã hội, hoặc cho hiện tại
                    và tương lai của người tham gia nghiên cứu? Việc trả lời câu
                    hỏi nghiên cứu có thực sự quan trọng và xứng đáng để những
                    người tham gia nghiên cứu chấp nhận những nguy cơ và bất lợi
                    khi đồng ý tham gia nghiên cứu? Nói cách khác, việc trả lời
                    câu hỏi nghiên cứu sẽ đóng góp kiến thức khoa học y học hoặc
                    góp phần cải thiện các biện pháp phòng chống, điều trị hoặc
                    chăm sóc con người. Chỉ như vậy mới biện giải được lý do lấy
                    đối tượng nghiên cứu tham gia là con người.
                  </Paragraph>
                </Panel>
                <Panel
                  header="2. Giá trị khoa học (Scientific validity)"
                  key="2"
                >
                  <Paragraph>
                    Giá trị khoa học của nghiên cứu được xem xét trước tiên ở
                    Câu hỏi nghiên cứu. Câu hỏi nghiên cứu có đáng giá hay
                    không, mục tiêu nghiên cứu phù hợp hay không, thiết kế
                    nghiên cứu có trả lời được câu hỏi nghiên cứu, phương
                    pháp/công cụ nghiên cứu có khả thi và đáng tin cậy hay
                    không, lực mẫu có đủ mạnh để kiểm chứng/chứng minh mục
                    tiêu/giả thuyết hay không? Một nghiên cứu không có giá trị
                    khoa học cũng đồng nghĩa với việc vi phạm đạo đức nghiên cứu
                    vì lãng phí nguồn lực và lạm dụng đối tượng nghiên cứu là
                    con người.
                  </Paragraph>
                </Panel>
                <Panel
                  header="3. Đảm bảo công bằng trong lựa chọn người tham gia nghiên cứu (Fair subject selection)"
                  key="3"
                >
                  <Paragraph>
                    Cần lựa chọn người nào tham gia vào nghiên cứu để đảm bảo
                    trả lời được câu hỏi nghiên cứu? Các tiêu chuẩn lựa chọn
                    người tham gia cần nhất quán với câu hỏi và mục tiêu nghiên
                    cứu trên nguyên tắc giảm thiểu rủi ro và tối đa lợi ích cho
                    cá nhân và cho xã hội. Những cá nhân/nhóm đối tượng chấp
                    nhận rủi ro khi tham gia nghiên cứu, đồng nghĩa với việc họ
                    có quyền hưởng lợi từ nghiên cứu mang lại, trái lại những
                    người có thể hưởng lợi từ nghiên cứu cũng nên chia sẻ những
                    nguy cơ hoặc gánh nặng từ nghiên cứu. Những nhóm người (như
                    phụ nữ hoặc trẻ em) không nên bị loại trừ cơ hội tham gia
                    nghiên cứu mà không có lý do khoa học chính đáng/hoặc nguy
                    cơ đặc biệt với nhóm người này. Nói cách khác, nghiên cứu
                    viên chính cần có lý do chính đáng tại sao không tuyển chọn
                    người tham gia nghiên cứu là phụ nữ hoặc trẻ em vào nghiên
                    cứu.
                  </Paragraph>
                </Panel>
                <Panel
                  header="4. Cân bằng Lợi ích - Rủi ro đối với người tham gia nghiên cứu (Favorable risk-benefit ratio)"
                  key="4"
                >
                  <Paragraph>
                    Rủi ro, rủi ro tiềm tàng mà một người có thể gặp phải khi
                    tham gia nghiên cứu là gì? Những lợi ích hiện tại, lợi ích
                    trong tương lai mà người tham gia nghiên cứu có thể được
                    hưởng, hoặc lợi ích đối với xã hội, kinh tế v.v.. của nghiên
                    cứu là gì? Cân bằng lợi ích- rủi ro của nghiên cứu? Nghiên
                    cứu viên chính có mô tả những biện pháp để giảm thiểu rủi ro
                    và tăng cường lợi ích hay không? Những biện pháp này có phù
                    hợp/tác dụng hay không?
                  </Paragraph>
                </Panel>
                <Panel
                  header="5. Người tham gia nghiên cứu tự nguyện đồng ý tham gia sau khi được Cung cấp đầy đủ thông tin về nghiên cứu (Informed consent)"
                  key="5"
                >
                  <Paragraph>
                    Bản cung cấp Thông tin cho người tham gia nghiên cứu cần bao
                    gồm thông tin chính xác về mục tiêu nghiên cứu, phương pháp
                    tiến hành, nguy cơ/rủi ro, lợi ích và các phương pháp can
                    thiệp thay thế; Thông tin giải thích mối liên quan giữa
                    nghiên cứu với tình trạng bệnh tật/mối quan tâm của đối
                    tượng nghiên cứu và đối tượng nghiên cứu tham gia một cách
                    tự nguyện/không bắt buộc
                  </Paragraph>
                  <Paragraph>
                    Nếu người được mời tham gia nghiên cứu là trẻ em, người bệnh
                    Alzheimer, người mất ý thức do não bị chấn thương hoặc người
                    mắc rối loạn sức khoẻ tâm thần vv… thì cần có sự đồng ý của
                    người giám hộ/đại diện hợp pháp
                  </Paragraph>
                </Panel>
                <Panel
                  header="6. Tôn trọng đối tượng tiềm năng/tham gia nghiên cứu (Respect for potential and enrolled subjects)"
                  key="6"
                >
                  <Paragraph>
                    Người tham gia nghiên cứu cần được đối xử với thái độ tôn
                    trọng cho dù họ đồng ý hay không đồng ý tham gia, nội dung
                    này cần được thể hiện đầy đủ trong hồ sơ nghiên cứu bao gồm:
                    tôn trọng quyền riêng tư, bí mật thông tin; tôn trọng quyết
                    định thay đổi/rút lui khỏi nghiên cứu; thông báo cho người
                    tham gia bất kỳ thay đổi nào trong đề cương nghiên cứu có
                    thể làm ảnh hưởng đến quyết định tiếp tục hay rút lui khỏi
                    nghiên cứu; theo dõi và chăm sóc sức khoẻ của bệnh nhân khi
                    tham gia nghiên cứu; thông báo cho bệnh nhân dừng nghiên cứu
                    khi cần thiết và thông báo/chia sẻ kết quả nghiên cứu tới
                    người tham gia sau khi kết thúc nghiên cứu.
                  </Paragraph>
                </Panel>
                <Panel
                  header="7. Cơ chế giám sát độc lập (Independent Monitoring)"
                  key="7"
                >
                  <Paragraph>
                    Nghiên cứu Thử nghiệm lâm sàng cần được giám sát thực hiện
                    bởi Cơ quan tài trợ, Hội đồng đạo đức và Ban giám sát An
                    toàn và Dữ liệu (DSMB) theo Quy ước quốc tế.
                  </Paragraph>
                </Panel>
                <Panel
                  header="8. Năng lực nhóm nghiên cứu, cơ quan chủ trì nghiên cứu và cơ quan phối hợp?"
                  key="8"
                >
                  <Paragraph>
                    Xem xét về chứng chỉ/đào tạo chuyên môn, về năng lực nghiên
                    cứu thông qua các công bố khoa học, về đáp ứng GCP trong
                    nghiên cứu. Nghiên cứu viên chính và các thành viên nghiên
                    cứu chính phải độc lập với Đơn vị tài trợ/Công ty dược
                    phẩm/sản xuất công nghệ thử nghiệm. Nói cách khác Nghiên cứu
                    viên chính không có mâu thuẫn lợi ích để đảm bảo tiến hành
                    nghiên cứu và báo cáo kết quả một cách trung thực nhất,
                    không vì bất kỳ một lợi ích nào khác làm sai lệch kết quả
                    nghiên cứu. Xem xét về đáp ứng GCP trong nghiên cứu TNLS, về
                    cơ sở vật chất/nhân sự đáp ứng nhu cầu triển khai nghiên
                    cứu, Thư ủng hộ/đồng ý tham gia nghiên cứu của các đơn vị
                    phối hợp.
                  </Paragraph>
                </Panel>
                <Panel
                  header="9. Tính đầy đủ, hợp lệ của Hồ sơ sản phẩm thử nghiệm (thuốc, công nghệ)?"
                  key="9"
                >
                  <Paragraph>
                    Hồ sơ về sản phẩm thử nghiệm được trình bày đầy đủ kèm theo
                    minh chứng và chứng nhận pháp lý theo quy định.
                  </Paragraph>
                </Panel>
              </Collapse>
            </Panel>
            <Panel
              header="Câu 6: Sau khi nhận được Biên bản tổng hợp ý kiến đánh giá của Hội đồng, Nghiên cứu viên chính sẽ làm gì tiếp theo?"
              key="6"
            >
              <Col>
                <Paragraph>
                  Nghiên cứu viên chính sẽ nhận được Biên bản tổng hợp ý kiến
                  nhận xét của Hội đồng qua email thông báo. Sau khi nhận được
                  email thông báo, NCVC hãy truy cập hệ thống trực tuyến để nhận
                  Biên bản.
                </Paragraph>
                <Paragraph>
                  Một hồ sơ nghiên cứu sẽ được xếp loại đánh giá theo 3 mức như
                  sau:<br></br>
                  1. Không chấp thuận theo các lý do ghi rõ trong Biên bản tổng
                  hợp ý kiến nhận xét của Hội đồng<br></br>
                  2. Chấp thuận, không cần sửa chữa/ bổ sung<br></br>
                  3. Chấp thuận, đề nghị sửa chữa theo nội dung góp ý của Hội
                  đồng
                </Paragraph>
                <Paragraph>
                  Xếp loại 1 (Không chấp thuận), về lý thuyết nếu Hồ sơ nghiên
                  cứu được đánh giá ở mức 1, NCVC sẽ không cần hoàn thiện Hồ sơ
                  nghiên cứu và Hệ thống xét duyệt của Hội đồng đạo đức sẽ đóng
                  và lưu hồ sơ. Tuy nhiên, NCVC có thể gửi Giải trình tới Hội
                  đồng để làm rõ những nội dung có thể làm thay đổi quyết định
                  của Hội đồng. Trong trường hợp này, NCVC tiến hành các bước
                  hoàn thiện hồ sơ tương tự Hồ sơ được đánh giá xếp loại 3.
                </Paragraph>
                <Paragraph>
                  Xếp loại 2 (Chấp thuận, không cần sửa chữa/bổ sung), NCVC sẽ
                  đồng thời nhận Biên bản và Chứng nhận chấp thuận của Hội đồng
                  để triển khai nghiên cứu.
                </Paragraph>
                <Paragraph>
                  Xếp loại 3 (Chấp thuận, đề nghị sửa chữa theo nội dung góp ý
                  của Hội đồng), NCVC cần quay trở lại Hồ sơ nghiên cứu trên hệ
                  thống để hoàn thiện Hồ sơ theo ý kiến tại Biên bản.
                </Paragraph>
              </Col>
            </Panel>
            <Panel
              header="Câu 7: Đề tài Người nộp hồ sơ của em là tự xin tài trợ một phần, không thuộc nhánh của đề tài nào thì phần: Cơ quan chủ trì, chủ nhiệm đề tài và thư ký đề tài là thông tin của chính em đúng không ạ?"
              key="7"
            >
              <Paragraph>
                Trước tiên, đề tài này được phân loại vào dạng đề tài nghiên cứu
                của Người nộp hồ sơ tại Bệnh viện K. Do vậy, Đơn vị chủ trì là
                Bệnh viện K. Theo quy định chung, đơn vị nhận tiền tài trợ và
                quản lý kinh phí sẽ được coi là Đơn vị đồng chủ trì của Đề tài
                này.
              </Paragraph>
              <Paragraph>
                Trong phần III. Thông tin của đơn vị phối hợp, NCVC cần nêu Đơn
                vị tài trợ cho nghiên cứu có kèm theo Thư xác nhận tài trợ kinh
                phí có đầy đủ chữ ký và dấu của nhà tài trợ. Đơn vị phối hợp là
                những đơn vị có tham gia vào nghiên cứu với các vai trò khác
                nhau: ví dụ, đơn vị tài trợ kinh phí, đơn vị thu tuyển bệnh
                nhân, đơn vị phân tích và xử lý số liệu v.v.... Trong hồ sơ
                nghiên cứu, tại phần III, NCVC cần nêu đầy đủ các thông tin về
                đơn vị phối hợp.
              </Paragraph>
            </Panel>
            <Panel
              header="Câu 8: Tôi có thể liên hệ với thư ký hội đồng bằng cách nào?"
              key="8"
            >
              <Paragraph>
                Để liên hệ với thư ký bạn có thể liên hệ tới một số cách sau:
              </Paragraph>
              <Paragraph>
                <ul>
                  <li>Số điện thoại: 0904 748 808, 0904 592 017</li>
                  <li>Địa chỉ email: benhvienk@bvk.org.vn</li>
                </ul>
              </Paragraph>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </Col>
  );
}

export default HuongDan;
