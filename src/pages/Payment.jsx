import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addOrder } from "../Redux/Slice/orderSlice"; // pastikan path sesuai

export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    date: "Tuesday, 07 July 2020 at 02:00pm",
    movieTitle: "Spider-Man: Homecoming",
    cinemaName: "CineOne21 Cinema",
    numberOfTickets: "3 pieces",
    totalPayment: "$30.00",
    seats: "C4, C5, C6",
  });
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Jonas El Rodriguez",
    email: "jonasrodri123@gmail.com",
    phoneNumber: "81445687121",
  });
  const [virtualAccount, setVirtualAccount] = useState("");
  const [loading, setLoading] = useState(true);

  const generateRandom16Digit = () =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");

  useEffect(() => {
    // buat nomor VA random saat halaman pertama kali dibuka
    setVirtualAccount(generateRandom16Digit());

    try {
      const savedPaymentData = localStorage.getItem("paymentData");
      if (savedPaymentData) {
        const data = JSON.parse(savedPaymentData);
        setPaymentDetails({
          date: `${data.bookingDetails.date} at ${data.bookingDetails.time}`,
          movieTitle: data.movie?.title || "Untitled Movie",
          cinemaName: data.bookingDetails.cinema || "Unknown Cinema",
          numberOfTickets: `${data.selectedSeats?.length || 0} pieces`,
          totalPayment: `$${data.totalPrice || 0}.00`,
          seats: data.selectedSeats?.join(", ") || "-",
        });
      }
    } catch (error) {
      console.error("Error loading payment data:", error);
    }
    setLoading(false);
  }, []);

  const paymentMethods = [
    { id: "google", name: "Google Pay", icon: "/logos_google-pay.png" },
    { id: "visa", name: "Visa", icon: "/logos_visa.png" },
    {
      id: "gopay",
      name: "GoPay",
      icon: "/Logo GoPay (SVG-240p) - FileVector69 1.png",
    },
    { id: "paypal", name: "PayPal", icon: "/logos_paypal.png" },
    {
      id: "dana",
      name: "DANA",
      icon: "/Logo DANA (PNG-240p) - FileVector69 1.png",
    },
    {
      id: "bca",
      name: "Bank BCA",
      icon: "/Bank BCA Logo (SVG-240p) - FileVector69 1.png",
    },
    {
      id: "bri",
      name: "Bank BRI",
      icon: "/Bank BRI (Bank Rakyat Indonesia) Logo (SVG-240p) - FileVector69 1.png",
    },
    { id: "ovo", name: "OVO", icon: "/ovo.png" },
  ];

  const handleInputChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handlePayment = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }
    setShowModal(true);
  };

  const copyVirtualAccount = () => {
    navigator.clipboard.writeText(virtualAccount);
  };

  // Fungsi membuat order baru ke Redux
  const createOrder = (isPaid) => {
    const orderData = {
      items: {
        movieTitle: paymentDetails.movieTitle,
        category: "PG-13",
        date: paymentDetails.date.split(" at ")[0],
        time: paymentDetails.date.split(" at ")[1],
        count: parseInt(paymentDetails.numberOfTickets) || 0,
        seats: paymentDetails.seats || "-",
        total: paymentDetails.totalPayment,
        cinema: paymentDetails.cinemaName,
      },
      va: virtualAccount,
      is_paid: isPaid,
    };

    dispatch(addOrder(orderData));
    localStorage.removeItem("paymentData");
  };

  const handleCheckPayment = () => {
    createOrder(true); // is_paid = true
    navigate("/ticket");
  };

  const handlePayLater = () => {
    createOrder(false); // is_paid = false
    navigate("/ticket");
  };

  const PaymentModal = () => {
    if (!showModal) return null;

    return (
      <>
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowModal(false)}
        ></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Payment Info</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-600 text-xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm">
                    No. Rekening Virtual
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="font-mono text-lg font-medium">
                    {virtualAccount}
                  </span>
                  <button
                    onClick={copyVirtualAccount}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Payment</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {paymentDetails.totalPayment}
                  </span>
                </div>
              </div>

              <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">
                  Pay this payment bill before it is due,
                  <span className="font-medium text-yellow-700">
                    {" "}
                    on June 23, 2023
                  </span>
                  . If the bill has not been paid by the specified time, it will
                  be forfeited.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckPayment}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Check Payment
                </button>
                <button
                  onClick={handlePayLater}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Pay Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-600 text-lg">
        Loading payment details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8 space-x-4">
        <span className="flex flex-col items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Dates And Time
          </p>
        </span>
        <span className="w-8 h-0.5 bg-gray-300"></span>
        <span className="flex flex-col items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mt-1">Seat</p>
        </span>
        <span className="w-8 h-0.5 bg-gray-300"></span>
        <span className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            3
          </div>
          <p className="text-sm font-medium text-blue-600 mt-1">Payment</p>
        </span>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Payment Info
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase mb-1">
                DATE & TIME
              </h4>
              <p className="text-gray-800">{paymentDetails.date}</p>
              <hr className="mt-3 border-gray-200" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase mb-1">
                MOVIE TITLE
              </h4>
              <p className="text-gray-800">{paymentDetails.movieTitle}</p>
              <hr className="mt-3 border-gray-200" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase mb-1">
                CINEMA NAME
              </h4>
              <p className="text-gray-800">{paymentDetails.cinemaName}</p>
              <hr className="mt-3 border-gray-200" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase mb-1">
                NUMBER OF TICKETS
              </h4>
              <p className="text-gray-800">{paymentDetails.numberOfTickets}</p>
              <hr className="mt-3 border-gray-200" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase mb-1">
                TOTAL PAYMENT
              </h4>
              <p className="text-blue-600 font-bold text-lg">
                {paymentDetails.totalPayment}
              </p>
              <hr className="mt-3 border-gray-200" />
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <div className="flex items-center px-3 py-3 bg-gray-100 border rounded-l-lg">
                  +62
                </div>
                <input
                  type="tel"
                  value={personalInfo.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Payment Method
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentSelect(method.id)}
                className={`p-4 border-2 rounded-lg ${
                  selectedPayment === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <img
                    src={method.icon}
                    alt={method.name}
                    className="h-8 object-contain"
                  />
                </div>
                <div className="text-sm font-medium text-gray-700 text-center">
                  {method.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={!selectedPayment}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            selectedPayment
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Pay your order
        </button>
      </div>

      <PaymentModal />

      <style jsx>{`
        @keyframes scale-up {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
