// import React, { useState } from 'react';

// const LoginForm = ({ onLogin }) => {
//   const [name, setName] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (name.trim()) {
//       onLogin(name);
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 to-blue-100">
//       <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg space-y-6">
//         <h2 className="text-2xl font-bold text-center">Login</h2>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none font-[Inter]"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState(''); // email or emp ID
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(identifier.trim().toLowerCase());
  };

  const loginform=()=>{
    const codedata= axios.post('http://localhost:4000/api/v1/auth/login', {
      email:identifier,
      password:password})
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
    console.log("response data",codedata)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg space-y-6 w-96">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="text"
          placeholder="Enter Email or Employee ID"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none font-[Inter]"
          required
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none font-[Inter]"
          required
        />
        <button onClick={loginform}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
