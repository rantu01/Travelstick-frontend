import { del, get, patch, post, postForm, put, deleted } from "./api";

//auth
export const sendOtp = (data) => post("/otps/send", data);
export const postSignup = (data) => post("/users/register", data);
export const postLogin = (data) => post("/auth/login", data);
export const googleLogin = (data) => post("/auth/verify-with-google", data);
export const postVerifyOTP = (data) => post("/auth/forget-password/verify-otp", data);
export const updatePassword = (data) => patch("/auth/password-update", data);

//sent Message 
export const sentMessage = (data) => post('/contacts/send', data)

//site management
export const fetchPageContent = (data) => get("/settings/pages/site", data)
export const fetchPageContentTheme1 = (data) => get("/settings/pages/site?slug=home_page", data)
export const postPageContent = (data) => post("/settings/pages", data);
export const putPageContent = (data) => put("/settings/pages", data);
export const updatePageContent = (data) => patch("/settings/pages", data)
export const fetchSettings = (data) => get("/settings", data);
export const fetchPublicSettings = (data) => get("/settings/site", data);
export const updateSettings = (data) => patch("/settings", data);
export const postSettings = (data) => post("/settings", data);
export const fetchEmailSettings = (data) => get("/settings", data);
export const postEmailSettings = (data) => post("/settings", data);
export const fetchsSMSSettings = (data) => get("/settings?fields=phone_config", data);
export const postsSMSSettings = (data) => post("/settings?fields=phone_config", data);

//dynamic setting
export const fetchDynamicSettings = (data) => get("/settings/sections", data);
export const updatedtDynamicSettings = (data) => patch("/settings/sections", data);

