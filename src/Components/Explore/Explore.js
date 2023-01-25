import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import './Explore.css'

function Explore() {
  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token.token);
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });

    fetch(`http://localhost:8000/post/all_post${user._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": `${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setPosts(json.details);
        console.log(json.details,"mmmmmmmm")
        json.details.forEach((post) => {
          const img = document.getElementById(post.id);
          observer.observe(img);
        });
      });
  }, [])

  return (
    <div className="explore-page">
      <div className="posts-grid">
        {posts && posts.map(post => (
          <img
            id={post.id}
            data-src={post.image}
            alt={post.title}
            key={post.id}
            src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E`}
          />
        ))}
      </div>
    </div>
  )
}

export default Explore
