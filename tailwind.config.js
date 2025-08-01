import LeaveForm from './src/LeaveForm'

 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{html,js}"],
   theme: {
     extend: {},
   },
   plugins: [],
 }

 theme: {
  extend: {
    animation: {
      'fade-in', 'fadeIn 0.6s ease-out';
    }
    keyframes: {
      fadeIn: {
        from: { opacity: 0; transform: 'translateY(10px)' }
        to: { opacity: 1; transform: 'translateY(0)' }
      }
    }
  }
}
