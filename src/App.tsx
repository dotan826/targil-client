import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const baseURL = "";

interface Comment {
  image: any,
  email: string,
  comment: string,
  latestCommentTime: string
}

const App = () => {
  const [comments, setComments] = useState<Comment[]>([]);                 // Comments Array
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]); // Filtered Comments
  const [email, setEmail] = useState("");                                  // Email Input
  const [message, setMessage] = useState("");                              // Message Input
  const [filter, setFilter] = useState("");                                // Filter Input
  

  useEffect(() => {
    getComments(); // Init Comments List

  }, []);

  // Get Comments
  const getComments = () => {
    axios.get<Comment[]>(baseURL + '/get') // Init Comment List
      .then((respond) => {
        // console.log(respond.data);
        setComments(respond.data);
        setFilteredComments(respond.data);
      });
  }

  // Add Comment
  const addComment = () => {
    axios.post(baseURL + '/add', {
      image: "https://www.gravatar.com/" + stringToHash(email),
      email: email,
      comment: message,
      latestCommentTime: getCurrentTime()
    }).then((respond) => {
      getComments();
      clearInputs();
    })
  }

  // Clear Inputs
  const clearInputs = () => {
    setEmail("");
    setMessage("");
  }

  // Convert String to Hash
  function stringToHash(email: string) {
    let hash = 0;
    if (email.length == 0) {
      return hash;
    }
    for (let i = 0; i < email.length; i++) {
      let char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  // Filter Comments by email
  const filterByEmail = (wordToFilter: string) => {
    setFilter(wordToFilter);
    let commentsAfterFilter = comments.filter(comment => comment.email.includes(wordToFilter));
    setFilteredComments(commentsAfterFilter);
  }

  // Get Current Time
  const getCurrentTime = () => {
    const date = new Date();
    const currentTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    return currentTime;
  }

  return (
    <div className="page-container">
      <div className="content-container">
        
        <div className="form-area">
          <div className="input-area">
            <input type="text" className="email-input" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
            <input type="text" className="message-input" placeholder="Message" value={message} onChange={(e) => { setMessage(e.target.value) }}></input>
          </div>
          <div className="submit-button-area">
            <button className="submit-button" onClick={() => { addComment() }}>Submit</button>
          </div>
        </div>

        <div className="filter-area">
          <input type="text" className="filter-input" placeholder="Filter" value={filter} onChange={(e) => { filterByEmail(e.target.value) }}></input>
        </div>

        <div className="comments-area">
          {
            filteredComments.map(
              (value, index) => {
                return (
                  <div className="comment-body" key={index}>
                    <img src={value.image} alt="img" className="comment-image" onClick={()=>{window.alert(value.email + "\n" + value.latestCommentTime)}}></img>
                    <div className="comment-content">
                      <div className="comment-email">{value.email}</div>
                      <div className="comment-comment">{value.comment}</div>
                    </div>
                  </div>
                );
              }
            )
          }
        </div>

      </div>
    </div>
  );
}

export default App;
