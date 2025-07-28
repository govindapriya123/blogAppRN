import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native'
import { getItem } from '../helpers/Storage';
import styled from 'styled-components/native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate, profilePicURL } from '../helpers/Util';
import { fetchPosts, publishedPosts, saveMyPosts, updateBookmarkStatus } from '../store/slices/postsSlice';
import { useAppDispatch } from '../utils/hooks';
import { fetchBookMarkedPosts, toggleBookMark } from '../store/slices/bookMarkSlice';
const Container = styled.View`
flex:1;
padding:10px;
background-color:#f8f9fa;
`;
const PostCard = styled(Card)`
margin-bottom:10px;
border-radius:10px;
`;

function DashboardScreen() {
  const dispatch = useAppDispatch();
  const userDetails=useSelector((state:any)=>state.auth.user);
  const posts=useSelector((state:any)=>state.posts.posts);
  const myPosts=useSelector((state:any)=>state.posts.myPosts);
  const loading=useSelector((state:any)=>state.loading);
  const bookmarkedPosts=useSelector((state:any)=>{state.bookmark.bookmarkedPosts});
  const postsPublished=useSelector((state:any)=>state.posts.publishedPosts);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<number[]>([]);
  const { width } = useWindowDimensions();
  useEffect(() => {
    const loadPosts=async()=>{
    const result=await dispatch(fetchPosts());
    if(fetchPosts.fulfilled.match(result)){
      dispatch(saveMyPosts(userDetails.id));
      dispatch(publishedPosts());
    }
    fetchBookmarks();
    };
    loadPosts();
  }, [dispatch]);
  const fetchBookmarks = async () => {
    const authToken = await getItem('authToken');
    try {
      const res = await axios.get('http://192.168.0.126:8086/api/bookmarks', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setBookmarkedPostIds(res.data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };
  const toggleBookmark = async (postId: number) => {
    await dispatch(toggleBookMark(postId));
    await dispatch(fetchPosts());
    await dispatch(fetchBookMarkedPosts());
    await dispatch(updateBookmarkStatus(postId));
  };
  if(loading){
    return <Text>Loading..</Text>
  }
  console.log("posts",posts);
  console.log("myposts",myPosts);
  console.log("count posts",posts.length);
  console.log("count myposts",myPosts.length);
  return (
    <Container>
      <FlatList
        data={postsPublished}
        keyExtractor={(item) => Math.random().toString()}
        bounces={false}
        renderItem={
          ({ item }) => (
            <PostCard onPress={() => navigation.navigate('PostDetails', { post: item })}>
              <Card.Title
                title={item.title}
                subtitle={formatDate(item.createdAt)}
                left={(props) => <Avatar.Image {...props} source={{uri:`${profilePicURL}/${item.user.username}.jpg`}} />}
                right={(props) =>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <IconButton
                      {...props}
                      icon={item.bookmarked ? 'bookmark' : 'bookmark-outline'}
                      iconColor="#ffb703"
                      size={20}
                      onPress={() => toggleBookmark(item.id)}
                    />

                  </View>
                }
              />
              <Card.Content>
                <RenderHTML
                  source={{ html: item.content }}
                  contentWidth={width}
                  baseStyle={{
                    fontSize: 14,
                    color: '#333',
                  }}
                  defaultTextProps={{
                    numberOfLines: 2,
                    ellipsizeMode: 'tail', // Ensure ellipsis is applied
                  }}
                />
              </Card.Content>
            </PostCard>
          )
        }
      />
    </Container>
  )
}

export default DashboardScreen