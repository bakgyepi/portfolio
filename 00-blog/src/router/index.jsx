// router/index.jsx
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Post from '../pages/Post'
import Setting from '../pages/Setting'
import Profile from '../pages/Profile'
import Guestbook from '../pages/Guestbook'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<Post />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/guestbook" element={<Guestbook />} />
      <Route path="/setting" element={<Setting />} />
      {/* <Route path="/blog/:id" element={<BlogPost />} /> */}
    </Routes>
  )
}