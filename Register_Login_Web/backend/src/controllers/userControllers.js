// import User từ models/userModels.js để sử dụng 
import User from "../models/userModels.js";
// import thư viện json web token để xử lí token login
import jwt from "jsonwebtoken";

//khai báo 1 hàm tên registerUser và export để xử lí việc đăng kí
export const registerUser = async (req, res) => {
  try {
    // lấy các trường dữ liệu cần từ request
    const { email, password, confirmPassword } = req.body;

    // kiểm tra các trường dữ liệu có được nhập hết chưa
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please enter the full email address, password, and confirmation password" });
    }

    // kiểm tra format của email theo regex
    // regex: /^[^\s@]+: bắt đầu chuỗi thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // @: sau đó là kí tự @
    // [^\s@]+: đi sau kí tự @ thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // \. tiếp theo là kí tự dấu .
    // [^\s@]+: đi sau kí tự dấu . thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // $/: kết thúc chuỗi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // kiểm tra email có khớp với điều kiện đã đặt ra trong emailRegex hay ko
    // nếu ko thì báo lỗi và dừng
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email is incorrectly formatted" });
    }

    // kiểm tra xem có trùng email ko
    // User.findOne({ email }): 1 hàm của Mongoose, dùng để tìm email trong collection “users” 
    const existingUser = await User.findOne({ email });
    // trường hợp thật sự tìm thấy 1 cái email có trong db thì bao lỗi rằng đã có email
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }


    // kiểm tra password: ít nhất 6 ký tự + 1 số + 1 ký tự đặc biệt
    // regex: /^...$/ kiểm tra từ đầu cho đến cuối chuỗi
    // (?=.*[0-9]): chuỗi phải chứa ít nhất 1 ký tự số từ 0->9 ở bất kỳ vị trí nào
    // (?=.*[=`~!@#$%^&*+-]): chuỗi phải chứa ít nhất 1 ký tự đặc biệt nằm ở trong ngoặc vuông ở bất kỳ vị trí nào
    // [A-Za-z0-9=`~!@#$%^&*+-]: cho phép mật khẩu chỉ chứa những ký tự trong ngoặc vuông: từ A->Z, a->z, 0->9 và các kí tự đặc biệt =`~!@#$%^&*+-
    // {6,}: phải dài ít nhất 6 ký tự
    const passwordRule = /^(?=.*[0-9])(?=.*[=`~!@#$%^&*+-])[A-Za-z0-9=`~!@#$%^&*+-]{6,}$/;
    // kiểm tra xem password có khớp với các yêu cầu trong regex ko, nêu ko thì báo lỗi và dừng
    if (!passwordRule.test(password)) {
      return res.status(400).json({message:"Password must be have at leat 6 characters, include at least 1 number and 1 special character (=`~!@#$%^&*+-)"});
    }

    // xem password và confirmPassword đã được nhập hợp lệ chưa, nếu chưa thì báo lỗi
    if (!password || !confirmPassword) return res.status(400).json({ message: "Please enter your password" });
    // sau đó xem thử password và confirmPassword có trùng ko, ko thì báo lỗi
    if (password !== confirmPassword) return res.status(400).json({ message: "Confirmation password does not match" });


    // tạo user mới
    const newUser = new User({
      email,
      password, // không hash, lưu nguyên văn
    });

    // lưu user vào MongoDB và trả về user
    const savedUser = await newUser.save();
    res.status(201).json({
      message: "Register successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
      },
    });
 // có lỗi thì bắt lỗi và thông báo lỗi
  } catch (error) {
    console.error("Error calling registerUser", error);
    res.status(500).json({ message: "Failed to register"});
  }
};

//khai báo 1 hàm tên loginUser và export để xử lí việc đăng nhập
export const loginUser = async (req, res) => {
  try {
    // lấy các trường dữ liệu cần từ request
    const { email, password } = req.body;

    // kiểm tra xem email và password có tồn tại chưa, chưa thì báo lỗi và dừng
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter the full email address, password" });
    }


    // User.findOne({ email }): 1 hàm của Mongoose, dùng để tìm email trong collection “users” 
    // .select("+password") lấy cả trường password dù cho trong model là false để có thể sử dụng để xử lí
    // khai báo biến user chứa email và password
    const user = await User.findOne({ email }).select("+password");
    // kiểm tra xem user có tồn tại ko, nếu ko thì báo lỗi
    if (!user) {
      return res.status(400).json({ message: "User no exist" });
    }

    // lấy dữ liệu password của user so với password đc nhập có giống ko, ko thì báo lỗi và dừng
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password"  });
    }

    // tạo token để lưu payload và chỉ yêu cầu user login lại sau 1 ngày
    // thêm vào đó là dùng để xác thực user và phân quyền
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "SecretKey",
      { expiresIn: "1d" }
    );


    //  gửi đầy đủ thông tin user về frontend
    res.status(200).json({
      message: "login successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  // có lỗi thì bắt lỗi và thông báo lỗi
  } catch (error) {
    console.error("Error calling loginUser", error);
    res.status(500).json({ message: "Failed to login"});
  }
};


