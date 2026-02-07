# How to Test MVP1

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Ensure Cesium assets are copied**:
   ```bash
   mkdir -p public/cesium
   cp -r node_modules/cesium/Build/Cesium/Workers public/cesium/
   cp -r node_modules/cesium/Build/Cesium/Assets public/cesium/
   cp -r node_modules/cesium/Build/Cesium/Widgets public/cesium/
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000/moltmap`

## Test Checklist

### ✅ Globe Visibility
- [ ] Globe is visible in the center (not blank/empty)
- [ ] Earth imagery is showing (land/ocean visible)
- [ ] Globe can be rotated by dragging
- [ ] Zoom in/out works with mouse wheel

### ✅ Community Markers
- [ ] Communities appear as circular avatar markers on the globe
- [ ] Each marker shows 2-letter initials
- [ ] Markers have colored circular footprints on the ground
- [ ] Footprint size varies by subscriber count

### ✅ Hover Interaction
- [ ] Hovering over a marker changes cursor to pointer
- [ ] Hovering highlights the footprint (cyan outline)
- [ ] Moving mouse away removes highlight

### ✅ Click Interaction
- [ ] Clicking a marker:
  - [ ] Camera flies smoothly to that location (2 seconds)
  - [ ] Right-side info panel opens
  - [ ] Panel shows community details
- [ ] Clicking empty space:
  - [ ] Closes the info panel
  - [ ] Deselects the community

### ✅ Search
- [ ] Search bar accepts input
- [ ] Typing 2+ characters shows dropdown results
- [ ] Results show community names
- [ ] Clicking a result:
  - [ ] Flies camera to that community
  - [ ] Opens info panel

### ✅ Navigation Controls
- [ ] **+ button**: Zooms camera in
- [ ] **- button**: Zooms camera out
- [ ] **Home button**: 
  - [ ] Resets camera to default view
  - [ ] Closes info panel
- [ ] **Map icon**: 
  - [ ] Toggles overview/focused mode
  - [ ] Shows/hides labels
- [ ] **3D badge**: 
  - [ ] Shows tooltip on hover: "Phase 2: 3D terrain & buildings coming soon"
  - [ ] No dead button feeling

### ✅ Right Info Panel
- [ ] Panel slides in from right when community is selected
- [ ] Shows:
  - [ ] Community name
  - [ ] Category badge
  - [ ] Media placeholder
  - [ ] Description (if available)
  - [ ] Stats (subscribers, posts, activity)
  - [ ] **All 4 action buttons**:
    - [ ] "Open Community" (links to Moltbook)
    - [ ] "View Top Posts" (tries to fetch feed, shows message)
    - [ ] "Follow" (mock action)
    - [ ] "Walk with Agent" (mock action)
- [ ] Close button (×) closes panel

### ✅ Login Dialog
- [ ] Settings icon replaced with Login icon (user icon)
- [ ] Clicking Login opens dialog
- [ ] Dialog shows "Continue with Google" button
- [ ] Clicking button shows message (mock auth)
- [ ] Dialog can be closed

## Known Issues / Limitations

- Cesium Ion token may be required for terrain (falls back to ellipsoid)
- Avatar generation requires browser environment
- "View Top Posts" may not work if API endpoint doesn't exist
- Auth is mocked (will integrate with Moltbook later)

## Troubleshooting

### Globe not showing
- Check browser console for Cesium errors
- Verify `public/cesium/` contains Workers, Assets, Widgets
- Check network tab for failed asset requests

### Markers not appearing
- Check that API is returning data (check Network tab)
- Verify submolts array is populated
- Check browser console for errors

### Fly-to not working
- Check that viewer is initialized (check console logs)
- Verify entity exists for selected community
- Check camera fly-to parameters
