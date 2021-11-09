import { Router } from 'itty-router'
import {v1} from 'uuid'
import bcrypt from 'bcryptjs'
const router = Router()

const Origin = "*";

const systemUrl = "https://strips-rw-magnificent-deemed.trycloudflare.com";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Access-Control-Allow-Origin", "*");

router.get("/posts", async (req) => {
  
  // load posts from KV store
  const posts = await db1.get('posts') || JSON.stringify([]);
  
  // no need to stringify as it's already a string when stored in KV store
  return new Response(posts,
    {
      headers: {
        "Access-Control-Allow-Origin": Origin,
        "Content-Type": "application/json"
      }
    })
})

router.post("/clear", async request => {
  // clear posts from KV store
  await db1.put('posts', JSON.stringify([]))
  return new Response("Cleared", {
    headers: {
      "Access-Control-Allow-Origin": Origin,
      "Content-Type": "application/json"
    }
  })
})



router.post("/posts", async (request) => {
  
  // Create a base object with status
  const headers = {
    
    'Access-Control-Request-Headers': 'Content-Type',
    "Access-Control-Allow-Origin": Origin,
    'Content-Type': 'application/json',
    "Accept": '*'
  }
  let status = 200;

  let fields = {
                status:'success',
                likeCount: 0,
                createdAt: new Date().toISOString()
              }
  
  var posts = JSON.parse(await db1.get('posts')) || [];

  // If the POST data is JSON then attach it to our response.
  try{
    const data = await request.json()
    // const username = data['username'];
    
    // const cookies = request.headers.get('cookie');

    // const isOldUser = await db1.get(username)

    // if (isOldUser){
    //     const verify = await fetch(systemUrl+"/verify", {headers:request.headers });
    //     const user = await verify.text();
    //     if (!verify.ok || user!==username){
    //         throw new Error("Invalid username");
    //     }
        
    // }else{
    //     const res = await fetch(systemUrl+`/auth/${username}`);
    //     const token = await res.text()
    //     await db1.put(username, token,  {expirationTtl: 60*60*24});
    //     headers['Set-Cookie'] = `token=${token}; httponly=true; SameSite=None; Expires=86400; Secure;`
    // }

    fields = {...fields, ...data}
    fields['_id'] = v1()
    
    posts = [fields].concat(posts)
    
    // set the new post array in the KV store
    await db1.put('posts', JSON.stringify(posts))
    
    
  }catch(e){
    // if error then set status to error
      fields["status"] = 'error'
      fields["message"] = e.message
      console.log(e.message)
      status = 403
  }

  // Serialise the JSON to a string.

  const returnData = fields;
    console.log(returnData)  

  return new Response(JSON.stringify(returnData), {
    status:status,
    headers: headers
  })
})


function findIndex(posts, id){
  let index = -1;
  for(let i=0; i<posts.length; ++i){
    // console.log(posts[i])
    if (id===posts[i]._id){
      index = i;
      break;
    }
  }
  return index;
}

router.delete("/posts/delete/:id", async request => {
  // load posts from KV store
  var response = {status:"Success"}
  var posts = JSON.parse(await db1.get('posts')) || [];
  const index = findIndex(posts, request.params.id);

  if (index>=0){
    posts.splice(index, 1)
    await db1.put('posts', JSON.stringify(posts))
    response['message'] = `Post ${request.params.id} liked`
  }
  else{
    response.status = "error"
    response['message'] = "Post not found"
  }

  return new Response(JSON.stringify(response), {
    
    headers: {
      
      "Access-Control-Allow-Origin": Origin,
      "Content-Type": "application/json"
    }
  })

  
})


router.patch("/posts/like/:id", async request => {
    // add like to the post

    var response = {status:"Success"}
    var posts = JSON.parse(await db1.get('posts')) || [];
    const index = findIndex(posts, request.params.id);

    
    if (index>=0){
      posts[index] = {...posts[index], likeCount: posts[index].likeCount+1}
      await db1.put('posts', JSON.stringify(posts))
      response['msg'] = `Post ${request.params.id} liked`
      response = {...posts[index], ...response}
    }
    else{
      response.status = "error"
      response['msg'] = "Post not found"
    }

    return new Response(JSON.stringify(response), {
      headers: {
        
        "Access-Control-Allow-Origin": Origin,
        "Content-Type": "application/json"
      }
    })
})

router.post('/signin', async request => {
  const response = { status: 'success' };
  var username = "";
  try{

    console.log(JSON.stringify(request));

    const data = await request.json();
    
    const {email, password} = data;
    username = email;

    const userDetailsByName = JSON.parse(await db1.get(email));
    
    if (!userDetailsByName){
      throw new Error('User doest not exist');
    }
    
    const verified = bcrypt.compareSync(password, userDetailsByName.password);
    console.log("verified", verified)
    if(!verified){
      throw new Error('Invalid password');
    }
    
    response['msg'] = "Signed in Successfully"

  }catch(e){
    console.error('Error occured')
    response.status = 'error'
    response['msg'] = e.message
  }
  finally{
    return new Response(JSON.stringify(response), {
      headers:{
        "Access-Control-Allow-Origin": Origin,
        "Access-Control-Allow-Credentials": true,
        "Authorization": `Bearer ${username}`,
        "Set-Cookie": `token=${username}; httponly=true; SameSite=None; Expires=24h; Secure;`,
        "Cookie": `token=${username}; httponly=true`,
      }
    })
  }
  
});


router.post('/signup', async request => {
  const res = {status: 'success', message: ''}
  try{
    const data = await request.json()
    const userName = data.email
    const password = data.password

    if (!userName || !password){
      throw new Error('User name and password are required')
    }
    
    const alreadyExist = await db1.get(userName)
    if(alreadyExist) throw new Error(`User ${userName} already exists`)

    const passwordHash = bcrypt.hashSync(password, 10);
    data.password = passwordHash
    data['_id'] = v1();

    await db1.put(userName, JSON.stringify(data))
    res.message = "Used Signed Up successfully"

  }catch(er){
    res.status = 'error'
    res.message = er.message
    console.log(er)
  }
  finally{
    return new Response(JSON.stringify(res), {
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": Origin,
        "Content-Type": "application/json"
      }
    })
  }
});


router.options('*', ()=> new Response("Success", {
    // Route to handle cors Prefligh request
   headers: {
     "Access-Control-Allow-Origin":Origin,
     "Content-Type":"application/json",
     "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PATCH, DELETE",
     "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type",
    }}))

router.all("*", () => new Response("404, not found!", { status: 404 }))


/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
