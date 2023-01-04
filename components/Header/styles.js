import { StyleSheet } from 'react-native';
import { fonts } from '../../src/styles';
import { colors } from '../../src/styles';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: colors.blue_secondary,
        color: colors.blue_tertiary,
    },
    title: {
        color: colors.blue_tertiary,
        fontFamily: fonts.bold,
        fontSize: 25,
    },
});