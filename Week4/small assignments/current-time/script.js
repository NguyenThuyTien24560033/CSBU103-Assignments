// khai báo một hàm có tên là updatTime
function updateTime() {
    // trong {} là phần body của hàm updateTime, chưa các câu lệnh sẽ xử lí mục tiêu của function
    // new Date(): tạo ra một đối tượng thời gian thực 
    // khai báo một biến tên là now, biến now chưa thông tin thời gian thực mà new Date tạo ra
    const now = new Date();

    // khai bá 1 biến tên hours chứa giá trị giờ trong biến now, dùng phương thức getHours để trích xuất giờ
    // ở đây dùng khai báo let vì hours sẽ được thay đổi format 12h
    let hours = now.getHours();
    // khai báo 1 biến tên minutes chứa giá trị phút trong biến now, dùng phương thức getMinutes để trích xuất phút
    const minutes = now.getMinutes().toString().padStart(2, '0');
    // khai báo 1 biến tên seconds chứa giá trị giây trong biến now, dùng phương thức getSecond để trích xuất giây
    // vì em muốn phút và giây luôn hiển thị 2 chữ số, nên dùng toString để chuyển giá trị số thành string
    // rồi từ đó dùng phương thức padStart để đệm thêm số 0 vào phần đầu của chuỗi để đạt đúng độ dài là 2 chữ số
    const seconds = now.getSeconds().toString().padStart(2, '0');
    // đổi định dạng 24h thành 12h
    // khai báo 1 biến têm là ampm chưa định dạng giờ
    // xét điều kiện: hours lớn hơn hoặc bằng 12 thì là PM(giờ chiều), còn nếu không thì là AM(giờ sáng)
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // dùng phép chia lấy dư để chuyển 24 giờ thành dạng 12h, vd: 15%12=3
    hours = hours % 12;
    // với trường hợp hours không phải là số 12, thì sẽ trả về giá trị hours % 12
    // còn nếu mà là 12h hoặc 24h thì khi thực hiện hours%12=0(điều kiện sẽ cho là false) thì trả về số 12
    hours = hours ? hours : 12;
    // ghép các thành phần thời gian lại, khai báo 1 biến tên timeString để chưa dãy thời gian giờ
    // giờ:phút:giây AM/PM
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    
    
    // hiển thị thứ ngày tháng năm
    // khai báo 1 biến tên options chứa giá trị thứ ngày tháng năm (key mặc định: weekday, year, month, day)
    const options = { 
        // hiển thị tên đầy đủ của thứ trong tuần
        weekday: 'long', 
        // hiển thị năm dưới dạng số(4 số, vd 2026)
        year: 'numeric', 
        // hiển thị tên đầy đủ của tháng trong năm
        month: 'long', 
        // hiển thị ngày dưới dạng số(2 số, vd 13)
        day: 'numeric' 
        
    };
    // khai báo 1 biến tên dataString để chứa thời gian ngày tháng
    // dùng phương thức toLocaleDateString để trích xuất thời gian từ biến now nơi chứa thời gian thực
    // toLocaleDateString(locale, DateString) => giá trị locale là underfile, sẽ mặc định theo trình duyệt người dùng, DateString là options
    // dựa vào options để biết cách thức trình bày là định dạng hiển thị
    const dateString = now.toLocaleDateString(undefined, options);
    // => Monday, November 10, 2025 (định dạng sẽ tuân theo locale)

    // cập nhật lại nội dung hiển thị trên file html, dùng phương thức getElementById để tìm kiếm 1 element trong html dựa trên id
    // textContent hiển thị nội dung dưới dạng plain text
    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

//chạy thời gian ngay khi page load
updateTime();

// chạy lại mỗi giây, tạo đồng hồ live
// setInterval là hàm tích hợp của JS dùng để gọi hàm hoặc thực thi 1 đoạn mã lặp đi lặp lại sau 1 khoảng thời gian nhất định
// 1000 là 1000 milis bằng 1s
setInterval(updateTime, 1000);