import React, { useEffect, useState,useRef } from 'react'
import {View,TextInput,Button,Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Alert, Modal, SafeAreaView} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Chip } from 'react-native-paper';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { CustomPicker } from '../custom/CustomPicker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import styled, { useTheme } from 'styled-components';
import { Picker } from '@react-native-picker/picker';
import { getItem } from '../helpers/Storage';
import { useNavigation } from '@react-navigation/native';
const PostScreen=styled(ScrollView)(props=>({
  backgroundColor:props.theme.primaryBackground,
  padding:10,
}));
const TextStyle=styled(Text)(props=>({
    color:props.theme.inputText
}));
const LabelStyle=styled(Text)(props=>({
  fontSize: 16, marginBottom: 8, fontWeight: 'bold',
  color:props.theme.inputText,
}));
const Input=styled(TextInput)(props=>({
  borderRadius:10,
  margin:20,
  borderWidth:1,
  minHeight:40,
  flexGrow:1,
  color:props.theme.textInputPlaceholder,
  borderColor:props.theme.borderInputColor,
}));
const ModalView=styled(View)(props=>({
  flex: 1,
  backgroundColor: props.theme.modalOverlay,
  justifyContent: 'center',
  alignItems: 'center',
}));
const ModalContent=styled(View)(props=>({
  width: 300,
  backgroundColor: props.theme.modalContent,
  borderRadius: 10,
  padding: 20,
  alignItems: 'center'
}));
const ModalTitle=styled(Text)(props=>({
  fontSize: 18,
  fontWeight: 'bold',
  color:props.theme.modalText,
  marginBottom: 20,
}));
const OptionsButton=styled(TouchableOpacity)(props=>({
  backgroundColor: '#28a745',
  padding: 15,
  borderRadius: 10,
  marginVertical: 5,
  width: '100%',
  alignItems: 'center',
} 
));
const OptionsText=styled(Text)(props=>({
  color: '#fff',
  fontWeight: 'bold',
}));
const CancelButton=styled(TouchableOpacity)(props=>({
  backgroundColor: '#dc3545',
  padding: 15,
  borderRadius: 10,
  marginTop: 10,
  width: '100%',
  alignItems: 'center',
}));
const CancelText=styled(Text)(props=>({
  color: '#fff',
  fontWeight: 'bold',
}));
const ErrorText=styled(Text)({
  color: 'red',
  fontSize: 12,
  marginTop: 4,
});
const CreatePostScreen=({navigation,route})=>{
   const {post}=route?.params||{};
   console.log("--post--",post);
   const [title,setTitle]=useState('');
   const [content,setContent]=useState('');
   const [categories,setCategories]=useState('');
   const [category,setCategory]=useState('');
   const [tags,setTags]=useState<string[]>([]);
   const [availableTags,setAvailableTags]=useState([]);
   const [modalVisible, setModalVisible] = useState(false);
   const [imageOrder,setImageOrder]=useState([]);
   const [charCount,setCharCount]=useState(0);
   const [pageButtonTitle,setPageButtonTitle]=useState('Create Post');
   const [errors, setErrors] = useState({ title: '', content: '' });
   const maxTitleLength = 100;
   const theme=useTheme();
   const editorRef = useRef<RichEditor|null>(null);
   const [imageUri, setImageUri] = useState<string[]>([]);
   useEffect(()=>{
   console.log('--[categories]--',categories);
   console.log('--availableTags--',availableTags);
   },[availableTags]);
   useEffect(() => {
    if (post) {
      console.log('Setting default values from post:', post);
      setPageButtonTitle('Update Post');
      setTitle(post.title || '');
      setContent(post.content || '');
      setCategory(post.category?.name|| '');
      setTags(post.tags?.map((tag: { id: any; }) => tag.id) || []);
      setImageUri(post.imageUrls || []); // if your backend provides image URLs
    }
  }, [post]);
   const validateFields = () => {
    let isValid = true;
    const newErrors = { title: '', content: '' };
  
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
      isValid = false;
    }
  
    if (!content.trim()) {
      newErrors.content = 'Content is required.';
      isValid = false;
    } else if (content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters long.';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
   useEffect(() => {
    if(post){
      console.log("--post--",post);
      navigation.setOptions({ title: 'Edit New Post' });
    }else{
      navigation.setOptions({ title: 'Create New Post' });
    }
    }, [navigation]);
    const fetchCategoriesAndTags = async () => {
      try {
        const token=await getItem('authToken');
        const fetchedTags = await fetch('http://192.168.0.126:8086/api/posts/tags', { headers: { Authorization: `Bearer ${token}` } });
        if (!fetchedTags.ok) {
          throw new Error('Failed to fetch tags');
        }
        const tagsData = await fetchedTags.json();
    
        const fetchedCategories = await fetch('http://192.168.0.126:8086/api/posts/categories', { headers: { Authorization: `Bearer ${token}` } });
        if (!fetchedCategories.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await fetchedCategories.json();
    
        console.log('--fetched categories--', categoriesData);
        setAvailableTags(tagsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }; 
    useEffect(()=>{
      fetchCategoriesAndTags();
    },[])
    useEffect(() => {
      if (editorRef.current && content) {
        try {
          editorRef.current.setContentHTML(content);
        } catch (e) {
          console.warn('Editor not ready:', e);
        }
      }
    }, [content]);
   const handleSubmit=async (status:'Draft'|'Publish')=>{

      try{
        const authToken =await getItem("authToken");
        const payload={
          title,
          content,
          tagIds:tags,
          category,
          status
        }
        if(post){
          console.log("--post--",post);
          let postid = typeof post.id === 'string' ? parseInt(post.id, 10) : post.id;
          const response=await fetch(`http://192.168.0.126:8086/api/posts/${postid}`,{
            method:'PUT',
            headers:{
              'Content-Type':'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body:JSON.stringify(payload),
          });
          console.log("--responseInupdate--",response);
          if(response.status==200){
            console.log('--navigating---');
           // navigation.navigate('Dashboard');
            //navigation.goBack();
            //navigation.pop(1);
            // navigation.replace('Dashboard');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
  
          }
          const {postId}=await response.json();
          console.log("typeof postId",typeof postId);
          if(imageUri){
          uploadImages(imageUri,postId);
          }
          console.log('--response--',response);

        }else{
        const response=await fetch('http://192.168.0.126:8086/api/posts',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body:JSON.stringify(payload),
        });
        console.log('--authToken--',authToken);
        console.log('--payload--',payload);
        const data = await response.json();
        console.log('--data--',response);
        console.log('Parsed JSON:', data.status); 
        if(response.status==200){
          console.log('--navigating---');
         // navigation.navigate('Dashboard');
          //navigation.goBack();
          //navigation.pop(1);
          // navigation.replace('Dashboard');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          });

        }
        const {postId}=data;
        if(imageUri){
        uploadImages(imageUri,parseInt(postId, 10));
        }
      }
     }catch(error){
       console.error("Upload Error:",error);
       Alert.alert('Error','Failed to upload images.try again')

     }
   }
   const handleSaveAsDraft = () => {
    console.log("save as draft");
    setModalVisible(false);
    if (validateFields()) {
     handleSubmit("Draft"); // Proceed with your logic
    }
    console.log('Post saved as draft');
     navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            })
  };

  const handlePublish = () => {
    console.log("publish screen");
    setModalVisible(false);
    if (validateFields()) {
      handleSubmit("Publish"); // Proceed with your logic
    }
  };
   const pickImage = () => {
      launchImageLibrary({ mediaType: 'photo',selectionLimit: 0, }, async (response) => {
        if(response.didCancel){
          console.log('User cancelled image picker');
        }else if(response.errorCode){
          console.log("Image picker error");
        }else{
        if (response.assets && response.assets[0]) {
          const uris = response.assets.map((asset)=>asset.uri||'') ; // Default to an empty string if undefined
          setImageUri(prev=>[...prev,...uris]);
        }
      }
      });
    };
    const uploadImages=async(uris:  any[],postId:any)=>{
      console.log('--uris--',uris);
      const authToken=await getItem('authToken');
      console.log("-- authToken--", authToken);
      if(uris.length===0){
        return;
      }
      const formData=new FormData();
      formData.append('postId', postId);
      for (const [index, uri] of uris.entries()) {
        // Get the file size
        const fileInfo = await RNFS.stat(uri);
        const fileSizeInMB = fileInfo.size / (1024 * 1024); // Convert bytes to MB
        console.log('--fileSizeInMB--', fileSizeInMB);
    
        // Check size limit (example: 5MB)
        if (fileSizeInMB > 5) {
          console.warn(`File ${index + 1} exceeds the size limit of 5MB.`);
          continue; // Skip this file
        }
    
        // Append the image to the form data
        formData.append('images', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      }
      try{
        const response = await axios.post('http://192.168.0.126:8086/api/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization':`Bearer ${authToken}`
          },
        });
        console.log('--formData--',formData);
        console.log('Upload Successful', response.data);
        Alert.alert('Success', 'Images uploaded successfully!');
      }catch(error){
        console.error('Upload Error:', error);
        Alert.alert('Error', 'Failed to upload images. Please try again.');
      }
    }
    const removeImage = (indexToRemove: number) => {
      setImageUri((prevUris: any[]) => prevUris.filter((_, index) => index !== indexToRemove));
    };
    
   return(
    <SafeAreaView style={{backgroundColor:theme.primaryBackground}}>
    <PostScreen bounces={false}>
      <Input
      placeholder='Enter Title'
      value={title}
      onChangeText={(text)=>{
        setTitle(text);
        setErrors((prev)=>({...prev,title:''}))
      }}
      multiline={true}
      autoFocus={true}
      placeholderTextColor={theme.headerText}
      />
     {errors.title && <ErrorText>{errors.title}</ErrorText> }
    {/* <TextInput
      placeholder='Enter Content...'
      value={content}
      style={styles.input}
      onChangeText={setContent}
      multiline={true}
      autoFocus={true}
      /> */}
    {/* <RichEditor
                disabled={false}
                ref={editorRef}
                placeholder="Write your content here..."
                onChange={(text) => setContent(text)}
                style={{ height: 200 }}
            /> */}
        <RichEditor
        placeholder='Enter Content'
        ref={editorRef}
        initialContentHTML={content}
        onChange={(text) => {
          setContent(text);
          setCharCount(text.length);
          setErrors((prev) => ({ ...prev, content: '' }));
        }}
        editorStyle={{color:theme.editorColor}}
      />
      <RichToolbar getEditor={() => editorRef.current} editor={editorRef} />
      {errors.content && <ErrorText>{errors.content}</ErrorText>}

      {/* <Picker selectedValue={category} onValueChange={(value) => setCategory(value)}>
        <Picker.Item label="Tech" value="1" />
        <Picker.Item label="Travel" value="2" />
      </Picker> */}
      <CustomPicker items={categories} selectedValue={category} onValueChange={setCategory} />
      <View style={styles.tagContainer}>
        {availableTags?.map((tag:any) => (
          <Chip
            key={tag.id}
            selected={tags.includes(tag.id)}
            onPress={() => {
              setTags((prev:any) =>
                prev.includes(tag.id) ? prev.filter((t:any) => t !== tag.id) : [...prev, tag.id]
              );
            }}
            style={{margin:3}}
          >
            {tag.name}
          </Chip>
        ))}
      </View>
      <View style={styles.container}>
      <Button title="Pick an image" onPress={pickImage} />
       {imageUri.length>0&&
        <ScrollView style={styles.previewContainer} horizontal>
          {imageUri.map((uri, index) => (
            uri&&<View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      }
    </View>
      <Button title={pageButtonTitle} onPress={() => setModalVisible(true)}/>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalView>
          <ModalContent>
            <ModalTitle>What would you like to do?</ModalTitle>
            <OptionsButton 
              onPress={handleSaveAsDraft}
            >
              <OptionsText>Save as Draft</OptionsText>
            </OptionsButton>
            <OptionsButton 
             onPress={handlePublish}
            >
              <OptionsText>Publish</OptionsText>
            </OptionsButton>
            <CancelButton
              onPress={() => setModalVisible(false)}
            >
              <CancelText>Cancel</CancelText>
            </CancelButton>
          </ModalContent>
        </ModalView>
      </Modal>
    </PostScreen>
    </SafeAreaView>
   )
};
const styles=StyleSheet.create({
   input:{
      borderRadius:20,
      marginHorizontal:10,
      marginTop:10,
      marginBottom:10,
      borderWidth:1,
      minHeight:40,
      flexGrow:1
   },
   container: {
      flexDirection:'row',
      alignItems: 'center',
      marginBottom:10
    },
    listContainer: {
      paddingVertical: 20,
    },
    previewImage: {
      width: 150,
      height: 150,
      borderRadius: 10,
      marginTop: 10,
    },
    previewContainer: {
      marginTop: 20,
      maxHeight: 200,
    },
    imageWrapper: {
      marginRight: 10,
    },
    label: { fontSize: 16, marginBottom: 8, fontWeight: 'bold' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
    removeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
    },
    
})
export default CreatePostScreen;