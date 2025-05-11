import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ConstantStyles } from '@/constants/constantStyles';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Fonts } from '@/constants/Fonts';

interface VideoControlsProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    onQualityChange: (quality: string) => void;
    onSpeedChange: (speed: number) => void;
    isFullScreen?: boolean;
}

const VideoControls: React.FC<VideoControlsProps> = ({
    currentTime,
    duration,
    onSeek,
    onQualityChange,
    onSpeedChange,
    isFullScreen = false,
}) => {
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState('auto');
    const [selectedSpeed, setSelectedSpeed] = useState(1);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const qualityOptions = ['auto', '1080p', '720p', '480p', '360p'];
    const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const iconSize = isFullScreen ? 30 : 20;
    const fontSize = isFullScreen ? 16 : 14;

    return (
        <View style={[styles.container, isFullScreen && styles.fullScreenContainer]}>
            {/* Timeline Slider */}
            <View style={styles.timelineContainer}>
                <Text style={[styles.timeText, { fontSize }]}>{formatTime(currentTime)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={currentTime}
                    onSlidingComplete={onSeek}
                    minimumTrackTintColor={Colors.mainColor}
                    maximumTrackTintColor={Colors.calmWhite}
                    thumbTintColor={Colors.mainColor}
                />
                <Text style={[styles.timeText, { fontSize }]}>{formatTime(duration)}</Text>
            </View>

            {/* Control Buttons */}
            <View style={styles.controlsContainer}>
                {/* Quality Button */}
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => {
                        setShowQualityMenu(!showQualityMenu);
                        setShowSpeedMenu(false);
                    }}
                >
                    <MaterialIcons name="settings" size={iconSize} color={Colors.calmWhite} />
                    {showQualityMenu && (
                        <View style={[styles.menu, isFullScreen && styles.fullScreenMenu]}>
                            {qualityOptions.map((quality) => (
                                <TouchableOpacity
                                    key={quality}
                                    style={[
                                        styles.menuItem,
                                        selectedQuality === quality && styles.selectedMenuItem,
                                    ]}
                                    onPress={() => {
                                        setSelectedQuality(quality);
                                        onQualityChange(quality);
                                        setShowQualityMenu(false);
                                    }}
                                >
                                    <Text style={[styles.menuText, { fontSize }]}>{quality}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>

                {/* Speed Button */}
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => {
                        setShowSpeedMenu(!showSpeedMenu);
                        setShowQualityMenu(false);
                    }}
                >
                    <MaterialIcons name="speed" size={iconSize} color={Colors.calmWhite} />
                    {showSpeedMenu && (
                        <View style={[styles.menu, isFullScreen && styles.fullScreenMenu]}>
                            {speedOptions.map((speed) => (
                                <TouchableOpacity
                                    key={speed}
                                    style={[
                                        styles.menuItem,
                                        selectedSpeed === speed && styles.selectedMenuItem,
                                    ]}
                                    onPress={() => {
                                        setSelectedSpeed(speed);
                                        onSpeedChange(speed);
                                        setShowSpeedMenu(false);
                                    }}
                                >
                                    <Text style={[styles.menuText, { fontSize }]}>{speed}x</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
    },
    fullScreenContainer: {
        padding: 20,
    },
    timelineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    timeText: {
        color: Colors.calmWhite,
        fontFamily: Fonts.regularText,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    controlButton: {
        padding: 5,
        marginLeft: 10,
    },
    menu: {
        position: 'absolute',
        bottom: '100%',
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 5,
        padding: 5,
        minWidth: 100,
    },
    fullScreenMenu: {
        minWidth: 150,
    },
    menuItem: {
        padding: 8,
        borderRadius: 3,
    },
    selectedMenuItem: {
        backgroundColor: Colors.mainColor,
    },
    menuText: {
        color: Colors.calmWhite,
        fontFamily: Fonts.regularText,
        textAlign: 'center',
    },
});

export default VideoControls; 