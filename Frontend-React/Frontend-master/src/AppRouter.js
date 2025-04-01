import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router";
import App from './App';
import Login from './Resources/Components/Login-Signup/login';
import Signup from './Resources/Components/Login-Signup/signup';
import Profile from './Resources/Components/Profile/profile';
import FoodCourt from './Resources/Components/Food court/foodCourt';
import AdminDashBoard from './Resources/Components/Dashboard/adminDashBoard';
import Shop from './Resources/Components/Shop/shop';
import EditShop from './Resources/Components/Shop/editShop';
import OwnerView from './Resources/Components/Shop/ownerView' 
import Club from './Resources/Components/Club/Club';
import ClubsPage from './Resources/Components/Club/ClubsPage';
import EditClub from './Resources/Components/Club/EditClub';
import OrganizerDashBoard from './Resources/Components/Dashboard/organizerDashBoard';
import Posts from './Resources/Components/Post/Posts';
import PostDetail from './Resources/Components/Club/PostDetail';
import EditPost from './Resources/Components/Dashboard/editPost';
export default function AppRouter() {
  return (
    <BrowserRouter>
         <Routes>
            <Route element={<App />}>
                <Route path='/' element={<Login />}/>
                <Route path='/signup' element={<Signup />}/>
                <Route path='/profile' element={<Profile />}/>
                <Route path='/foodCourt' element={<FoodCourt />}/>

                <Route path='/adminDashBoard' element={<AdminDashBoard />}/>
                <Route path='/adminDashBoard/student' element={<AdminDashBoard />}/> 
                <Route path='/adminDashBoard/club' element={<AdminDashBoard />}/>
                <Route path='/adminDashBoard/club/detail' element={<AdminDashBoard />}/>
                <Route path='/adminDashBoard/post' element={<AdminDashBoard />}/>
                <Route path='/adminDashBoard/noti' element={<AdminDashBoard />}/>

                <Route path='/shop' element={<Shop />}/>
                <Route path='/shop/orders' element={<Shop />}/>
                <Route path='/editShop' element={<EditShop />}/>
                <Route path='/ownerView' element={<OwnerView />}/>

                <Route path='/club' element={<ClubsPage />}/>
                <Route path='/clubInfoPage' element={<Club />}/>
                <Route path='/editClub' element={<EditClub />}/>

                <Route path='/organizerDashBoard' element={<OrganizerDashBoard />}/>
                <Route path='/editPost' element={<EditPost />}/>

                <Route path='/post' element={<Posts />}/>
                <Route path='/postDetail' element={<PostDetail />}/>

            </Route>
        </Routes>
    </BrowserRouter>
  )
}
