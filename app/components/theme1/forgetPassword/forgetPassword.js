'use client'
import FormInput from '@/app/components/form/input'
import Banner from '@/app/components/site/common/component/Banner'
import { Form, Input, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { postResetPassword, postVerifyOTP, sendOtp } from '@/app/helper/backend'
import { useTimer } from 'use-timer';
import FormPassword from '@/app/components/form/password'
import { useI18n } from '@/app/contexts/i18n'
import Banner2 from '../../site/common/component/Banner2'
const ForgetPasswordPage = ({ theme }) => {
  const i18n = useI18n();
  const [forgetPasswordForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const router = useRouter();
  const [passwordModal, setPasswordModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { time, start, pause, reset } = useTimer({
    initialTime: 120,
    timerType: 'DECREMENTAL',
  });
  useEffect(() => {
    if (otpEmail) {
      start();
    }
    if (time === 0) pause();
  }, [time, start, pause, otpEmail]);
  const handleSubmit = async (value) => {
    setLoading(true);
    if (!!value?.email) {
      setOtpEmail(value.email);
      const data = await sendOtp({
        body: {
          identifier: value.email,
          action: "forget_password"
        }
      });
      if (data.success) {
        message.success(data.message);
        setIsModalOpen(true);
        setLoading(false);
      } else {
        message.error(data.errorMessage);
        setLoading(false);
      }
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  }
  const handlePasswordMOdalCancel = () => {
    setPasswordModal(false);
  }
  const [form] = Form.useForm();
  return (
    <section className=''>
      {
        theme === 'one' ?
          <Banner title='Forget Password' /> :
          <Banner2 title='Forget Password' />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative">
        <div className=" md:max-w-[868px] w-full md:mx-auto relative ">
          <div className="px-10 sm:px-[150px] md:px-[200px] lg:px-[232px]">
            <h1 className='heading-3 text-[#05073C] capitalize'>{i18n.t('Forgot Your Password')}?</h1>
            <p className='description-2 text-[#888AA0] font-normal mt-2 sm:mt-3'>{i18n.t('Please enter your email to reset your password')}</p>
            <Form initialValues={{ email: '' }} autoComplete='off' className='mt-5 md:mt-6 lg:mt-8 xl:mt-10' layout='vertical' onFinish={handleSubmit} form={form}>
              <div className=''>
                <FormInput className='w-full p-3 md:p-4 rounded-xl focus:outline-primary' label='Email' type={'email'} name='email' placeholder='Enter your email' required={true} />
              </div>
              <div className="text-center">
                <button type='submit' className='mt-6 w-full common-btn !rounded-xl bg-primary'>{loading ? i18n.t('Loading...') : i18n.t('Continue')}</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <div className="w-full p-10">
          <div className="">
            <h1 className='heading-6 text-white capitalize'>{i18n.t('Verify OTP')}</h1>
            <p className='description-2 text-[#888AA0] font-normal mt-2 sm:mt-3'>{i18n.t('Please enter 4-digit code sent to')} <span className='text-primary'>{otpEmail}</span> </p>
            <Form  form={forgetPasswordForm} className='mt-5 md:mt-6 lg:mt-8 xl:mt-10' onFinish={
              async (value) => {
                if (!!otp) {
                  const data = await postVerifyOTP({
                    body: {
                      otp: otp,
                      action: "forget_password",
                      identifier: otpEmail
                    }
                  })
                  if (data.success) {
                    setAccessToken(data.data.accessToken);
                    message.success(data.message);
                    form.resetFields();
                    forgetPasswordForm.resetFields();
                    handleCancel();
                    setPasswordModal(true);
                  }
                  else {
                    message.error(data.errorMessage);
                  }
                }
              }
            } layout='vertical'>
              <div className='otp'>
                <Input.OTP onChange={(value) => setOtp(value)} className='w-full p-3 sm:p-4 xl:p-5 glass-effect rounded text-white' length={5} />
              </div>
              <div>
                <p className='mt-5 md:mt-6 lg:mt-8 xl:mt-10 description-2 text-[#888AA0]'>
                  {i18n.t("Do not receive the code")} ?
                  {
                    time === 0 ? (
                      <span className='text-primary cursor-pointer'>
                        <button onClick={async () => {
                          const data = await sendOtp({
                            body: {
                              "identifier": otpEmail,
                              "action": "signup"
                            }
                          });
                          if (data.success) {
                            message.success(data.message);
                            reset();
                            start();
                          }

                        }}>{i18n.t("Resend")}</button>
                      </span>
                    ) : <span className='text-primary cursor-pointer'>
                      <button>{i18n.t("Resend")} in {time} s</button>
                    </span>
                  }

                </p>
              </div>
              <div className="text-center">
                <button type='submit' className='mt-6 w-full common-btn text-[#02050A] font-semibold bg-primary'>{i18n.t('Verify')}</button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>

      {/* Password modal  */}
      <Modal open={passwordModal} onCancel={handlePasswordMOdalCancel} footer={null} centered>
        <div className="w-full p-10">
          <div className="">
            <h1 className='heading-3 text-[#05073C] capitalize'>{i18n.t('Reset Password')}</h1>
            <p className='description-1 text-[#888AA0] font-normal mt-2 sm:mt-3'>{i18n.t('Please enter your new password and confirm password')}</p>
            <Form  form={resetPasswordForm} className='mt-5 md:mt-6 lg:mt-8 xl:mt-10' onFinish={
              async (value) => {
                if (!!otp) {
                  const data = await postResetPassword({
                    body: {
                      "password": value.password,
                      "confirm_password": value.confirm_password,
                    },
                    accessToken: accessToken
                  })
                  if (data.success) {
                    message.success(data.message);
                    form.resetFields();
                    resetPasswordForm.resetFields();
                    handlePasswordMOdalCancel();
                    router.push('/');
                  }
                  else {
                    message.error(data.errorMessage);
                  }
                }
              }
            } layout='vertical'>
              <div className='sm:!mt-2 auth'>
                <FormPassword className='w-full p-3 md:p-4  rounded focus:outline-primary border' label='Password' name='password' placeholder='Enter your password' required={true} />
              </div>
              <div className='sm:!mt-2 auth'>
                <FormPassword className='w-full p-3 md:p-4  rounded focus:outline-primary border' confirm label='Re-type Password' name='confirm_password' placeholder='Confirm your password' required={true} />
              </div>
              <div className="text-center">
                <button type='submit' className='w-full mt-6 common-btn text-[#02050A] font-semibold bg-primary xl:mt-8 lg:mt-6 sm:mt-5'>{i18n.t('Reset Password')}</button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default ForgetPasswordPage
