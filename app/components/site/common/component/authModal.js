"use client";
import FormInput from "@/app/components/form/input";
import FormPassword from "@/app/components/form/password";
import { useI18n } from "@/app/contexts/i18n";
import { useUser } from "@/app/contexts/user";
import {
  googleLogin,
  postLogin,
  postSignup,
  sendOtp,
} from "@/app/helper/backend";
import { app, requestPermissionAndGetToken } from "@/firebase.config";
import { Modal, Tabs, Form, Input, message } from "antd";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoPersonAdd } from "react-icons/io5";
const { TabPane } = Tabs;
import { useTimer } from "use-timer";
const AuthModal = ({ authModalOpen, setAuthModalOpen, slug = null }) => {
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [signUpValues, setSignUpValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [signInform] = Form.useForm();
  const router = useRouter();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const i18n = useI18n();
  const { time, start, pause, reset } = useTimer({
    initialTime: 120,
    timerType: "DECREMENTAL",
  });
  useEffect(() => {
    if (otpEmail) {
      start();
    }
    if (time === 0) pause();
  }, [time, start, pause, otpEmail]);
  const handleSubmit = async (value) => {
    setLoading(true);
    const fcmToken = await requestPermissionAndGetToken();
    const data = await postLogin({
      body: {
        identifier: value?.email,
        password: value?.password,
        fcm_token: fcmToken,
      },
    });
    if (data?.success) {
      setUser(data?.data?.user);
      localStorage.setItem("token", data?.data?.accessToken);
      message.success(data?.message);
      form.resetFields();
      if (slug) {
        setAuthModalOpen(false);
        router.push(slug);
      } else if (
        data?.data?.user?.role === "admin" ||
        data?.data?.user?.role === "employee"
      ) {
        router.push("/admin");
        setLoading(false);
        setAuthModalOpen(false);
      } else if (data?.data?.user?.role === "user") {
        router.push("/user");
        setLoading(false);
        setAuthModalOpen(false);
      } else {
        router.push("/");
        setLoading(false);
        setAuthModalOpen(false);
      }
    } else {
      message.error(data?.errorMessage);
      setLoading(false);
      setAuthModalOpen(false);
    }
  };
  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    const fcmToken = await requestPermissionAndGetToken();
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const result = await signInWithPopup(auth, googleProvider);
    const { accessToken } = result.user;
    const data = await googleLogin({
      body: {
        id_token: accessToken,
        role: "user",
        fcm_token: fcmToken,
      },
    });
    if (data?.success) {
      setUser(data?.data?.user);
      localStorage.setItem("token", data?.data?.accessToken);
      message.success(data?.message);
      form.resetFields();
      if (
        data?.data?.user?.role === "admin" ||
        data?.data?.user?.role === "employee"
      ) {
        router.push("/admin");
        setGoogleLoading(false);
        form.resetFields();
        setAuthModalOpen(false);
      } else if (data?.data?.user?.role === "user") {
        router.push("/user");
        setGoogleLoading(false);
        form.resetFields();
        setAuthModalOpen(false);
      } else {
        router.push("/");
        setGoogleLoading(false);
        form.resetFields();
        setAuthModalOpen(false);
      }
    } else {
      message.error(data?.errorMessage);
      setGoogleLoading(false);
      form.resetFields();
      setAuthModalOpen(false);
    }
  };

  const handleSignInSubmit = async (value) => {
    setLoading(true);
    if (!!value?.email) {
      setOtpEmail(value.email);
      setSignUpValues(value);
      const data = await sendOtp({
        body: {
          identifier: value.email,
          action: "signup",
        },
      });
      if (data.success) {
        message.success(data.message);
        form.resetFields();
        setAuthModalOpen(false);
        setIsModalOpen(true);
        signInform.resetFields();
        setLoading(false);
      } else {
        message.error(data.errorMessage);
        signInform.resetFields();
        setAuthModalOpen(false);
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        open={authModalOpen}
        onCancel={() => setAuthModalOpen(false)}
        footer={null}
        centered
        width={500}
        className="auth-modal"
        maskClosable={false}
      >
        {/* Top image section */}
        <div
          className="auth-modal-image"
          style={{ backgroundImage: "url(/theme1/auth1.jpg)" }}
        />

        {/* Form section */}
        <div className="px-6 md:px-12 pb-6 pt-4">
          <Tabs
            defaultActiveKey="login"
            centered
            items={[
              {
                key: "login",
                label: i18n?.t("Login"),
                children: (
                  <>
                    <Form
                      initialValues={{ email: "" }}
                      autoComplete="off"
                      className="mt-3"
                      layout="vertical"
                      onFinish={handleSubmit}
                      form={form}
                    >
                      <div>
                        <FormInput
                          className="w-full p-2 md:p-3 rounded focus:outline-primary"
                          label="Email"
                          name="email"
                          placeholder="Enter your email"
                          required={true}
                        />
                      </div>
                      <div>
                        <FormPassword
                          className="w-full p-2 md:p-3 rounded focus:outline-primary border"
                          label="Password"
                          name="password"
                          placeholder="Enter your password"
                          required={true}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          router.push("/forgotPassword");
                          setAuthModalOpen(false);
                        }}
                        className="text-primary hover:underline transform duration-300 hover:!text-primary description-2 mt-5 sm:mt-6 lg:mt-8 xl:mt-10"
                      >
                        {i18n?.t("Forgot Password")}?
                      </button>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 w-full view-button bg-primary xl:mt-8 lg:mt-6 sm:mt-5 mt-4"
                        >
                          <FaSignInAlt className="text-xl" />
                          {loading ? i18n?.t("Loading...") : i18n?.t("Login")}
                        </button>
                      </div>
                    </Form>
                    <div className="my-5">
                      <button
                        onClick={() => signInWithGoogle()}
                        className="flex items-center justify-center gap-2 w-full view-button bg-primary border"
                      >
                        <FcGoogle className="text-xl" />
                        {googleLoading
                          ? i18n?.t("Loading...")
                          : i18n?.t("Login with Google")}
                      </button>
                    </div>
                  </>
                ),
              },
              {
                key: "signup",
                label: i18n?.t("Signup"),
                children: (
                  <Form
                    className="mt-3"
                    layout="vertical"
                    onFinish={handleSignInSubmit}
                    initialValues={{ name: "", email: "" }}
                    autoComplete="off"
                    form={signInform}
                  >
                    <div>
                      <FormInput
                        className="w-full p-2 md:p-3 rounded focus:outline-primary"
                        label="Name"
                        name="name"
                        placeholder="Enter your name"
                        required={true}
                      />
                    </div>
                    <div className="sm:!mt-2">
                      <FormInput
                        isEmail={true}
                        className="w-full p-2 md:p-3 rounded focus:outline-primary"
                        label="Email"
                        name="email"
                        placeholder="Enter your email"
                        required={true}
                      />
                    </div>
                    <div className="sm:!mt-2 auth">
                      <FormPassword
                        className="w-full p-2 md:p-3 rounded focus:outline-primary border"
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        required={true}
                      />
                    </div>
                    <div className="sm:!mt-2 auth">
                      <FormPassword
                        className="w-full p-2 md:p-3 rounded focus:outline-primary border"
                        confirm
                        label="Re-type Password"
                        name="confirm_password"
                        placeholder="Confirm your password"
                        required={true}
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full view-button bg-primary xl:mt-8 lg:mt-6 sm:mt-5 mt-4"
                      >
                        <IoPersonAdd className="text-lg" />
                        {loading ? i18n?.t("Loading...") : i18n?.t("Signup")}
                      </button>
                    </div>
                  </Form>
                ),
              },
            ]}
          />
        </div>
      </Modal>
      {/* OTP Modal */}
      <Modal
        width={600}
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
        centered
      >
        <div className="w-full p-10">
          <div className="">
            <h1 className="heading-6 text-white capitalize">
              {i18n.t("Verify OTP")}
            </h1>
            <p className="description-2 text-[#888AA0] font-normal mt-2 sm:mt-3">
              {i18n.t("Please enter 5-digit code sent to ")}
              <span className="text-primary">{otpEmail}</span>{" "}
            </p>
            <Form
              className="mt-5 md:mt-6 lg:mt-8 xl:mt-10"
              onFinish={async (value) => {
                if (!!otp) {
                  setLoading(true);
                  const fcmToken = await requestPermissionAndGetToken();
                  const data = await postSignup({
                    body: {
                      otp: otp,
                      name: signUpValues.name,
                      email: signUpValues.email,
                      password: signUpValues.password,
                      fcm_token: fcmToken,
                    },
                  });
                  if (data.success) {
                    message.success(data.message);
                    form.resetFields();
                    signInform.resetFields();
                    setAuthModalOpen(true);
                    setLoading(false);
                    handleCancel();
                  } else {
                    message.error(data.errorMessage);
                    setLoading(false);
                    form.resetFields();
                    signInform.resetFields();
                  }
                }
              }}
              layout="vertical"
            >
              <div className="otp">
                <Input.OTP
                  onChange={(value) => setOtp(value)}
                  className="w-full p-3 sm:p-4 xl:p-5 glass-effect rounded text-white"
                  length={5}
                />
              </div>
              <div>
                <p className="mt-5 md:mt-6 lg:mt-8 xl:mt-10 description-2 text-[#888AA0]">
                  {i18n.t("Do not receive the code")} ?
                  {time === 0 ? (
                    <span className="text-primary cursor-pointer">
                      <button
                        onClick={async () => {
                          setLoading(true);
                          const data = await sendOtp({
                            body: {
                              identifier: otpEmail,
                              action: "signup",
                            },
                          });
                          if (data.success) {
                            message.success(data.message);
                            reset();
                            start();
                            setLoading(false);
                          }
                        }}
                      >
                        {loading ? i18n?.t("Loading...") : i18n?.t("Resend")}
                      </button>
                    </span>
                  ) : (
                    <span className="text-primary cursor-not-allowed">
                      <button>
                        {i18n.t("Resend")} in {time} s
                      </button>
                    </span>
                  )}
                </p>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full common-btn text-[#02050A] font-semibold bg-primary xl:mt-8 lg:mt-6 sm:mt-5 mt-4"
                >
                  {loading ? i18n?.t("Loading...") : i18n?.t("Verify")}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuthModal;
