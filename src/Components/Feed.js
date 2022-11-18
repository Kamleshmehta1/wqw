import React from "react";
import { useGetAllPostsQuery, useDeletePostMutation } from "../postFeature";
import Card from "@mui/material/Card";
import { Grid } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';
import { editMethod } from "../createSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Feed() {
  const { data: post, isLoading } = useGetAllPostsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const handleEdit = (id) => {
    Cookies.set("userId", id, { expires: 3600 });
    let Obj = post.find((ele) => ele.id === id)
    dispatch(editMethod({ name: [Obj.name], image: [Obj.image], post: [Obj.post] }))
    navigate("/addBlogs");
  };

  const handleDelete = async (id) => {
    let boolValue = window.confirm("Are you sure you want to delete this blog?");
    if (boolValue) {
      await deletePost(id);
      navigate("/addBlogs");
      navigate("/feed");
      toast.success("Blog deleted successfully!")
    }
  }

  return (
    <div className="postContainer">
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        {post.map((ele) => (
          <Grid item xs={12} sm={12} md={6} key={ele.id}>
            <Card sx={{ maxWidth: 345, margin: "20px 0 0 0" }} key={ele.id}>
              <CardMedia
                component="img"
                height="140"
                image={ele.image}
                alt="Not Found"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {ele.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ele.post}
                </Typography>
              </CardContent>
              <Button onClick={() => handleEdit(ele.id)}>EDIT</Button>
              <Button onClick={() => handleDelete(ele.id)}>DELETE</Button>
            </Card>
          </Grid>
        ))}
        <ToastContainer />
      </Grid>
    </div>
  );
}

export default Feed;
