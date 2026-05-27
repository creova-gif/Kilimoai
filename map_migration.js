const fs = require('fs');

const content = fs.readFileSync('app/(tabs)/fields.tsx', 'utf8');

// Replace react-native-svg with react-native-maps
let newContent = content.replace(
  /import Svg, \{[\s\S]*?\} from 'react-native-svg';/,
  `import MapView, { Polygon as MapPolygon, Marker, PROVIDER_GOOGLE } from 'react-native-maps';`
);

// We need to inject lat/lng into ZONES
newContent = newContent.replace(
  /points: '40,60 180,30 200,160 60,180',/,
  `coordinates: [\n      { latitude: -6.8270, longitude: 37.6680 },\n      { latitude: -6.8265, longitude: 37.6695 },\n      { latitude: -6.8280, longitude: 37.6698 },\n      { latitude: -6.8285, longitude: 37.6682 },\n    ],`
);

newContent = newContent.replace(
  /points: '180,30 320,50 300,180 200,160',/,
  `coordinates: [\n      { latitude: -6.8265, longitude: 37.6695 },\n      { latitude: -6.8260, longitude: 37.6710 },\n      { latitude: -6.8275, longitude: 37.6715 },\n      { latitude: -6.8280, longitude: 37.6698 },\n    ],`
);

newContent = newContent.replace(
  /points: '60,180 200,160 170,290 30,260',/,
  `coordinates: [\n      { latitude: -6.8285, longitude: 37.6682 },\n      { latitude: -6.8280, longitude: 37.6698 },\n      { latitude: -6.8295, longitude: 37.6695 },\n      { latitude: -6.8300, longitude: 37.6680 },\n    ],`
);

newContent = newContent.replace(
  /points: '200,160 300,180 280,310 170,290',/,
  `coordinates: [\n      { latitude: -6.8280, longitude: 37.6698 },\n      { latitude: -6.8275, longitude: 37.6715 },\n      { latitude: -6.8290, longitude: 37.6712 },\n      { latitude: -6.8295, longitude: 37.6695 },\n    ],`
);

// Replace centers
newContent = newContent.replace(/center: \{ x: 120, y: 110 \},/, `centerLat: -6.8275, centerLng: 37.6688,`);
newContent = newContent.replace(/center: \{ x: 250, y: 100 \},/, `centerLat: -6.8268, centerLng: 37.6705,`);
newContent = newContent.replace(/center: \{ x: 115, y: 220 \},/, `centerLat: -6.8290, centerLng: 37.6688,`);
newContent = newContent.replace(/center: \{ x: 240, y: 230 \},/, `centerLat: -6.8285, centerLng: 37.6705,`);

// Remove AnimatedPolygon and AnimatedG
newContent = newContent.replace(/const AnimatedPolygon[\s\S]*?AnimatedG =[\s\S]*?;/, '');

// Fix viewBox usage
newContent = newContent.replace(/const viewBox = useMemo\([\s\S]*?\}, \[zoomLevel, activeZoneId\]\);/, '');

// Replace the map rendering part
const mapContainerRegex = /<View style=\{styles\.mapContainer\}>[\s\S]*?<\/View>\s*\{\/\* ── Active Selection Bottom Details Card/m;
const newMapStr = `<View style={[styles.mapContainer, { borderRadius: 0, marginHorizontal: -16, marginTop: -8 }]}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              mapType="satellite"
              initialRegion={{
                latitude: -6.8280,
                longitude: 37.6695,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              {filteredZones.map((zone) => {
                const isSelected = activeZoneId === zone.id;
                const fillColor = getZoneColor(zone);
                
                return (
                  <MapPolygon
                    key={zone.id}
                    coordinates={(zone as any).coordinates}
                    fillColor={isSelected ? fillColor + '80' : fillColor + '30'}
                    strokeColor={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
                    strokeWidth={isSelected ? 3 : 1}
                    tappable={true}
                    onPress={() => handleZoneSelect(zone.id)}
                  />
                );
              })}

              {/* Markers for specific zones */}
              {filteredZones.some(z => z.id === 8) && (
                <Marker coordinate={{ latitude: -6.8290, longitude: 37.6688 }}>
                  <View style={[styles.hudBadge, { position: 'relative', left: 0, top: 0 }]}>
                    <Droplets size={10} color="#3b82f6" />
                    <Text style={styles.hudBadgeText}>{language === 'sw' ? 'Unyevu 82%' : '82% Humidity'}</Text>
                  </View>
                </Marker>
              )}

              {filteredZones.some(z => z.id === 12) && (
                <Marker coordinate={{ latitude: -6.8268, longitude: 37.6705 }}>
                  <View style={[styles.hudLabel, { position: 'relative', left: 0, top: 0 }]}>
                    <Text style={styles.hudLabelText}>{language === 'sw' ? 'Nitrojeni Chini' : 'Low Nitrogen'}</Text>
                  </View>
                </Marker>
              )}
            </MapView>

            {/* Filter selectors floating over map */}
            <View style={[styles.filterContainer, { position: 'absolute', top: 10, left: 16, right: 16, zIndex: 10 }]}>
              {(['productivity', 'ndvi', 'ph'] as MapFilter[]).map((filter) => {
                const active = activeFilter === filter;
                let label = '';
                if (filter === 'productivity') label = language === 'sw' ? 'Uzalishaji' : 'Productivity';
                if (filter === 'ndvi') label = 'NDVI Index';
                if (filter === 'ph') label = 'Soil pH';

                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setActiveFilter(filter);
                    }}
                    style={[
                      styles.filterPill,
                      { borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.9)' },
                      active && { backgroundColor: '#1A3B14', borderColor: '#1A3B14' },
                    ]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive, { color: active ? '#FCFBF7' : '#1A3B14' }]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Active Selection Bottom Details Card`;

newContent = newContent.replace(mapContainerRegex, newMapStr);

// Remove old filter container
newContent = newContent.replace(/\{\/\* ── Filter Selectors \(Pills\) ───────────────────────── \*\/\}[\s\S]*?<\/View>/, '');

fs.writeFileSync('app/(tabs)/fields.tsx', newContent);
console.log('Done migrating');
