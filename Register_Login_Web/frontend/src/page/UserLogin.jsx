// import useState để quản lý state trong component
import { useState } from "react";
// import css
import "./UserLogin.css";
// import Toaster và toast từ thư viện sonner để hiển thị thông báo
import { Toaster, toast } from "sonner";
// import useNavigate để điều hướng page
import { useNavigate } from "react-router-dom";

// khai báo hàm UserLogin nhận props onBack xử lí việc login
const UserLogin = ({ onBack }) => {
  // state chứa dữ liệu hiện tại: isLogin, email, password, confirmPassword, loading nhận các giá trị khởi tạo ban đầu tương ứng
  // hàm cập nhật state setIsLogin, setEmail, setPassword, setConfirmPassword, setLoading
  // xử lí state login
  const [isLogin, setIsLogin] = useState(true);
  // xử lí state email
  const [email, setEmail] = useState("");
  // xử lí state password
  const [password, setPassword] = useState("");
  // xử lí state confirmPassword => xác thực mật khẩu
  const [confirmPassword, setConfirmPassword] = useState("");
  // xử lí state loading => tạm dừng và thông báo cho client biết phải chờ server phản hồi
  const [loading, setLoading] = useState(false);
  // khai báo hook điều hướng
  const navigate = useNavigate();
  // API chứa URL của API endpoint để gửi request đến server
  // URL trỏ đến server chạy trên máy local (localhost) ở cổng 5005
  // /api/users là endpoint của server, thường dùng để gửi request liên quan tới user
  const API = "http://localhost:5005/api/users";


  // khai báo hàm JQuery để kiểm tra tính hợp lệ của dữ liệu nhập vào form Login/Register
  const JQuery = () => {
    // kiểm tra format của email theo regex
    // regex: /^[^\s@]+: bắt đầu chuỗi thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // @: sau đó là kí tự @
    // [^\s@]+: đi sau kí tự @ thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // \. tiếp theo là kí tự dấu .
    // [^\s@]+: đi sau kí tự dấu . thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // $/: kết thúc chuỗi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // kiểm tra email có khớp với điều kiện đã đặt ra trong emailRegex hay ko
    // nếu ko thì báo lỗi và dừng
    if (!emailRegex.test(email)) {
      toast.error("Email is incorrectly formatted");
      return false;
    }

    // kiểm tra password: ít nhất 6 ký tự + 1 số + 1 ký tự đặc biệt
    // regex: /^...$/ kiểm tra từ đầu cho đến cuối chuỗi
    // (?=.*[0-9]): chuỗi phải chứa ít nhất 1 ký tự số từ 0->9 ở bất kỳ vị trí nào
    // (?=.*[=`~!@#$%^&*+-]): chuỗi phải chứa ít nhất 1 ký tự đặc biệt nằm ở trong ngoặc vuông ở bất kỳ vị trí nào
    // [A-Za-z0-9=`~!@#$%^&*+-]: cho phép mật khẩu chỉ chứa những ký tự trong ngoặc vuông: từ A->Z, a->z, 0->9 và các kí tự đặc biệt =`~!@#$%^&*+-
    // {6,}: phải dài ít nhất 6 ký tự
    const passwordRegex = /^(?=.*[0-9])(?=.*[=`~!@#$%^&*+-])[A-Za-z0-9=`~!@#$%^&*+-]{6,}$/;
    // kiểm tra xem password có khớp với các yêu cầu trong regex ko, nêu ko thì báo lỗi và dừng
    if (!passwordRegex.test(password)) {
      toast.error("Password must be have at leat 6 characters, include at least 1 number and 1 special character (=`~!@#$%^&*+-)");
      return false;
    }

    // !isLogin: chỉ kiểm tra password !== confirmPassword khi đang register
    // password !== confirmPassword: nếu ko khớp thì báo lỗi và dừng
    if (!isLogin && password !== confirmPassword) {
      toast.error("The confirmation password does not match");
      return false;
    }

    // nếu tất cả đều ok thì trả về hợp lệ
    return true; 
  };

  
  // khai báo registerUser gửi req đăng kí tài khoản và nhận về res
  // nhận vào email, password, confirmpassword
  const registerUser = async (email, password, confirmPassword) => {
    // dùng try...catch để bắt lỗi
    try {
      // gửi req đến tới API/register để đăng ký tài khoản mới
      const res = await fetch(`${API}/register`, {
        // phương thức POST
        method: "POST",
        // dữ liệu gửi đi là dạng json
        headers: { "Content-Type": "application/json" },
        // chuyển các trường dữ liệu cần gửi thành dạng json
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      // khai báo biến data nhận về phản hồi res ở dạng object JS
      const data = await res.json();
      // nếu res ko ok thì báo lỗi và trả về null
      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return null;
      }
      // nếu ok thì báo ok 
      toast.success("Successfully registered!");
      // cập nhật state
      setIsLogin(true);
      setPassword("");
      setConfirmPassword("");
      // trả về data
      return data;
      // nếu có lỗi thì bắt lỗi và thông báo lỗi và trả về null
    } catch (error) {
      toast.error("Server connection error");
      return null;
    }
  };


  // khai báo hàm loginUser gửi req đăng nhập tài khoản và nhận về res
  // nhận email, password
  const loginUser = async (email, password) => {
    // dùng try...catch bắt lỗi
    try {
      // gửi req đến tới API/login để đăng nhập
      const res = await fetch(`${API}/login`, {
        // phương thức POST
        method: "POST",
        // dữ liệu gửi đi dạng json
        headers: { "Content-Type": "application/json" },
        // biến các trường dữ liệu thành json rồi gửi đi
        body: JSON.stringify({ email, password }),
      });
      // khai báo data nhận về res dạng object JS
      const data = await res.json();
      // nếu res ko ok thì báo lỗi và trả về null
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return null;
      }
      // nếu ok thì trả về data
      return data;
       // nếu có lỗi thì bắt lỗi và thông báo lỗi và trả về null
    } catch (error) {
      toast.error("Server connection error");
      return null;
    }
  };

 
  // khai báo hàm handleSubmit xử lí việc submit các form
  // e là event gửi vào
  const handleSubmit = async (e) => {
    // chặn việc reload mặc định của trình duyệt
    // tránh việc reload ngay khi submit làm mất dữ liệu gửi đi 
    e.preventDefault();
    // bật loading, báo cho client biết là cần server xử lí và phản hồi
    setLoading(true);

    // xử lí JQuery: kiểm tra xem các dữ liệu input có hợp lệ ko
    // nếu ko thì cập nhật state setLoading và dừng 
    if (!JQuery()) {
      setLoading(false);
      return; 
    }
    // dùng try...catch để bắt lỗi
    try {
      // xem thử có đang ở trạng thái login ko
      if (isLogin) {
        // nếu có thì đầu tiên là khai báo biến data chứa phản hồi
        // gọi hàm loginUser nhận email, password xử lí việc login
        const data = await loginUser(email, password);
        if (data?.token) {
          // lưu dữ liệu vào localStorage 
          // lưu JWT hoặc token server trả về để giữ trạng thái đăng nhập
          localStorage.setItem("token", data.token);
          // lưu thông tin user -> hiển thị thông tin user trên UI hoặc lấy ra sau này
          localStorage.setItem("user", JSON.stringify(data.user));
          // lưu userId -> truy xuất nhanh khi API khác cần dùng hoặc update profile
          localStorage.setItem("userId", data.user._id || data.user.id);
          // hiển thị popup thông báo thành công cho người dùng
          toast.success("Login successful!");
          // kiểm tra user nhận từ server đã đúng chưa
          console.log("User from API:", data.user);
          // kiểm tra token đã được lưu vào localStorage đúng chưa
          console.log("Token stored:", data.token);
          // tạo event toàn cục để các component khác biết user đã thay đổi, từ đó lắng nghe và tự render mà ko cần reload
          window.dispatchEvent(new Event("userChanged"));
          // chuyển hướng về homepage
          navigate("/");
          // kiểm tra và gọi callback onBack nếu có
          // đóng modal hoặc quay về màn hình trước sau khi hoàn thành login/register
          if (onBack) onBack();   }
      } else {
        await registerUser(email, password, confirmPassword);
      }}
      // nếu có lỗi thì bắt lỗi và thông báo lỗi 
    catch (err) {
      toast.error("Some erros happend");
      // dù cho thực hiện try hay catch thì sau đó cũng cập nhật state setLoading là false để tắt loading
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Toaster: component của thư viện sonner dùng để hiển thị thông báo toast */}
      {/* position="top-center": đặt toast ở giữa phía trên màn hình */}
      {/* richColors: dùng màu sắc đẹp hơn cho toast */}
      <Toaster position="top-center" richColors />

      {/* khối box */}
      <div className="login-box">

        {/* nút x => đóng form */}
        {/* onClick={() => navigate("/")} : khi click, dùng hook useNavigate để quay về homepage */}
        <span
            className="close-x"
            onClick={() => {
              if (onBack) onBack(); 
              navigate("/");        
            }}
          >
            &times;
          </span>

        {/* tiêu đề form*/}
        <h2 className="title">Welcome</h2>

        {/* 2 nút tab để chuyển giữa Login và Register mode */}
               <div className="tab">
          {/* nếu đang login -> gán class active để style nút hiện đang chọn */}
          {/* onClick={() => setIsLogin(true)}: chuyển trạng thái form sang login */}
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          {/* nếu đang ko login -> gán class active để style nút hiện đang chọn */}
          {/* onClick={() => setIsLogin(false)}: chuyển trạng thái form sang register */}
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* onSubmit={handleSubmit}: gọi hàm handleSubmit khi user submit form */}
        <form className="login-form" onSubmit={handleSubmit}>
        {/* input email
            value={email}: liên kết với state email
            onChange={(e) => setEmail(e.target.value)}: cập nhật state setEmail khi user nhập
            required: bắt buộc phải nhập 
          */}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* input password
              value={password}: liên kết với state password
              onChange={(e) => setPassword(e.target.value)}: cập nhật state setPassword khi user nhập
              required: bắt buộc phải nhập 
          */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* kiểm tra trạng thái login, nếu đang ko login => đang register*/}
          {/* input Confirm password
              value={confirmPassword}: liên kết với state confirmPassword
              onChange={(e) => setConfirmPassword(e.target.value)}: cập nhật state setConfirmPassword khi user nhập
              required: bắt buộc phải nhập 
          */}
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          {/* nút submit */}
          {/* disabled={loading}: loading=true -> tránh bấm nhiều lần */}
          {/* loading ? "Processing..." : ...
              loading = true -> hiển thị "Processing..."
              loading = false -> đánh giá tiếp phần sau (isLogin ? "Login" : "Register")
              isLogin ? "Login" : "Register"
              isLogin = true -> hiển thị "Login"
              isLogin = false -> hiển thị "Register"
          */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>

          {/* text hướng dẫn user chuyển giữa login/register */}
          <p className="switch-text">

            {isLogin ? (
              <>
                Don’t have an account?{" "}
                {/* nếu nhấn vào text thì cập nhật state setIsLogin là false => chuyển sang register*/}
                <span onClick={() => setIsLogin(false)}>Sign up now</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                {/* nếu nhấn vào text thì cập nhật state setIsLogin là true => chuyển sang login */}
                <span onClick={() => setIsLogin(true)}>Login</span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

// export mặc định hàm UserLogin
export default UserLogin;
