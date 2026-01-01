/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import { useI18n } from "@/app/contexts/i18n";
import { fetchAdminLanguages, putLanguage } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Form } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Translations = () => {
  const i18n = useI18n();
  const params = useParams();
  const id = params?._id;
  const [translations, getTranslations] = useFetch(fetchAdminLanguages, {}, false);
  const [data, getData] = useFetch(fetchAdminLanguages, {}, false);
  const [refresh, setRefresh] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      getData({ _id: id });
      getTranslations({ _id: id });
    }
  }, [id, refresh]);

  useEffect(() => {
    if (translations) {
      let values = {};
      Object?.keys(translations?.translations ?? {})?.forEach((key) => {
        values = {
          ...values,
          [id]: {
            ...values[id],
            [key]: {
              value: translations?.translations[key],
            },
          },
        };
      });
      form.setFieldsValue(values);
    }
  }, [translations]);

  const keys = [
    //setting
    { name: "Offer Section Information" },
    { name: "Destination Section Information" },
    { name: "Tour Guides Section Information" },
    { name: "Testimonial Section Information" },
    { name: "Visa Section Information" },
    { name: "Packages Section Information" },
    { name: "Blog Section Information" },
    { name: "Newsletter Section Information" },
    { name: "FAQ Section Information" },
    { name: "Product Section Information" },
    { name: "Add New Language" },
    { name: "Edit Language" },
    { name: "Quick Setup" },
    { name: "Create Admin" },
    { name: "Enter Name" },
    { name: "Enter Admin Email" },
    { name: "Enter Admin Phone" },
    { name: "Enter Admin Password" },
    { name: "Confirm Admin Password" },
    { name: "Database Setup" },
    { name: "Database String" },
    { name: "Website Name" },
    { name: "Client Side URL" },
    { name: "Server Side URL" },
    { name: "Node Env" },
    { name: "AWS Bucket Information" },
    { name: "File Upload Type" },
    { name: "AWS Bucket Name" },
    { name: "AWS Access Key" },
    { name: "AWS Secret Access Key" },
    { name: "AWS Region" },
    { name: "Please Wait" },
    // User Dashboard
    { name: "Packages Booking" },
    { name: "Revenue Booking" },
    { name: "Visa Booking" },
    { name: "Hotel Booking" },
    { name: "Testimonials" },
    { name: "Change Password" },
    { name: "Sign Out" },
    { name: "Product" },

    // Inner Page
    { name: "Cart" },
    { name: "Tour Packages" },
    { name: "Items" },
    { name: "Action" },
    { name: "No items found" },
    { name: "Order Summary" },
    { name: "Sub Total" },
    { name: "Delivery Charge" },
    { name: "Total Amount" },
    { name: "Proceed to Checkout" },
    { name: "Remove" },
    { name: "Select Payment Method" },
    { name: "Checkout" },
    { name: "Note" },
    { name: "Inquiry Form" },
    { name: "Email Address" },
    { name: "Your Message" },
    { name: "Visa Document" },
    { name: "Location" },
    { name: "Price Filter" },
    { name: "Service" },
    { name: "Amenities" },
    { name: "Room" },
    { name: "Hotel Rating" },
    { name: "Traveler Rating" },
    { name: "This place is a traveler favorite, thanks to its high ratings, glowing reviews, and trusted reliability—perfect for your next adventure" },
    { name: "Overall rating" },
    { name: "Submit Feedback" },
    { name: "Search Hotel" },
    { name: "Hotel Location" },
    { name: "Book This Hotel" },
    { name: "Children" },
    { name: "Tickets" },
    { name: "Extra Services" },
    { name: "Total Price" },
    { name: "Pay Now" },
    { name: "Activities" },
    { name: "Home" },

    // Authentication
    { name: "Login" },
    { name: "Forgot Password" },
    { name: "Login with Google" },
    { name: "Signup" },
    { name: "Verify OTP" },
    { name: "Do not receive the code" },
    { name: "Resend" },
    { name: "Verify" },

    // Navbar
    { name: "Home" },
    { name: "About" },
    { name: "Contact" },
    { name: "Logged out successfully" },
    { name: "Product" },
    { name: "Blog" },
    { name: "Logout" },
    { name: "Tour" },
    { name: "Destination" },
    { name: "Pages" },
    { name: "Packages" },
    { name: "Terms And Condition" },
    { name: "Book A Trip" },

    // Hero
    { name: "View Packages" },
    { name: "Search" },
    { name: "Start From" },
    { name: "End At" },
    { name: "Visa Mode" },
    { name: "Validity" },
    { name: "Select Destination" },
    { name: "Select Tour Type" },
    { name: "Select start date" },
    { name: "Select end date" },
    { name: "Select Hotel Type" },
    { name: "Select Room Type" },
    { name: "Select hotel reputation" },
    { name: "Select Visa Type" },
    { name: "Select Visa Mode" },
    { name: "Select country" },
    { name: "Select validity" },
    { name: "Validity" },

    // Landing Page
    { name: "View Offer" },
    { name: "Trusted by over 32K growing companies" },
    { name: "Explore More" },
    { name: "Discover More" },
    { name: "View Details" },
    { name: "Show More" },
    { name: "Search Visa" },
    { name: "Subscribe" },
    { name: "Duration" },
    { name: "About This Package" },
    { name: "About This Hotel" },
    { name: "Included and Excluded" },
    { name: "Groups" },
    { name: "Book This Tour" },
    { name: "Tickets" },
    { name: "Extra Services" },
    { name: "Book Now" },
    { name: "Itinerary" },
    { name: "Tour Guider Details" },
    { name: "Specialties" },
    { name: "Filters" },
    { name: "No Packages Found" },
    { name: "Date" },
    { name: "Teat Time" },
    { name: "Out of Stock" },
    { name: "In Stock" },
    { name: "Groups" },

    // Admin Dashboard
    { name: "Dashboard" },
    { name: "Users" },
    { name: "Destination" },
    { name: "Offer Management" },
    { name: "Hotel Management" },
    { name: "Package Management" },
    { name: "Services" },
    { name: "Hotels" },
    { name: "Bookings" },
    { name: "Reviews" },
    { name: "Visa Management" },
    { name: "Visa Type" },
    { name: "Visa" },
    { name: "Tour Guiders" },
    { name: "Product Management" },
    { name: "Categories" },
    { name: "Products" },
    { name: "Orders" },
    { name: "Support Ticket" },
    { name: "Blog Management" },
    { name: "Blogs" },
    { name: "Site Testimonials" },
    { name: "HRM" },
    { name: "All Employee" },
    { name: "Roles" },
    { name: "FAQ" },
    { name: "Settings" },
    { name: "Site Settings" },
    { name: "Page Settings" },
    { name: "Email Settings" },
    { name: "SMS Settings" },
    { name: "Payment Settings" },
    { name: "Dynamic Sections" },
    { name: "Contact Us" },
    { name: "Newsletter" },
    { name: "Languages" },
    { name: "Packages Revenue" },
    { name: "Hotel Revenue" },
    { name: "Visa Revenue" },
    { name: "Product Revenue" },
    { name: "Revenue Trend" },
    { name: "Packages" },
    { name: "Hotel" },
    { name: "Visa" },
    { name: "Booking Distribution" },
    { name: "Phone" },
    { name: "Actions" },
    { name: "Employee List" },
    { name: "Latest Packages" },
    { name: "Package Name" },
    { name: "Booking Date" },
    { name: "Amount" },
    { name: "Order Status" },
    { name: "Pending" },
    { name: "Cancelled" },
    { name: "Pending" },
    { name: "Confirmed" },
    { name: "Completed" },
    { name: "Recent Package Bookings" },
    { name: "Package Booking Details" },
    { name: "Package Image" },
    { name: "User Image" },
    { name: "Booking Id" },
    { name: "Package name" },
    { name: "Package Price" },
    { name: "Check In Date" },
    { name: "Check out Date" },
    { name: "Booking Person" },
    { name: "Transaction Id" },
    { name: "Payment Status" },
    { name: "Order Date" },
    { name: "Recent Hotel Bookings" },
    { name: "Package Image" },
    { name: "Language List" },

    // contact us
    { name: "Email" },
    { name: "Subject" },
    { name: "Message" },
    { name: "Contact At" },
    { name: "Contact Us List" },

    // Destinations
    { name: "Add New Destination" },
    { name: "Edit Destination" },
    { name: "Destination Images" },
    { name: "About Destination" },
    { name: "Destination Name" },
    { name: "Destination Capital Name" },
    { name: "Destination Language Name" },
    { name: "Destination Currency Name" },
    { name: "Destination Video URL" },
    { name: "Update Destination" },
    { name: "View Destination Details" },
    { name: "Destination Details" },
    { name: "Destination Location" },
    { name: "Address" },
    { name: "Discover more handpicked destinations that complement your journey and inspire your next adventure" },
    { name: "Explore Related Destinations" },
    { name: "Destination List" },
    { name: "Capital" },
    { name: "No Related Products Found" },
    { name: "Related Products" },
    { name: "Add to Cart" },
    { name: "Buy Now" },
    { name: "Product Details" },
    { name: "Language" },
    { name: "Currency" },

    // Employee
    { name: "Registered At" },
    { name: "Permissions" },
    { name: "Employee List" },
    { name: "Edit Employee" },
    { name: "Add Employee" },
    { name: "Phone Number" },
    { name: "Reset Your Password" },
    { name: "Old Password" },
    { name: "New Password" },
    { name: "Confirm Password" },

    // FAQ
    { name: "Question" },
    { name: "Answer" },
    { name: "FAQ List" },
    { name: "Edit Faq" },
    { name: "Add Faq" },

    // Hotel Management
    { name: "Add New Hotel" },
    { name: "Edit Hotel" },
    { name: "Price" },
    { name: "Capacity" },
    { name: "Hotel Type" },
    { name: "Hotel List" },
    { name: "View Hotel Details" },
    { name: "Hotel Details" },
    { name: "Room Type" },
    { name: "Reputation" },
    { name: "Discount" },
    { name: "Discount Type" },
    { name: "Created At" },
    { name: "Hotel Description" },
    { name: "Highlights" },
    { name: "Includes" },
    { name: "Excludes" },
    { name: "Hotel Name" },
    { name: "About Hotel" },
    { name: "Hotel Destination" },
    { name: "Hotel Reputation" },
    { name: "Hotel Contain Capacity" },
    { name: "Discount Amount" },
    { name: "Active" },
    { name: "Inactive" },
    { name: "Hotel Services" },
    { name: "Edit Hotel Service" },
    { name: "Service Title" },
    { name: "Service Price" },
    { name: "Reviewer Image" },
    { name: "Reviewer Name" },
    { name: "Comment" },
    { name: "Hotel Review" },
    { name: "Hotel Image" },
    { name: "User Name" },
    { name: "Hotel Booking Details" },
    { name: "Booking Person" },

    // Blog management
    { name: "Add New Blog" },
    { name: "Edit Blog" },
    { name: "Please enter a valid email address" },
    { name: "Blogs List" },
    { name: "Image" },
    { name: "Title" },
    { name: "Short Description" },
    { name: "Category" },
    { name: "Status" },
    { name: "Latest" },
    { name: "Created At" },
    { name: "Add New" },
    { name: "Blog Details" },
    { name: "Banner Image" },
    { name: "Author" },
    { name: "Recent Posts" },
    { name: "Tags" },
    { name: "Published On" },
    { name: "Read Time" },
    { name: "Submit" },
    { name: "Send Message" },
    { name: "Follow Us" },
    { name: "Category Name" },
    { name: "Blog Categories" },
    { name: "Edit Blog Category" },
    { name: "Add New Blog Category" },

    // Newsletter
    { name: "Subscribed At" },
    { name: "Send Mail" },
    { name: "Newsletter List" },
    { name: "Send Mail All" },
    { name: "Send Mail To All Newsletter Subscribers" },
    { name: "Send Mail To Newsletter Subscriber" },
    { name: "Close" },
    { name: "Send" },

    // Offer
    { name: "Offer Type" },
    { name: "Expires At" },
    { name: "Offer List" },
    { name: "Edit Offer" },
    { name: "Add Offer" },
    { name: "Offer Title" },
    { name: "Offer Description" },
    { name: "Offer Type" },
    { name: "Offer Details" },

    // Package Management
    { name: "Check In" },
    { name: "Check Out" },
    { name: "Package List" },
    { name: "Add New Package" },
    { name: "Edit Package" },
    { name: "Package activity" },
    { name: "About Package" },
    { name: "Group Size" },
    { name: "Tour Type" },
    { name: "Trending" },
    { name: "Itinerary" },
    { name: "Feathers" },
    { name: "Add Feathers" },
    { name: "Add Itinerary" },
    { name: "Add Exclude" },
    { name: "Add Include" },
    { name: "Add Highlight" },

    // Product Management
    { name: "Product List" },
    { name: "Add New Product" },
    { name: "Edit Product" },
    { name: "Order ID" },
    { name: "Quantity" },
    { name: "Order Date" },
    { name: "Product Orders" },
    { name: "Product Categories" },
    { name: "Edit Product Category" },
    { name: "Add New Product Category" },

    // profile
    { name: "Edit Profile" },
    { name: "Full Name" },
    { name: "Phone Number" },
    { name: "City" },
    { name: "Country" },
    { name: "State" },
    { name: "Zip Code" },
    { name: "Save Changes" },
    { name: "Logout" },

    //Tour Guider
    { name: "Tours Guiders" },
    { name: "Specialists" },
    { name: "Qualifications" },
    { name: "Professional Information" },
    { name: "Facebook Url" },
    { name: "Linkedin Url" },
    { name: "Instagram Url" },
    { name: "Twitter Url" },
    { name: "Add Tour Guider" },
    { name: "Edit tour Guider" },
    { name: "About Provider" },
    { name: "Personal Information" },
    { name: "Add Specialist" },
    { name: "Add Qualification" },

    // HRM
    { name: "Edit Role" },
    { name: "Add Role" },
    { name: "Role Name" },
    { name: "HRM Roles" },
    { name: "Registered At" },
    { name: "Create" },
    { name: "Edit" },
    { name: "View" },
    { name: "Delete" },
    { name: "Roles Permission" },

    // Setting
    { name: "Site Settings" },
    { name: "Upload Logo" },
    { name: "Favicon" },
    { name: "Select Upload Type" },
    { name: "Select Otp Type" },
    { name: "Client Side URL" },
    { name: "Server Side URL" },
    { name: "Linkedin Url" },
    { name: "Youtube Url" },
    { name: "Currency Code" },
    { name: "Currency Symbol" },
    { name: "Per Kiloliter Charge" },
    { name: "Delivery Charge" },
    { name: "Select Status" },
    { name: "Partnership" },
    { name: "Gallery" },

    // Dynamic Setting
    { name: "Why Choose Us" },
    { name: "Add Feature" },

    // Email Settings
    { name: "SendGrid SMTP" },
    { name: "Gmail Provider" },
    { name: "Email Settings" },

    // Pages setting
    { name: "Page Settings" },
    { name: "Landing Page" },
    { name: "About Us" },
    { name: "Privacy & Policy" },
    { name: "Terms & Conditions" },
    { name: "Company Name" },
    { name: "Company Address" },
    { name: "Video Url" },
    { name: "Company Number" },
    { name: "Home Page Settings" },
    { name: "Newsletter Video" },
    { name: "Privacy Policy" },

    // Users
    { name: "Joined At" },
    { name: "Password Changed Successfully" },
    { name: "User List" },
    { name: "Change User Password" },
    { name: "Confirm Password" },
    { name: "Date Of Birth" },
    { name: "Gender" },
    { name: "Our Image Gallery" },
    { name: "Follow Us On" },
    { name: "Useful link" },
    { name: "Visa Services" },
    { name: "Email Us" },
    { name: "Payment Partners" },
    { name: "Visa Inquiry List" },
    { name: "View Document" },
    { name: "No Document" },
    { name: "Product Orders Completed" },
    {name: "Mark all as read"},
    {name: "Marked as read"},
    {name: "Mark as read"},
    {name: "No Notification Found"},
    {name: "Notifications"},
    {name: "Already marked"},
  ];

  const handleSubmit = async (values) => {
    let translationsArray = [];
    Object.keys(values)?.forEach((lang) => {
      Object.keys(values[lang])?.forEach((key) => {
        translationsArray.push({
          [key]: values[lang][key].value,
        });
      });
    });

    const translationsObject = {
      translations: Object.assign({}, ...translationsArray),
    };

    const response = await useAction(
      putLanguage,
      {
        body: {
          _id: id,
          name: data?.name,
          code: data?.code,
          flag: data?.flag,
          ...translationsObject,
        },
      },
      () => {
        getTranslations({ _id: id });
        setRefresh((prev) => !prev);
      }
    );

  };

  return (
    <>
      <div className="w-full overflow-x-auto mt-7">
        <div className="rounded mx-6 bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">{i18n.t("Language List")}</h1>
            <BackButton />
          </div>
          <div className="px-8 py-8">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <table className="w-full">
                <thead className="bg-primary/20">
                  <tr>
                    <th className="py-2 px-6 text-start w-1/2">English</th>
                    <th className="py-2 px-6 text-start w-1/2">{data?.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {keys?.map((key, index) => (
                    <tr key={index}>
                      <td className="mx-3 my-3 w-1/2 ">
                        <FormInput
                          className="w-full rounded bg-transparent p-3 mt-3 dashinput"
                          initialValue={key.name}
                          readOnly={true}
                        />
                      </td>

                      {id && (
                        <td className="pl-4 w-1/2">
                          <HiddenInput
                            name={[id, key?.name, "type"]}
                            initialValue={key?.type}
                          />
                          <FormInput
                            className="w-full rounded bg-transparent p-3 mt-3 dashinput"
                            name={[id, key?.name, "value"]}
                            placeholder="Type here"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button type="submit"> {i18n.t("Save")} </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Translations;
