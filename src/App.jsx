import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'antd/dist/reset.css';

// 导入页面组件
import Home from "./pages/index";
import Books from "./pages/books";
import Categories from "./pages/categories";
import Login from "./pages/login";
import Users from "./pages/users";
import Borrows from "./pages/borrows";
import AddBook from './pages/addBook';
import AddUser from './pages/addUser';
import AddCategory from './pages/addCategory';
import AddBorrow from './pages/addBorrow';
import NotFound from "./pages/404";

import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter basename="/assignment02">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Books />} />
          <Route path="books" element={<Books />} />
          <Route path="books/add" element={<AddBook />} />
          <Route path="books/edit/:id" element={<AddBook />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<AddCategory />} />
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<AddUser />} />
          <Route path="borrows" element={<Borrows />} />
          <Route path="borrows/add" element={<AddBorrow />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

