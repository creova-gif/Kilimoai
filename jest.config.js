module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-qrcode-svg|lucide-react-native)"
  ],
  // @testing-library/react-native v13 auto-extends Jest matchers on import,
  // so no separate extend-expect setup file is required.
};
