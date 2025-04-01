import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Buttons/button';
import Cookies from 'js-cookie';

export default function PostForm({ shopPostData,image, buttonName, shopName, visibility, postId, postImg, postTitle, postCaption, postDes, onPostRemove }) {
    const isUser = Cookies.get("user");
    const userData = isUser && JSON.parse(isUser);
    const [btnName, setBtnName] = useState(buttonName)
    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isRemoveLoading, setIsRemoveLoading] = useState(false);

    const [storedShopPosts, setStoredShopPosts] = useState({});

    const {
        register: registerPost,
        handleSubmit: handlePostSubmit,
        formState: { errors: postErrors }
    } = useForm();

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
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }
            // to update the sessionStorage
            if (Object.keys(shopPostData).length > 0) {
                setStoredShopPosts((prevItem) => {
                    const newItems = { ...prevItem };
                    Object.keys(shopPostData).forEach(key => {

                        newItems[shopPostData[key].post_id] = {
                            post_id: shopPostData[key].post_id,
                            title: shopPostData[key].title,
                            image: shopPostData[key].image,
                            content: shopPostData[key].content,
                            caption: shopPostData[key].caption,
                            visibility: shopPostData[key].visibility
                        }
                    });
                    return newItems;
                })
            }
            if (Object.keys(storedShopPosts).length > 0) {
                sessionStorage.setItem("shopPostList", JSON.stringify(storedShopPosts));
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

    const handelRemoveShopPost = async (postId) => {
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


    const handleCreateShopPost = async (data) => {
        setIsCreateLoading(true)
        try {
            const formData = new FormData();
            formData.append('creator', userData.name);
            formData.append('title', data.title);
            formData.append('caption', data.caption);
            formData.append('poster_name', shopName);
            formData.append('content', data.description);
            formData.append('image', data.image[0]);
            formData.append('visibility', "shopEvent");

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
        } catch (error) {
            console.log(error)
        } finally {
            setIsCreateLoading(false)
        }
    }

    return (

        <form onSubmit={btnName === "Create" ? handlePostSubmit(handleCreateShopPost) : handlePostSubmit(handleUpdatePost)}>
            <div className="form-row">
                <input
                    type="hidden"
                    placeholder="Post title"
                    defaultValue={postId}
                    {...registerPost("postId")}
                />
            </div>
            <div className="form-row">
                <label htmlFor="">Title</label>
                <input
                    type="text"
                    placeholder="Post title"
                    defaultValue={postTitle}
                    {...registerPost("title", { required: "Post title is required" })}
                />
                {postErrors.postTitle && (
                    <div className="alert alert-error">
                        <span>{postErrors.postTitle.message}</span>
                    </div>
                )}
            </div>
            <div className="form-row">
                <label htmlFor="">Caption</label>
                <input
                    type="text"
                    placeholder="Post Caption"
                    defaultValue={postCaption}
                    {...registerPost("caption", { required: "Post caption is required" })}
                />
                {postErrors.caption && (
                    <div className="alert alert-error">
                        <span>{postErrors.caption.message}</span>
                    </div>
                )}
            </div>
            <div className="form-row">
                <label htmlFor="">Post description</label>
                <textarea
                    placeholder="Write your post description"
                    defaultValue={postDes}
                    {...registerPost("description", { required: "Post description is required" })}
                />
                {postErrors.description && (
                    <div className="alert alert-error">
                        <span>{postErrors.description.message}</span>
                    </div>
                )}
            </div>

            <div className="form-row">
                <input type="hidden" id="visibility" defaultValue={visibility} {...registerPost("visibility")}>
                </input>
            </div>

            <div className="form-row">
                <label htmlFor="">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    {...registerPost("image")}
                />,
            </div>

            <div className="form-btn-row">
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
                            onClick={() => handelRemoveShopPost(postId)}
                        />
                    </div>


                }

                {btnName === "Create" &&
                    <Button
                        btnType={"normal"}
                        btnSize={"M"}
                        btnText={isCreateLoading ? "Creating..." : btnName}
                        type={"submit"}
                    />
                }

            </div>
        </form>
    )
}
