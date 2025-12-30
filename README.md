# React Native Swappable Grid Example

A comprehensive example project demonstrating the [`react-native-swappable-grid`](https://www.npmjs.com/package/react-native-swappable-grid) library. This Expo app showcases two different deletion patterns for a swappable grid component with drag-and-drop functionality.

## 🎯 Features

- **Swappable Grid Layout**: Drag and reorder items in a responsive grid layout
- **Two Deletion Patterns**:
  - **Hold to Delete**: Long-press an item to reveal a delete button
  - **Drag to Delete**: Drag an item to a delete component to delete it
- **Dynamic Item Sizing**: Adjustable item size via slider control
- **Add Items**: Dynamically add new items to the grid
- **Smooth Animations**: Wiggle animations and smooth transitions powered by React Native Reanimated
- **Haptic Feedback**: Enhanced user experience with haptic feedback

## 📱 Screenshots

The app includes two example screens accessible via bottom tab navigation:

1. **Hold to Delete** - Long-press an item to enter delete mode
2. **Drag to Delete** - Drag items to the trashcan to delete them

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for macOS) or Android Emulator, or Expo Go app on your device

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-native-swappable-grid-example
   ```

2. Navigate to the project directory:
   ```bash
   cd reactNativeSwappableGridExample
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:

```bash
npm start
# or
npx expo start
```

Then choose one of the following options:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your device
- Press `w` to open in web browser

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android emulator
- `npm run ios` - Start the app on iOS simulator
- `npm run web` - Start the app in web browser
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
reactNativeSwappableGridExample/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── dragToDelete/        # Drag-to-delete example
│   │   └── holdToDelete/        # Hold-to-delete example
│   ├── index.tsx                 # Root redirect
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── IconButton/               # Icon button component
│   ├── Item/                     # Grid item component
│   ├── Slider/                   # Slider control component
│   └── TabBarButton/             # Custom tab bar button
├── constants/                    # App constants
│   └── Icons.ts                  # Icon definitions
├── hooks/                        # Custom React hooks
└── assets/                       # Images and static assets
```

## 🎨 Examples

### Example 1: Hold to Delete

Located in `app/(tabs)/holdToDelete/index.tsx`

- Long-press any item for 300ms to enter delete mode
- Items will wiggle to indicate delete mode is active
- A delete button appears on each item
- Tap the delete button to remove the item

### Example 2: Drag to Delete

Located in `app/(tabs)/dragToDelete/index.tsx`

- Long-press any item to enter delete mode
- Drag the item to the trashcan component at the bottom
- Release to delete the item
- Custom delete component with trash icon

## 🛠️ Technologies Used

- **[Expo](https://expo.dev/)** - React Native framework
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based routing
- **[react-native-swappable-grid](https://www.npmjs.com/package/react-native-swappable-grid)** - Swappable grid component
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Smooth animations
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** - Gesture recognition
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** - Haptic feedback

## 📚 Key Concepts Demonstrated

- **Grid Layout**: Responsive grid with configurable item sizes and gaps
- **Drag and Drop**: Reordering items within the grid
- **Long Press Gestures**: Activating delete mode
- **Custom Components**: Trailing components (add button) and delete components
- **State Management**: Managing grid items and their lifecycle
- **Animations**: Wiggle effects and smooth transitions

## 🎛️ Configuration

The examples demonstrate various configuration options:

- `itemWidth` / `itemHeight`: Size of grid items
- `gap`: Spacing between items
- `wiggle`: Animation configuration for delete mode
- `longPressMs`: Duration to trigger long press
- `trailingComponent`: Component shown after all items (e.g., add button)
- `deleteComponent`: Custom component for delete interactions
- `onDelete`: Callback when an item is deleted

## 🤝 Contributing

This is an example project. Feel free to fork it and use it as a starting point for your own projects!

## 📄 License

This project is provided as an example. Please refer to the license of the `react-native-swappable-grid` library for usage terms.

## 🔗 Related Links

- [react-native-swappable-grid on npm](https://www.npmjs.com/package/react-native-swappable-grid)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

---

Built with ❤️ using Expo and React Native
