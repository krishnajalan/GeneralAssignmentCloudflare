import axios from "axios";

const url = "https://general-assignment.krishnajalan.workers.dev/posts";

const API = axios.create({
  // headers: {"Access-Control-Allow-Origin": "*"},
});

export const fetchPosts = async () => await API.get(url);

export const createPost = async (newPost) => await API.post(url, newPost); // .then(response => response).catch(error => console.log(error => console.log(error.message)));

export const likePost = async (id) => await API.patch(`${url}/like/${id}`);
export const deletePost = async (id) => await API.delete(`${url}/delete/${id}`);

// export const likePost = (id) => fetch(`${url}/like/${id}`, {'method': "POST", 'mode':"no-cors", 'headers':{"Access-Control-Allow-Origin": "*"}});
export const updatePost = async (id, updatedPost) =>
  await fetch(`${url}/${id}`, {
    method: "PATCH",
    body: updatedPost,
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .catch((error) => console.log((error) => console.log(error.message)));
