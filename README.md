# Keyboard Shortcut Tracker

A beautiful, interactive web app for tracking and visualizing your keyboard shortcuts across macOS and Windows.

## 🌟 Features

- **Visual Keyboard Layout**: See your shortcuts overlaid on an interactive keyboard
- **Table View**: Manage all shortcuts in a sortable, editable table
- **Persistent Storage**: All shortcuts are saved between sessions
- **Password Protection**: Simple password gate to keep your shortcuts private
- **Import/Export**: Easily backup and share your shortcut collections
- **Tag System**: Organize shortcuts by category (AI, Window Management, System, etc.)
- **OS Toggle**: Switch between macOS and Windows keyboard layouts
- **Layout Options**: Support for full-size and TKL (tenkeyless) keyboards

## 🚀 Quick Start

### Hosting on GitHub Pages

1. **Create a new GitHub repository**
   - Go to GitHub and create a new repository
   - Name it something like `keyboard-shortcuts`
   - Make it public or private (your choice)

2. **Upload the file**
   - Upload the `index.html` file to your repository
   - Commit the changes

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select the branch (usually `main` or `master`)
   - Select root folder `/`
   - Click Save

4. **Access your app**
   - GitHub will provide a URL like: `https://yourusername.github.io/keyboard-shortcuts/`
   - Wait a minute or two for deployment
   - Visit the URL to access your app

### Embedding in Notion

1. **Get your GitHub Pages URL** from the steps above

2. **In Notion, create an embed block**:
   - Type `/embed` and press Enter
   - Paste your GitHub Pages URL
   - Adjust the size as needed

## 🔐 Password

The default password is: **shortcuts**

To change the password:
1. Open `index.html` in a text editor
2. Find the line: `if (password === 'shortcuts') {`
3. Replace `'shortcuts'` with your desired password
4. Save and re-upload to GitHub

## 📝 Usage

### Adding Shortcuts

1. Scroll to the "Add New Shortcut" section
2. Fill in:
   - **Name**: What the shortcut does (e.g., "Copy")
   - **Keys**: The key combination (e.g., "Cmd+C" or "Ctrl+C")
   - **Tag**: Category for organization
   - **Description**: Optional details
3. Click "Add"

### Viewing Shortcuts

**Keyboard View**:
- Hover over keys to see associated shortcuts
- Keys with shortcuts are highlighted in color
- Filter by tag to focus on specific categories

**Table View**:
- See all shortcuts in a sortable table
- Click "Edit" to modify a shortcut
- Click the trash icon to delete

### Import/Export

**Export**:
- Click the "Export" button
- Downloads a JSON file with all your shortcuts
- Keep this as a backup!

**Import**:
- Click "Import" 
- Select a previously exported JSON file
- Your shortcuts will be restored

## 🎨 Customization

### Changing Colors

The app uses a color scheme for different tags:
- AI: Purple (`#8b5cf6`)
- Window Management: Blue (`#3b82f6`)
- System: Green (`#10b981`)
- Browser: Orange (`#f59e0b`)
- Editor: Red (`#ef4444`)
- Custom: Indigo (`#6366f1`)

To customize, edit the `tagColors` object in the HTML file.

### Adding New Tags

1. Find the line: `const tags = ['AI', 'Window Management', 'System', 'Browser', 'Editor', 'Custom'];`
2. Add your new tag to the array
3. Add a corresponding color in the `tagColors` object below

## 💾 Data Storage

The app uses browser localStorage to persist your shortcuts. This means:
- ✅ Data persists across sessions
- ✅ No server required
- ✅ Works offline
- ⚠️ Data is stored in your browser (clear browser data = lose shortcuts)
- ⚠️ Data is not synced across devices

**Important**: Always export your shortcuts periodically as a backup!

## 📱 Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🎯 Tips

1. **Naming Convention**: Use consistent naming like "Cmd+Shift+K" vs "⌘⇧K"
2. **Hover to Discover**: Hover over keys in keyboard view to see all associated shortcuts
3. **Regular Exports**: Export your shortcuts monthly as a backup
4. **Tag Strategy**: Use tags that match your workflow (e.g., "Video Editing", "Coding", "Design")

## 🐛 Troubleshooting

**Shortcuts not saving?**
- Check that your browser allows localStorage
- Make sure you're not in private/incognito mode

**Can't see the keyboard?**
- Try zooming out in your browser (Cmd/Ctrl + -)
- The keyboard is responsive but works best on larger screens

**Import not working?**
- Ensure the file is a valid JSON export from this app
- Check the file isn't corrupted

## 📄 License

This project is open source and free to use.

## 🤝 Contributing

Feel free to modify and improve this app! Some ideas:
- Add more keyboard layouts (AZERTY, Dvorak, etc.)
- Implement keyboard shortcuts for the app itself
- Add search functionality
- Create themes/color schemes
- Add cloud sync via GitHub Gists

---

Made with ❤️ for keyboard enthusiasts
