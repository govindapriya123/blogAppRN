import React, { useEffect } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { draftPosts } from "../store/slices/postsSlice";
import { toggleBookMark } from "../store/slices/bookMarkSlice";
import styled from "styled-components/native";
import { Avatar, Card, IconButton } from "react-native-paper";
import { formatDate, profilePicURL } from "../helpers/Util";
import RenderHTML from "react-native-render-html";
const Container = styled.View`
flex:1;
padding:10px;
background-color:#f8f9fa;
`;
const PostCard = styled(Card)`
margin-bottom:10px;
border-radius:10px;
`;
const DraftsScreen=({navigation})=>{
    const dispatch=useAppDispatch();
    const { width } = useWindowDimensions();
    const drafts=useAppSelector((state:any)=>state.posts.draftPosts);
    console.log("--drafts--",drafts);
    const toggleBookmark = async (postId: number) => {
        await dispatch(toggleBookMark(postId));
      };
    useEffect(()=>{
     dispatch(draftPosts());
    },[dispatch]);
    return(
        <Container>
         <FlatList
        data={drafts}
        keyExtractor={(item) => Math.random().toString()}
        bounces={false}
        renderItem={
          ({ item }) => (
            <PostCard onPress={() => navigation.navigate('PostDetails', { post: item })}>
              <Card.Title
                title={item.title}
                subtitle={formatDate(item.createdAt)}
                left={(props) => <Avatar.Image {...props} source={{uri:`${profilePicURL}/${item.user.username}.jpg`}} />}
              />
              <Card.Content>
                <RenderHTML
                  source={{ html: item.content }}
                  baseStyle={{
                    fontSize: 14,
                    color: '#333',
                  }}
                  contentWidth={width}
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
export default DraftsScreen;