// khai báo 1 hàm tên changePassword và export để xử lí việc thay đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    // lấy các trường dữ liệu cần từ request
    const { oldPassword, newPassword, confirmPassword } = req.body;
    // tạo biến tên userId để lấy id từ body
    const userId = req.params.id;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ các trường" });
    }

    // so sánh giá trị của newPassword có giống với confirmPassword, nếu ko thì báo lỗi
    if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Confirmation password does not match" });
    }

    // kiểm tra password: ít nhất 6 ký tự + 1 số + 1 ký tự đặc biệt
    // regex: /^...$/ kiểm tra từ đầu cho đến cuối chuỗi
    // (?=.*[0-9]): chuỗi phải chứa ít nhất 1 ký tự số từ 0->9 ở bất kỳ vị trí nào
    // (?=.*[=`~!@#$%^&*+-]): chuỗi phải chứa ít nhất 1 ký tự đặc biệt nằm ở trong ngoặc vuông ở bất kỳ vị trí nào
    // [A-Za-z0-9=`~!@#$%^&*+-]: cho phép mật khẩu chỉ chứa những ký tự trong ngoặc vuông: từ A->Z, a->z, 0->9 và các kí tự đặc biệt =`~!@#$%^&*+-
    // {6,}: phải dài ít nhất 6 ký tự
    const passwordRule = /^(?=.*[0-9])(?=.*[=`~!@#$%^&*+-])[A-Za-z0-9=`~!@#$%^&*+-]{6,}$/;
    // kiểm tra xem newPassword có khớp với các yêu cầu trong regex ko, nêu ko thì báo lỗi và dừng
    if (!passwordRule.test(newPassword)) {
      return res.status(400).json({
        message: "Password should contains at least 1 number and 1 special character(=`~!@#$%^&*+-)",
      });
    }

    // User.findById(userId): 1 hàm của Mongoose, dùng để tìm id trong collection “users” 
    // .select("+password") lấy cả trường password dù cho trong model là false để có thể sử dụng để xử lí
    // khai báo biến user chứa id và password
    const user = await User.findById(userId).select("+password");
    // kiểm tra xem user có tồn tại ko, nếu ko thì báo lỗi
    if (!user) return res.status(404).json({ message: "User not found" });


    // lấy dữ liệu password của user so với oldPassword đc nhập có giống ko, nếu ko thì báo lỗi
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: "Old password is not correct" });
    }

    // cập nhật mật khẩu mới
    user.password = newPassword;
    // lưu lại trên MongoDB 
    await user.save();

    // ko có vấn đề gì thì thông báo thành công
    return res.status(200).json({ message: "Password changed successfully!" });
    // nếu có lỗi thì bắt lỗi rồi hiển thị thông báo
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Error changing password"});
  }
};

// khai báo 1 hàm tên updateUser và export để xử lí việc cập nhật dữ liệu của user
export const updateUser = async (req, res) => {
  try {
    // tạo biến tên user và dùng User.findById((req.params.id): 1 hàm của Mongoose, dùng để tìm id trong collection “users”
    const user = await User.findById(req.params.id);
    // kiểm tra xem user id có tồn tại ko, nếu ko thì báo lỗi
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // const { name, email, gender, address } = req.body;
    // // cập nhật từng trường có giá trị
    // // user.name = name || user.name;
    // // user.email = email || user.email;
    // // user.gender = gender || user.gender;
    // // user.address = address || user.address;
    // if (name !== undefined) user.name = name ? name.trim() : "";
    // if (email !== undefined) user.email = email ? email.trim() : user.email;
    // if (gender !== undefined) user.gender = gender ? gender.trim() : "";
    // if (address !== undefined) user.address = address ? address.trim() : "";
    // cập nhật từng trường có giá trị
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;


    const { email } = req.body;
    if (email!== user.email) {
    // kiểm tra format của email theo regex
    // regex: /^[^\s@]+: bắt đầu chuỗi thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // @: sau đó là kí tự @
    // [^\s@]+: đi sau kí tự @ thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // \. tiếp theo là kí tự dấu .
    // [^\s@]+: đi sau kí tự dấu . thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // $/: kết thúc chuỗi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // kiểm tra email có khớp với điều kiện đã đặt ra trong emailRegex hay ko
    // nếu ko thì báo lỗi và dừng
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email is incorrectly formatted" });
    }

    // kiểm tra xem có trùng email ko
    // User.findOne({ email }): 1 hàm của Mongoose, dùng để tìm email trong collection “users” 
    const existingUser = await User.findOne({ email });
    // trường hợp thật sự tìm thấy 1 cái email có trong db thì bao lỗi rằng đã có email
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

    // khai báo biến tên updatedUser chứa dữ liệu user vừa lưu lại 
    const updatedUser = await user.save();
    // trả mã 200 và dữ liệu vừa cập nhật
    res.status(200).json(updatedUser);
    // nếu có lỗi thì bắt lỗi rồi hiển thị thông báo
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: "Error updating user" });
  }
};