//user management
export const fetchUserList = (data) => get('/users', data)
export const fetchUserDetailsByAdmin = (data) => get('/user/details/admin-panel', data)
export const deleteUserByAdmin = (data) => del(`/users/${data._id}`)
export const updatePasswordByAdmin = (data) => patch('/users/password-update', data)
export const updateUserStatusByAdmin = (data) => patch('/user/accountant-activation', data)
export const fetchUser = (data) => get("/users/profile", data);
export const postResetPassword = (data) => post("/auth/forget-password/submit", data, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.accessToken ? data.accessToken : ''}` } });
// Newsletter
export const fetchNewsletterList = (data) => get('/subscribers', data)
export const postNewsletterList = (data) => post('/subscribers', data)
export const fetchNewsletterDetails = (data) => get(`/newsletters/${data._id}`, data)
export const postNewsletter = (data) => post('/newsletters', data)
export const postNewsletterMessage = (data) => post(`/subscribers/send-email`, data)
export const patchNewsletter = (data) => patch(`/newsletters/${data._id}`, data)
export const deleteNewsletter = (data) => del(`/subscribers/${data._id}`)
//translation
export const fetchTranslations = (data) => get("/settings/languages/site", data);
export const fetchAllLanguages = (data) => get("/settings/languages/site", data);
export const fetchAdminLanguages = (data) => get("/settings/languages", data);
export const putLanguage = (data) => put("/settings/languages", data);
export const postLanguage = (data) => post("/settings/languages", data);
export const delLanguage = (data) => del(`/settings/languages/${data._id}`);

// get user and Update user
export const getUser = (data) => get("/users/profile", data);
export const updateUser = (data) => patch("/users/profile", data);
//FAQ
export const fetchFAQ = (data) => get("/faqs", data)
export const deleteFAQ = (data) => del(`/faqs/${data._id}`)
export const postFAQ = (data) => post(`/faqs`, data)
export const updatedFAQ = (data) => put(`/faqs`, data)

//blog tag
export const blogTagGet = (data) => get('/blog-tags', data)
export const blogTagUpdate = (data) => put(`/blog-tags`, data)
export const blogTagCreate = (data) => post('/blog-tags', data)
export const blogTagDelete = (data) => del(`/blog-tags/${data._id}`)

//blog categories
export const blogCategoriesGet = (data) => get('/blog-categories', data)
export const blogCategoriesUpdate = (data) => put(`/blog-categories`, data)
export const blogCategoriesCreate = (data) => post('/blog-categories', data)
export const blogCategoriesDelete = (data) => del(`/blog-categories/${data._id}`)
export const getBlogCategoriesPublic = (data) => get("/blogs/categories", data);

//blogs 
export const blogGet = (data) => get('/blogs', data)
export const blogUpdate = (data) => put(`/blogs`, data)
export const blogCreate = (data) => post('/blogs', data)
export const blogDelete = (data) => del(`/blogs/${data._id}`)
export const getPublicBlog = (data) => get('/blogs/site', data)
export const getLatestPublicBlog = (data) => get('/blogs/site?is_latest=true', data)
export const getLatestPublicBlogSite = (data) => get('/blogs/site', data)

//image upload 
export const singleImageUpload = (data) => postForm('/files/single-image-upload', data);
export const singlePDFUpload = (data) => postForm('/files/single-pdf-upload', data);
export const multipleImageUpload = (data) => postForm('/files/multiple-image-upload', data);
export const deleteImage = (data) => deleted(`/files/file-remove`, data);

// Destination
export const postDestination = (data) => post('/destinations', data)
export const updateDestination = (data) => put(`/destinations`, data)
export const getDestination = (data) => get('/destinations', data)
export const getAllPublicDestination = (data) => get('/destinations/site', data)
export const deleteDestination = (data) => del(`/destinations/${data._id}`)

//Activity
export const postActivity = (data) => post('/activities', data)
export const updateActivity = (data) => put(`/activities`, data)
export const getActivity = (data) => get('/activities', data)
export const getAllPublicActivity = (data) => get('/activities/site', data)
export const deleteActivity = (data) => del(`/activities/${data._id}`)

// packages Management
export const createPackages = (data) => post('/packages', data)
export const getAllPackages = (data) => get('/packages', data)
export const updatePackages = (data) => put('/packages', data)
export const deletePackages = (data) => del(`/packages/${data._id}`, data)
export const getAllPublicPackages = (data) => get('/packages/site', data)
export const getAllSidePublicPackages = (data) => get('/packages/sidebar', data)

//Package services
export const getAllPackageServices = (data) => get('/services?module=package', data)
export const updatePackageServices = (data) => put('/services', data)
export const getAllPublicPackageServices = (data) => get('/services/site?module=package', data)

// package booking calculation amd payment
export const postPackageBookingCalculation = (data) => post('/packages/booking/calculate', data)
export const createPackageBookingPayment = (data) => post('/packages/booking', data)

// package review
export const postReview = (data) => post('/reviews', data)
export const getPackageReviewByAdmin = (data) => get('/reviews/package', data)
export const updatePackageReviewStatusByAdmin = (data) => put('/reviews', data)
export const deletePackageReviewByAdmin = (data) => del(`/reviews/${data._id}`)

// Package booking
export const getAllPackageBookingByAdmin = (data) => get('/packages/booking', data)
export const getAllPackageBookingByUser = (data) => get('/packages/booking', data)
export const updatePackageBookingStatus = (data) => patch('/packages/booking', data)

//Hotel Management
export const createHotel = (data) => post('/hotels', data)
export const updateHotel = (data) => put('/hotels', data)
export const getAllHotel = (data) => get('/hotels', data)
export const getAllPublicHotel = (data) => get('/hotels/site', data)
export const deleteHotel = (data) => del(`/hotels/${data._id}`, data)
export const getAllSidePublicHotel = (data) => get('/hotels/sidebar', data)

//Hotel services
export const getAllHotelServices = (data) => get('/services?module=room', data)
export const updateHotelServices = (data) => put('/services', data)
export const getAllPublicHotelServices = (data) => get('/services/site?module=room', data)

//create Hotel booking payment and calculation
export const createHotelBookingPayment = (data) => post('/hotels/booking', data)
export const hotelBookingCalculation = (data) => post('/hotels/booking/calculate', data)

// Hotel booking
export const getAllHotelBookingByAdmin = (data) => get('/hotels/booking', data)
export const getAllHotelBookingByUser = (data) => get('/hotels/booking', data)
export const updateHotelBookingStatus = (data) => patch('/hotels/booking', data)

// Hotel Review
export const getAllHotelReviewByAdmin = (data) => get('/reviews/hotel', data)
export const updateHotelReviewStatusByAdmin = (data) => put('/reviews', data)
export const deleteHotelReviewByAdmin = (data) => del(`/reviews/${data._id}`)


//visa Type Management
export const createVisaType = (data) => post('/visas/types', data)
export const updateVisaType = (data) => put('/visas/types', data)
export const getAllVisaType = (data) => get('/visas/types', data)
export const getAllPublicVisaType = (data) => get('/visas/types/site', data)
export const deleteVisaType = (data) => del(`/visas/types/${data._id}`, data)
//visa  Management
export const createVisa = (data) => post('/visas', data)
export const updateVisa = (data) => put('/visas', data)
export const getAllVisa = (data) => get('/visas', data)
export const getAllPublicVisa = (data) => get('/visas/site', data)
export const deleteVisa = (data) => del(`/visas/${data._id}`, data)
export const getAllSidePublicVisa = (data) => get('/visas/sidebar', data)
export const getAllVisaQuery = (data) => get('/visas/inquiries', data)
export const deleteVisaQuery = (data) => del(`/visas/inquiries/${data._id}`, data)
export const createVisaQuery = (data) => post('/visas/inquiries', data)

//HRM
export const CreateEmployee = (data) => post('/users/employees', data)
export const UpdateEmployee = (data) => put('/users/employees', data)
export const GetAllEmployees = (data) => get('/users/employees', data)
export const DeleteAEmployee = (data) => del(`/users/${data._id}`, data)
export const CreateRoles = (data) => post('/hrm/roles', data)
export const GetAllRoles = (data) => get('/hrm/roles', data)
export const UpdateRoles = (data) => put('hrm/roles', data)
export const DeleteARole = (data) => del(`/hrm/roles/${data._id}`, data)
export const AssignPermissions = (data) => patch('/hrm/roles/permissions', data)
export const GetAllPermission = (data) => get('/hrm/roles/permissions', data)

// Offers Management
export const createOffers = (data) => post('/offers', data)
export const getAllOffers = (data) => get('/offers', data)
export const updateOffers = (data) => put('/offers', data)
export const deleteOffers = (data) => del(`/offers/${data._id}`, data)
export const getAllPublicOffers = (data) => get('/offers/site', data)

//providers
export const CreateProvider = (data) => post('/providers', data)
export const GetAllProviders = (data) => get('/providers', data)
export const UpdateProvider = (data) => put('providers', data)
export const DeleteProvider = (data) => del(`/providers/${data._id}`, data)
export const GetPublicProviders = (data) => get('/providers/site', data)

//service management
export const CreateServiceCategory = (data) => post('/service-categories', data)
export const GetAllServiceCategories = (data) => get('/service-categories', data)
export const UpdateServiceCategory = (data) => put('service-categories', data)
export const DeleteServiceCategory = (data) => del(`/service-categories/${data._id}`, data)
export const GetPublicServiceCategories = (data) => get('/service-categories/site', data)

export const CreateService = (data) => post('/services', data)
export const GetAllServices = (data) => get('/services', data)
export const getAllPublicServices = (data) => get('/services/site', data)
export const UpdateService = (data) => put('services', data)
export const DeleteService = (data) => del(`/services/${data._id}`, data)

// service Tag
export const createServiceTag = (data) => post('/service-tags', data)
export const getAllServiceTags = (data) => get('/service-tags', data)
export const updateServiceTag = (data) => put('service-tags', data)
export const deleteServiceTag = (data) => del(`/service-tags/${data._id}`, data)

//contact
export const createContact = (data) => post('/contacts/send', data)
export const getAllContacts = (data) => get('/contacts', data)
export const updateContact = (data) => put('contacts', data)
export const deleteContact = (data) => del(`/contacts/${data._id}`, data)
export const replyContact = (data) => patch('/contacts/reply', data)

// advertisement
export const PostAdvertisement = (data) => post('/advertisements', data)
export const createImpression = (data) => post('/advertisements/impressions', data)
export const createClick = (data) => post('/advertisements/clicks', data)
export const UpdateAdvertisement = (data) => put(`/advertisements`, data)
export const GetAdvertisement = (data) => get('/advertisements', data)
export const getAllPublicAdvertisement = (data) => get('/advertisements/site', data)
export const DeleteAdvertisement = (data) => del(`/advertisements/${data._id}`)

//Testimonials
export const getAllTestimonialsByAdmin = (data) => get('/testimonials', data)
export const updateTestimonialByAdmin = (data) => put('/testimonials', data)
export const deleteTestimonialsByAdmin = (data) => del(`/testimonials/${data._id}`, data)

export const createTestimonialByUser = (data) => post('/testimonials', data)
export const getSpecificUserTestimonial = (data) => get('/testimonials', data)
export const getAllPublicReviews = (data) => get('/testimonials/site', data)
export const deleteTestimonialByUser = (data) => del(`/testimonials/${data._id}`)
//review
export const getAllReviewsByAdmin = (data) => get('/reviews', data)
export const updateReviewByAdmin = (data) => put('reviews', data)
export const deleteReviewByAdmin = (data) => del(`/reviews/${data._id}`, data)

export const createReviewByUser = (data) => post('/reviews', data)
export const getSpecificUserReview = (data) => get('/reviews/site', data)
export const deleteReviewByUser = (data) => del(`/reviews/${data._id}`)

//product category
export const createProductCategory = (data) => post('/product-categories', data)
export const getAllProductCategories = (data) => get('/product-categories', data)
export const updateProductCategory = (data) => put('/product-categories', data)
export const deleteProductCategory = (data) => del(`/product-categories/${data._id}`, data)
export const getPublicProductCategories = (data) => get('/product-categories', data)

//Products
export const createProduct = (data) => post('/products', data)
export const getAllProducts = (data) => get('/products', data)
export const updateProduct = (data) => put('/products', data)
export const deleteProduct = (data) => del(`/products/${data._id}`, data)
export const getPublicProducts = (data) => get('/products/site', data)

//cart
export const fetchCart = (data) => get("/carts", data);
export const postCart = (data) => post("/carts", data);
export const deleteCart = (data) => del(`/carts/${data._id}`, data);
export const fetchCartCalculation = (data) => get("/carts/calculate", data);
export const orderProduct = (data) => post("/products/order", data);

//order
export const getAllProductList = (data) => get("/products/order", data);
export const updateProductOrderStatus = (data) => patch("/products/order", data);

//support ticket
export const createSupportTicketByUser = (data) => post('/supports', data)
export const getAllSupportTicketsByUser = (data) => get('/supports/site', data)
export const getAllSupportTicketsByAdmin = (data) => get('/supports', data)
export const deleteSupportTicket = (data) => del(`/supports/${data._id}`, data)


//product Payment
export const createProductPayment = (data) => post('/products/payment', data)
export const confirmProductPayments = (data) => patch('/products/payment', data)
export const paymentMethodsList = (data) => get('/payment-methods', data)

//packages Payment
export const createpackagesPayment = (data) => post('/packagess/payment', data)
export const confirmpackagesPayments = (data) => patch('/packagess/payment', data)

//Product Order
export const getAllOrders = (data) => get('/products/orders', data)
export const updateOrderStatus = (data) => patch('/products/orders', data)

//packages Booking
export const getAllpackagesBooking = (data) => get('/packagess/bookings', data)
export const updatepackagesBookingStatus = (data) => patch('/packagess/booking', data)

//Dashboard
export const getDashboardData = (data) => get('/dashboards', data)

//product review
export const createProductReview = (data) => post('/product-reviews', data)
export const getPublicProductReview = (data) => get('/product-reviews/site', data)
export const getAllProductReviewByAdmin = (data) => get('/product-reviews', data)
export const updateProductReviewByAdmin = (data) => put('/product-reviews', data)
export const deleteProductReviewByAdmin = (data) => del(`/product-reviews/${data._id}`, data)

// get Here filter data
export const getHeroFilterData = (data) => get('/dashboards/all-filter', data)

// payment status update
export const updatePaypalPaymentStatus = (data) => patch('/payments/paypal', data);
export const updateRazorpayPaymentStatus = (data) => patch('/payments/razorpay', data);

//Notification
export const getNotificationsByAdmin = (data) => get('/notifications', data);
export const getAllReadNotifications = (data) => get('/notifications/all', data);
export const updateNotificationByAdmin = (data) => patch('/notifications', data);
export const deleteNotificationByAdmin = (data) => del(`/notifications/${data._id}`, data);