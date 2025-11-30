// import thư viện
// useState là hook giúp tạo biến state — mỗi khi thay đổi, UI tự update
import { useState } from "react";
// import CSS để style giao diện
import "./CalculatorPage.css"
// khai báo 1 hàm tên CalculatorPage, hàm này chứa toàn bộ logic + UI
const CalculatorPage = () => {
  // khai báo state
  // input, output là tên biến state hiện tại, chứa các giá trị lần lượt là rỗng, null
  // setInput, setOutput là tên hàm cập nhật state, dùng để thay đổi giá trị của tên biến state hiện tại tương ứng
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
// khai báo một hàm có tên là handleClick
// value:tham số này nhận giá trị mới cần được thêm vào string
  const handleClick = (value) => {
    // kiểm tra nếu output ko phải giá trị null, nghĩa là đã có giá trị output được cập nhật
    if (output !== null) {
      // nếu mà giá trị nhập vô là operator
      if (/[+\-*/]/.test(value)) {
      // nối thêm vào output để tiếp tục tính
      setInput(output + value);
      // cập nhật output là null
      setOutput(null);
    } else {
      // nếu mà là số thì cập nhật output là null rồi nhận value cho input, tính cái mới
      setInput(value);
      setOutput(null);
    }
    return;
  }
    // cập nhật state 
    // prev: giá trị mới nhất và chính xác nhất của state input trước khi cập nhật state
    // prev + value: thực hiện phép nối chuỗi
    setInput((prev) => prev + value);
  };

// khai báo một hàm  có tên là handleClear
// reset toàn bộ state, đưa UI về trạng thái state ban đầu
  const handleClear = () => {
    setInput("");
    setOutput(null);
  };

  // 
  const validateExpression = (expr) => {
    //expr.trim(): xóa các khoảng trắng ở đầu và cuối chuỗi expr
  const clean = expr.trim();

  // chặn việc gửi yêu cầu rỗng
  // kiểm tra xem có phải giá trị trống
  if (clean === "") {
    // nếu phải thì trả về 1 thông báo, dùng return để kết thúc
    return "Error: No input! Please enter a calculation.";
  }

  // chặn biểu thức bắt đầu bằng toán tử nhân hoặc chia
  // /^ là tìm kiếm kí tự bắt đầu
  // [*/] trong ngoặc vuông là toán tử cần tìm
  // test(clean) kiểm tra xem giá trị của clean có khớp với /^[*/]/ ko, nếu có thì true, ko thì false
  if (/^[*/]/.test(clean)) {
    // nếu phải thì trả về 1 thông báo, dùng return để kết thúc
    return "Error: Expression cannot start with * or /";
  }

  // chặn biểu thức kết thúc bằng một phép tính hoặc dấu chấm
  //  /...$ là tìm kiếm kí tự kết thúc
  // +\-*/ là toán tử
  //  \. là dấu chấm thập phân
  if (/[+\-*/\.]$/.test(clean)) {
    return "Error: Expression cannot end with an operator or dot";
  }

  // /^[-+]? cho phép bắt đầu bằng + - hoặc (?) nghĩa là có thể là số chứ ko nhất thiết là + -
  // \d+(\.\d+)?: phần số nguyên(\d+) .phần thập phân (\.\d+) ? nghĩa là có hay ko cũng được
  // [+\-*/] toán tử
  // [-+]?\d+(\.\d+)? tiếp theo là  + hoặc - số hoặc chỉ số thôi, số có thể là số thập phân
  // * cho phép chuỗi phía trước lặp đi lặp lại, từ 1 phép tính đơn giản thì sẽ được phép lặp lại thành phép toán phức tạp hơn
  // $/ kết thúc mẫu tìm kiếm ngay tại cuối chuỗi
  // tất cả những thành phần trên được lưu vào 1 biến tên là validPattern theo thứ tự nhé
  const validPattern = /^[-+]?\d+(\.\d+)?([+\-*/][-+]?\d+(\.\d+)?)*$/;
// kiểm tra nếu giá trị trong validPattern có khớp với clean ko, nếu ko thì thực hiện return
  if (!validPattern.test(clean)) {
    return "Error: Invalid operator sequence (e.g., **, +*, -/)";
  }
// nếu khớp thì trả về null, nghĩa là valid
  return null; 
};

// khai báo 1 hàm tên handleEqual, dùng biểu thức bất đồng bộ, xử lí khi users bấm =
  const handleEqual = async () => {
    // khai báo biến tến errorMessage chứa giá trị trả về của hàm validateExpression nhận input
    const errorMessage = validateExpression(input);

    // nếu hợp lệ thì trả về null thì bỏ qua if, ko hợp lệ thì thực hiện if
    if (errorMessage) {
      // hiện ra thông báo được trả về từ validateExpression dưới dạng popup(alert)
      alert(errorMessage);
      // kết thức tại đây
      return;
    }
    // dùng try..catch để bắt lỗi
    try {
      // gửi req từ frontend lên backend 
      // khai báo 1 biến res chứa phản hồi từ backend
      // await bắt chờ cho đến khi nhận phản hồi
      // fetch chính là fetch API để tạo yêu cầu mạng 
      // http://localhost:8001/api chính là endpoint, /api là tuyến đường
      const res = await fetch("http://localhost:8001/api", {
        // phương thức HTTP POST
        method: "POST",
        headers: {
          // dữ liệu trong phần body được mã hóa dưới dạng JSON
          "Content-Type": "application/json",
        },
        // chuyển expression: input thành json để truyền qua mạng
        body: JSON.stringify({ expression: input }),
      });
      // khai báo biến data chứa dữ liệu phản hồi cuối cùng từ backend về frontend
      const data = await res.json();
      // !data.success nếu success trong backend là false thì thực hiện code trong if
    if (!data.success) {
      // hiện popup báo lỗi
      alert(data.message);  
      // kết thúc
      return;
    }

    // nếu success true thì cập nhật kết quả
    setOutput(data.result);
    // nếu có lỗi thì bắt lỗi và log ra error
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-cal">
    {/* khối hiển thị phép tính đang nhập hoặc kết quả phép tính */}
      <div className="top-cal">
      {/* kiểm tra nếu mà output không là null thì hiện output, nếu là null thì hiện input đang nhập hoặc 0 */}
        {output !== null ? output : input || "0"}
      </div>
    {/* khối chứa các kí tự máy tính, nút bấm = và nút bấm clear */}
      <div className="body-cal">
      {/* mảng kí tự */}
      {/* map là dùng để lặp tất cả các phần tử trong mảng */}
      {/* cứ mỗi vòng lặp bnt sẽ có 1 giá trị trong mảng*/}
        {[
          "1", "2", "3",
          "4", "5", "6",
          "7", "8", "9",
          "0", "+", "-", "*", "/", ".",
          "Clear", "=" 
        ].map((bnt) => (
          <button
          //key giúp React nhận diện từng button khi render danh sách
            key={bnt}
            // đặt class cho các nút là input-bnt nhưng riêng btn là Clear thì class là clear-bnt
            className={`input-bnt ${bnt === "Clear" ? "clear-bnt" : ""}`}
            // onClick xử lí khi được bấm
            onClick={() =>
            // bấm nút clear thì gọi hàm handleClear xử lí reset
            // nếu btn là dấu = thì gọi hàm handleEqual() trả về kết quả
            // không thì gọi hàm handleClick() thêm kí tự đó vào chuỗi input
              bnt ==="Clear"?handleClear():
              bnt === "=" ? handleEqual() : handleClick(bnt)
            }
          >
          {/* hiển thị giá trị btn thành button trên UI */}
            {bnt}
          </button>
        ))}
      </div>
      
    </div>
  );
};
//export default đối tượng CalculatorPage
export default CalculatorPage;
