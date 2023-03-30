import { useState,useEffect } from 'react';
import axios from "axios";
import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";
// ... this is equal to spread operator.
function App() {
  const [input,setInput]=useState("");
  const [post,setPosts]=useState([]);
  // Jab jab posts waala state update ho tab tab yeh method call hogi.
  useEffect(()=>
  {
   document.querySelector(".layout").scrollTop=document.querySelector(".layout").scrollHeight;
  },[post]);
  
  const fetchBotResponse = async () =>
  {
    const {data}= await axios.post("http://localhost:4000",{input},
    {
      headers:
      {
        "Content-Type":"application/json",
      },
    }); 
    // Here we will get response from bot.
    return data;
  };
  const onSubmit=()=>
  {
    if(input.trim()==="")
    return;
    updatePosts(input);
    updatePosts("loading...",false,true);
    // taaki eb baar query bhej de toh chat box waala msg delete ho jaaye
    setInput("")
    // ftechBotResponse will return promise
    fetchBotResponse().then((res)=>{
     console.log(res);
     updatePosts(res.bot.trim(),true);

    });
  };
  const autoTypingBotResponse= (text) => 
  {
    let index=0;
    let interval = setInterval(() =>{
     if(index<text.length)
     {
      setPosts(prevState=>
        {
         let lastItem = prevState.pop();
         if(lastItem.type!=="bot")
         {
           prevState.push({
            type: "bot",
            post: text.charAt(index-1)
           })
         }
         else{
          prevState.push({
            type: "bot",
            post: lastItem.post + text.charAt(index-1)
           })
         }
         return [...prevState];
        });
      index++;
     }
     else{
      clearInterval(interval);
     }
    },20)
  };
  const updatePosts=(post,isBot,isLoading)=>
  {
    if(isBot)
    {
      autoTypingBotResponse(post);
    }
    else
    {
      setPosts(prevState=>
        {
          return [
         ...prevState,
         {type: isLoading ? "loading":"user",post:post}];
        });
    } 
  };
  const onKeyUp=(e)=>
  {
    // 13 is written because enter key has a code 13
    if(e.key==="Enter" || e.which===13)
    {
      onSubmit();
    }
  };
  return <main className="chatGPT-app">
    <section className="chat-container">
      <div className="layout">

       {post.map((post,index)=>
       (
       <div className={`chat-bubble ${post.type==="bot" || post.type==="loading" ? "bot" : ""}`}>
          <div 
          key={index}
          className="avatar">
            <img src={post.type==="bot" || post.type==="loading" ? bot : user} />
          </div>
          {post.type==="loading" ? (
            <div className="loader">
            <img src={loadingIcon} />
           </div>) :(
             <div className="post">{post.post}</div>
           )}
            </div>
       ))}
      </div>
    </section>
    <footer>
      <input
      value={input}
        className="composebar"
        autoFocus
        type="text"
        placeholder="Ask Anything!"
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={onKeyUp}
      />
      <div className="send-button" onClick={onSubmit}>
       <img src={send}/>
      </div>
    </footer>
  </main>; 
}

export default App
