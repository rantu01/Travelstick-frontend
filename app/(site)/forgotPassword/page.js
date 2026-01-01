/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import MainLoader from "@/app/(dashboard)/components/common/loader";
import Banner from "@/app/components/site/common/component/Banner";
import Banner2 from "@/app/components/site/common/component/Banner2";
import ForgetPasswordPage from "@/app/components/theme1/forgetPassword/forgetPassword";

import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useEffect } from "react";

const ForgetPassword = () => {
  const [dataTheme, getDataTheme, { loading }] = useFetch(
    fetchPageContentTheme1,
    {
      status: true,
    }
  );
  useEffect(() => {
    if (dataTheme) getDataTheme();
  }, []);
  const activeTheme = dataTheme?.theme;

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center">
          <MainLoader />
        </div>
      ) : (
        <div>
          <ForgetPasswordPage theme={activeTheme} />
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
