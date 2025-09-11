# Betta Breeding Tracker

A comprehensive mobile-friendly web application for tracking Betta fish breeding spawns with daily care actions, genetics predictions, and timeline management.

![Betta Tracker](https://img.shields.io/badge/Version-1.0.0-brightgreen) ![PWA](https://img.shields.io/badge/PWA-Ready-blue) ![Mobile](https://img.shields.io/badge/Mobile-Optimized-orange)

## Features

### 🐟 **Smart Dashboard**

- **Batch Cards**: Each spawn shows pair name, age (DPH - Days Post Hatch), current phase, and today's critical actions
- **Phase Tracking**: Visual indicators for Incubation 🥚, Hatch 🐣, Free-swim 🌊, Fry 🐟, and Juvenile 🧒 phases
- **Real-time Actions**: Get 1-3 specific tasks for each batch based on current age and phase

### 📅 **Timeline Management**

- **Auto-calculated Dates**: Set eggs-laid date, app calculates hatch (D+2) and free-swim (D+4) automatically
- **Visual Timeline**: Track progress through breeding phases with completion indicators
- **Age Calculation**: Automatic DPH (Days Post Hatch) tracking

### 🧬 **Genetics Predictions**

- **Parent Traits**: Track male/female color, pattern, and fin type
- **Offspring Predictions**: Age-based appearance forecasts at 3 days, 3 weeks, and 3 months
- **Marble Warnings**: Special alerts for color-changing genetics

### 📱 **Mobile-First Design**

- **Progressive Web App (PWA)**: Install on mobile devices like a native app
- **Dark Theme**: Easy on the eyes with aquarium-inspired colors
- **Touch-Friendly**: Large buttons and swipe-friendly interface
- **Offline Capable**: Works without internet connection

### 💾 **Data Management**

- **Local Storage**: All data stored securely on your device
- **Export/Import**: Backup and restore data via JSON files
- **No Account Required**: Complete privacy - your data never leaves your device

## Daily Action System

The app provides intelligent, phase-based care recommendations:

### **Incubation Phase (🥚 D0 to Hatch)**

- Keep surface calm
- No feeding required
- Maintain stable 80-82°F

### **Hatch Phase (🐣 DPH 0-1)**

- Observe tails hanging
- Still no feeding (using yolk sac)
- Watch for free-swimming behavior

### **Free-swim Phase (🌊 DPH 2-3)**

- **Critical**: Remove male when majority free-swimming
- Start first foods (infusoria/vinegar eels) 3-4× daily
- Begin BBS (Baby Brine Shrimp) preparation

### **Fry Phase (🐟 DPH 4-14)**

- Feed BBS morning & evening (watch for orange bellies)
- 10-20% gentle water changes every other day
- Pre-warm all change water to tank temperature

### **Juvenile Phase (🧒 DPH 15+)**

- Introduce micro-pellets gradually
- Weekly size sorting and monitoring
- Jar aggressive males when needed (6+ weeks)

## Genetics Knowledge Base

### **Supported Traits**

- **Colors**: Red, Blue (Royal/Steel/Turquoise), Black, White/Opaque/Cellophane, Copper, Koi/Marble
- **Patterns**: Solid, Butterfly, Marble/Koi, Dragon Scaling, Grizzle
- **Fin Types**: Halfmoon (HM), Veiltail (VT), Plakat (PK), Dumbo

### **Prediction Examples**

- **Red × White**: Pastel/cellophane with red wash, may fade over time
- **Red × Red**: Mostly reds with varying intensity, some copper tones
- **Blue × Red**: Mixed metallics, butterfly patterns possible
- **Marble Genetics**: Colors will continue changing - app provides warnings

## Installation

### **As a Web App**

1. Open `index.html` in any modern web browser
2. The app works immediately - no installation required

### **As a Mobile PWA**

1. Open the app in your mobile browser
2. Tap "Add to Home Screen" when prompted
3. Use like any native app

### **Local Development**

```bash
# Clone or download the repository
git clone <repository-url>

# Navigate to the directory
cd betta-tracker

# Open in any web server or directly in browser
# For local development with live server:
python -m http.server 8000
# Then open http://localhost:8000
```

## Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser LocalStorage API
- **PWA**: Service Worker for offline functionality
- **Design**: Mobile-first responsive design
- **Icons**: Unicode emoji for universal compatibility

## File Structure

```
betta-tracker/
├── index.html          # Main application HTML
├── styles.css          # All styling and responsive design
├── app.js              # Core application logic
├── manifest.json       # PWA configuration
├── sw.js              # Service Worker for offline functionality
└── README.md          # This documentation
```

## Usage Guide

### **Adding Your First Batch**

1. Tap "Add New Batch" on the dashboard
2. Enter batch name (e.g., "Red Dragon x Blue HM")
3. Set eggs-laid date (today's date is pre-filled)
4. Optionally fill parent genetics for predictions
5. Save to start tracking

### **Daily Monitoring**

1. Open the app each morning
2. Review "Today's Actions" for each active batch
3. Tap any batch card for detailed timeline and genetics
4. Mark actions as completed (male removal, feeding, etc.)

### **Data Backup**

1. Tap the export button (📤) in the header
2. Save the JSON file to cloud storage or share it
3. To restore: tap import (📥) and select your backup file

## Breeding Knowledge Integration

The app incorporates established Betta breeding practices:

- **Temperature Management**: Optimal 80-82°F for fry development
- **Feeding Protocols**: Phase-appropriate nutrition recommendations
- **Water Quality**: Change schedules based on fry age and density
- **Male Management**: Timing for removal and jarring
- **Genetics Basics**: Simplified but accurate color/fin predictions

## Browser Support

- **Modern Mobile Browsers**: iOS Safari, Android Chrome, Firefox Mobile
- **Desktop Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **PWA Support**: Full offline functionality on supported browsers

## Contributing

This is a standalone application designed for simplicity and reliability. The codebase is intentionally minimal and focused:

- **Pure JavaScript**: No frameworks or build tools required
- **Single File Architecture**: Easy to modify and understand
- **Local-First**: Privacy and reliability by design

## License

Open source - feel free to modify and improve for the Betta breeding community.

## Acknowledgments

Built with input from experienced Betta breeders and incorporates established breeding protocols for optimal fish health and development.
