"use client";
import ContactPage from "@/app/components/theme1/contact/contact";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
const Contact = () => {

  const [data] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data?.theme;

  return (
    <div>
      <ContactPage theme={theme} />
    </div>
  );
};

export default Contact;