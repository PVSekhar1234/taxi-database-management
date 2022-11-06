module.exports = {
    content: ["./views/.ejs.{ejs,js}"],
    theme: {
      extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
  }