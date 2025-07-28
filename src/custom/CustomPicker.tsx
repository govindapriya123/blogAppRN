import React,{useState} from 'react';
import {View,Text,TouchableOpacity,Modal, StyleSheet,Animated, FlatList} from 'react-native';
export const CustomPicker=({items,selectedValue,onValueChange}:any)=>{
    const [isModalVisible,setIsModalVisible]=useState(false);
    const [animatedHeight]=useState(new Animated.Value(0));
    const handleItemPress=(item: any)=>{
        onValueChange(item.name);
        setIsModalVisible(false);
        animatePickerHeight(0);
    }
    const animatePickerHeight=(toValue: number)=>{
        Animated.timing(animatedHeight,{
            toValue,
            duration:300,
            useNativeDriver:false,
        }).start();
    }
    const handlePickerOpen=()=>{
        setIsModalVisible(true);
        animatePickerHeight(250);
    }
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePickerOpen} style={styles.pickerButton}>
             <Text style={styles.pickerButtonText}>
                {selectedValue||'Select Item'}
                </Text>
            </TouchableOpacity>
            <Modal visible={isModalVisible} transparent={true} animationType='fade'>
                <TouchableOpacity style={styles.modalBackground} onPress={()=>setIsModalVisible(false)} >
                <Animated.View style={[styles.pickerModal,{height:animatedHeight}]}>
                <FlatList
                data={items}
                renderItem={({item})=>(
                    <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => handleItemPress(item)}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
    )}
                keyExtractor={(item,index)=>index.toString()}
                />
                </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    )

};
const styles = StyleSheet.create({
    container: {
      margin: 20,
    },
    pickerButton: {
      padding: 15,
      backgroundColor: '#3498db',
      borderRadius: 5,
    },
    pickerButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerModal: {
      width: '100%',
      backgroundColor: '#fff',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden',
    },
    listItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    itemText: {
      fontSize: 16,
    },
  });