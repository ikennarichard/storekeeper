# 📦 Storekeeper App

A modern React Native inventory management application built with React Native(Expo), SQLite database storage and native camera integration.

## ✨ Features

- **Cross-platform**: Works on iOS and Android
- **Local SQLite Database**: Persistent storage with expo-sqlite
- **Full CRUD Operations**: Create, Read, Update, and Delete products
- **Image Management**: Store and display product images
- **Modern UI**: Clean and intuitive interface with React Native Paper

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm
- Expo CLI
- Expo Go app (for testing on physical device)
- VS Code

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ikennarichard/storekeeper.git
cd storekeeper
```

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm start
```

4. Run app:
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 🔧 Key Technologies

- **React Native (Expo)**
- **React Native Paper**
- **TypeScript**

## 🔨 Build Instructions

### Development Build

```bash
eas build:configure
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

## 📲 Relevant Links

- [Github](https://github.com/ikennarichard/storekeeper)
- [APK file](https://expo.dev/accounts/richyyyy/projects/storekeeper/builds/c5b479ba-8fcb-4d68-864c-a634c488e395)
- [Live demo](https://appetize.io/app/b_336c4euedfgqkiukto2e3z7bru)
- [Video Demo](https://drive.google.com/file/d/1afH-_akUYJcBu0OmPB0TV_24XkT7zQHb/view?usp=drivesdk)

### Installation Instructions

1. Download the APK file to your Android device
2. Enable "Install from Unknown Sources" in Settings
3. Open the APK file and follow installation prompts
4. Grant necessary permissions when prompted

## 🐛 Troubleshooting

### Database Issues
```bash
# Clear app data and restart
npm start -c
```

### Image Picker Not Working
- Ensure you've granted camera/gallery permissions
- Check Expo Go app permissions in device settings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/foo`)
3. Commit your changes (`git commit -m 'Add some foo'`)
4. Push to the branch (`git push origin feature/foo`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## 🙏 Acknowledgments

- HNGi13 Admin, Mentor
- The entire HNG mobile dev team

---
