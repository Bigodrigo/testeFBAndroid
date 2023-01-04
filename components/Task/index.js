import React, { useState } from "react";
import { NativeBaseProvider, Center, VStack, HStack, Text, Button, IconButton, View } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import { Swipeable } from "react-native-gesture-handler";

import { colors, styles } from "../../src/styles";

export function Task ({data, action}) {
    return (
        <Swipeable
            renderRightActions={() => (
                <IconButton size="lg" variant= "ghost" bg={colors.blue_secondary} style={styles.containerDelete}
                onPress={()=> {
                    action(data.id)}}
                _icon= {{ as: MaterialIcons, 
                    name : data.isFinished ? "delete-forever" : "done" ,
                    color: data.isFinished ? colors.red_primary : colors.blue_tertiary
                }}
                />
                )}
            containerStyle={{
                paddingHorizontal: 20,
                marginTop: 10,
            }}
        >
            <View style={styles.containerTasks} height={80}>
                <Text 
                color={'white'}
                style={styles.title}
                >{data.content}</Text>
            </View>
        </Swipeable>
    )}