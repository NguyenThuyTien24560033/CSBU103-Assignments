// khai báo 1 hàm có tên là validateInput
function validateInput() {
    // khai báo 1 biến có tên textarea sẽ tham chiếu đến element trong html có id là userInput bằng phương thức getElementById
    const textarea   = document.getElementById("userInput");
    // khai báo 1 biến có tên charCount sẽ tham chiếu đến element trong html có id là charCount bằng phương thức getElementById
    const charCount  = document.getElementById("charCount");
    // khai báo 1 biến có tên messageDiv sẽ tham chiếu đến element trong html có id là message bằng phương thức getElementById
    const messageDiv = document.getElementById("message");
    // khai báo 1 biến tên là text lấy giá trị(value) từ DOM thông qua biến textarea
    let text   = textarea.value;
    // khai báo 1 biến tên là length lấy độ dài(lenght) từ DOM thông qua biến tex
    let length = text.length;

    // cập nhật số đếm giá trị trên giao diện
    charCount.textContent = length;

    // trường hợp 1, khi mà ko nhập kí tự mà nhấn enter
    // hiện 1 thông báo màu cam về việc nhập kí tự
    if (length === 0) {
        messageDiv.textContent = "Please enter some text.";
        messageDiv.style.color = "orange";
        messageDiv.style.backgroundColor = "#fff3e0";
    }
    // trường hợp 2, là khi nhập đúng số kí tự 1-50 kí tự
    // hiện thông báo màu xanh thông báo hợp lệ
    else {
        // ${length}: sẽ lấy giá trị của length hiện tại để hiển thị
        // nếu mà kí tự lớn hơn 1 thì thêm s vào charater để đúng ngữ pháp, ko thì thôi
        // dùng backtick cho cấu trúc này
        messageDiv.textContent = `Valid! You used ${length} character${length > 1 ? 's' : ''}.`;
        messageDiv.style.color = "green";
        messageDiv.style.backgroundColor = "#e8f5e9";
    }
}

// vùng xử lí sự kiện, ngăn chặn kí tự thứ 51 xuất hiện khi mà bạn nhập nó
// đây cũng là trường hợp thứ 3, số kí tự >50
document.getElementById("userInput").addEventListener("input", function () {
    // kiểm tra xem độ dài có vượt quá 50 không
    // this chỉ đến <textarea>
    if (this.value.length > 50) {
        // hiển thị 1 popup (alert) cảnh báo về việc đã nhập kí tự thứ 51,  quá 50 kí tự
        alert(`Error: You entered 51th characters!\nMaximum allowed is 50 characters.`);

        // cắt đoạn quá kí tự về đúng theo 50 kí tự đầu tiên rồi gán vô lại textarea
        this.value = this.value.slice(0, 50);
        // cập nhật số đếm hiển thị là 50
        document.getElementById("charCount").textContent = 50;

        // // hiện một thông báo màu đỏ, nền #ffebee ( màu hồng nhạt) thông báo là bạn đã nhập quá 50 kí tự
        const messageDiv = document.getElementById("message");
        messageDiv.textContent = "Too long! Maximum 50 characters allowed.";
        messageDiv.style.color = "red";
        messageDiv.style.backgroundColor = "#ffebee";
        // nếu bé hơn 50 kí tự
    } else {
        // cập nhật số đếm bằng độ dài hiện tại
        document.getElementById("charCount").textContent = this.value.length;
    }
});

// lắng nghe sự kiện click trên nút "Enter" có id là enterBtn
// khi click xảy ra, nó gọi hàm validateInput để thực hiện kiểm tra và hiển thị kết quả.
document.getElementById("enterBtn").addEventListener("click", validateInput);