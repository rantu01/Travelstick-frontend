"use client";
import React, { useRef, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app, requestPermissionAndGetToken } from "@/firebase.config";
import { googleLogin, postLogin, sendOtp, postSignup } from "@/app/helper/backend";
import { useUser } from "@/app/contexts/user";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { Modal, Form, Input } from "antd";
import FormInput from "@/app/components/form/input";
import FormPassword from "@/app/components/form/password";
import { useTimer } from "use-timer";

const TravelLandingPage = () => {
    // Scroll korar jonno reference
    const topSectionRef = useRef(null);

    const scrollToTop = () => {
        topSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const [googleLoading, setGoogleLoading] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [signUpModalOpen, setSignUpModalOpen] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpEmail, setOtpEmail] = useState("");
    const [signUpValues, setSignUpValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [signUpForm] = Form.useForm();
    const { time, start, pause, reset } = useTimer({
        initialTime: 120,
        timerType: "DECREMENTAL",
    });
    const { setUser } = useUser();
    const router = useRouter();

    const signInWithGoogle = async () => {
        try {
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
                message.success(data?.message || "Logged in");
                if (data?.data?.user?.role === "admin" || data?.data?.user?.role === "employee") {
                    router.push("/admin");
                } else if (data?.data?.user?.role === "user") {
                    router.push("/user");
                } else {
                    router.push("/");
                }
            } else {
                message.error(data?.errorMessage || "Google login failed");
            }
        } catch (err) {
            console.error(err);
            message.error("Google sign-in canceled or failed");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleEmailSubmit = async (value) => {
        try {
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
                message.success(data?.message || "Logged in");
                form.resetFields();
                setEmailModalOpen(false);
                if (data?.data?.user?.role === "admin" || data?.data?.user?.role === "employee") {
                    router.push("/admin");
                } else if (data?.data?.user?.role === "user") {
                    router.push("/user");
                } else {
                    router.push("/");
                }
            } else {
                message.error(data?.errorMessage);
            }
        } catch (err) {
            console.error(err);
            message.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpSubmit = async (value) => {
        try {
            setLoading(true);
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
                signUpForm.resetFields();
                setSignUpModalOpen(false);
                setOtpModalOpen(true);
                reset();
                start();
            } else {
                message.error(data.errorMessage);
            }
        } catch (err) {
            console.error(err);
            message.error("Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) return message.error("Enter OTP");
        try {
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
                setOtp("");
                setOtpModalOpen(false);
                setEmailModalOpen(true);
            } else {
                message.error(data.errorMessage);
            }
        } catch (err) {
            console.error(err);
            message.error("OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">

            {/* Upper Section: Sign In & Illustration */}
            <div
                ref={topSectionRef}
                className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/theme1/loginBG.png')",
                }}
            >
                {/* Mock Illustration Background elements (Simplified) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 text-6xl opacity-20">🚗</div>
                    <div className="absolute bottom-20 right-20 text-8xl opacity-20">✈️</div>
                </div>

                {/* Sign In Card */}
                <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
                    <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

                    <button onClick={() => setEmailModalOpen(true)} className="w-full bg-[#1a2b6d] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-4 hover:bg-[#14235c] transition-colors">
                        <span>📧</span> Email Address
                    </button>

                    <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-6 hover:bg-gray-50 transition-colors">
                        <span>📞</span> Mobile Number
                    </button>

                    <div className="flex items-center gap-2 mb-6 text-gray-400 text-sm">
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                        <span>Or Sign In with</span>
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                        <button onClick={signInWithGoogle} disabled={googleLoading} className="w-full p-2 border rounded-full hover:bg-gray-50 flex items-center justify-center px-4">
                            {googleLoading ? (
                                'Loading...'
                            ) : (
                                <>
                                    <img src="/googleLogo.png" alt="Google Logo" className="h-5 w-5 mr-2" />
                                    Log in with Google
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-sm text-gray-600">
                        Don't have an account? <span onClick={() => setSignUpModalOpen(true)} className="text-[#1a2b6d] font-bold cursor-pointer">Sign up!</span>
                    </p>
                </div>
            </div>

            <Modal
                open={emailModalOpen}
                onCancel={() => setEmailModalOpen(false)}
                footer={null}
                centered
                width={500}
                className="auth-modal"
                maskClosable={false}
            >
                <div className="px-6 md:px-12 pb-6 pt-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Sign In</h2>
                    <Form form={form} layout="vertical" onFinish={handleEmailSubmit} initialValues={{ email: "" }}>
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
                        <div className="text-center">
                            <button type="submit" className="flex items-center justify-center gap-2 w-full view-button bg-primary xl:mt-8 lg:mt-6 sm:mt-5 mt-4">
                                {loading ? 'Loading...' : 'Login'}
                            </button>
                        </div>
                    </Form>
                </div>
            </Modal>

            <Modal
                open={signUpModalOpen}
                onCancel={() => setSignUpModalOpen(false)}
                footer={null}
                centered
                width={500}
                className="auth-modal"
                maskClosable={false}
            >
                <div className="px-6 md:px-12 pb-6 pt-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Signup</h2>
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                            <span>Or Signup with</span>
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                        </div>

                        <button onClick={signInWithGoogle} disabled={googleLoading} className="w-full p-2 border rounded-full hover:bg-gray-50 flex items-center justify-center px-4">
                            {googleLoading ? (
                                'Loading...'
                            ) : (
                                <>
                                    <img src="/googleLogo.png" alt="Google Logo" className="h-5 w-5 mr-2" />
                                    Log in with Google
                                </>
                            )}
                        </button>
                    </div>

                    <Form form={signUpForm} layout="vertical" onFinish={handleSignUpSubmit} initialValues={{ name: "", email: "" }}>
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
                            <button type="submit" className="flex items-center justify-center gap-2 w-full view-button bg-primary xl:mt-8 lg:mt-6 sm:mt-5 mt-4">
                                {loading ? 'Loading...' : 'Signup'}
                            </button>
                        </div>
                    </Form>
                </div>
            </Modal>

            <Modal
                width={600}
                open={otpModalOpen}
                onCancel={() => setOtpModalOpen(false)}
                maskClosable={false}
                footer={null}
                centered
            >
                <div className="w-full p-10">
                    <div className="">
                        <h1 className="heading-6 text-white capitalize">Verify OTP</h1>
                        <p className="description-2 text-[#888AA0] font-normal mt-2 sm:mt-3">Please enter 5-digit code sent to <span className="text-primary">{otpEmail}</span></p>
                        <Form onFinish={handleVerifyOtp} layout="vertical" className="mt-5 md:mt-6 lg:mt-8 xl:mt-10">
                            <div className="otp">
                                <Input.OTP onChange={(value) => setOtp(value)} className="w-full p-3 sm:p-4 xl:p-5 glass-effect rounded text-white" length={5} />
                            </div>
                            <div>
                                <p className="mt-5 md:mt-6 lg:mt-8 xl:mt-10 description-2 text-[#888AA0]">
                                    Do not receive the code ?
                                    {time === 0 ? (
                                        <span className="text-primary cursor-pointer">
                                            <button onClick={async () => {
                                                setLoading(true);
                                                const data = await sendOtp({ body: { identifier: otpEmail, action: 'signup' } });
                                                if (data.success) {
                                                    message.success(data.message);
                                                    reset();
                                                    start();
                                                    setLoading(false);
                                                }
                                            }}>{loading ? 'Loading...' : 'Resend'}</button>
                                        </span>
                                    ) : (
                                        <span className="text-primary cursor-not-allowed"><button>Resend in {time} s</button></span>
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <button type="submit" onClick={handleVerifyOtp} className="w-full common-btn text-[#02050A] font-semibold bg-primary xl:mt-8 lg:mt-6 sm:mt-5 mt-4">{loading ? 'Loading...' : 'Verify'}</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Modal>

            {/* Lower Section: Hero / City View */}
            <div
                className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center text-white text-center p-6"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/theme1/cityimage.jpg')",
                }}
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-lg">
                    Start Exploring the World with Us!
                </h1>

                <button
                    onClick={scrollToTop}
                    className="group bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-all transform hover:scale-105"
                >
                    Get Started
                    <span className="text-xl transition-transform duration-300 group-hover:-rotate-45">
                        →
                    </span>
                </button>
            </div>

        </div>
    );
};

export default TravelLandingPage;