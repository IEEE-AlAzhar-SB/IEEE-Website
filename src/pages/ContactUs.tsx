import { ChangeEvent, SubmitEvent, useState } from "react";
import { useFeedbackMutation } from "../hooks";
import { Section } from "../components";
import { FaUser, FaEnvelope, FaPhone, FaCommentDots } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const { mutate, isPending, error } = useFeedbackMutation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        // TODO: we we implement feedback dashboard we will need ti invalidate the cache here after successful submission
        setSuccessMessage("Your message has been sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });

        const timer = setTimeout(() => setSuccessMessage(""), 5000);
        return () => clearTimeout(timer);
      },
    });
  };

  return (
    <div>
      <Section
        showSocialIcons={true}
        text={`Get in touch with us.\nWe're here to assist you.`}
        additionalText={`Contact us for assistance, feedback, or collaboration opportunities.`}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Bind onSubmit handler */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col grid-cols-1 gap-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaUser className="text-[#05568D]" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ahmed"
                className="p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#05568D]"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaEnvelope className="text-[#05568D]" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="mail@something.com"
                className="p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#05568D]"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaPhone className="text-[#05568D]" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01234567890"
                className="p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#05568D]"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 my-1 flex items-center gap-2">
              <FaCommentDots className="text-[#05568D]" />
              Message
            </label>
            <textarea
              rows={9}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className="p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#05568D] resize-none"
              required
            ></textarea>
          </div>

          {/* Status Notifications */}
          <div className="md:col-span-2 text-right">
            {error && (
              <p className="text-red-500 text-sm font-medium">
                {error.message}
              </p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm font-medium">
                {successMessage}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={isPending}
              className={`bg-[#05568D] text-white px-6 py-2 rounded-full hover:bg-[#033e66] transition duration-300 font-semibold ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
