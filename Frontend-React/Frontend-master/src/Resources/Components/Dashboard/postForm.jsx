import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Buttons/button';
import Cookies from 'js-cookie';

export default function PostForm({  shopPostData,image, buttonName, shopName, visibility, postId, postImg, postTitle, postCaption, postDes, onPostRemove }) {
    const userCookie = Cookies.get("user");
    const userData = userCookie && JSON.parse(userCookie);
    const [btnName, setBtnName] = useState(buttonName)

    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isRemoveLoading, setIsRemoveLoading] = useState(false);
    const [storedShopPosts, setStoredShopPosts] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    // Function to convert base64 to Blob
    function base64ToBlob(base64, mimeType = "image/png") {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    // Handle Create Post
    const handleCreateOrganizerPost = async (data) => {
        setIsCreateLoading(true);
        try {
            const formData = new FormData();
            formData.append('creator', userData.name);
            formData.append('title', data.title);
            formData.append('caption', data.caption);
            formData.append('poster_name', "Organizer");
            formData.append('content', data.description);
            formData.append('image', data.image[0]);
            formData.append('visibility', "shopEvent");

            const res = await fetch(`http://localhost:8080/post/addPost`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }
          

            alert("Post created successfully");
            setBtnName("Update")
        } catch (error) {
            console.error(error);
            alert("Failed to create post");
        } finally {
            setIsCreateLoading(false);
        }
    };

    // Handle Update Post
    const handleUpdatePost = async (data) => {
        setIsUpdateLoading(true);
        try {
            const formData = new FormData();
            formData.append('post_id', postId);
            formData.append('title', data.title);
            formData.append('caption', data.caption);
            formData.append('content', data.description);
            formData.append('visibility', "shopEvent");

            // Check if a new file is provided
            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            } else if (image) {
                const blob = base64ToBlob(image);
                formData.append("image", blob, "defaultImage.png");
            }

            const res = await fetch(`http://localhost:8080/post/updatePost`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            alert("Post updated successfully!");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post. Please try again.");
        } finally {
            setIsUpdateLoading(false);
        }
    };

    // Handle Remove Post
    const handleRemovePost = async () => {
        setIsRemoveLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/post/deletePost`, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify({ post_id: postId }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to delete post');
            }

            if (onPostRemove) {
                onPostRemove(postId);
            }

            alert("Post deleted successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to delete post");
        } finally {
            setIsRemoveLoading(false);
        }
    };

    return (
        <form onSubmit={btnName === "Create" ? handleSubmit(handleCreateOrganizerPost) : handleSubmit(handleUpdatePost)}>
            
            <div className="form-row">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    placeholder="Post title"
                    defaultValue={postTitle}
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                    <div className="alert alert-error">
                        <span>{errors.title.message}</span>
                    </div>
                )}
            </div>

            <div className="form-row">
                <label htmlFor="caption">Caption</label>
                <input
                    type="text"
                    placeholder="Post Caption"
                    defaultValue={postCaption}
                    {...register("caption", { required: "Post caption is required" })}
                />
                {errors.caption && (
                    <div className="alert alert-error">
                        <span>{errors.caption.message}</span>
                    </div>
                )}
            </div>

            <div className="form-row">
                <label htmlFor="description">Post description</label>
                <textarea
                    placeholder="Post description"
                    defaultValue={postDes}
                    {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                    <div className="alert alert-error">
                        <span>{errors.description.message}</span>
                    </div>
                )}
            </div>

            <div className="form-row">
                <label htmlFor="image">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                />
                {errors.image && (
                    <div className="alert alert-error">
                        <span>{errors.image.message}</span>
                    </div>
                )}
            </div>

            <div className="form-btn-row">
                {btnName === "Update" && (
                    <div className="form-btn-row">
                        <Button
                            btnType={"normal"}
                            btnSize={"M"}
                            btnText={isUpdateLoading ? "Updating..." : "Update"}
                            type={"submit"}
                            disabled={isUpdateLoading}
                        />
                        <Button
                            btnType={"normal"}
                            btnSize={"M"}
                            type={"button"}
                            btnText={isRemoveLoading ? "Removing..." : "Remove"}
                            onClick={handleRemovePost}
                            disabled={isRemoveLoading}
                        />
                    </div>
                )}

                {btnName === "Create" && (
                    <Button
                        btnType={"normal"}
                        btnSize={"M"}
                        btnText={isCreateLoading ? "Creating..." : "Create"}
                        type={"submit"}
                        disabled={isCreateLoading}
                    />
                )}
            </div>
        </form>
    );
}