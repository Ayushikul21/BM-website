import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaRegCalendarAlt, FaClipboardList } from 'react-icons/fa';

const LeaveForm = ({ userName, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    leaveType: 'Select leave type',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit(); // ✅ call the callback prop passed from App
    } else {
      console.warn('onSubmit is not a function');
    }
    alert("Leave request submitted:\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-blue-100 to-purple-200 flex items-center justify-center px-4 py-10">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-[900px] bg-white/70 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl p-12 animate-fade-in"
        >
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Leave Application
        </h2>

        <div className="space-y-5">
          {/* Name */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <FaUser className="inline-block mr-2 text-blue-500" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              placeholder="John Doe"
            />
          </div> */}

          {/* Email */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <FaEnvelope className="inline-block mr-2 text-blue-500" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              placeholder="john.doe@example.com"
            />
          </div> */}

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <FaClipboardList className="inline-block mr-2 text-blue-500" /> Leave Type
            </label>
            <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 outline-none font-[Inter]"
                >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Compensatory Leave">Compensatory Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Probationary Leave">Probationary Leave</option>
                <option value="Sabbatical Leave">Sabbatical Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* From Date */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                <FaRegCalendarAlt className="inline-block mr-2 text-blue-500" /> From
                </label>
                <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
            </div>    

            {/* To Date */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                <FaRegCalendarAlt className="inline-block mr-2 text-blue-500" /> To
                </label>
                <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
            </div>

          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder="Briefly describe the reason for leave..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition duration-300"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;
