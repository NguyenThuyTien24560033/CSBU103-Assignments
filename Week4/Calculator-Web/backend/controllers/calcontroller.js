// đây là nơi xử lí logic tính của hàm 
// xuất một hàm được khai báo có tên là calculate
// nhận hai đối tượng là req và res, dùng hàm mũi tên
export const calculate = (req, res) => {
    // tìm tới một thuộc tính có tên là expression trong red.body
    // truy cập vào body của req, đây là nơi chứa dữ liệu JSON gửi từ frontend
    const { expression } = req.body;
    // kiểm tra xem dữ liệu gửi từ frontend(expression) có tồn tại hoặc invalid ko(!expression) và nó có khác kiểu string ko
    if (!expression || typeof expression !== "string") {
        // nếu có thì dừng lại và thiết lập một mã trạng thái có htpp là 400 
        // trả về client 1 phản hồi json 
        return res.status(400).json({
            // báo hiệu thất bại và ra thông báo lỗi
            success: false,
            message: "Expression is required and must be a string"
        });
    }

    try {
        // khai báo 1 biến tên result chứ giá trị phép tính trả về sau khi tính toán
        // Function là 1 hàm tạo, tạo 1 hàm mới từ 1 chuỗi
        // '+ expression +' chèn vào biểu thức expression
        // Sau khi Function tạo 1 hàm mới + () thì hàm sẽ được gọi ngay và trả về kết quả của biểu thức
        const result = Function(' return (' + expression + ')')();

        // kiểm tra xem kiểu dữ liệu của result là number, nếu ko thì thực thi code trong lệnh if
        // isFinite(result) kiểm tra xem kết quả trả biểu thức có hữu hạn ko, trong trường hợp /0 sẽ gây lỗi, nếu ko thì thực thi code trong lệnh if
        if (typeof result !== "number" || !isFinite(result)) {
        // nếu có thì dừng lại và thiết lập một mã trạng thái có htpp là 400 
        // trả về client 1 phản hồi json 
            return res.status(400).json({
                success: false,
                 // báo hiệu thất bại và ra thông báo lỗi
                message: "You cannot divide by zero"
            });
        }
        // nếu ko xảy ra bất cứ trường hợp nào ko như ý, thì kết quả sẽ được phản hồi lại client dạng JSON
        res.json({
            // báo hiệu thành công
            success: true,
            // trả về kết quả =kết quả (chính là return(expression))
            result: result
        });
// nếu code trong try có lỗi, bắt lấy nó và thực thi catch(error)
    } catch (error) {
        //nếu có thì dừng lại và thiết lập một mã trạng thái có htpp là 400 
        // trả về client 1 phản hồi json 
        res.status(400).json({
            // báo hiệu thất bại và ra thông báo lỗi
            success: false,
            message: "Invalid expression"
        });
    }
};