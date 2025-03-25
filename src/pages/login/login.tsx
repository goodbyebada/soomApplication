import { loginUser } from "@apis/signup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
// import { sendKeyToServer } from "@utils/registerServiceWorker";

export const LoginPage = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("accessToken");

  //   const afterLogin = async (accessToken: string | null) => {
  //     if (accessToken) {
  //       await sendKeyToServer(0);
  //       navigate("/main");
  //     }
  //   };

  //   // afterLogin(accessToken);
  // }, []);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [inputValid, setInputValid] = useState<boolean>(false);
  const [showFailedAlert, setShowFailedAlert] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputValue.email.length > 0 && inputValue.password.length > 0
      ? setInputValid(true)
      : setInputValid(false);

    const { id, value } = e.target;

    setInputValue((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputValue);
    const response = await loginUser(inputValue);
    console.log(response);

    // 로그인 실패 예외처리
    if (!response || response.data.code === 400 || response.data.code === 500) {
      setShowFailedAlert(true);
      const timer = setTimeout(() => {
        setShowFailedAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    //로그인 성공
    const accessToken = response.data.result.accessToken;
    localStorage.setItem("accessToken", accessToken);

    setShowFailedAlert(false);
    setInputValid(true);
    navigate("/main");
  };

  return (
    <Container>
      <header>
        <h1>돌아온 당신을 환영합니다.</h1>
        <p>"하루 5분의 숨통. 당신만의 해방일지"</p>
      </header>

      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <label htmlFor="email">아이디</label>
          <input
            id="email"
            type="text"
            placeholder="아이디"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper style={{ marginBottom: "40px" }}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
          />
        </InputWrapper>

        <SubmitButton type="submit" disabled={!inputValid}>
          로그인
        </SubmitButton>
      </Form>

      <Link to="/signup">
        <SignUpButton>
          계정이 없으신가요?<button>회원가입</button>
        </SignUpButton>
      </Link>

      {/* 로그인 실패 */}
      {showFailedAlert && (
        <SignupFailedAlert>로그인에 실패했습니다</SignupFailedAlert>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-top: 100px;

  header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 327px;
    height: 64px;
    margin-bottom: 50px;

    h1 {
      font-size: 24px;
      font-weight: 400;
      color: #0c1421;
    }

    p {
      font-size: 15px;
      font-weight: 400;
      color: #313957;
    }
  }
`;

const Form = styled.form`
  width: 327px;
  height: 220px;
  margin-bottom: 45px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  label {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #0c1421;
  }

  input {
    width: 327px;
    height: 42px;
    border: 1px solid #d4d7e3;
    border-radius: 8px;
    padding-left: 14px;
    background-color: rgba(128, 221, 242, 0.2);
    outline: none;
    font-size: 14px;
    font-weight: 400;
    color: #1d1d1d;
  }

  input::placeholder {
    font-size: 14px;
    font-weight: 400;
    color: #8897ad;
  }
`;

const SubmitButton = styled.button`
  width: 327px;
  height: 44px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 400;
  color: white;
  background-color: ${(props) => (props.disabled ? "#9E9E9E" : "#049dbf")};
  border: none;
  cursor: pointer;
`;

const SignUpButton = styled.p`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  color: #313957;

  button {
    color: #1e4ae9;
    background-color: white;
    border: none;
    cursor: pointer;
  }
`;

const fadeUpToDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SignupFailedAlert = styled.div`
  position: absolute;
  top: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 330px;
  height: 60px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  font-size: 16px;
  font-weight: 500;
  color: white;
  animation: ${fadeUpToDown} 0.5s ease-in-out;
`;
