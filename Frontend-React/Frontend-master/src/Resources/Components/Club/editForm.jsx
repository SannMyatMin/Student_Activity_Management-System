import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import Cookies from 'js-cookie';
import Button from '../Buttons/button';

export default function EditForm({ clubPostData, postId, buttonName, setCreateForm, title,caption, description, image, visibility, onPostRemove }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const userCookie = Cookies.get("user");
  const userData = userCookie ? JSON.parse(userCookie) : {};
  const userName = userData.name;

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [btnName, setBtnName] = useState(buttonName)

  const [storedClubPosts, setStoredClubPosts] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  function base64ToBlob(base64, mimeType = "image/png") {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  const handleUpdatePost = async (data) => {

    setIsUpdateLoading(true);
    try {
      const formData = new FormData();

      formData.append('post_id', data.postId);
      formData.append('title', data.title);
      formData.append('caption', data.caption);
      formData.append('content', data.description);
      formData.append('visibility', data.visibility);

      // Check if a new file is provided
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      } else if (image) {
        const blob = base64ToBlob(image);
        formData.append("image", blob, "defaultImage.png");
      }
      formData.append('price', data.itemPrice);
      formData.append('quantity', data.itemQuantity);

      const res = await fetch(`http://localhost:8080/post/updatePost`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to add item');
      }

      // to update the sessionStorage
      if (Object.keys(clubPostData).length > 0) {
        setStoredClubPosts((prevItem) => {
          const newItems = { ...prevItem };
          Object.keys(clubPostData).forEach(key => {
            newItems[clubPostData[key].post_id] = {
              post_id: clubPostData[key].post_id,
              title: clubPostData[key].title,
              image: clubPostData[key].image,
              content: clubPostData[key].content,
              caption: clubPostData[key].caption,
              visibility: clubPostData[key].visibility
            }
          });
          return newItems;
        })
      }
      if (Object.keys(storedClubPosts).length > 0) {
        sessionStorage.setItem("clubPostList", JSON.stringify(storedClubPosts));
      }
      ///////////////////////////


      alert("Post updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update Post. Please try again.");
    } finally {
      setIsUpdateLoading(false);
    }
  };


  const handleCreateClubPost = async (data) => {
    setIsLoading(true)

    try {
      const formData = new FormData();
      formData.append('creator', userData.name);
      formData.append('title', data.title);
      formData.append('caption', data.caption);
      formData.append('poster_name', params.get("clubName"));
      formData.append('content', data.description);
      formData.append('image', data.image[0]);
      formData.append('visibility', data.visibility);

      const res = await fetch(`http://localhost:8080/post/addPost`, {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const errorMessage = await res.text();
        console.log(errorMessage)
      }

      alert("Post created successfully")
      setBtnName("Update")
      setCreateForm(false); // Close the form after successful creation
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }

  const handelRemoveClubPost = async (postId) => {
    setIsRemoveLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/post/deletePost`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ post_id: postId })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to delete item');
      }

      if (onPostRemove) {
        onPostRemove(postId);
      }

      alert(`Post deleted successfully`);
    } catch (error) {
      console.log(error);
      alert("Failed to delete item");
    } finally {
      setIsRemoveLoading(false);
    }
  }

  return (
    <div className="editClubPost-wrapper">
      <div className="form-container">
        <form onSubmit={btnName === "Create" ? handleSubmit(handleCreateClubPost) : handleSubmit(handleUpdatePost)}>
          <div className="form-row">
            <input
              type="hidden"
              id="title"
              placeholder="Post title"
              defaultValue={postId}
              {...register('postId')}
            />
          </div>
          <div className="form-row">
            <label htmlFor="title">Post title</label>
            <input
              type="text"
              id="title"
              placeholder="Post title"
              defaultValue={title}
              {...register('title', { required: 'Please enter a title.' })}
            />
            {errors.title && <div className="alert alert-error"><span>{errors.title.message}</span></div>}
          </div>

           <div className="form-row">
            <label htmlFor="title">Post Caption</label>
            <input
              type="text"
              id="title"
              placeholder="Post Caption"
              defaultValue={caption}
              {...register('caption', { required: 'Please enter a caption.' })}
            />
            {errors.caption && <div className="alert alert-error"><span>{errors.caption.message}</span></div>}
          </div>

          <div className="form-row">
            <label htmlFor="description">Post description</label>
            <textarea
              id="description"
              placeholder="Description about your club post"
              defaultValue={description}
              {...register('description', { required: 'Please enter a description.' })}
            />
            {errors.description && <div className="alert alert-error"><span>{errors.description.message}</span></div>}
          </div>

          <div className="form-row">
            <label htmlFor="Visibility">Visibility</label>
            <select id="visibility" defaultValue={visibility} {...register("visibility", { required: "Please select an visibility type" })}>
              <option value="Club">Club</option>
              <option value="clubEvent">Event</option>
            </select>
            {errors.visibility && <div className="alert alert-error"><span>{errors.visibility.message}</span></div>}
          </div>

          <div className="form-row">
            <label htmlFor="Image">Post Image</label>
            <input
              type="file"
              id="Image"
              accept="image/*"
              {...register("image")}
            />

          </div>

          <div className="form-row">
            {btnName === "Update" &&
              <div className="form-btn-row">
                <Button
                  btnType={"normal"}
                  btnSize={"M"}
                  btnText={btnName}
                  type={"submit"}
                />
                <Button
                  btnType={"normal"}
                  btnSize={"M"}
                  btnText={isRemoveLoading ? "Removing..." : "Remove"}
                  type={"button"}
                  onClick={() => handelRemoveClubPost(postId)}
                />
              </div>


            }
            {btnName === "Create" &&
              <Button
                btnType={"normal"}
                btnSize={"M"}
                btnText={isLoading ? "Creating..." : btnName}
                type={"submit"}
              />
            }

          </div>
        </form>
      </div>
    </div>
  );
}